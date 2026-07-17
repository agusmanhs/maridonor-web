<?php

namespace App\Enums;

enum StockStatus: string
{
    case Available = 'available';
    case Reserved = 'reserved';
    case Distributed = 'distributed';
    case Expired = 'expired';
    case Discarded = 'discarded';
}
