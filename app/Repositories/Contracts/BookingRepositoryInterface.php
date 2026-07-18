<?php

namespace App\Repositories\Contracts;

use App\Models\Booking;
use Illuminate\Support\Collection;

interface BookingRepositoryInterface
{
    public function findById(string $id): ?Booking;

    public function findByQrCode(string $qrCode): ?Booking;

    public function getDonorBookings(string $donorId, array $filters): Collection;

    public function create(array $data): Booking;

    public function update(string $id, array $data): bool;

    public function hasActiveBookingOnDate(string $donorId, string $date): bool;
}
