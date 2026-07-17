<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Referral extends Model
{
    use HasUuid;

    protected $fillable = [
        'referrer_id',
        'referred_user_id',
        'status',
        'points_awarded',
    ];

    protected $casts = [
        'points_awarded' => 'integer',
    ];

    public function referrer(): BelongsTo
    {
        return $this->belongsTo(DonorProfile::class, 'referrer_id');
    }

    public function referredUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_user_id');
    }
}
