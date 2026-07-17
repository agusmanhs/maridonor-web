<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Badge extends Model
{
    use HasUuid;

    protected $fillable = [
        'code',
        'name',
        'description',
        'icon_url',
        'criteria_type',
        'criteria_value',
        'points_reward',
        'is_active',
    ];

    protected $casts = [
        'criteria_value' => 'array',
        'points_reward' => 'integer',
        'is_active' => 'boolean',
    ];

    public function userBadges(): HasMany
    {
        return $this->hasMany(UserBadge::class);
    }
}
