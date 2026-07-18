<?php

namespace App\Repositories\Eloquent;

use App\Models\Announcement;
use App\Models\Notification;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use Illuminate\Support\Collection;

class NotificationRepository implements NotificationRepositoryInterface
{
    public function getUserNotifications(string $userId, array $filters): Collection
    {
        $query = Notification::where('user_id', $userId);

        if (isset($filters['is_read'])) {
            $query->where('is_read', $filters['is_read']);
        }

        return $query->latest('created_at')->get();
    }

    public function markAsRead(string $notificationId, string $userId): bool
    {
        $notification = Notification::where('id', $notificationId)
            ->where('user_id', $userId)
            ->first();

        if ($notification && !$notification->is_read) {
            return $notification->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }

        return false;
    }

    public function markAllAsRead(string $userId): bool
    {
        Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return true;
    }

    public function sendNotification(array $data): Notification
    {
        return Notification::create(array_merge($data, [
            'sent_at' => now(),
        ]));
    }

    public function getAnnouncements(array $filters): Collection
    {
        $query = Announcement::with(['author', 'institution']);

        // Default publik hanya melihat pengumuman aktif/terbit
        $now = now();
        $query->where(function ($q) use ($now) {
            $q->whereNull('published_at')
              ->orWhere('published_at', '<=', $now);
        })->where(function ($q) use ($now) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>=', $now);
        });

        if (!empty($filters['target_audience'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('target_audience', 'all')
                  ->orWhere('target_audience', $filters['target_audience']);
            });
        }

        if (isset($filters['is_pinned'])) {
            $query->where('is_pinned', $filters['is_pinned']);
        }

        return $query->orderByDesc('is_pinned')
            ->orderByDesc('published_at')
            ->get();
    }

    public function createAnnouncement(array $data): Announcement
    {
        return Announcement::create($data);
    }
}
