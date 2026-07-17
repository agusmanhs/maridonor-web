<?php

namespace App\Enums;

enum InstitutionStatus: string
{
    case Pending = 'pending';
    case UnderReview = 'under_review';
    case Approved = 'approved';
    case Suspended = 'suspended';
}
