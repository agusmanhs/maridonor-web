<?php

namespace App\Http\Resources\Institution;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstitutionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'code' => $this->code,
            'license_number' => $this->license_number,
            'npwp' => $this->npwp,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'operational_hours' => $this->operational_hours,
            'latitude' => (float) $this->latitude,
            'longitude' => (float) $this->longitude,
            'logo_url' => $this->logo_url,
            'status' => $this->status,
            'address' => new AddressResource($this->whenLoaded('address')),
            'distance_km' => $this->when(isset($this->distance), fn() => round((float) $this->distance, 2)),
            'approved_at' => $this->approved_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
