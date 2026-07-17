<?php

namespace App\Models;

use App\Enums\BloodComponent;
use App\Enums\BloodType;
use App\Enums\DonationStatus;
use App\Enums\RhesusType;
use App\Traits\HasAuditLog;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Donation extends Model
{
    use HasUuid, HasAuditLog;

    protected $fillable = [
        'donor_id',
        'institution_id',
        'blood_request_id',
        'booking_id',
        'blood_stock_id',
        'blood_type',
        'rhesus',
        'component_type',
        'volume_ml',
        'donated_at',
        'status',
        'hemoglobin',
        'systolic_bp',
        'diastolic_bp',
        'weight_at_donation',
        'deferred_reason',
        'officer_notes',
        'officer_id',
        'points_earned',
        'certificate_url',
    ];

    protected $casts = [
        'blood_type' => BloodType::class,
        'rhesus' => RhesusType::class,
        'component_type' => BloodComponent::class,
        'status' => DonationStatus::class,
        'volume_ml' => 'integer',
        'donated_at' => 'datetime',
        'hemoglobin' => 'decimal:1',
        'systolic_bp' => 'integer',
        'diastolic_bp' => 'integer',
        'weight_at_donation' => 'decimal:2',
        'points_earned' => 'integer',
    ];

    public function donorProfile(): BelongsTo
    {
        return $this->belongsTo(DonorProfile::class, 'donor_id');
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function bloodRequest(): BelongsTo
    {
        return $this->belongsTo(BloodRequest::class);
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function bloodStock(): BelongsTo
    {
        return $this->belongsTo(BloodStock::class);
    }

    public function officer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'officer_id');
    }
}
