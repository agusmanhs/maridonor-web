<?php

namespace App\Http\Controllers\Api\V1\Schedule;

use App\Http\Controllers\Controller;
use App\Http\Requests\Schedule\CancelBookingRequest;
use App\Http\Requests\Schedule\StoreBookingRequest;
use App\Http\Requests\Schedule\StoreScheduleSlotRequest;
use App\Http\Resources\Schedule\BookingResource;
use App\Http\Resources\Schedule\ScheduleSlotResource;
use App\Services\Schedule\DonationScheduleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DonationScheduleController extends Controller
{
    public function __construct(
        private readonly DonationScheduleService $scheduleService
    ) {}

    public function index(Request $request, string $institutionId): JsonResponse
    {
        $filters = $request->only(['start_date', 'end_date', 'type']);
        $slots = $this->scheduleService->listSlots($institutionId, $filters);

        return response()->json([
            'success' => true,
            'data' => ScheduleSlotResource::collection($slots),
        ], 200);
    }

    public function storeSlot(StoreScheduleSlotRequest $request): JsonResponse
    {
        $slot = $this->scheduleService->createSlot(
            $request->validated(),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Slot jadwal donor berhasil dibuat.',
            'data' => new ScheduleSlotResource($slot),
        ], 201);
    }

    public function storeBooking(StoreBookingRequest $request): JsonResponse
    {
        $booking = $this->scheduleService->createBooking(
            $request->validated(),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Booking jadwal donor berhasil dilakukan.',
            'data' => new BookingResource($booking->load('scheduleSlot.institution')),
        ], 201);
    }

    public function myBookings(Request $request): JsonResponse
    {
        $user = $request->user();
        $donorProfile = $user->donorProfile;

        if (!$donorProfile) {
            return response()->json([
                'success' => true,
                'data' => [],
            ], 200);
        }

        $filters = $request->only(['status']);
        $bookings = $this->scheduleService->getDonorList($donorProfile->id, $filters);

        return response()->json([
            'success' => true,
            'data' => BookingResource::collection($bookings),
        ], 200);
    }

    public function checkIn(Request $request, string $id): JsonResponse
    {
        // Pastikan hanya staff PMI / RS / Admin yang bisa memanggil check-in
        $user = $request->user();
        if (!in_array($user->role->value, ['pmi_staff', 'pmi_admin', 'rs_staff', 'rs_admin', 'super_admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki hak akses untuk melakukan check-in.',
            ], 403);
        }

        $this->scheduleService->checkIn($id, $user->id);

        return response()->json([
            'success' => true,
            'message' => 'Pendonor berhasil check-in.',
        ], 200);
    }

    public function cancelBooking(CancelBookingRequest $request, string $id): JsonResponse
    {
        $this->scheduleService->cancelBooking(
            $id,
            $request->input('reason'),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil dibatalkan.',
        ], 200);
    }
}
