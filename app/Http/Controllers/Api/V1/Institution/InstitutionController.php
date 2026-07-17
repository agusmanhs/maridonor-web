<?php

namespace App\Http\Controllers\Api\V1\Institution;

use App\Http\Controllers\Controller;
use App\Http\Requests\Institution\AddStaffRequest;
use App\Http\Requests\Institution\RegisterInstitutionRequest;
use App\Http\Resources\Institution\InstitutionResource;
use App\Http\Resources\Institution\InstitutionStaffResource;
use App\Services\Institution\InstitutionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InstitutionController extends Controller
{
    public function __construct(
        private readonly InstitutionService $institutionService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['type', 'city', 'latitude', 'longitude', 'radius_km']);
        $institutions = $this->institutionService->list($filters);

        return response()->json([
            'success' => true,
            'data' => InstitutionResource::collection($institutions),
        ], 200);
    }

    public function show(string $id): JsonResponse
    {
        $institution = $this->institutionService->detail($id);

        if (!$institution) {
            return response()->json([
                'success' => false,
                'message' => 'Institusi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new InstitutionResource($institution->load('address')),
        ], 200);
    }

    public function register(RegisterInstitutionRequest $request): JsonResponse
    {
        $institution = $this->institutionService->register($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran institusi berhasil. Menunggu verifikasi oleh Super Admin.',
            'data' => new InstitutionResource($institution),
        ], 201);
    }

    public function getStaff(string $id): JsonResponse
    {
        $staff = $this->institutionService->getStaff($id);

        return response()->json([
            'success' => true,
            'data' => InstitutionStaffResource::collection($staff->load('user')),
        ], 200);
    }

    public function addStaff(AddStaffRequest $request, string $id): JsonResponse
    {
        $this->institutionService->addStaff(
            $id,
            $request->input('email'),
            $request->input('role')
        );

        return response()->json([
            'success' => true,
            'message' => 'Staff berhasil ditambahkan dan diundang.',
        ], 200);
    }

    public function removeStaff(Request $request, string $id, string $userId): JsonResponse
    {
        // Proteksi agar admin PMI/RS tidak bisa menghapus dirinya sendiri
        if ($request->user()->id === $userId) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak bisa menghapus diri Anda sendiri dari daftar staff.',
            ], 422);
        }

        $removed = $this->institutionService->removeStaff($id, $userId);

        if (!$removed) {
            return response()->json([
                'success' => false,
                'message' => 'Staff tidak ditemukan atau gagal dihapus.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Staff berhasil dihapus dari institusi.',
        ], 200);
    }
}
