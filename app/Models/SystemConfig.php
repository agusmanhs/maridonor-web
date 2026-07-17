<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemConfig extends Model
{
    use HasUuid;

    protected $fillable = [
        'key',
        'value',
        'description',
        'updated_by',
    ];

    protected $casts = [
        'value' => 'array',
    ];

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
