<?php

namespace App\Http\Resources\BloodStock;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BloodStockResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'institution_id' => $this->institution_id,
            'blood_type' => $this->blood_type,
            'rhesus' => $this->rhesus,
            'component_type' => $this->component_type,
            'bag_number' => $this->bag_number,
            'quantity_ml' => (int) $this->quantity_ml,
            'status' => $this->status,
            'batch_number' => $this->batch_number,
            'source_donor_id' => $this->source_donor_id,
            'collected_at' => $this->collected_at?->toISOString(),
            'expires_at' => $this->expires_at?->toISOString(),
            'distributed_to' => $this->distributed_to,
            'distributed_at' => $this->distributed_at?->toISOString(),
            'discarded_reason' => $this->discarded_reason,
            'discarded_at' => $this->discarded_at?->toISOString(),
            'created_by' => $this->created_by,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
