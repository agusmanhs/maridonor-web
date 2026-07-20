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
use App\Models\Booking;
use App\Models\ScheduleSlot;
use App\Enums\BookingStatus;
use Carbon\Carbon;

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
            ->paginate(10, ['*'], 'donations_page')->withQueryString();

        // Ambil daftar antrean reservasi hari ini/aktif
        $bookings = Booking::whereHas('scheduleSlot', function ($q) use ($institutionId) {
                $q->where('institution_id', $institutionId);
            })
            ->with(['donorProfile.user', 'scheduleSlot'])
            ->whereIn('status', [BookingStatus::Booked, BookingStatus::CheckedIn, BookingStatus::Donated, BookingStatus::Deferred])
            ->orderByRaw("CASE status WHEN 'checked_in' THEN 1 WHEN 'booked' THEN 2 WHEN 'donated' THEN 3 WHEN 'deferred' THEN 4 ELSE 5 END")
            ->orderBy('created_at', 'desc')
            ->paginate(15, ['*'], 'bookings_page')->withQueryString();

        return Inertia::render('Schedule/Index', [
            'slots' => $slots,
            'donations' => $donations,
            'bookings' => $bookings,
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

    public function bookSlot(Request $request, $id): RedirectResponse
    {
        $user = $request->user();
        $donorProfile = DonorProfile::where('user_id', $user->id)->first();
        if (!$donorProfile) {
            abort(404, 'Profil pendonor Anda belum terdaftar.');
        }

        // 1. Cek kelayakan donor
        if ($donorProfile->next_eligible_date && Carbon::parse($donorProfile->next_eligible_date)->isFuture()) {
            return back()->withErrors(['booking' => 'Anda belum layak berdonor saat ini. Tanggal kelayakan Anda berikutnya adalah ' . $donorProfile->next_eligible_date->toDateString()]);
        }

        // 2. Cek apakah sudah punya booking aktif
        $activeBooking = Booking::where('donor_id', $donorProfile->id)
            ->where('status', BookingStatus::Booked)
            ->first();
        if ($activeBooking) {
            return back()->withErrors(['booking' => 'Anda sudah memiliki reservasi jadwal donor yang masih aktif. Silakan selesaikan atau batalkan reservasi tersebut terlebih dahulu.']);
        }

        // 3. Cek kapasitas slot
        $slot = ScheduleSlot::findOrFail($id);
        if ($slot->booked_count >= $slot->capacity) {
            return back()->withErrors(['booking' => 'Kapasitas slot ini sudah penuh. Silakan pilih slot lainnya.']);
        }

        DB::transaction(function () use ($donorProfile, $slot) {
            // Increment booked count
            $slot->increment('booked_count');

            // Hitung queue number
            $queueNumber = Booking::where('slot_id', $slot->id)->count() + 1;

            Booking::create([
                'donor_id' => $donorProfile->id,
                'slot_id' => $slot->id,
                'qr_code' => 'DONOR-' . strtoupper(uniqid()),
                'queue_number' => $queueNumber,
                'status' => BookingStatus::Booked,
            ]);
        });

        return redirect()->route('dashboard.donor')->with('success', 'Reservasi jadwal donor berhasil disimpan.');
    }

    public function cancelBooking(Request $request, $id): RedirectResponse
    {
        $user = $request->user();
        $donorProfile = DonorProfile::where('user_id', $user->id)->first();
        if (!$donorProfile) {
            abort(404, 'Profil pendonor Anda belum terdaftar.');
        }

        $booking = Booking::where('id', $id)->where('donor_id', $donorProfile->id)->where('status', BookingStatus::Booked)->firstOrFail();
        
        DB::transaction(function () use ($booking) {
            $booking->update([
                'status' => BookingStatus::Cancelled,
                'cancelled_at' => now(),
                'cancellation_reason' => 'Dibatalkan oleh pendonor melalui Web Portal.',
                'cancelled_by' => $booking->donorProfile->user_id,
            ]);

            // Decrement slot booked count
            $booking->scheduleSlot()->decrement('booked_count');
        });

        return redirect()->route('dashboard.donor')->with('success', 'Reservasi jadwal donor Anda telah dibatalkan.');
    }

    public function checkInBooking(Request $request, $id): RedirectResponse
    {
        $booking = Booking::findOrFail($id);
        if ($booking->status !== BookingStatus::Booked) {
            throw ValidationException::withMessages([
                'booking' => ['Status reservasi tidak valid untuk check-in.'],
            ]);
        }

        $booking->update([
            'status' => BookingStatus::CheckedIn,
            'checked_in_at' => now(),
        ]);

        return back()->with('success', 'Pendonor berhasil check-in. Silakan lanjutkan ke tahap screening medis.');
    }

    public function submitScreening(Request $request, $id): RedirectResponse
    {
        $booking = Booking::findOrFail($id);
        if ($booking->status !== BookingStatus::CheckedIn) {
            throw ValidationException::withMessages([
                'booking' => ['Pendonor harus melakukan check-in terlebih dahulu sebelum screening.'],
            ]);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:completed,deferred',
            'systolic_bp' => 'required|integer|min:50|max:250',
            'diastolic_bp' => 'required|integer|min:30|max:150',
            'hemoglobin' => 'required|numeric|min:5|max:25',
            'weight' => 'required|numeric|min:30|max:200',
            'component_type' => 'required_if:status,completed|string|in:whole_blood,prc,ffp,platelet,cryo',
            'volume_ml' => 'required_if:status,completed|integer|min:100|max:1000',
            'deferred_reason' => 'required_if:status,deferred|nullable|string|max:500',
            'officer_notes' => 'nullable|string|max:500',
        ]);

        $donorProfile = $booking->donorProfile;
        $user = $request->user();
        $staffRecord = $user->institutionStaff()->first();
        $institutionId = $staffRecord ? $staffRecord->institution_id : null;

        if ($user->role->value === 'super_admin' && !$institutionId) {
            $institutionId = Institution::where('type', 'pmi')->first()?->id;
        }

        if (!$institutionId) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        DB::transaction(function () use ($booking, $donorProfile, $validated, $institutionId, $user) {
            if ($validated['status'] === 'completed') {
                // 1. Buat Transaksi Donasi
                Donation::create([
                    'donor_id' => $donorProfile->id,
                    'institution_id' => $institutionId,
                    'booking_id' => $booking->id,
                    'blood_type' => $donorProfile->blood_type,
                    'rhesus' => $donorProfile->rhesus,
                    'component_type' => $validated['component_type'],
                    'volume_ml' => $validated['volume_ml'],
                    'donated_at' => now(),
                    'status' => \App\Enums\DonationStatus::Completed,
                    'hemoglobin' => $validated['hemoglobin'],
                    'systolic_bp' => $validated['systolic_bp'],
                    'diastolic_bp' => $validated['diastolic_bp'],
                    'weight_at_donation' => $validated['weight'],
                    'officer_notes' => $validated['officer_notes'],
                    'officer_id' => $user->id,
                    'points_earned' => 100,
                ]);

                // 2. Perbarui status booking
                $booking->update([
                    'status' => BookingStatus::Donated,
                ]);

                // 3. Perbarui Profil Pendonor (Poin & eligibility)
                $donorProfile->increment('points', 100);
                $donorProfile->increment('total_donations', 1);
                $donorProfile->update([
                    'last_donation_date' => now(),
                    'next_eligible_date' => now()->addDays(60),
                    'eligibility_status' => \App\Enums\EligibilityStatus::Eligible,
                    'deferral_reason' => null,
                ]);
            } else {
                // Penangguhan (Deferred)
                // 1. Perbarui status booking
                $booking->update([
                    'status' => BookingStatus::Deferred,
                ]);

                // 2. Perbarui status kelayakan di profil pendonor
                $donorProfile->update([
                    'eligibility_status' => \App\Enums\EligibilityStatus::Deferred,
                    'deferral_reason' => $validated['deferred_reason'],
                ]);

                // 3. Buat Catatan Donasi sebagai 'deferred' untuk histori screening
                Donation::create([
                    'donor_id' => $donorProfile->id,
                    'institution_id' => $institutionId,
                    'booking_id' => $booking->id,
                    'blood_type' => $donorProfile->blood_type,
                    'rhesus' => $donorProfile->rhesus,
                    'component_type' => \App\Enums\BloodComponent::WholeBlood, // default
                    'volume_ml' => 0,
                    'donated_at' => now(),
                    'status' => \App\Enums\DonationStatus::Deferred,
                    'hemoglobin' => $validated['hemoglobin'],
                    'systolic_bp' => $validated['systolic_bp'],
                    'diastolic_bp' => $validated['diastolic_bp'],
                    'weight_at_donation' => $validated['weight'],
                    'deferred_reason' => $validated['deferred_reason'],
                    'officer_notes' => $validated['officer_notes'],
                    'officer_id' => $user->id,
                    'points_earned' => 0,
                ]);
            }
        });

        $message = $validated['status'] === 'completed' 
            ? 'Screening berhasil. Donasi darah dicatat dan poin pendonor ditambahkan.' 
            : 'Screening selesai. Pendonor ditangguhkan medis dengan alasan: ' . $validated['deferred_reason'];

        return back()->with('success', $message);
    }
}
