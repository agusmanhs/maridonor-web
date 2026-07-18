<?php

namespace App\Http\Controllers\Api\V1\Reward;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reward\ClaimReferralRequest;
use App\Http\Resources\Reward\BadgeResource;
use App\Http\Resources\Reward\LeaderboardResource;
use App\Http\Resources\Reward\ReferralResource;
use App\Services\Reward\RewardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RewardController extends Controller
{
    public function __construct(
        private readonly RewardService $rewardService
    ) {}

    public function badges(Request $request): JsonResponse
    {
        $badges = $this->rewardService->listBadges($request->user()->id);

        return response()->json([
            'success' => true,
            'data' => [
                'earned' => BadgeResource::collection($badges['earned']),
                'locked' => BadgeResource::collection($badges['locked']),
            ],
        ], 200);
    }

    public function leaderboard(Request $request): JsonResponse
    {
        $limit = $request->query('limit', 10);
        $leaderboard = $this->rewardService->getLeaderboard($limit);

        return response()->json([
            'success' => true,
            'data' => LeaderboardResource::collection($leaderboard),
        ], 200);
    }

    public function referrals(Request $request): JsonResponse
    {
        $referrals = $this->rewardService->getReferrals($request->user()->id);

        return response()->json([
            'success' => true,
            'data' => ReferralResource::collection($referrals->load('referredUser')),
        ], 200);
    }

    public function claimReferral(ClaimReferralRequest $request): JsonResponse
    {
        $claimed = $this->rewardService->claimReferralCode(
            $request->user()->id,
            $request->input('referral_code')
        );

        if (!$claimed) {
            return response()->json([
                'success' => false,
                'message' => 'Kode referral tidak valid, milik Anda sendiri, atau sudah pernah diklaim sebelumnya.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Kode referral berhasil diklaim. Poin bonus 100 telah ditambahkan ke akun Anda.',
        ], 200);
    }
}
