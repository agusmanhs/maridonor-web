<?php

namespace App\Http\Resources\Schedule;

use App\Http\Resources\Institution\InstitutionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleSlotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'institution_id' => $this->institution_id,
            'slot_date' => $this->slot_date?->format('Y-m-d'),
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'capacity' => (int) $this->capacity,
            'booked_count' => (int) $this->booked_count,
            'type' => $this->type,
            'event_name' => $this->event_name,
            'notes' => $this->notes,
            'is_cancelled' => (bool) $this->is_cancelled,
            'created_by' => $this->created_by,
            'institution' => new InstitutionResource($this->whenLoaded('institution')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
