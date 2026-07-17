<?php

namespace App\Enums;

enum EligibilityStatus: string
{
    case Eligible = 'eligible';
    case TemporarilyDeferred = 'temporarily_deferred';
    case PermanentlyDeferred = 'permanently_deferred';
}
