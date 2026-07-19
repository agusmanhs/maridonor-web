<?php

namespace Tests\Feature\Web;

use App\Models\Address;
use App\Models\Donation;
use App\Models\DonorProfile;
use App\Models\Institution;
use App\Models\InstitutionStaff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WebCertificateTest extends TestCase
{
    use RefreshDatabase;

    private User $pmiStaff;
    private User $donor;
    private Institution $pmi;
    private Donation $donation;

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

        $donorProfile = DonorProfile::create([
            'user_id' => $this->donor->id,
            'nik_encrypted' => '3273',
            'gender' => 'male',
            'birth_date' => '1990-01-01',
            'blood_type' => 'O',
            'rhesus' => 'positive',
            'referral_code' => 'REF1',
        ]);

        $this->donation = Donation::create([
            'donor_id' => $donorProfile->id,
            'institution_id' => $this->pmi->id,
            'blood_type' => 'O',
            'rhesus' => 'positive',
            'component_type' => 'whole_blood',
            'volume_ml' => 350,
            'donated_at' => now(),
            'status' => 'completed',
        ]);
    }

    public function test_authenticated_user_can_access_completed_donation_certificate(): void
    {
        $response = $this->actingAs($this->pmiStaff)
            ->get(route('donations.certificate', $this->donation->id));

        $response->assertStatus(200);
    }

    public function test_cannot_access_uncompleted_donation_certificate(): void
    {
        $uncompletedDonation = Donation::create([
            'donor_id' => $this->donation->donor_id,
            'institution_id' => $this->pmi->id,
            'blood_type' => 'O',
            'rhesus' => 'positive',
            'component_type' => 'whole_blood',
            'volume_ml' => 350,
            'donated_at' => now(),
            'status' => 'deferred', // gagal donasi / tertunda
        ]);

        $response = $this->actingAs($this->pmiStaff)
            ->get(route('donations.certificate', $uncompletedDonation->id));

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_any_certificate(): void
    {
        $response = $this->get(route('donations.certificate', $this->donation->id));

        $response->assertRedirect(route('login'));
    }
}
