<?php

namespace App\Enums;

enum RequestStatus: string
{
    case Draft = 'draft';
    case Open = 'open';
    case PartiallyFulfilled = 'partially_fulfilled';
    case Fulfilled = 'fulfilled';
    case Expired = 'expired';
    case Cancelled = 'cancelled';
}
