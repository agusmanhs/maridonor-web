<?php

namespace Tests\Feature\Web;

use App\Models\User;
use App\Models\DonorProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class WebProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_donor_can_update_profile()
    {
        $user = User::factory()->create([
            'role' => \App\Enums\UserRole::Donor,
            'name' => 'Old Name',
            'phone' => '081234567890',
        ]);

        $profile = DonorProfile::create([
            'user_id' => $user->id,
            'gender' => 'male',
            'birth_date' => '1990-01-01',
            'blood_type' => \App\Enums\BloodType::A,
            'rhesus' => \App\Enums\RhesusType::Positive,
            'points' => 0,
            'level' => 1,
            'referral_code' => 'OLDREF',
        ]);

        $response = $this->actingAs($user)->patch(route('profile.update'), [
            'name' => 'New Name',
            'phone' => '089876543210',
            'gender' => 'female',
            'birth_date' => '1995-05-05',
            'blood_type' => 'O',
            'rhesus' => 'negative',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'New Name',
            'phone' => '089876543210',
        ]);
        $this->assertDatabaseHas('donor_profiles', [
            'user_id' => $user->id,
            'gender' => 'female',
            'birth_date' => '1995-05-05 00:00:00',
            'blood_type' => 'O',
            'rhesus' => 'negative',
        ]);
    }

    public function test_non_donor_can_update_profile()
    {
        $user = User::factory()->create([
            'role' => \App\Enums\UserRole::PmiStaff,
            'name' => 'Staff Old',
            'phone' => '081111111111',
        ]);

        $response = $this->actingAs($user)->patch(route('profile.update'), [
            'name' => 'Staff New',
            'phone' => '082222222222',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Staff New',
            'phone' => '082222222222',
        ]);
    }

    public function test_user_can_update_password()
    {
        $user = User::factory()->create([
            'phone' => '081234567890',
            'role' => \App\Enums\UserRole::Donor,
            'password' => Hash::make('oldpassword123'),
        ]);

        $response = $this->actingAs($user)->patch(route('profile.password'), [
            'current_password' => 'oldpassword123',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertRedirect();
        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
    }
}
