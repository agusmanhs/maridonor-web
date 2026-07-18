<?php

namespace App\Http\Controllers\Api\V1\Notification;

use App\Http\Controllers\Controller;
use App\Http\Requests\Notification\StoreAnnouncementRequest;
use App\Http\Resources\Notification\AnnouncementResource;
use App\Http\Resources\Notification\NotificationResource;
use App\Services\Notification\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationService $notificationService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['is_read']);
        
        $notifications = $this->notificationService->getUserNotifications(
            $request->user()->id,
            $filters
        );

        return response()->json([
            'success' => true,
            'data' => NotificationResource::collection($notifications),
        ], 200);
    }

    public function markRead(Request $request, string $id): JsonResponse
    {
        $marked = $this->notificationService->markAsRead($id, $request->user()->id);

        if (!$marked) {
            return response()->json([
                'success' => false,
                'message' => 'Notifikasi tidak ditemukan atau sudah dibaca.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi berhasil ditandai sebagai dibaca.',
        ], 200);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $this->notificationService->markAllAsRead($request->user()->id);

        return response()->json([
            'success' => true,
            'message' => 'Semua notifikasi berhasil ditandai sebagai dibaca.',
        ], 200);
    }

    public function announcements(Request $request): JsonResponse
    {
        $filters = $request->only(['target_audience', 'is_pinned']);

        // Filter audiens default jika bukan admin
        $user = $request->user();
        if (!$user || !in_array($user->role->value, ['super_admin', 'pmi_admin'])) {
            $filters['target_audience'] = $user ? ($user->role->value === 'donor' ? 'donors' : 'institutions') : 'all';
        }

        $announcements = $this->notificationService->listAnnouncements($filters);

        return response()->json([
            'success' => true,
            'data' => AnnouncementResource::collection($announcements),
        ], 200);
    }

    public function storeAnnouncement(StoreAnnouncementRequest $request): JsonResponse
    {
        $announcement = $this->notificationService->createAnnouncement(
            $request->validated(),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil dipublikasikan.',
            'data' => new AnnouncementResource($announcement),
        ], 201);
    }
}
