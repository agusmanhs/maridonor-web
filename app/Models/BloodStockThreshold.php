<?php

namespace App\Models;

use App\Enums\BloodComponent;
use App\Enums\BloodType;
use App\Enums\RhesusType;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BloodStockThreshold extends Model
{
    use HasUuid;

    protected $fillable = [
        'institution_id',
        'blood_type',
        'rhesus',
        'component_type',
        'critical_threshold',
        'low_threshold',
    ];

    protected $casts = [
        'blood_type' => BloodType::class,
        'rhesus' => RhesusType::class,
        'component_type' => BloodComponent::class,
        'critical_threshold' => 'integer',
        'low_threshold' => 'integer',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
