<?php

namespace App\Services\BloodStock;

use App\Enums\BloodComponent;
use App\Enums\StockStatus;
use App\Models\BloodStock;
use App\Repositories\Contracts\BloodStockRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class BloodStockService
{
    public function __construct(
        private readonly BloodStockRepositoryInterface $stockRepo
    ) {}

    public function list(string $institutionId, array $filters): LengthAwarePaginator
    {
        return $this->stockRepo->getStockList($institutionId, $filters);
    }

    public function getSummary(string $institutionId): Collection
    {
        return $this->stockRepo->getInventorySummary($institutionId);
    }

    public function getAlerts(string $institutionId): Collection
    {
        return $this->stockRepo->checkThresholds($institutionId)->filter(function ($item) {
            return $item->status !== 'normal';
        })->values();
    }

    public function addStock(array $data, string $creatorId): BloodStock
    {
        if (empty($data['batch_number'])) {
            $data['batch_number'] = 'BATCH-' . now()->format('Ymd');
        }

        // Hitung masa expired secara otomatis berdasarkan tipe komponen jika tidak di-input manual
        if (empty($data['expires_at'])) {
            $collectedAt = !empty($data['collected_at']) ? Carbon::parse($data['collected_at']) : now();
            $componentType = $data['component_type'] instanceof BloodComponent ? $data['component_type']->value : $data['component_type'];

            $daysToAdd = match ($componentType) {
                'platelet' => 5,
                'whole_blood', 'prc' => 35,
                'ffp', 'cryo' => 365,
                default => 35,
            };

            $data['expires_at'] = $collectedAt->addDays($daysToAdd);
        }

        // Cek duplikasi nomor kantong
        $existing = $this->stockRepo->findByBagNumber($data['bag_number']);
        if ($existing) {
            throw ValidationException::withMessages([
                'bag_number' => ['Nomor kantong darah ini sudah terdaftar di sistem.'],
            ]);
        }

        return $this->stockRepo->create(array_merge($data, [
            'status' => StockStatus::Available,
            'created_by' => $creatorId,
        ]));
    }

    public function distributeStock(string $stockId, string $toInstitutionId, string $updaterId): bool
    {
        $stock = $this->stockRepo->findById($stockId);

        if (!$stock || $stock->status !== StockStatus::Available) {
            throw ValidationException::withMessages([
                'stock_id' => ['Stok darah tidak tersedia untuk didistribusikan.'],
            ]);
        }

        return $this->stockRepo->update($stockId, [
            'status' => StockStatus::Distributed,
            'distributed_to' => $toInstitutionId,
            'distributed_at' => now(),
        ]);
    }

    public function discardStock(string $stockId, string $reason, string $updaterId): bool
    {
        $stock = $this->stockRepo->findById($stockId);

        if (!$stock || !in_array($stock->status, [StockStatus::Available, StockStatus::Reserved])) {
            throw ValidationException::withMessages([
                'stock_id' => ['Stok darah tidak dapat dibuang.'],
            ]);
        }

        return $this->stockRepo->update($stockId, [
            'status' => StockStatus::Discarded,
            'discarded_reason' => $reason,
            'discarded_at' => now(),
        ]);
    }
}
