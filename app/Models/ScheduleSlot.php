<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ScheduleSlot extends Model
{
    use HasUuid;

    protected $fillable = [
        'institution_id',
        'slot_date',
        'start_time',
        'end_time',
        'capacity',
        'booked_count',
        'type',
        'event_name',
        'notes',
        'is_cancelled',
        'cancellation_reason',
        'created_by',
    ];

    protected $casts = [
        'slot_date' => 'date',
        'capacity' => 'integer',
        'booked_count' => 'integer',
        'is_cancelled' => 'boolean',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'slot_id');
    }
}
