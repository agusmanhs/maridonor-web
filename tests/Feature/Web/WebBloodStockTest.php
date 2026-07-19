<?php

namespace Tests\Feature\Web;

use App\Models\Address;
use App\Models\BloodStock;
use App\Models\DonorProfile;
use App\Models\Institution;
use App\Models\InstitutionStaff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WebBloodStockTest extends TestCase
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

    public function test_pmi_staff_can_view_blood_stocks_page(): void
    {
        $response = $this->actingAs($this->pmiStaff)
            ->get(route('blood-stocks.index'));

        $response->assertStatus(200);
    }

    public function test_rs_staff_can_view_blood_stocks_page(): void
    {
        $response = $this->actingAs($this->rsStaff)
            ->get(route('blood-stocks.index'));

        $response->assertStatus(200);
    }

    public function test_non_staff_cannot_view_blood_stocks_page(): void
    {
        $response = $this->actingAs($this->donor)
            ->get(route('blood-stocks.index'));

        $response->assertStatus(403); // Terhadang RoleMiddleware
    }

    public function test_pmi_staff_can_register_new_blood_stock(): void
    {
        $response = $this->actingAs($this->pmiStaff)
            ->post(route('blood-stocks.store'), [
                'bag_number' => 'BAG-TEST-99',
                'blood_type' => 'O',
                'rhesus' => 'positive',
                'component_type' => 'prc',
                'quantity_ml' => 350,
                'collected_at' => now()->format('Y-m-d'),
            ]);

        $response->assertRedirect(route('blood-stocks.index'));
        $this->assertDatabaseHas('blood_stocks', [
            'bag_number' => 'BAG-TEST-99',
            'blood_type' => 'O',
            'status' => 'available',
        ]);
    }

    public function test_rs_staff_cannot_register_blood_stock(): void
    {
        $response = $this->actingAs($this->rsStaff)
            ->post(route('blood-stocks.store'), [
                'bag_number' => 'BAG-TEST-99',
                'blood_type' => 'O',
                'rhesus' => 'positive',
                'component_type' => 'prc',
                'quantity_ml' => 350,
                'collected_at' => now()->format('Y-m-d'),
            ]);

        $response->assertStatus(403);
    }

    public function test_pmi_staff_can_distribute_blood_stock_to_hospital(): void
    {
        $stock = BloodStock::create([
            'institution_id' => $this->pmi->id,
            'blood_type' => 'O',
            'rhesus' => 'positive',
            'component_type' => 'prc',
            'bag_number' => 'BAG-DIST-1',
            'batch_number' => 'BATCH-TEST-123',
            'quantity_ml' => 350,
            'status' => \App\Enums\StockStatus::Available,
            'collected_at' => now(),
            'expires_at' => now()->addDays(35),
            'created_by' => $this->pmiStaff->id,
        ]);

        $response = $this->actingAs($this->pmiStaff)
            ->post(route('blood-stocks.distribute', $stock->id), [
                'to_institution_id' => $this->rs->id,
            ]);

        $response->assertRedirect(route('blood-stocks.index'));
        $this->assertDatabaseHas('blood_stocks', [
            'id' => $stock->id,
            'status' => 'distributed',
            'distributed_to' => $this->rs->id,
        ]);
    }
}
