<?php

namespace App\Services\Auth;

use App\Repositories\Contracts\OtpCodeRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class OtpService
{
    public function __construct(
        private readonly OtpCodeRepositoryInterface $otpRepo
    ) {}

    public function sendOtp(string $identifier, string $type): array
    {
        // Generate 6 digit numeric code
        $code = (string) rand(100000, 999999);

        // Encrypt code for secure storage (using Laravel's native encryption via cast)
        $otp = $this->otpRepo->create([
            'identifier' => $identifier,
            'code' => $code,
            'type' => $type,
            'attempts' => 0,
            'expires_at' => now()->addMinutes(5),
        ]);

        // Simulasikan pengiriman ke log untuk tahap development awal
        Log::info("MARIDONOR OTP [{$type}] sent to {$identifier}: {$code}");

        return [
            'expires_in' => 300, // 5 menit dalam detik
            'resend_after' => 60, // 1 menit dalam detik
        ];
    }

    public function verifyOtp(string $identifier, string $code, string $type): bool
    {
        $otp = $this->otpRepo->findValidOtp($identifier, $type);

        if (!$otp) {
            return false;
        }

        // Bandingkan kode (karena cast 'encrypted' otomatis mendekripsi nilai dari DB)
        if ($otp->code !== $code) {
            $this->otpRepo->incrementAttempts($otp->id);
            return false;
        }

        $this->otpRepo->markAsUsed($otp->id);
        return true;
    }
}
