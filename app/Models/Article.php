<?php

namespace App\Models;

use App\Traits\HasAuditLog;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasUuid, SoftDeletes, HasAuditLog;

    protected $fillable = [
        'author_id',
        'institution_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'thumbnail_url',
        'category',
        'status',
        'published_at',
        'view_count',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'view_count' => 'integer',
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
