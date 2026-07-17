<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Address extends Model
{
    use HasUuid;

    protected $fillable = [
        'province',
        'city',
        'district',
        'sub_district',
        'postal_code',
        'street_address',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function donorProfiles(): HasMany
    {
        return $this->hasMany(DonorProfile::class);
    }

    public function institutions(): HasMany
    {
        return $this->hasMany(Institution::class);
    }
}
