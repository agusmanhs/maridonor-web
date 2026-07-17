<?php

namespace App\Http\Resources\BloodStock;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BloodStockSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'blood_type' => $this->blood_type,
            'rhesus' => $this->rhesus,
            'component_type' => $this->component_type,
            'total_bags' => (int) $this->total_bags,
            'total_volume_ml' => (int) $this->total_volume_ml,
        ];
    }
}
