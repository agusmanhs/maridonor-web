<?php

namespace Tests\Feature;

use App\Enums\EligibilityStatus;
use App\Enums\UserRole;
use App\Models\Badge;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RewardApiTest extends TestCase
{
    use RefreshDatabase;

    private User $referrer;
    private User $referee;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Setup User Pengundang (Referrer)
        $this->referrer = User::create([
            'name' => 'Budi Referrer',
            'email' => 'referrer@example.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'role' => UserRole::Donor,
        ]);
        
        $this->referrer->donorProfile()->create([
            'gender' => 'male',
            'birth_date' => '1995-03-15',
            'blood_type' => 'A',
            'rhesus' => 'positive',
            'referral_code' => 'BUD123',
            'eligibility_status' => EligibilityStatus::Eligible,
            'points' => 100,
        ]);

        // 2. Setup User Pendaftar Baru (Referee)
        $this->referee = User::create([
            'name' => 'Andi Referee',
            'email' => 'referee@example.com',
            'phone' => '081234567892',
            'password' => Hash::make('password'),
            'role' => UserRole::Donor,
        ]);

        $this->referee->donorProfile()->create([
            'gender' => 'male',
            'birth_date' => '1996-04-16',
            'blood_type' => 'O',
            'rhesus' => 'positive',
            'referral_code' => 'AND456',
            'eligibility_status' => EligibilityStatus::Eligible,
            'points' => 50,
        ]);
    }

    public function test_user_can_claim_referral_code_successfully(): void
    {
        $token = $this->referee->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson(route('api.v1.rewards.referrals.claim'), [
                'referral_code' => 'BUD123', // Kode milik Budi
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        // Verifikasi pertambahan poin (masing-masing +100 poin)
        $this->assertDatabaseHas('donor_profiles', [
            'user_id' => $this->referrer->id,
            'points' => 200, // 100 + 100
        ]);

        $this->assertDatabaseHas('donor_profiles', [
            'user_id' => $this->referee->id,
            'points' => 150, // 50 + 100
        ]);
    }

    public function test_user_cannot_claim_own_referral_code(): void
    {
        $token = $this->referee->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson(route('api.v1.rewards.referrals.claim'), [
                'referral_code' => 'AND456', // Kode milik Andi sendiri
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_user_can_view_leaderboard(): void
    {
        $response = $this->getJson(route('api.v1.rewards.leaderboard'));

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['user_id', 'name', 'blood_type', 'rhesus', 'points']
                ]
            ]);
    }
}
