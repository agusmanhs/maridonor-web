<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Institution;
use App\Models\InstitutionStaff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;

    private User $pmiStaff;
    private User $rsStaff;
    private User $donor;
    private Institution $pmi;
    private Institution $hospital;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Buat Institusi PMI
        $this->pmi = Institution::create([
            'name' => 'PMI Cabang Utama',
            'code' => 'PMI-001',
            'license_number' => 'LIC-PMI-001',
            'type' => \App\Enums\InstitutionType::Pmi,
            'email' => 'pmi.cabang@example.com',
            'phone' => '0219988776',
            'latitude' => -6.1751,
            'longitude' => 106.8272,
            'address_id' => \App\Models\Address::create([
                'province' => 'Banten',
                'city' => 'Tangerang',
                'district' => 'Cipondoh',
                'sub_district' => 'Kenanga',
                'postal_code' => '15147',
                'street_address' => 'Jl. KH Hasyim Ashari No. 12',
            ])->id,
            'is_active' => true,
        ]);

        // 2. Buat Institusi Rumah Sakit
        $this->hospital = Institution::create([
            'name' => 'RS Harapan Mulia',
            'code' => 'RS-001',
            'license_number' => 'LIC-RS-001',
            'type' => \App\Enums\InstitutionType::Hospital,
            'email' => 'rs.harapan@example.com',
            'phone' => '021556677',
            'latitude' => -6.1752,
            'longitude' => 106.8273,
            'address_id' => \App\Models\Address::create([
                'province' => 'Banten',
                'city' => 'Tangerang',
                'district' => 'Pinang',
                'sub_district' => 'Sudimara Pinang',
                'postal_code' => '15145',
                'street_address' => 'Jl. Pinang Raya No. 44',
            ])->id,
            'is_active' => true,
        ]);

        // 3. Setup User PMI Staff
        $this->pmiStaff = User::create([
            'name' => 'PMI Staff User',
            'email' => 'pmi_staff@example.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'role' => UserRole::PmiStaff,
        ]);

        InstitutionStaff::create([
            'institution_id' => $this->pmi->id,
            'user_id' => $this->pmiStaff->id,
            'role' => 'staff',
        ]);

        // 4. Setup User RS Staff
        $this->rsStaff = User::create([
            'name' => 'RS Staff User',
            'email' => 'rs_staff@example.com',
            'phone' => '081234567892',
            'password' => Hash::make('password'),
            'role' => UserRole::RsStaff,
        ]);

        InstitutionStaff::create([
            'institution_id' => $this->hospital->id,
            'user_id' => $this->rsStaff->id,
            'role' => 'staff',
        ]);

        // 5. Setup User Donor
        $this->donor = User::create([
            'name' => 'Donor User',
            'email' => 'donor@example.com',
            'phone' => '081234567893',
            'password' => Hash::make('password'),
            'role' => UserRole::Donor,
        ]);
    }

    public function test_pmi_staff_can_view_pmi_dashboard_metrics(): void
    {
        $token = $this->pmiStaff->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson(route('api.v1.dashboard.pmi'));

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_available_stock_bags',
                    'active_requests_count',
                    'total_registered_donors',
                    'donation_trends',
                ]
            ]);
    }

    public function test_rs_staff_can_view_hospital_dashboard_metrics(): void
    {
        $token = $this->rsStaff->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson(route('api.v1.dashboard.hospital'));

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'total_requests_sent',
                    'total_requests_fulfilled',
                    'active_requests_count',
                    'hospital_stock_bags',
                ]
            ]);
    }

    public function test_donor_cannot_view_dashboard_metrics(): void
    {
        $token = $this->donor->createToken('test')->plainTextToken;

        // Uji ke dashboard PMI
        $response1 = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson(route('api.v1.dashboard.pmi'));
        $response1->assertStatus(403);

        // Uji ke dashboard RS
        $response2 = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson(route('api.v1.dashboard.hospital'));
        $response2->assertStatus(403);
    }
}
