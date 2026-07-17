<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    use HasUuid;

    protected $fillable = [
        'author_id',
        'institution_id',
        'title',
        'content',
        'type',
        'target_audience',
        'is_pinned',
        'published_at',
        'expires_at',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
