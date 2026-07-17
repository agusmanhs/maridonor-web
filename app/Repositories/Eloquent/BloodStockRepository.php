<?php

namespace App\Repositories\Eloquent;

use App\Models\BloodStock;
use App\Models\BloodStockThreshold;
use App\Repositories\Contracts\BloodStockRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class BloodStockRepository implements BloodStockRepositoryInterface
{
    public function findById(string $id): ?BloodStock
    {
        return BloodStock::with(['institution', 'donorProfile.user'])->find($id);
    }

    public function findByBagNumber(string $bagNumber): ?BloodStock
    {
        return BloodStock::where('bag_number', $bagNumber)->first();
    }

    public function getStockList(string $institutionId, array $filters): Collection
    {
        $query = BloodStock::where('institution_id', $institutionId);

        if (!empty($filters['blood_type'])) {
            $query->where('blood_type', $filters['blood_type']);
        }

        if (!empty($filters['rhesus'])) {
            $query->where('rhesus', $filters['rhesus']);
        }

        if (!empty($filters['component_type'])) {
            $query->where('component_type', $filters['component_type']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        } else {
            // Default hanya tampilkan stok yang 'available'
            $query->where('status', \App\Enums\StockStatus::Available);
        }

        return $query->latest('expires_at')->get();
    }

    public function create(array $data): BloodStock
    {
        return BloodStock::create($data);
    }

    public function update(string $id, array $data): bool
    {
        $stock = $this->findById($id);
        if ($stock) {
            return $stock->update($data);
        }
        return false;
    }

    public function getInventorySummary(string $institutionId): Collection
    {
        return BloodStock::select('blood_type', 'rhesus', 'component_type', DB::raw('count(*) as total_bags'), DB::raw('sum(quantity_ml) as total_volume_ml'))
            ->where('institution_id', $institutionId)
            ->where('status', \App\Enums\StockStatus::Available)
            ->where('expires_at', '>', now())
            ->groupBy('blood_type', 'rhesus', 'component_type')
            ->get();
    }

    public function checkThresholds(string $institutionId): Collection
    {
        // Query untuk membandingkan stok aktif saat ini dengan batas threshold
        return DB::table('blood_stock_thresholds as t')
            ->leftJoin('blood_stocks as s', function ($join) {
                $join->on('t.institution_id', '=', 's.institution_id')
                    ->on('t.blood_type', '=', 's.blood_type')
                    ->on('t.rhesus', '=', 's.rhesus')
                    ->on('t.component_type', '=', 's.component_type')
                    ->where('s.status', '=', \App\Enums\StockStatus::Available->value)
                    ->where('s.expires_at', '>', now());
            })
            ->select(
                't.blood_type',
                't.rhesus',
                't.component_type',
                't.critical_threshold',
                't.low_threshold',
                DB::raw('count(s.id) as current_bags')
            )
            ->where('t.institution_id', $institutionId)
            ->groupBy('t.blood_type', 't.rhesus', 't.component_type', 't.critical_threshold', 't.low_threshold')
            ->get()
            ->map(function ($item) {
                $item->status = 'normal';
                if ($item->current_bags <= $item->critical_threshold) {
                    $item->status = 'critical';
                } elseif ($item->current_bags <= $item->low_threshold) {
                    $item->status = 'low';
                }
                return $item;
            });
    }
}
