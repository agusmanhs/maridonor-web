<?php

namespace App\Http\Resources\Notification;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'type' => $this->type instanceof \BackedEnum ? $this->type->value : $this->type,
            'title' => $this->title,
            'body' => $this->body,
            'data' => $this->data,
            'channel' => $this->channel,
            'is_read' => (bool) $this->is_read,
            'read_at' => $this->read_at?->toISOString(),
            'sent_at' => $this->sent_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
