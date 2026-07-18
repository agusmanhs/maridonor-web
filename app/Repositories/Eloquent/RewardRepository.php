<?php

namespace App\Repositories\Eloquent;

use App\Models\Badge;
use App\Models\DonorProfile;
use App\Models\Referral;
use App\Models\UserBadge;
use App\Repositories\Contracts\RewardRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RewardRepository implements RewardRepositoryInterface
{
    public function getUserBadges(string $userId): Collection
    {
        return UserBadge::with('badge')
            ->where('user_id', $userId)
            ->get()
            ->pluck('badge');
    }

    public function getAvailableBadges(): Collection
    {
        return Badge::orderBy('required_donations')->get();
    }

    public function awardBadgeToUser(string $userId, string $badgeId): bool
    {
        UserBadge::firstOrCreate([
            'user_id' => $userId,
            'badge_id' => $badgeId,
        ], [
            'earned_at' => now(),
        ]);
        return true;
    }

    public function getReferrals(string $userId): Collection
    {
        // Mendapatkan daftar user yang berhasil diajak (referredUser)
        return Referral::with('referredUser')
            ->whereHas('referrer', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->get();
    }

    public function addReferral(array $data): bool
    {
        Referral::create($data);
        return true;
    }

    public function getLeaderboard(int $limit): Collection
    {
        // Mengambil pendonor teratas berdasarkan poin di donor_profiles
        return DonorProfile::with('user')
            ->orderByDesc('points')
            ->limit($limit)
            ->get();
    }
}
