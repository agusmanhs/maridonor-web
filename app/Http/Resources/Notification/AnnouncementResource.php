<?php

namespace App\Http\Resources\Notification;

use App\Http\Resources\Auth\UserResource;
use App\Http\Resources\Institution\InstitutionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'author_id' => $this->author_id,
            'author' => new UserResource($this->whenLoaded('author')),
            'institution_id' => $this->institution_id,
            'institution' => new InstitutionResource($this->whenLoaded('institution')),
            'title' => $this->title,
            'content' => $this->content,
            'type' => $this->type,
            'target_audience' => $this->target_audience,
            'is_pinned' => (bool) $this->is_pinned,
            'published_at' => $this->published_at?->toISOString(),
            'expires_at' => $this->expires_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
