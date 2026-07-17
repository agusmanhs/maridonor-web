<?php

namespace App\Enums;

enum UrgencyLevel: string
{
    case Emergency = 'emergency';
    case Urgent = 'urgent';
    case Elective = 'elective';
}
