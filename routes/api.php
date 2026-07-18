<?php

use App\Http\Controllers\Api\V1\Article\ArticleController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\BloodRequest\BloodRequestController;
use App\Http\Controllers\Api\V1\BloodStock\BloodStockController;
use App\Http\Controllers\Api\V1\Institution\InstitutionController;
use App\Http\Controllers\Api\V1\Notification\NotificationController;
use App\Http\Controllers\Api\V1\Reward\RewardController;
use App\Http\Controllers\Api\V1\Schedule\DonationScheduleController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function () {
    // Public Auth Routes
    Route::post('/auth/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/auth/register/institution', [InstitutionController::class, 'register'])->name('auth.register.institution');
    Route::post('/auth/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/auth/otp/send', [AuthController::class, 'sendOtp'])->name('auth.otp.send');
    Route::post('/auth/otp/verify', [AuthController::class, 'verifyOtp'])->name('auth.otp.verify');

    // Public Institution, Schedule, Rewards, Article & Announcement Routes
    Route::get('/institutions', [InstitutionController::class, 'index'])->name('institutions.index');
    Route::get('/institutions/{id}', [InstitutionController::class, 'show'])->name('institutions.show');
    Route::get('/institutions/{institutionId}/schedule-slots', [DonationScheduleController::class, 'index'])->name('schedule-slots.index');
    Route::get('/rewards/leaderboard', [RewardController::class, 'leaderboard'])->name('rewards.leaderboard');
    Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');
    Route::get('/faqs', [ArticleController::class, 'indexFaqs'])->name('faqs.index');
    Route::get('/announcements', [NotificationController::class, 'announcements'])->name('announcements.index');

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

        // Blood Requests Module (RS staff can request, PMI staff can approve and fulfill)
        Route::get('/blood-requests', [BloodRequestController::class, 'index'])->name('blood-requests.index');
        Route::get('/blood-requests/{id}', [BloodRequestController::class, 'show'])->name('blood-requests.show');
        Route::post('/blood-requests', [BloodRequestController::class, 'store'])->name('blood-requests.store');
        
        Route::middleware('role:pmi_staff,pmi_admin,super_admin')->group(function () {
            Route::post('/blood-requests/{id}/process', [BloodRequestController::class, 'process'])->name('blood-requests.process');
            Route::post('/blood-requests/{id}/fulfill', [BloodRequestController::class, 'fulfill'])->name('blood-requests.fulfill');
        });

        // Rewards Module (User/Donor points, badges and referrals)
        Route::get('/rewards/badges', [RewardController::class, 'badges'])->name('rewards.badges');
        Route::get('/rewards/referrals', [RewardController::class, 'referrals'])->name('rewards.referrals');
        Route::post('/rewards/referrals/claim', [RewardController::class, 'claimReferral'])->name('rewards.referrals.claim');

        // Manage Articles (Corporate admins and Super admin)
        Route::middleware('role:super_admin,pmi_admin,rs_admin')->group(function () {
            Route::post('/articles', [ArticleController::class, 'store'])->name('articles.store');
        });

        // Manage FAQs (Only Super Admin)
        Route::middleware('role:super_admin')->group(function () {
            Route::post('/faqs', [ArticleController::class, 'storeFaq'])->name('faqs.store');
        });

        // Notifications Management
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead'])->name('notifications.read');

        // Manage Announcements (Only Super Admin and PMI Admin/Staff)
        Route::middleware('role:super_admin,pmi_admin,pmi_staff')->group(function () {
            Route::post('/announcements', [NotificationController::class, 'storeAnnouncement'])->name('announcements.store');
        });
    });
});
