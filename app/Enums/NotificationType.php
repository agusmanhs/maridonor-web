<?php

namespace App\Enums;

enum NotificationType: string
{
    case BloodRequest = 'blood_request';
    case ScheduleReminder = 'schedule_reminder';
    case StockAlert = 'stock_alert';
    case BadgeEarned = 'badge_earned';
    case Announcement = 'announcement';
    case System = 'system';
}
