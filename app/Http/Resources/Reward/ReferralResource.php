<?php

namespace App\Http\Resources\Reward;

use App\Http\Resources\Auth\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReferralResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'referrer_id' => $this->referrer_id,
            'referred_user_id' => $this->referred_user_id,
            'status' => $this->status,
            'points_awarded' => (int) $this->points_awarded,
            'created_at' => $this->created_at?->toISOString(),
            'referred_user' => new UserResource($this->whenLoaded('referredUser')),
        ];
    }
}
