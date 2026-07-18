<?php

namespace App\Http\Resources\Reward;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BadgeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'badge_type' => $this->badge_type,
            'icon_url' => $this->icon_url,
            'required_points' => (int) $this->required_points,
            'required_donations' => (int) $this->required_donations,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
