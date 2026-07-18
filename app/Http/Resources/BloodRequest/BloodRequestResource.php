<?php

namespace App\Http\Resources\BloodRequest;

use App\Http\Resources\Auth\UserResource;
use App\Http\Resources\Institution\AddressResource;
use App\Http\Resources\Institution\InstitutionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BloodRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'request_code' => $this->request_code,
            'requester_id' => $this->requester_id,
            'institution_id' => $this->institution_id,
            'patient_name' => $this->patient_name,
            'patient_birth_year' => $this->patient_birth_year ? (int) $this->patient_birth_year : null,
            'medical_record_number' => $this->medical_record_number,
            'diagnosis' => $this->diagnosis,
            'blood_type' => $this->blood_type instanceof \BackedEnum ? $this->blood_type->value : $this->blood_type,
            'rhesus' => $this->rhesus instanceof \BackedEnum ? $this->rhesus->value : $this->rhesus,
            'component_type' => $this->component_type instanceof \BackedEnum ? $this->component_type->value : $this->component_type,
            'quantity_needed' => (int) $this->quantity_needed,
            'quantity_fulfilled' => (int) $this->quantity_fulfilled,
            'urgency_level' => $this->urgency_level instanceof \BackedEnum ? $this->urgency_level->value : $this->urgency_level,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'destination_hospital_id' => $this->destination_hospital_id,
            'contact_name' => $this->contact_name,
            'contact_phone' => $this->contact_phone,
            'notes' => $this->notes,
            'deadline_at' => $this->deadline_at?->toISOString(),
            'opened_at' => $this->opened_at?->toISOString(),
            'fulfilled_at' => $this->fulfilled_at?->toISOString(),
            'cancelled_at' => $this->cancelled_at?->toISOString(),
            'cancelled_reason' => $this->cancelled_reason,
            'address' => $this->relationLoaded('destinationHospital') 
                ? new AddressResource($this->destinationHospital->address) 
                : null,
            'requester' => new UserResource($this->whenLoaded('requester')),
            'institution' => new InstitutionResource($this->whenLoaded('institution')),
            'destination_hospital' => new InstitutionResource($this->whenLoaded('destinationHospital')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
