<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    use HasUuid;

    protected $fillable = [
        'user_id',
        'push_enabled',
        'email_enabled',
        'sms_enabled',
        'whatsapp_enabled',
        'blood_request_notif',
        'schedule_reminder_notif',
        'stock_alert_notif',
        'announcement_notif',
        'quiet_hours_start',
        'quiet_hours_end',
    ];

    protected $casts = [
        'push_enabled' => 'boolean',
        'email_enabled' => 'boolean',
        'sms_enabled' => 'boolean',
        'whatsapp_enabled' => 'boolean',
        'blood_request_notif' => 'boolean',
        'schedule_reminder_notif' => 'boolean',
        'stock_alert_notif' => 'boolean',
        'announcement_notif' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
