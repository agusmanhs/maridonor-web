<?php

namespace App\Repositories\Eloquent;

use App\Models\OtpCode;
use App\Repositories\Contracts\OtpCodeRepositoryInterface;

class OtpCodeRepository implements OtpCodeRepositoryInterface
{
    public function findValidOtp(string $identifier, string $type): ?OtpCode
    {
        return OtpCode::where('identifier', $identifier)
            ->where('type', $type)
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->where('attempts', '<', 5)
            ->latest('created_at')
            ->first();
    }

    public function create(array $data): OtpCode
    {
        return OtpCode::create($data);
    }

    public function incrementAttempts(string $id): void
    {
        $otp = OtpCode::find($id);
        if ($otp) {
            $otp->increment('attempts');
        }
    }

    public function markAsUsed(string $id): void
    {
        $otp = OtpCode::find($id);
        if ($otp) {
            $otp->update(['used_at' => now()]);
        }
    }
}
