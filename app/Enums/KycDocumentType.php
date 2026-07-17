<?php

namespace App\Enums;

enum KycDocumentType: string
{
    case KtpPhoto = 'ktp_photo';
    case SelfieKtp = 'selfie_ktp';
    case VerificationLetter = 'verification_letter';
}
