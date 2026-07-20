<?php

use App\Http\Controllers\Web\Auth\WebAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $articles = \App\Models\Article::where('status', 'published')
        ->latest()
        ->take(3)
        ->get();

    $announcements = \App\Models\Announcement::latest()
        ->take(3)
        ->get();

    return inertia('Welcome', [
        'title' => 'Maridonor Admin Portal',
        'articles' => $articles,
        'announcements' => $announcements,
        'auth' => [
            'user' => auth()->user() ? [
                'name' => auth()->user()->name,
                'email' => auth()->user()->email,
                'role' => auth()->user()->role->value,
            ] : null,
        ]
    ]);
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [WebAuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [WebAuthController::class, 'login']);
    Route::get('/register', [WebAuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [WebAuthController::class, 'register']);
});

Route::post('/logout', [WebAuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::middleware(['auth'])->group(function () {
    Route::middleware('role:pmi_staff,pmi_admin,super_admin')->get('/dashboard/pmi', [\App\Http\Controllers\Web\Dashboard\WebDashboardController::class, 'pmiDashboard'])->name('dashboard.pmi');
    Route::middleware('role:rs_staff,rs_admin,super_admin')->get('/dashboard/hospital', [\App\Http\Controllers\Web\Dashboard\WebDashboardController::class, 'hospitalDashboard'])->name('dashboard.hospital');
    Route::middleware('role:donor,super_admin')->get('/dashboard/donor', [\App\Http\Controllers\Web\Dashboard\WebDashboardController::class, 'donorDashboard'])->name('dashboard.donor');

    // Rute Manajemen Stok Darah
    Route::get('/blood-stocks', [\App\Http\Controllers\Web\BloodStock\WebBloodStockController::class, 'index'])->name('blood-stocks.index');
    Route::middleware('role:pmi_staff,pmi_admin,super_admin')->group(function () {
        Route::post('/blood-stocks', [\App\Http\Controllers\Web\BloodStock\WebBloodStockController::class, 'store'])->name('blood-stocks.store');
        Route::post('/blood-stocks/{id}/distribute', [\App\Http\Controllers\Web\BloodStock\WebBloodStockController::class, 'distribute'])->name('blood-stocks.distribute');
    });

    // Rute Permohonan Darah Darurat
    Route::get('/blood-requests', [\App\Http\Controllers\Web\BloodRequest\WebBloodRequestController::class, 'index'])->name('blood-requests.index');
    Route::get('/blood-requests/{id}', [\App\Http\Controllers\Web\BloodRequest\WebBloodRequestController::class, 'show'])->name('blood-requests.show');
    Route::middleware('role:rs_staff,rs_admin,super_admin')->post('/blood-requests', [\App\Http\Controllers\Web\BloodRequest\WebBloodRequestController::class, 'store'])->name('blood-requests.store');
    Route::middleware('role:pmi_staff,pmi_admin,super_admin')->post('/blood-requests/{id}/fulfill', [\App\Http\Controllers\Web\BloodRequest\WebBloodRequestController::class, 'fulfill'])->name('blood-requests.fulfill');

    // Rute Slot Jadwal & Transaksi Donor (PMI)
    Route::get('/schedules', [\App\Http\Controllers\Web\Schedule\WebScheduleController::class, 'index'])->name('schedules.index');
    Route::patch('/bookings/{id}/check-in', [\App\Http\Controllers\Web\Schedule\WebScheduleController::class, 'checkInBooking'])->name('bookings.web_check_in');
    Route::post('/bookings/{id}/screening', [\App\Http\Controllers\Web\Schedule\WebScheduleController::class, 'submitScreening'])->name('bookings.screening');

    Route::middleware('role:pmi_staff,pmi_admin,super_admin')->group(function () {
        Route::post('/schedules/slots', [\App\Http\Controllers\Web\Schedule\WebScheduleController::class, 'storeSlot'])->name('schedules.store_slot');
        Route::post('/schedules/donations', [\App\Http\Controllers\Web\Schedule\WebScheduleController::class, 'storeDonation'])->name('schedules.store_donation');
    });

    // Generic profile & password routes for all users
    Route::patch('/profile', [\App\Http\Controllers\Web\Profile\WebProfileController::class, 'updateProfile'])->name('profile.update');
    Route::patch('/profile/password', [\App\Http\Controllers\Web\Profile\WebProfileController::class, 'updatePassword'])->name('profile.password');

    // Booking Rutes bagi Pendonor
    Route::middleware('role:donor,super_admin')->group(function () {
        Route::post('/schedules/slots/{id}/book', [\App\Http\Controllers\Web\Schedule\WebScheduleController::class, 'bookSlot'])->name('schedules.book_slot');
        Route::delete('/bookings/{id}', [\App\Http\Controllers\Web\Schedule\WebScheduleController::class, 'cancelBooking'])->name('bookings.cancel');
    });

    // Rute Sertifikat Digital
    Route::get('/donations/{id}/certificate', [\App\Http\Controllers\Web\Certificate\WebCertificateController::class, 'show'])->name('donations.certificate');

    // Rute Master Data (Super Admin)
    Route::middleware('role:super_admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/users', [\App\Http\Controllers\Web\Admin\AdminUserController::class, 'index'])->name('users.index');
        Route::post('/users', [\App\Http\Controllers\Web\Admin\AdminUserController::class, 'store'])->name('users.store');
        Route::get('/institutions', [\App\Http\Controllers\Web\Admin\AdminInstitutionController::class, 'index'])->name('institutions.index');
        Route::post('/institutions', [\App\Http\Controllers\Web\Admin\AdminInstitutionController::class, 'store'])->name('institutions.store');
        Route::patch('/institutions/{id}/status', [\App\Http\Controllers\Web\Admin\AdminInstitutionController::class, 'updateStatus'])->name('institutions.update_status');

        // KYC Verification routes
        Route::get('/kyc', [\App\Http\Controllers\Web\Admin\AdminKycController::class, 'index'])->name('kyc.index');
        Route::patch('/kyc/{id}/status', [\App\Http\Controllers\Web\Admin\AdminKycController::class, 'updateStatus'])->name('kyc.update_status');

        // CMS routes for Articles & Announcements
        Route::resource('/articles', \App\Http\Controllers\Web\Admin\AdminArticleController::class)->except(['show']);
        Route::resource('/announcements', \App\Http\Controllers\Web\Admin\AdminAnnouncementController::class)->except(['show']);
    });
});
