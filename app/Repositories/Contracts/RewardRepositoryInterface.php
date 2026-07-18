<?php

namespace App\Repositories\Contracts;

use App\Models\Badge;
use Illuminate\Support\Collection;

interface RewardRepositoryInterface
{
    public function getUserBadges(string $userId): Collection;

    public function getAvailableBadges(): Collection;

    public function awardBadgeToUser(string $userId, string $badgeId): bool;

    public function getReferrals(string $userId): Collection;

    public function addReferral(array $data): bool;

    public function getLeaderboard(int $limit): Collection;
}
