<?php

namespace Tests\Feature\Web;

use App\Models\Address;
use App\Models\BloodRequest;
use App\Models\BloodStock;
use App\Models\DonorProfile;
use App\Models\Institution;
use App\Models\InstitutionStaff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WebBloodRequestTest extends TestCase
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

    public function test_rs_staff_can_view_blood_requests_page(): void
    {
        $response = $this->actingAs($this->rsStaff)
            ->get(route('blood-requests.index'));

        $response->assertStatus(200);
    }

    public function test_rs_staff_can_submit_blood_request(): void
    {
        $response = $this->actingAs($this->rsStaff)
            ->post(route('blood-requests.store'), [
                'patient_name' => 'John Doe',
                'patient_birth_year' => 1990,
                'medical_record_number' => 'MR-9988',
                'diagnosis' => 'Kecelakaan parah',
                'blood_type' => 'O',
                'rhesus' => 'positive',
                'component_type' => 'prc',
                'quantity_needed' => 3,
                'urgency_level' => 'emergency',
                'contact_name' => 'Staff RS',
                'contact_phone' => '0812',
                'deadline_at' => now()->addDay()->format('Y-m-d H:i'),
            ]);

        $response->assertRedirect(route('blood-requests.index'));
        $this->assertDatabaseHas('blood_requests', [
            'patient_name' => 'John Doe',
            'blood_type' => 'O',
            'urgency_level' => 'emergency',
            'status' => 'open',
        ]);
    }

    public function test_pmi_staff_cannot_submit_blood_request(): void
    {
        $response = $this->actingAs($this->pmiStaff)
            ->post(route('blood-requests.store'), [
                'patient_name' => 'John Doe',
                'patient_birth_year' => 1990,
                'medical_record_number' => 'MR-9988',
                'diagnosis' => 'Kecelakaan parah',
                'blood_type' => 'O',
                'rhesus' => 'positive',
                'component_type' => 'prc',
                'quantity_needed' => 3,
                'urgency_level' => 'emergency',
                'contact_name' => 'Staff RS',
                'contact_phone' => '0812',
                'deadline_at' => now()->addDay()->format('Y-m-d H:i'),
            ]);

        $response->assertStatus(403);
    }

    public function test_pmi_staff_can_fulfill_blood_request(): void
    {
        $request = BloodRequest::create([
            'request_code' => 'REQ-TEST',
            'requester_id' => $this->rsStaff->id,
            'institution_id' => $this->rs->id,
            'patient_name' => 'Budi',
            'patient_birth_year' => 1980,
            'medical_record_number' => 'MR-1',
            'diagnosis' => 'Anemia',
            'blood_type' => 'O',
            'rhesus' => 'positive',
            'component_type' => 'prc',
            'quantity_needed' => 1,
            'quantity_fulfilled' => 0,
            'urgency_level' => 'emergency',
            'status' => 'open',
            'destination_hospital_id' => $this->rs->id,
            'contact_name' => 'Dr. Robert',
            'contact_phone' => '081',
            'deadline_at' => now()->addHours(12),
        ]);

        $stock = BloodStock::create([
            'institution_id' => $this->pmi->id,
            'blood_type' => 'O',
            'rhesus' => 'positive',
            'component_type' => 'prc',
            'bag_number' => 'BAG-MATCH-1',
            'batch_number' => 'BATCH-TEST',
            'quantity_ml' => 350,
            'status' => \App\Enums\StockStatus::Available,
            'collected_at' => now(),
            'expires_at' => now()->addDays(35),
            'created_by' => $this->pmiStaff->id,
        ]);

        $response = $this->actingAs($this->pmiStaff)
            ->post(route('blood-requests.fulfill', $request->id), [
                'blood_stock_ids' => [$stock->id],
            ]);

        $response->assertRedirect(route('blood-requests.show', $request->id));
        $this->assertDatabaseHas('blood_requests', [
            'id' => $request->id,
            'status' => 'fulfilled',
            'quantity_fulfilled' => 1,
        ]);
        $this->assertDatabaseHas('blood_stocks', [
            'id' => $stock->id,
            'status' => 'distributed',
            'distributed_to' => $this->rs->id,
        ]);
    }
}
