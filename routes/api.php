<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\BloodStock\BloodStockController;
use App\Http\Controllers\Api\V1\Institution\InstitutionController;
use App\Http\Controllers\Api\V1\Schedule\DonationScheduleController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function () {
    // Public Auth Routes
    Route::post('/auth/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/auth/register/institution', [InstitutionController::class, 'register'])->name('auth.register.institution');
    Route::post('/auth/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/auth/otp/send', [AuthController::class, 'sendOtp'])->name('auth.otp.send');
    Route::post('/auth/otp/verify', [AuthController::class, 'verifyOtp'])->name('auth.otp.verify');

    // Public Institution & Schedule Routes
    Route::get('/institutions', [InstitutionController::class, 'index'])->name('institutions.index');
    Route::get('/institutions/{id}', [InstitutionController::class, 'show'])->name('institutions.show');
    Route::get('/institutions/{institutionId}/schedule-slots', [DonationScheduleController::class, 'index'])->name('schedule-slots.index');

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

        // Blood Stock Management (PMI & RS staff/admins)
        Route::middleware('role:pmi_staff,pmi_admin,rs_staff,rs_admin,super_admin')->group(function () {
            Route::get('/institutions/{institutionId}/blood-stocks', [BloodStockController::class, 'index'])->name('blood-stocks.index');
            Route::get('/institutions/{institutionId}/blood-stocks/summary', [BloodStockController::class, 'summary'])->name('blood-stocks.summary');
            Route::get('/institutions/{institutionId}/blood-stocks/alerts', [BloodStockController::class, 'alerts'])->name('blood-stocks.alerts');
            Route::post('/blood-stocks', [BloodStockController::class, 'store'])->name('blood-stocks.store');
            Route::post('/blood-stocks/{id}/discard', [BloodStockController::class, 'discard'])->name('blood-stocks.discard');
        });

        // Blood Distribution (Only PMI staff/admin can distribute blood bags to hospitals)
        Route::middleware('role:pmi_staff,pmi_admin,super_admin')->group(function () {
            Route::post('/blood-stocks/{id}/distribute', [BloodStockController::class, 'distribute'])->name('blood-stocks.distribute');
        });

        // Booking & Scheduling for Donors
        Route::post('/bookings', [DonationScheduleController::class, 'storeBooking'])->name('bookings.store');
        Route::get('/bookings/my', [DonationScheduleController::class, 'myBookings'])->name('bookings.my');
        Route::post('/bookings/{id}/cancel', [DonationScheduleController::class, 'cancelBooking'])->name('bookings.cancel');
        Route::post('/bookings/{id}/check-in', [DonationScheduleController::class, 'checkIn'])->name('bookings.check-in');

        // Manage slots (Only PMI staff/admin can create donation slots)
        Route::middleware('role:pmi_staff,pmi_admin,super_admin')->group(function () {
            Route::post('/schedule-slots', [DonationScheduleController::class, 'storeSlot'])->name('schedule-slots.store');
        });
    });
});
