<?php

namespace App\Http\Resources\Donor;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonorProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'gender' => $this->gender,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'blood_type' => $this->blood_type,
            'rhesus' => $this->rhesus,
            'weight_kg' => $this->weight_kg ? (float) $this->weight_kg : null,
            'total_donations' => (int) $this->total_donations,
            'last_donation_date' => $this->last_donation_date?->format('Y-m-d'),
            'next_eligible_date' => $this->next_eligible_date?->format('Y-m-d'),
            'eligibility_status' => $this->eligibility_status,
            'points' => (int) $this->points,
            'level' => (int) $this->level,
            'referral_code' => $this->referral_code,
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,
        ];
    }
}
