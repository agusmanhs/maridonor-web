<?php

namespace App\Http\Controllers\Web\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebDashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function pmiDashboard(Request $request): Response
    {
        $user = $request->user();
        
        // Dapatkan ID institusi PMI dari relasi staff atau fallback ke PMI pertama untuk super_admin
        $pmiInstitutionId = null;
        if ($user->role->value === 'super_admin') {
            $pmiInstitutionId = \App\Models\Institution::where('type', \App\Enums\InstitutionType::Pmi)->first()?->id;
        } else {
            $staffRecord = $user->institutionStaff()->first();
            $pmiInstitutionId = $staffRecord ? $staffRecord->institution_id : null;
        }

        if (!$pmiInstitutionId) {
            abort(403, 'Anda tidak terasosiasi dengan UDD PMI mana pun.');
        }

        $metrics = $this->dashboardService->getPmiMetricsByInstitution($pmiInstitutionId);

        return Inertia::render('Dashboard/Pmi', [
            'metrics' => $metrics,
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                ]
            ]
        ]);
    }

    public function hospitalDashboard(Request $request): Response
    {
        $user = $request->user();

        // Dapatkan ID institusi RS dari relasi staff atau fallback ke RS pertama untuk super_admin
        $hospitalInstitutionId = null;
        if ($user->role->value === 'super_admin') {
            $hospitalInstitutionId = \App\Models\Institution::where('type', \App\Enums\InstitutionType::Hospital)->first()?->id;
        } else {
            $staffRecord = $user->institutionStaff()->first();
            $hospitalInstitutionId = $staffRecord ? $staffRecord->institution_id : null;
        }

        if (!$hospitalInstitutionId) {
            abort(403, 'Anda tidak terasosiasi dengan Rumah Sakit mana pun.');
        }

        $metrics = $this->dashboardService->getHospitalMetricsByInstitution($hospitalInstitutionId);

        return Inertia::render('Dashboard/Hospital', [
            'metrics' => $metrics,
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                ]
            ]
        ]);
    }

    public function donorDashboard(Request $request): Response
    {
        $user = $request->user();
        
        $donorProfile = \App\Models\DonorProfile::where('user_id', $user->id)->first();
        if (!$donorProfile) {
            abort(404, 'Profil pendonor Anda belum dikonfigurasi.');
        }

        // Ambil riwayat donasi sukses pendonor
        $donations = \App\Models\Donation::where('donor_id', $donorProfile->id)
            ->with(['institution.address'])
            ->orderBy('donated_at', 'desc')
            ->get();

        // Ambil daftar slot aktif di PMI
        $upcomingSlots = \App\Models\ScheduleSlot::with(['institution'])
            ->where('slot_date', '>=', now()->toDateString())
            ->where('is_cancelled', false)
            ->orderBy('slot_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard/Donor', [
            'donorProfile' => [
                'id' => $donorProfile->id,
                'blood_type' => $donorProfile->blood_type,
                'rhesus' => $donorProfile->rhesus,
                'points' => $donorProfile->points,
                'total_donations' => $donorProfile->total_donations,
                'last_donation_date' => $donorProfile->last_donation_date?->toDateString(),
                'next_eligible_date' => $donorProfile->next_eligible_date?->toDateString(),
                'referral_code' => $donorProfile->referral_code,
            ],
            'donations' => $donations,
            'upcomingSlots' => $upcomingSlots,
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                ]
            ]
        ]);
    }
}
