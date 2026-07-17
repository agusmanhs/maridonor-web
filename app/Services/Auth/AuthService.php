<?php

namespace App\Services\Auth;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepo,
        private readonly OtpService $otpService
    ) {}

    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            // Create user
            $user = $this->userRepo->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'password' => Hash::make($data['password']),
                'role' => UserRole::Donor, // Default role dari public register adalah donor
                'status' => UserStatus::Active,
                'kyc_level' => 0,
            ]);

            // Create empty/default Donor Profile
            $user->donorProfile()->create([
                'gender' => $data['gender'],
                'birth_date' => $data['birth_date'],
                'blood_type' => $data['blood_type'],
                'rhesus' => $data['rhesus'],
                'eligibility_status' => \App\Enums\EligibilityStatus::Eligible,
                'points' => 0,
                'level' => 1,
                // Generate a simple unique referral code based on name and random number
                'referral_code' => strtoupper(substr($data['name'], 0, 3) . rand(100, 999)),
            ]);

            // Create default notification preferences
            $user->notificationPreference()->create();

            // Send Verification OTP to phone
            $otpData = $this->otpService->sendOtp($user->phone, 'phone_verify');

            return [
                'user' => $user,
                'otp' => $otpData,
            ];
        });
    }

    public function login(array $data): array
    {
        $user = $this->userRepo->findByEmail($data['email']);

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kombinasi email dan password salah.'],
            ]);
        }

        if ($user->status === UserStatus::Suspended) {
            throw ValidationException::withMessages([
                'email' => ['Akun Anda sedang ditangguhkan. Silakan hubungi admin.'],
            ]);
        }

        // Update last login timestamp
        $this->userRepo->update($user->id, [
            'last_login_at' => now(),
            'fcm_token' => $data['fcm_token'] ?? $user->fcm_token,
        ]);

        // Generate Sanctum access token
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('donorProfile'),
        ];
    }

    public function logout(User $user): void
    {
        // Revoke the token that was used to authenticate the current request
        $user->currentAccessToken()->delete();
    }
}
