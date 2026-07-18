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

        $metrics = $this->dashboardService->getPmiDashboardMetrics($pmiInstitutionId);

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

        $metrics = $this->dashboardService->getHospitalDashboardMetrics($hospitalInstitutionId);

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
}
