<?php

namespace App\Http\Controllers\Web\Schedule;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\DonorProfile;
use App\Models\Institution;
use App\Models\User;
use App\Repositories\Contracts\ScheduleSlotRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class WebScheduleController extends Controller
{
    public function __construct(
        private readonly ScheduleSlotRepositoryInterface $slotRepo
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $staffRecord = $user->institutionStaff()->first();
        $institutionId = $staffRecord ? $staffRecord->institution_id : null;

        if ($user->role->value === 'super_admin' && !$institutionId) {
            $institutionId = Institution::where('type', 'pmi')->first()?->id;
        }

        if (!$institutionId) {
            abort(403, 'Anda tidak terasosiasi dengan institusi medis manapun.');
        }

        $currentInstitution = Institution::find($institutionId);

        // Ambil daftar slots jadwal donor
        $slots = $this->slotRepo->getSlots($institutionId, []);

        // Ambil riwayat donasi sukses di UDD PMI saat ini
        $donations = Donation::where('institution_id', $institutionId)
            ->with(['donorProfile.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Schedule/Index', [
            'slots' => $slots,
            'donations' => $donations,
            'currentInstitution' => $currentInstitution,
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                ]
            ]
        ]);
    }

    public function storeSlot(Request $request): RedirectResponse
    {
        $user = $request->user();
        $staffRecord = $user->institutionStaff()->first();
        $institutionId = $staffRecord ? $staffRecord->institution_id : null;

        if ($user->role->value === 'super_admin' && !$institutionId) {
            $institutionId = Institution::where('type', 'pmi')->first()?->id;
        }

        if (!$institutionId) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|string',
            'end_time' => 'required|string|after:start_time',
            'max_capacity' => 'required|integer|min:1|max:500',
        ]);

        $this->slotRepo->create([
            'institution_id' => $institutionId,
            'slot_date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'capacity' => $validated['max_capacity'],
            'booked_count' => 0,
            'created_by' => $user->id,
        ]);

        return redirect()->route('schedules.index')->with('success', 'Slot jadwal donor berhasil ditambahkan.');
    }

    public function storeDonation(Request $request): RedirectResponse
    {
        $user = $request->user();
        $staffRecord = $user->institutionStaff()->first();
        $institutionId = $staffRecord ? $staffRecord->institution_id : null;

        if ($user->role->value === 'super_admin' && !$institutionId) {
            $institutionId = Institution::where('type', 'pmi')->first()?->id;
        }

        if (!$institutionId) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        $validated = $request->validate([
            'donor_email' => 'required|email|exists:users,email',
            'blood_type' => 'required|string|in:A,B,AB,O',
            'rhesus' => 'required|string|in:positive,negative',
            'component_type' => 'required|string|in:whole_blood,prc,ffp,platelet,cryo',
            'volume_ml' => 'required|integer|min:100|max:500',
        ]);

        // Verifikasi role user donor
        $donorUser = User::where('email', $validated['donor_email'])->first();
        if ($donorUser->role->value !== 'donor') {
            throw ValidationException::withMessages([
                'donor_email' => ['User dengan email ini bukan merupakan pendonor terdaftar.'],
            ]);
        }

        $donorProfile = DonorProfile::where('user_id', $donorUser->id)->first();
        if (!$donorProfile) {
            throw ValidationException::withMessages([
                'donor_email' => ['Profil pendonor tidak ditemukan.'],
            ]);
        }

        DB::transaction(function () use ($validated, $donorProfile, $institutionId) {
            // 1. Buat Transaksi Donasi
            Donation::create([
                'donor_id' => $donorProfile->id,
                'institution_id' => $institutionId,
                'blood_type' => $validated['blood_type'],
                'rhesus' => $validated['rhesus'],
                'component_type' => $validated['component_type'],
                'volume_ml' => $validated['volume_ml'],
                'donated_at' => now(),
                'status' => 'completed',
            ]);

            // 2. Perbarui Profil Pendonor (Gamifikasi Poin & eligibility)
            $donorProfile->increment('points', 100); // Tambah 100 poin donasi
            $donorProfile->increment('total_donations', 1);
            $donorProfile->update([
                'last_donation_date' => now(),
                'next_eligible_date' => now()->addDays(60), // Jadwal donor berikutnya (60 hari)
            ]);
        });

        return redirect()->route('schedules.index')->with('success', 'Transaksi donor walk-in berhasil dicatat dan poin pendonor bertambah.');
    }
}
