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
        $this->app->bind(
            \App\Repositories\Contracts\ScheduleSlotRepositoryInterface::class,
            \App\Repositories\Eloquent\ScheduleSlotRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\BookingRepositoryInterface::class,
            \App\Repositories\Eloquent\BookingRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\BloodRequestRepositoryInterface::class,
            \App\Repositories\Eloquent\BloodRequestRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\RewardRepositoryInterface::class,
            \App\Repositories\Eloquent\RewardRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\ArticleRepositoryInterface::class,
            \App\Repositories\Eloquent\ArticleRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\NotificationRepositoryInterface::class,
            \App\Repositories\Eloquent\NotificationRepository::class
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
