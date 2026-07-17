<?php

namespace App\Enums;

enum BloodComponent: string
{
    case WholeBlood = 'whole_blood';
    case Prc = 'prc';
    case Ffp = 'ffp';
    case Platelet = 'platelet';
    case Cryo = 'cryo';
}
