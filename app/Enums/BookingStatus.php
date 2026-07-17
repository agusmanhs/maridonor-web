<?php

namespace App\Enums;

enum BookingStatus: string
{
    case Booked = 'booked';
    case CheckedIn = 'checked_in';
    case Donated = 'donated';
    case Deferred = 'deferred';
    case Cancelled = 'cancelled';
    case NoShow = 'no_show';
}
