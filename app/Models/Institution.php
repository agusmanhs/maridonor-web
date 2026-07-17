<?php

namespace App\Models;

use App\Enums\InstitutionStatus;
use App\Enums\InstitutionType;
use App\Traits\HasAuditLog;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Institution extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'name',
        'type',
        'code',
        'license_number',
        'npwp',
        'address_id',
        'phone',
        'email',
        'website',
        'operational_hours',
        'latitude',
        'longitude',
        'logo_url',
        'status',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected $casts = [
        'type' => InstitutionType::class,
        'status' => InstitutionStatus::class,
        'operational_hours' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'approved_at' => 'datetime',
    ];

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function staff(): HasMany
    {
        return $this->hasMany(InstitutionStaff::class);
    }

    public function bloodStocks(): HasMany
    {
        return $this->hasMany(BloodStock::class);
    }

    public function bloodStockThresholds(): HasMany
    {
        return $this->hasMany(BloodStockThreshold::class);
    }

    public function scheduleSlots(): HasMany
    {
        return $this->hasMany(ScheduleSlot::class);
    }

    public function originatingRequests(): HasMany
    {
        return $this->hasMany(BloodRequest::class, 'institution_id');
    }

    public function destinationRequests(): HasMany
    {
        return $this->hasMany(BloodRequest::class, 'destination_hospital_id');
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }
}
