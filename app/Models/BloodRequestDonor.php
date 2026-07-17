<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BloodRequestDonor extends Model
{
    use HasUuid;

    protected $table = 'blood_request_donors';

    protected $fillable = [
        'blood_request_id',
        'donor_id',
        'response',
        'responded_at',
        'status',
        'notes',
    ];

    protected $casts = [
        'responded_at' => 'datetime',
    ];

    public function bloodRequest(): BelongsTo
    {
        return $this->belongsTo(BloodRequest::class);
    }

    public function donorProfile(): BelongsTo
    {
        return $this->belongsTo(DonorProfile::class, 'donor_id');
    }
}
