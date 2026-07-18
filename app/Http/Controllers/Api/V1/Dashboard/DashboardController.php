<?php

namespace App\Http\Controllers\Api\V1\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService
    ) {}

    public function pmiMetrics(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!in_array($user->role->value, ['pmi_staff', 'pmi_admin', 'super_admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki hak akses untuk melihat dashboard PMI.',
            ], 403);
        }

        $metrics = $this->dashboardService->getPmiMetrics($user->id);

        return response()->json([
            'success' => true,
            'data' => $metrics,
        ], 200);
    }

    public function hospitalMetrics(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!in_array($user->role->value, ['rs_staff', 'rs_admin', 'super_admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki hak akses untuk melihat dashboard Rumah Sakit.',
            ], 403);
        }

        $metrics = $this->dashboardService->getHospitalMetrics($user->id);

        return response()->json([
            'success' => true,
            'data' => $metrics,
        ], 200);
    }
}
