<?php

namespace App\Models;

use App\Enums\BloodComponent;
use App\Enums\BloodType;
use App\Enums\RhesusType;
use App\Enums\StockStatus;
use App\Traits\HasAuditLog;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BloodStock extends Model
{
    use HasUuid, HasAuditLog;

    protected $fillable = [
        'institution_id',
        'blood_type',
        'rhesus',
        'component_type',
        'bag_number',
        'quantity_ml',
        'status',
        'batch_number',
        'source_donor_id',
        'collected_at',
        'expires_at',
        'distributed_to',
        'distributed_at',
        'discarded_reason',
        'discarded_at',
        'created_by',
    ];

    protected $casts = [
        'blood_type' => BloodType::class,
        'rhesus' => RhesusType::class,
        'component_type' => BloodComponent::class,
        'status' => StockStatus::class,
        'quantity_ml' => 'integer',
        'collected_at' => 'datetime',
        'expires_at' => 'datetime',
        'distributed_at' => 'datetime',
        'discarded_at' => 'datetime',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function donorProfile(): BelongsTo
    {
        return $this->belongsTo(DonorProfile::class, 'source_donor_id');
    }

    public function recipientInstitution(): BelongsTo
    {
        return $this->belongsTo(Institution::class, 'distributed_to');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }
}
