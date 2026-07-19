<?php

namespace Tests\Feature\Web;

use App\Models\Address;
use App\Models\DonorProfile;
use App\Models\Institution;
use App\Models\InstitutionStaff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WebScheduleTest extends TestCase
{
    use RefreshDatabase;

    private User $pmiStaff;
    private User $rsStaff;
    private User $donor;
    private Institution $pmi;
    private Institution $rs;

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

        $this->rs = Institution::create([
            'name' => 'RS Immanuel',
            'type' => \App\Enums\InstitutionType::Hospital,
            'code' => 'RS-001',
            'license_number' => 'LIC-2',
            'address_id' => $address->id,
            'phone' => '0222',
            'email' => 'rs@test.com',
            'latitude' => -6.91,
            'longitude' => 107.61,
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

        $this->rsStaff = User::create([
            'name' => 'RS Staff',
            'email' => 'rs.staff@test.com',
            'phone' => '082',
            'password' => bcrypt('password'),
            'role' => \App\Enums\UserRole::RsStaff,
            'status' => \App\Enums\UserStatus::Active,
        ]);

        InstitutionStaff::create([
            'institution_id' => $this->rs->id,
            'user_id' => $this->rsStaff->id,
            'role' => 'rs_staff',
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

    public function test_pmi_staff_can_view_schedules_page(): void
    {
        $response = $this->actingAs($this->pmiStaff)
            ->get(route('schedules.index'));

        $response->assertStatus(200);
    }

    public function test_pmi_staff_can_create_schedule_slot(): void
    {
        $response = $this->actingAs($this->pmiStaff)
            ->post(route('schedules.store_slot'), [
                'date' => now()->addDays(2)->format('Y-m-d'),
                'start_time' => '09:00',
                'end_time' => '12:00',
                'max_capacity' => 100,
            ]);

        $response->assertRedirect(route('schedules.index'));
        $this->assertDatabaseHas('schedule_slots', [
            'institution_id' => $this->pmi->id,
            'slot_date' => now()->addDays(2)->format('Y-m-d 00:00:00'),
            'start_time' => '09:00',
            'capacity' => 100,
            'created_by' => $this->pmiStaff->id,
        ]);
    }

    public function test_rs_staff_cannot_create_schedule_slot(): void
    {
        $response = $this->actingAs($this->rsStaff)
            ->post(route('schedules.store_slot'), [
                'date' => now()->addDays(2)->format('Y-m-d'),
                'start_time' => '09:00',
                'end_time' => '12:00',
                'max_capacity' => 100,
            ]);

        $response->assertStatus(403);
    }

    public function test_pmi_staff_can_record_walkin_donor_and_adds_points(): void
    {
        $donorProfile = DonorProfile::where('user_id', $this->donor->id)->first();
        $this->assertEquals(0, $donorProfile->points);

        $response = $this->actingAs($this->pmiStaff)
            ->post(route('schedules.store_donation'), [
                'donor_email' => 'donor@test.com',
                'blood_type' => 'O',
                'rhesus' => 'positive',
                'component_type' => 'whole_blood',
                'volume_ml' => 350,
            ]);

        $response->assertRedirect(route('schedules.index'));
        $this->assertDatabaseHas('donations', [
            'donor_id' => $donorProfile->id,
            'institution_id' => $this->pmi->id,
            'volume_ml' => 350,
            'status' => 'completed',
        ]);

        $donorProfile->refresh();
        $this->assertEquals(100, $donorProfile->points);
        $this->assertEquals(1, $donorProfile->total_donations);
        $this->assertNotNull($donorProfile->last_donation_date);
    }
}
