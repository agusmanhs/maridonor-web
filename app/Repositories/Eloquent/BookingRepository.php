<?php

namespace App\Repositories\Eloquent;

use App\Models\Booking;
use App\Repositories\Contracts\BookingRepositoryInterface;
use Illuminate\Support\Collection;

class BookingRepository implements BookingRepositoryInterface
{
    public function findById(string $id): ?Booking
    {
        return Booking::with(['donorProfile.user', 'scheduleSlot.institution'])->find($id);
    }

    public function findByQrCode(string $qrCode): ?Booking
    {
        return Booking::with(['donorProfile.user', 'scheduleSlot.institution'])
            ->where('qr_code', $qrCode)
            ->first();
    }

    public function getDonorBookings(string $donorId, array $filters): Collection
    {
        $query = Booking::with('scheduleSlot.institution')
            ->where('donor_id', $donorId);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->get();
    }

    public function create(array $data): Booking
    {
        return Booking::create($data);
    }

    public function update(string $id, array $data): bool
    {
        $booking = $this->findById($id);
        if ($booking) {
            return $booking->update($data);
        }
        return false;
    }

    public function hasActiveBookingOnDate(string $donorId, string $date): bool
    {
        return Booking::where('donor_id', $donorId)
            ->whereIn('status', [
                \App\Enums\BookingStatus::Booked->value,
                \App\Enums\BookingStatus::CheckedIn->value
            ])
            ->whereHas('scheduleSlot', function ($q) use ($date) {
                $q->whereDate('slot_date', $date);
            })
            ->exists();
    }
}
