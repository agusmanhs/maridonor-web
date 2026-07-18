<?php

namespace App\Services\Reward;

use App\Models\Badge;
use App\Models\DonorProfile;
use App\Models\Referral;
use App\Repositories\Contracts\RewardRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RewardService
{
    public function __construct(
        private readonly RewardRepositoryInterface $rewardRepo,
        private readonly UserRepositoryInterface $userRepo
    ) {}

    public function listBadges(string $userId): array
    {
        $earnedBadges = $this->rewardRepo->getUserBadges($userId);
        $availableBadges = $this->rewardRepo->getAvailableBadges();

        $earnedBadgeIds = $earnedBadges->pluck('id')->toArray();

        // Pisahkan badge yang terkunci (locked)
        $lockedBadges = $availableBadges->filter(function ($badge) use ($earnedBadgeIds) {
            return !in_array($badge->id, $earnedBadgeIds);
        })->values();

        return [
            'earned' => $earnedBadges,
            'locked' => $lockedBadges,
        ];
    }

    public function getLeaderboard(int $limit = 10): Collection
    {
        return $this->rewardRepo->getLeaderboard($limit);
    }

    public function getReferrals(string $userId): Collection
    {
        return $this->rewardRepo->getReferrals($userId);
    }

    public function claimReferralCode(string $userId, string $referralCode): bool
    {
        // Cari pemilik referral code
        $referrerProfile = DonorProfile::where('referral_code', $referralCode)->first();
        if (!$referrerProfile || $referrerProfile->user_id === $userId) {
            return false;
        }

        $referee = $this->userRepo->findById($userId);
        if (!$referee || !$referee->donorProfile) {
            return false;
        }

        // Cek apakah user baru ini sudah pernah diklaim referral-nya
        $alreadyClaimed = Referral::where('referee_id', $userId)->exists();
        if ($alreadyClaimed) {
            return false;
        }

        return DB::transaction(function () use ($referrerProfile, $referee) {
            $pointsAwarded = 100; // Poin bonus referral

            // 1. Tambah ke tabel Referrals
            $this->rewardRepo->addReferral([
                'referrer_id' => $referrerProfile->id,
                'referred_user_id' => $referee->id,
                'status' => 'registered',
                'points_awarded' => $pointsAwarded,
            ]);

            // 2. Berikan poin bonus ke Referrer (Pemilik kode)
            $referrerProfile->increment('points', $pointsAwarded);

            // 3. Berikan poin bonus ke Referee (Pendatang baru)
            $referee->donorProfile->increment('points', $pointsAwarded);

            return true;
        });
    }

    public function checkAndAwardBadges(string $userId): Collection
    {
        $user = $this->userRepo->findById($userId);
        if (!$user || !$user->donorProfile) {
            return collect();
        }

        // Hitung total donasi sukses milik user
        $totalDonations = \App\Models\Donation::where('donor_id', $user->donorProfile->id)
            ->where('status', \App\Enums\DonationStatus::Completed ?? 'completed')
            ->count();

        $earnedBadges = $this->rewardRepo->getUserBadges($userId);
        $availableBadges = $this->rewardRepo->getAvailableBadges();
        $earnedBadgeIds = $earnedBadges->pluck('id')->toArray();

        $newlyEarnedBadges = collect();

        foreach ($availableBadges as $badge) {
            // Jika belum didapatkan, dan syarat donasi terpenuhi
            if (!in_array($badge->id, $earnedBadgeIds) && $totalDonations >= $badge->required_donations) {
                $this->rewardRepo->awardBadgeToUser($userId, $badge->id);
                $newlyEarnedBadges->push($badge);
            }
        }

        return $newlyEarnedBadges;
    }
}
