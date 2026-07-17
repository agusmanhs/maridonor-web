<?php

namespace Tests\Feature;

use App\Enums\InstitutionStatus;
use App\Enums\InstitutionType;
use App\Enums\UserRole;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class InstitutionApiTest extends TestCase
{
    use RefreshDatabase;

    private Institution $pmi;
    private User $donor;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup master data awal untuk testing
        $this->pmi = Institution::create([
            'name' => 'PMI Bandung',
            'type' => InstitutionType::Pmi,
            'code' => 'PMI-001',
            'license_number' => '123',
            'address_id' => \App\Models\Address::create([
                'province' => 'A', 'city' => 'B', 'district' => 'C', 'sub_district' => 'D', 'postal_code' => '123', 'street_address' => 'E'
            ])->id,
            'phone' => '123',
            'email' => 'pmi@example.com',
            'latitude' => 0,
            'longitude' => 0,
        ]);

        $this->donor = User::create([
            'name' => 'Donor User',
            'email' => 'donor@example.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'role' => UserRole::Donor,
        ]);

        $this->admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'phone' => '081234567892',
            'password' => Hash::make('password'),
            'role' => UserRole::PmiAdmin,
        ]);
    }

    public function test_institution_registration_successfully(): void
    {
        $response = $this->postJson(route('api.v1.auth.register.institution'), [
            'institution_name' => 'PMI Bandung Kota',
            'institution_type' => 'pmi',
            'license_number' => 'SIP/PMI/2026/001',
            'npwp' => '01.234.567.8-901.000',
            'phone' => '0224201234',
            'email' => 'pmi.bandung@example.com',
            'province' => 'Jawa Barat',
            'city' => 'Bandung',
            'district' => 'Sumur Bandung',
            'sub_district' => 'Kebon Pisang',
            'postal_code' => '40112',
            'street_address' => 'Jl. Aceh No. 79',
            'latitude' => -6.914744,
            'longitude' => 107.609810,
            'admin_name' => 'Admin PMI Bandung',
            'admin_email' => 'admin.bandung@example.com',
            'admin_password' => 'SecurePassword123!',
            'admin_password_confirmation' => 'SecurePassword123!',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'PMI Bandung Kota')
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('institutions', [
            'email' => 'pmi.bandung@example.com',
            'status' => InstitutionStatus::Pending->value,
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'admin.bandung@example.com',
            'role' => UserRole::PmiAdmin->value,
        ]);
    }

    public function test_non_admin_cannot_access_staff_list(): void
    {
        $tokenDonor = $this->donor->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $tokenDonor])
            ->getJson(route('api.v1.institutions.staff.index', $this->pmi->id));

        $response->assertStatus(403);
    }

    public function test_admin_can_access_staff_list(): void
    {
        $tokenAdmin = $this->admin->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $tokenAdmin])
            ->getJson(route('api.v1.institutions.staff.index', $this->pmi->id));

        $response->assertStatus(200);
    }
}
