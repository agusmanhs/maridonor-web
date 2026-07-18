<?php

namespace App\Services\Notification;

use App\Models\Announcement;
use App\Models\Notification;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use Illuminate\Support\Collection;

class NotificationService
{
    public function __construct(
        private readonly NotificationRepositoryInterface $notifRepo
    ) {}

    public function getUserNotifications(string $userId, array $filters): Collection
    {
        return $this->notifRepo->getUserNotifications($userId, $filters);
    }

    public function markAsRead(string $notificationId, string $userId): bool
    {
        return $this->notifRepo->markAsRead($notificationId, $userId);
    }

    public function markAllAsRead(string $userId): bool
    {
        return $this->notifRepo->markAllAsRead($userId);
    }

    public function sendSystemNotification(string $userId, string $type, string $title, string $body, ?array $data = null): Notification
    {
        return $this->notifRepo->sendNotification([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'data' => $data,
            'channel' => 'in_app',
            'is_read' => false,
        ]);
    }

    public function listAnnouncements(array $filters): Collection
    {
        return $this->notifRepo->getAnnouncements($filters);
    }

    public function createAnnouncement(array $data, string $authorId): Announcement
    {
        return $this->notifRepo->createAnnouncement(array_merge($data, [
            'author_id' => $authorId,
            'published_at' => $data['published_at'] ?? now(),
        ]));
    }
}
