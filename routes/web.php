<?php

use App\Http\Controllers\Web\Auth\WebAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Welcome', [
        'title' => 'Maridonor Admin Portal',
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
    Route::middleware('role:pmi_staff,pmi_admin,super_admin')->group(function () {
        Route::post('/schedules/slots', [\App\Http\Controllers\Web\Schedule\WebScheduleController::class, 'storeSlot'])->name('schedules.store_slot');
        Route::post('/schedules/donations', [\App\Http\Controllers\Web\Schedule\WebScheduleController::class, 'storeDonation'])->name('schedules.store_donation');
    });

    // Rute Sertifikat Digital
    Route::get('/donations/{id}/certificate', [\App\Http\Controllers\Web\Certificate\WebCertificateController::class, 'show'])->name('donations.certificate');
});
