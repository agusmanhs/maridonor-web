<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\SendOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Http\Resources\Auth\UserResource;
use App\Services\Auth\AuthService;
use App\Services\Auth\OtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService,
        private readonly OtpService $otpService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil. Silakan verifikasi nomor HP Anda.',
            'data' => [
                'user' => new UserResource($result['user']),
                'otp' => $result['otp'],
            ],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'access_token' => $result['access_token'],
                'token_type' => $result['token_type'],
                'user' => new UserResource($result['user']),
            ],
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil',
        ], 200);
    }

    public function sendOtp(SendOtpRequest $request): JsonResponse
    {
        $result = $this->otpService->sendOtp(
            $request->input('identifier'),
            $request->input('type')
        );

        return response()->json([
            'success' => true,
            'message' => 'OTP berhasil dikirim',
            'data' => $result,
        ], 200);
    }

    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $isValid = $this->otpService->verifyOtp(
            $request->input('identifier'),
            $request->input('code'),
            $request->input('type')
        );

        if (!$isValid) {
            return response()->json([
                'success' => false,
                'message' => 'OTP tidak valid atau sudah kedaluwarsa.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP berhasil diverifikasi',
        ], 200);
    }
}
