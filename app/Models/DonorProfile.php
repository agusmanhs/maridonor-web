<?php

namespace App\Models;

use App\Enums\BloodType;
use App\Enums\EligibilityStatus;
use App\Enums\RhesusType;
use App\Traits\HasAuditLog;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DonorProfile extends Model
{
    use HasUuid, HasAuditLog;

    protected $fillable = [
        'user_id',
        'nik_encrypted',
        'gender',
        'birth_date',
        'blood_type',
        'rhesus',
        'weight_kg',
        'address_id',
        'photo_url',
        'total_donations',
        'last_donation_date',
        'next_eligible_date',
        'eligibility_status',
        'deferral_reason',
        'deferral_until',
        'points',
        'level',
        'referral_code',
        'referred_by',
        'health_notes_encrypted',
        'emergency_contact_name',
        'emergency_contact_phone',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'last_donation_date' => 'date',
        'next_eligible_date' => 'date',
        'deferral_until' => 'date',
        'weight_kg' => 'decimal:2',
        'points' => 'integer',
        'level' => 'integer',
        'total_donations' => 'integer',
        'eligibility_status' => EligibilityStatus::class,
        'blood_type' => BloodType::class,
        'rhesus' => RhesusType::class,
        'nik_encrypted' => 'encrypted',
        'health_notes_encrypted' => 'encrypted',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function referrer(): BelongsTo
    {
        return $this->belongsTo(DonorProfile::class, 'referred_by');
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(DonorProfile::class, 'referred_by');
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class, 'donor_id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'donor_id');
    }
}
