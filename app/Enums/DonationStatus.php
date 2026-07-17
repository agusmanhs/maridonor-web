<?php

namespace App\Enums;

enum DonationStatus: string
{
    case Scheduled = 'scheduled';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    case Deferred = 'deferred';
}
