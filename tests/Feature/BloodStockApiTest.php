<?php

namespace Tests\Feature;

use App\Enums\BloodComponent;
use App\Enums\BloodType;
use App\Enums\InstitutionType;
use App\Enums\RhesusType;
use App\Enums\StockStatus;
use App\Enums\UserRole;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class BloodStockApiTest extends TestCase
{
    use RefreshDatabase;

    private Institution $pmi;
    private Institution $rs;
    private User $pmiStaff;
    private User $donor;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Setup PMI
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

        // 2. Setup RS
        $this->rs = Institution::create([
            'name' => 'RS Santosa',
            'type' => InstitutionType::Hospital,
            'code' => 'RS-001',
            'license_number' => '456',
            'address_id' => \App\Models\Address::create([
                'province' => 'A', 'city' => 'B', 'district' => 'C', 'sub_district' => 'D', 'postal_code' => '123', 'street_address' => 'E'
            ])->id,
            'phone' => '456',
            'email' => 'rs@example.com',
            'latitude' => 0,
            'longitude' => 0,
        ]);

        // 3. Setup PMI Staff
        $this->pmiStaff = User::create([
            'name' => 'PMI Staff',
            'email' => 'staff@example.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'role' => UserRole::PmiStaff,
        ]);

        // 4. Setup Donor User
        $this->donor = User::create([
            'name' => 'Donor User',
            'email' => 'donor@example.com',
            'phone' => '081234567892',
            'password' => Hash::make('password'),
            'role' => UserRole::Donor,
        ]);
    }

    public function test_staff_can_add_blood_stock_successfully(): void
    {
        $token = $this->pmiStaff->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson(route('api.v1.blood-stocks.store'), [
                'institution_id' => $this->pmi->id,
                'blood_type' => 'O',
                'rhesus' => 'positive',
                'component_type' => 'platelet', // TC, expired otomatis 5 hari
                'bag_number' => 'BAG123456',
                'quantity_ml' => 350,
                'batch_number' => 'BATCH001',
                'collected_at' => now()->format('Y-m-d H:i:s'),
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.bag_number', 'BAG123456')
            ->assertJsonPath('data.status', 'available');

        $this->assertDatabaseHas('blood_stocks', [
            'bag_number' => 'BAG123456',
            'status' => StockStatus::Available->value,
        ]);
    }

    public function test_donor_cannot_add_blood_stock(): void
    {
        $token = $this->donor->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson(route('api.v1.blood-stocks.store'), [
                'institution_id' => $this->pmi->id,
                'blood_type' => 'O',
                'rhesus' => 'positive',
                'component_type' => 'platelet',
                'bag_number' => 'BAG123456',
                'quantity_ml' => 350,
                'batch_number' => 'BATCH001',
                'collected_at' => now()->format('Y-m-d H:i:s'),
            ]);

        $response->assertStatus(403);
    }
}
