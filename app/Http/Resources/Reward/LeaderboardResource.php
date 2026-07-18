<?php

namespace App\Http\Resources\Reward;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaderboardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'user_id' => $this->user_id,
            'name' => $this->user?->name,
            'blood_type' => $this->blood_type,
            'rhesus' => $this->rhesus,
            'points' => (int) $this->points,
            'avatar_url' => $this->user?->avatar_url,
        ];
    }
}
