<?php

namespace Tests\Feature\Web;

use App\Models\Address;
use App\Models\DonorProfile;
use App\Models\Institution;
use App\Models\InstitutionStaff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WebDonorDashboardTest extends TestCase
{
    use RefreshDatabase;

    private User $pmiStaff;
    private User $donor;
    private Institution $pmi;

    protected function setUp(): void
    {
        parent::setUp();

        $address = Address::create([
            'street_address' => 'Jl. Aceh No. 79',
            'city' => 'Bandung',
            'district' => 'Sumur Bandung',
            'sub_district' => 'Merdeka',
            'province' => 'Jawa Barat',
            'postal_code' => '40114',
        ]);

        $this->pmi = Institution::create([
            'name' => 'PMI Bandung',
            'type' => \App\Enums\InstitutionType::Pmi,
            'code' => 'PMI-001',
            'license_number' => 'LIC-1',
            'address_id' => $address->id,
            'phone' => '0221',
            'email' => 'pmi@test.com',
            'latitude' => -6.9,
            'longitude' => 107.6,
            'status' => \App\Enums\InstitutionStatus::Approved,
        ]);

        $this->pmiStaff = User::create([
            'name' => 'PMI Staff',
            'email' => 'pmi.staff@test.com',
            'phone' => '081',
            'password' => bcrypt('password'),
            'role' => \App\Enums\UserRole::PmiStaff,
            'status' => \App\Enums\UserStatus::Active,
        ]);

        InstitutionStaff::create([
            'institution_id' => $this->pmi->id,
            'user_id' => $this->pmiStaff->id,
            'role' => 'pmi_staff',
            'is_active' => true,
        ]);

        $this->donor = User::create([
            'name' => 'Donor User',
            'email' => 'donor@test.com',
            'phone' => '083',
            'password' => bcrypt('password'),
            'role' => \App\Enums\UserRole::Donor,
            'status' => \App\Enums\UserStatus::Active,
        ]);

        DonorProfile::create([
            'user_id' => $this->donor->id,
            'nik_encrypted' => '3273',
            'gender' => 'male',
            'birth_date' => '1990-01-01',
            'blood_type' => 'O',
            'rhesus' => 'positive',
            'referral_code' => 'REF1',
        ]);
    }

    public function test_donor_can_access_donor_dashboard(): void
    {
        $response = $this->actingAs($this->donor)
            ->get(route('dashboard.donor'));

        $response->assertStatus(200);
    }

    public function test_pmi_staff_cannot_access_donor_dashboard(): void
    {
        $response = $this->actingAs($this->pmiStaff)
            ->get(route('dashboard.donor'));

        $response->assertStatus(403);
    }

    public function test_donor_redirected_to_donor_dashboard_after_login(): void
    {
        $response = $this->post(route('login'), [
            'email' => 'donor@test.com',
            'password' => 'password',
        ]);

        $response->assertRedirect('/dashboard/donor');
    }
}
