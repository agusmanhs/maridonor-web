<?php

namespace App\Models;

use App\Enums\BloodComponent;
use App\Enums\BloodType;
use App\Enums\RequestStatus;
use App\Enums\RhesusType;
use App\Enums\UrgencyLevel;
use App\Traits\HasAuditLog;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BloodRequest extends Model
{
    use HasUuid, HasAuditLog;

    protected $fillable = [
        'request_code',
        'requester_id',
        'institution_id',
        'patient_name',
        'patient_birth_year',
        'medical_record_number',
        'diagnosis',
        'blood_type',
        'rhesus',
        'component_type',
        'quantity_needed',
        'quantity_fulfilled',
        'urgency_level',
        'status',
        'destination_hospital_id',
        'contact_name',
        'contact_phone',
        'notes',
        'deadline_at',
        'opened_at',
        'fulfilled_at',
        'cancelled_at',
        'cancelled_reason',
    ];

    protected $casts = [
        'blood_type' => BloodType::class,
        'rhesus' => RhesusType::class,
        'component_type' => BloodComponent::class,
        'urgency_level' => UrgencyLevel::class,
        'status' => RequestStatus::class,
        'patient_birth_year' => 'integer',
        'quantity_needed' => 'integer',
        'quantity_fulfilled' => 'integer',
        'deadline_at' => 'datetime',
        'opened_at' => 'datetime',
        'fulfilled_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function destinationHospital(): BelongsTo
    {
        return $this->belongsTo(Institution::class, 'destination_hospital_id');
    }

    public function requestDonors(): HasMany
    {
        return $this->hasMany(BloodRequestDonor::class);
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }
}
