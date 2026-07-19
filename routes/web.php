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

    // Rute Manajemen Stok Darah
    Route::get('/blood-stocks', [\App\Http\Controllers\Web\BloodStock\WebBloodStockController::class, 'index'])->name('blood-stocks.index');
    Route::middleware('role:pmi_staff,pmi_admin,super_admin')->group(function () {
        Route::post('/blood-stocks', [\App\Http\Controllers\Web\BloodStock\WebBloodStockController::class, 'store'])->name('blood-stocks.store');
        Route::post('/blood-stocks/{id}/distribute', [\App\Http\Controllers\Web\BloodStock\WebBloodStockController::class, 'distribute'])->name('blood-stocks.distribute');
    });
});
