<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Institution\InstitutionController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function () {
    // Public Auth Routes
    Route::post('/auth/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/auth/register/institution', [InstitutionController::class, 'register'])->name('auth.register.institution');
    Route::post('/auth/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/auth/otp/send', [AuthController::class, 'sendOtp'])->name('auth.otp.send');
    Route::post('/auth/otp/verify', [AuthController::class, 'verifyOtp'])->name('auth.otp.verify');

    // Public Institution Routes
    Route::get('/institutions', [InstitutionController::class, 'index'])->name('institutions.index');
    Route::get('/institutions/{id}', [InstitutionController::class, 'show'])->name('institutions.show');

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
        
        Route::get('/me', function (\Illuminate\Http\Request $request) {
            return response()->json([
                'success' => true,
                'data' => new \App\Http\Resources\Auth\UserResource($request->user()->load('donorProfile')),
            ]);
        })->name('me');

        // Institution Staff Management (Only for corporate admins & super admin)
        Route::middleware('role:pmi_admin,rs_admin,super_admin')->group(function () {
            Route::get('/institutions/{id}/staff', [InstitutionController::class, 'getStaff'])->name('institutions.staff.index');
            Route::post('/institutions/{id}/staff', [InstitutionController::class, 'addStaff'])->name('institutions.staff.store');
            Route::delete('/institutions/{id}/staff/{userId}', [InstitutionController::class, 'removeStaff'])->name('institutions.staff.destroy');
        });
    });
});
