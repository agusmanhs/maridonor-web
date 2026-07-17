<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class OtpCode extends Model
{
    use HasUuid;

    // OtpCode only has created_at
    public $timestamps = false;

    protected $fillable = [
        'identifier',
        'code',
        'type',
        'attempts',
        'expires_at',
        'used_at',
    ];

    protected $casts = [
        'code' => 'encrypted',
        'attempts' => 'integer',
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'created_at' => 'datetime',
    ];
}
