<?php

namespace App\Models;

use App\Enums\BookingStatus;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    use HasUuid;

    protected $fillable = [
        'donor_id',
        'slot_id',
        'qr_code',
        'queue_number',
        'status',
        'checked_in_at',
        'cancelled_at',
        'cancellation_reason',
        'cancelled_by',
    ];

    protected $casts = [
        'status' => BookingStatus::class,
        'queue_number' => 'integer',
        'checked_in_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function donorProfile(): BelongsTo
    {
        return $this->belongsTo(DonorProfile::class, 'donor_id');
    }

    public function scheduleSlot(): BelongsTo
    {
        return $this->belongsTo(ScheduleSlot::class, 'slot_id');
    }

    public function canceller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function donation(): HasOne
    {
        return $this->hasOne(Donation::class);
    }
}
