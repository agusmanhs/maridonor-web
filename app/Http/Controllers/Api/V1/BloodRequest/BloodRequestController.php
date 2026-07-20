<?php

namespace App\Http\Controllers\Api\V1\BloodRequest;

use App\Http\Controllers\Controller;
use App\Http\Requests\BloodRequest\FulfillBloodRequestRequest;
use App\Http\Requests\BloodRequest\ProcessBloodRequestRequest;
use App\Http\Requests\BloodRequest\StoreBloodRequestRequest;
use App\Http\Resources\BloodRequest\BloodRequestResource;
use App\Services\BloodRequest\BloodRequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BloodRequestController extends Controller
{
    public function __construct(
        private readonly BloodRequestService $bloodRequestService
    ) {}

    public function index(Request $request): JsonResponse
    {
        // Proteksi role: Hanya PMI Staff, PMI Admin, RS Staff, RS Admin, Super Admin, dan Donor
        $user = $request->user();
        if (!in_array($user->role->value, ['pmi_staff', 'pmi_admin', 'rs_staff', 'rs_admin', 'super_admin', 'donor'])) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki hak akses untuk melihat data permintaan darah.',
            ], 403);
        }

        $filters = $request->only(['status', 'urgency', 'city']);
        
        // Staf RS hanya bisa melihat request dari RS mereka sendiri
        if (in_array($user->role->value, ['rs_staff', 'rs_admin'])) {
            $staffInfo = \App\Models\InstitutionStaff::where('user_id', $user->id)->first();
            if ($staffInfo) {
                $filters['requester_id'] = $staffInfo->institution_id;
            }
        }

        $requests = $this->bloodRequestService->list($filters);

        return response()->json([
            'success' => true,
            'data' => BloodRequestResource::collection($requests),
        ], 200);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        if (!in_array($user->role->value, ['pmi_staff', 'pmi_admin', 'rs_staff', 'rs_admin', 'super_admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki hak akses untuk melihat detail permintaan darah.',
            ], 403);
        }

        $bloodRequest = $this->bloodRequestService->detail($id);

        if (!$bloodRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Permintaan darah tidak ditemukan.',
            ], 404);
        }

        // Staf RS hanya bisa melihat request miliknya sendiri
        if (in_array($user->role->value, ['rs_staff', 'rs_admin'])) {
            $staffInfo = \App\Models\InstitutionStaff::where('user_id', $user->id)->first();
            if ($staffInfo && $bloodRequest->requester_id !== $staffInfo->institution_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki hak akses untuk melihat data ini.',
                ], 403);
            }
        }

        return response()->json([
            'success' => true,
            'data' => new BloodRequestResource($bloodRequest->load(['requester', 'destinationHospital.address'])),
        ], 200);
    }

    public function store(StoreBloodRequestRequest $request): JsonResponse
    {
        $bloodRequest = $this->bloodRequestService->requestBlood(
            $request->validated(),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Permintaan pasokan darah berhasil diajukan.',
            'data' => new BloodRequestResource($bloodRequest),
        ], 201);
    }

    public function process(ProcessBloodRequestRequest $request, string $id): JsonResponse
    {
        $this->bloodRequestService->processRequest(
            $id,
            $request->input('status'),
            $request->input('rejection_reason'),
            $request->user()->id
        );

        $statusMessage = $request->input('status') === 'approved' ? 'disetujui' : 'ditolak';

        return response()->json([
            'success' => true,
            'message' => "Permintaan darah berhasil {$statusMessage}.",
        ], 200);
    }

    public function fulfill(FulfillBloodRequestRequest $request, string $id): JsonResponse
    {
        $this->bloodRequestService->fulfillRequest(
            $id,
            $request->input('blood_stock_ids'),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Kantong darah berhasil dialokasikan dan didistribusikan ke rumah sakit.',
        ], 200);
    }
}
