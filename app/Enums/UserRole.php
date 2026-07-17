<?php

namespace App\Enums;

enum UserRole: string
{
    case Donor = 'donor';
    case Patient = 'patient';
    case RsStaff = 'rs_staff';
    case RsAdmin = 'rs_admin';
    case PmiStaff = 'pmi_staff';
    case PmiAdmin = 'pmi_admin';
    case SuperAdmin = 'super_admin';
}
