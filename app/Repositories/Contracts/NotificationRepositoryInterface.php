<?php

namespace App\Repositories\Contracts;

use App\Models\Announcement;
use App\Models\Notification;
use Illuminate\Support\Collection;

interface NotificationRepositoryInterface
{
    public function getUserNotifications(string $userId, array $filters): Collection;

    public function markAsRead(string $notificationId, string $userId): bool;

    public function markAllAsRead(string $userId): bool;

    public function sendNotification(array $data): Notification;

    public function getAnnouncements(array $filters): Collection;

    public function createAnnouncement(array $data): Announcement;
}
