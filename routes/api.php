<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function () {
    // Public Auth Routes
    Route::post('/auth/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/auth/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/auth/otp/send', [AuthController::class, 'sendOtp'])->name('auth.otp.send');
    Route::post('/auth/otp/verify', [AuthController::class, 'verifyOtp'])->name('auth.otp.verify');

    // Protected Auth Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
        
        Route::get('/me', function (\Illuminate\Http\Request $request) {
            return response()->json([
                'success' => true,
                'data' => new \App\Http\Resources\Auth\UserResource($request->user()->load('donorProfile')),
            ]);
        })->name('me');
    });
});
