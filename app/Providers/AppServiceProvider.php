<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\Contracts\UserRepositoryInterface::class,
            \App\Repositories\Eloquent\UserRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\OtpCodeRepositoryInterface::class,
            \App\Repositories\Eloquent\OtpCodeRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\InstitutionRepositoryInterface::class,
            \App\Repositories\Eloquent\InstitutionRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\BloodStockRepositoryInterface::class,
            \App\Repositories\Eloquent\BloodStockRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
