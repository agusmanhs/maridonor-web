<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_as_donor_successfully(): void
    {
        $response = $this->postJson(route('api.v1.auth.register'), [
            'name' => 'Agus Budi',
            'email' => 'agus@example.com',
            'phone' => '081234567890',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
            'gender' => 'male',
            'birth_date' => '1995-03-15',
            'blood_type' => 'A',
            'rhesus' => 'positive',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'user' => ['id', 'name', 'email', 'phone', 'role', 'status', 'kyc_level'],
                    'otp' => ['expires_in', 'resend_after'],
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'agus@example.com',
            'phone' => '081234567890',
            'role' => UserRole::Donor->value,
        ]);

        $this->assertDatabaseHas('donor_profiles', [
            'gender' => 'male',
            'blood_type' => 'A',
            'rhesus' => 'positive',
        ]);
    }

    public function test_user_cannot_register_with_invalid_age(): void
    {
        $response = $this->postJson(route('api.v1.auth.register'), [
            'name' => 'Agus Budi',
            'email' => 'agus@example.com',
            'phone' => '081234567890',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
            'gender' => 'male',
            'birth_date' => now()->subYears(15)->format('Y-m-d'), // Usia 15 tahun (di bawah 17 tahun)
            'blood_type' => 'A',
            'rhesus' => 'positive',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['birth_date']);
    }

    public function test_user_can_login_successfully(): void
    {
        $user = User::create([
            'name' => 'Agus Budi',
            'email' => 'agus@example.com',
            'phone' => '081234567890',
            'password' => Hash::make('SecurePassword123!'),
            'role' => UserRole::Donor,
        ]);

        $user->donorProfile()->create([
            'gender' => 'male',
            'birth_date' => '1995-03-15',
            'blood_type' => 'A',
            'rhesus' => 'positive',
            'referral_code' => 'AGU123',
        ]);

        $response = $this->postJson(route('api.v1.auth.login'), [
            'email' => 'agus@example.com',
            'password' => 'SecurePassword123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'access_token',
                    'token_type',
                    'user' => ['id', 'name', 'email'],
                ],
            ]);
    }

    public function test_user_can_logout_successfully(): void
    {
        $user = User::create([
            'name' => 'Agus Budi',
            'email' => 'agus@example.com',
            'phone' => '081234567890',
            'password' => Hash::make('SecurePassword123!'),
            'role' => UserRole::Donor,
        ]);

        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson(route('api.v1.auth.logout'));

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Logout berhasil');
    }
}
