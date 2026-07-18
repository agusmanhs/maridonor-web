<?php

namespace Tests\Feature;

use App\Enums\BloodComponent;
use App\Enums\BloodType;
use App\Enums\InstitutionType;
use App\Enums\RequestStatus;
use App\Enums\RhesusType;
use App\Enums\UrgencyLevel;
use App\Enums\UserRole;
use App\Models\BloodRequest;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class BloodRequestApiTest extends TestCase
{
    use RefreshDatabase;

    private Institution $pmi;
    private Institution $rs;
    private User $rsStaff;
    private User $pmiStaff;

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

        // 3. Setup RS Staff
        $this->rsStaff = User::create([
            'name' => 'RS Staff',
            'email' => 'rs_staff@example.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'role' => UserRole::RsStaff,
        ]);
        
        $this->rs->staff()->create([
            'user_id' => $this->rsStaff->id,
            'role' => 'staff',
            'is_active' => true
        ]);

        // 4. Setup PMI Staff
        $this->pmiStaff = User::create([
            'name' => 'PMI Staff',
            'email' => 'pmi_staff@example.com',
            'phone' => '081234567892',
            'password' => Hash::make('password'),
            'role' => UserRole::PmiStaff,
        ]);
    }

    public function test_rs_staff_can_request_blood_successfully(): void
    {
        $token = $this->rsStaff->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson(route('api.v1.blood-requests.store'), [
                'patient_name' => 'Agus Budi',
                'blood_type' => 'O',
                'rhesus' => 'positive',
                'component_type' => 'prc',
                'quantity_needed' => 3,
                'urgency_level' => 'emergency',
                'destination_hospital_id' => $this->rs->id,
                'contact_name' => 'Budi S',
                'contact_phone' => '0812345678',
                'notes' => 'Pasien kritis kecelakaan',
                'deadline_at' => now()->addDays(2)->format('Y-m-d H:i:s'),
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'open');

        $this->assertDatabaseHas('blood_requests', [
            'requester_id' => $this->rsStaff->id,
            'blood_type' => 'O',
            'urgency_level' => UrgencyLevel::Emergency->value,
            'status' => RequestStatus::Open->value,
        ]);
    }

    public function test_pmi_can_approve_blood_request(): void
    {
        $req = BloodRequest::create([
            'requester_id' => $this->rsStaff->id,
            'request_code' => 'REQ-001',
            'patient_name' => 'Agus Budi',
            'blood_type' => BloodType::O,
            'rhesus' => RhesusType::Positive,
            'component_type' => BloodComponent::Prc,
            'quantity_needed' => 3,
            'quantity_fulfilled' => 0,
            'urgency_level' => UrgencyLevel::Emergency,
            'status' => RequestStatus::Open,
            'destination_hospital_id' => $this->rs->id,
            'contact_name' => 'Budi S',
            'contact_phone' => '0812345678',
            'deadline_at' => now()->addDays(2),
        ]);

        $token = $this->pmiStaff->createToken('test')->plainTextToken;

        // PMI menolak permohonan darah (rejected)
        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson(route('api.v1.blood-requests.process', $req->id), [
                'status' => 'rejected',
                'rejection_reason' => 'Stok kosong total di area',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('blood_requests', [
            'id' => $req->id,
            'status' => RequestStatus::Cancelled->value,
        ]);
    }
}
