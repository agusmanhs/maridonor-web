<?php

namespace App\Http\Resources\Schedule;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'donor_id' => $this->donor_id,
            'slot_id' => $this->slot_id,
            'qr_code' => $this->qr_code,
            'queue_number' => (int) $this->queue_number,
            'status' => $this->status,
            'checked_in_at' => $this->checked_in_at?->toISOString(),
            'cancelled_at' => $this->cancelled_at?->toISOString(),
            'cancellation_reason' => $this->cancellation_reason,
            'cancelled_by' => $this->cancelled_by,
            'schedule_slot' => new ScheduleSlotResource($this->whenLoaded('scheduleSlot')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
