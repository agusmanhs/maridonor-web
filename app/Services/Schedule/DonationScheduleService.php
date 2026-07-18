<?php

namespace App\Services\Schedule;

use App\Enums\BookingStatus;
use App\Enums\EligibilityStatus;
use App\Models\Booking;
use App\Models\ScheduleSlot;
use App\Repositories\Contracts\BookingRepositoryInterface;
use App\Repositories\Contracts\ScheduleSlotRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class DonationScheduleService
{
    public function __construct(
        private readonly ScheduleSlotRepositoryInterface $slotRepo,
        private readonly BookingRepositoryInterface $bookingRepo,
        private readonly UserRepositoryInterface $userRepo
    ) {}

    public function listSlots(string $institutionId, array $filters): Collection
    {
        return $this->slotRepo->getSlots($institutionId, $filters);
    }

    public function createSlot(array $data, string $creatorId): ScheduleSlot
    {
        return $this->slotRepo->create(array_merge($data, [
            'booked_count' => 0,
            'is_cancelled' => false,
            'created_by' => $creatorId,
        ]));
    }

    public function createBooking(array $data, string $userId): Booking
    {
        return DB::transaction(function () use ($data, $userId) {
            $user = $this->userRepo->findById($userId);
            $donorProfile = $user?->donorProfile;

            if (!$donorProfile) {
                throw ValidationException::withMessages([
                    'booking' => ['Profil donor Anda belum terdaftar lengkap.'],
                ]);
            }

            // 1. Ambil Slot
            $slot = $this->slotRepo->findById($data['slot_id']);
            if (!$slot || $slot->is_cancelled) {
                throw ValidationException::withMessages([
                    'slot_id' => ['Slot jadwal donor tidak tersedia.'],
                ]);
            }

            // 2. Cek Kapasitas Slot
            if ($slot->booked_count >= $slot->capacity) {
                throw ValidationException::withMessages([
                    'slot_id' => ['Kapasitas slot jadwal donor ini sudah penuh.'],
                ]);
            }

            // 3. Cek Next Eligible Date (Medis)
            $slotDate = Carbon::parse($slot->slot_date);
            if ($donorProfile->eligibility_status !== EligibilityStatus::Eligible) {
                throw ValidationException::withMessages([
                    'booking' => ['Status kelayakan donor Anda saat ini ditangguhkan: ' . ($donorProfile->deferral_reason ?? 'deferred')],
                ]);
            }

            if ($donorProfile->next_eligible_date && $donorProfile->next_eligible_date->isAfter($slotDate)) {
                throw ValidationException::withMessages([
                    'booking' => ['Anda baru diperbolehkan mendonorkan darah kembali pada tanggal ' . $donorProfile->next_eligible_date->format('d-m-Y')],
                ]);
            }

            // 4. Cek Double Booking pada tanggal yang sama
            if ($this->bookingRepo->hasActiveBookingOnDate($donorProfile->id, $slot->slot_date->format('Y-m-d'))) {
                throw ValidationException::withMessages([
                    'booking' => ['Anda sudah memiliki jadwal booking aktif pada tanggal ' . $slot->slot_date->format('d-m-Y')],
                ]);
            }

            // 5. Generate QR Code & Queue Number
            $qrCode = 'DONOR-BK-' . strtoupper(Str::random(12));
            $queueNumber = $slot->booked_count + 1;

            // 6. Buat Booking
            $booking = $this->bookingRepo->create([
                'donor_id' => $donorProfile->id,
                'slot_id' => $slot->id,
                'qr_code' => $qrCode,
                'queue_number' => $queueNumber,
                'status' => BookingStatus::Booked,
            ]);

            // 7. Increment Booked Count
            $this->slotRepo->incrementBookedCount($slot->id);

            return $booking;
        });
    }

    public function checkIn(string $bookingId, string $updaterId): bool
    {
        $booking = $this->bookingRepo->findById($bookingId);

        if (!$booking || $booking->status !== BookingStatus::Booked) {
            throw ValidationException::withMessages([
                'booking_id' => ['Booking tidak valid atau sudah melakukan check-in.'],
            ]);
        }

        return $this->bookingRepo->update($bookingId, [
            'status' => BookingStatus::CheckedIn,
            'checked_in_at' => now(),
        ]);
    }

    public function cancelBooking(string $bookingId, string $reason, string $userId): bool
    {
        $booking = $this->bookingRepo->findById($bookingId);

        if (!$booking || $booking->status !== BookingStatus::Booked) {
            throw ValidationException::withMessages([
                'booking_id' => ['Booking tidak dapat dibatalkan.'],
            ]);
        }

        return DB::transaction(function () use ($booking, $reason, $userId) {
            // Update status booking ke cancel
            $this->bookingRepo->update($booking->id, [
                'status' => BookingStatus::Cancelled,
                'cancelled_at' => now(),
                'cancellation_reason' => $reason,
                'cancelled_by' => $userId,
            ]);

            // Decrement capacity
            $this->slotRepo->decrementBookedCount($booking->slot_id);

            return true;
        });
    }

    public function getDonorList(string $donorId, array $filters): Collection
    {
        return $this->bookingRepo->getDonorBookings($donorId, $filters);
    }

    public function getBookingDetail(string $id): ?Booking
    {
        return $this->bookingRepo->findById($id);
    }
}
