<?php

namespace App\Http\Controllers\Api\V1\BloodStock;

use App\Http\Controllers\Controller;
use App\Http\Requests\BloodStock\DiscardBloodStockRequest;
use App\Http\Requests\BloodStock\DistributeBloodStockRequest;
use App\Http\Requests\BloodStock\StoreBloodStockRequest;
use App\Http\Resources\BloodStock\BloodStockResource;
use App\Http\Resources\BloodStock\BloodStockSummaryResource;
use App\Services\BloodStock\BloodStockService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BloodStockController extends Controller
{
    public function __construct(
        private readonly BloodStockService $bloodStockService
    ) {}

    public function index(Request $request, string $institutionId): JsonResponse
    {
        $filters = $request->only(['blood_type', 'rhesus', 'component_type', 'status']);
        $stocks = $this->bloodStockService->list($institutionId, $filters);

        return response()->json([
            'success' => true,
            'data' => BloodStockResource::collection($stocks),
        ], 200);
    }

    public function summary(Request $request, string $institutionId): JsonResponse
    {
        $summary = $this->bloodStockService->getSummary($institutionId);

        return response()->json([
            'success' => true,
            'data' => BloodStockSummaryResource::collection($summary),
        ], 200);
    }

    public function alerts(Request $request, string $institutionId): JsonResponse
    {
        $alerts = $this->bloodStockService->getAlerts($institutionId);

        return response()->json([
            'success' => true,
            'data' => $alerts,
        ], 200);
    }

    public function store(StoreBloodStockRequest $request): JsonResponse
    {
        $stock = $this->bloodStockService->addStock(
            $request->validated(),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Kantong darah berhasil ditambahkan ke stok.',
            'data' => new BloodStockResource($stock),
        ], 201);
    }

    public function distribute(DistributeBloodStockRequest $request, string $id): JsonResponse
    {
        $this->bloodStockService->distributeStock(
            $id,
            $request->input('distributed_to'),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Stok darah berhasil didistribusikan.',
        ], 200);
    }

    public function discard(DiscardBloodStockRequest $request, string $id): JsonResponse
    {
        $this->bloodStockService->discardStock(
            $id,
            $request->input('reason'),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Kantong darah berhasil dibuang dari stok aktif.',
        ], 200);
    }
}
