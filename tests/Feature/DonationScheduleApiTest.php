<?php

namespace Tests\Feature;

use App\Enums\EligibilityStatus;
use App\Enums\InstitutionType;
use App\Enums\UserRole;
use App\Models\Institution;
use App\Models\ScheduleSlot;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class DonationScheduleApiTest extends TestCase
{
    use RefreshDatabase;

    private Institution $pmi;
    private User $pmiStaff;
    private User $donorUser;

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

        // 2. Setup PMI Staff
        $this->pmiStaff = User::create([
            'name' => 'PMI Staff',
            'email' => 'staff@example.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'role' => UserRole::PmiStaff,
        ]);

        // 3. Setup Donor User dengan Profil Lengkap
        $this->donorUser = User::create([
            'name' => 'Donor User',
            'email' => 'donor@example.com',
            'phone' => '081234567892',
            'password' => Hash::make('password'),
            'role' => UserRole::Donor,
        ]);

        $this->donorUser->donorProfile()->create([
            'gender' => 'male',
            'birth_date' => '1995-03-15',
            'blood_type' => 'A',
            'rhesus' => 'positive',
            'referral_code' => 'DON123',
            'eligibility_status' => EligibilityStatus::Eligible,
            'next_eligible_date' => now()->subDay(), // Kemarin (eligible hari ini)
        ]);
    }

    public function test_pmi_staff_can_create_schedule_slot(): void
    {
        $token = $this->pmiStaff->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson(route('api.v1.schedule-slots.store'), [
                'institution_id' => $this->pmi->id,
                'slot_date' => now()->addDays(2)->format('Y-m-d'),
                'start_time' => '08:00:00',
                'end_time' => '10:00:00',
                'capacity' => 20,
                'type' => 'regular',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.capacity', 20);
    }

    public function test_donor_can_book_schedule_slot_successfully(): void
    {
        // 1. Buat Slot Jadwal
        $slot = ScheduleSlot::create([
            'institution_id' => $this->pmi->id,
            'slot_date' => now()->addDays(2)->format('Y-m-d'),
            'start_time' => '08:00:00',
            'end_time' => '10:00:00',
            'capacity' => 10,
            'booked_count' => 0,
            'type' => 'regular',
            'created_by' => $this->pmiStaff->id,
        ]);

        // 2. Lakukan Booking
        $token = $this->donorUser->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson(route('api.v1.bookings.store'), [
                'slot_id' => $slot->id,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['id', 'qr_code', 'queue_number', 'status']
            ]);

        $this->assertDatabaseHas('bookings', [
            'slot_id' => $slot->id,
            'queue_number' => 1,
            'status' => 'booked',
        ]);
    }

    public function test_donor_cannot_book_twice_on_same_day(): void
    {
        // 1. Buat 2 Slot pada hari yang sama
        $date = now()->addDays(2)->format('Y-m-d');
        
        $slot1 = ScheduleSlot::create([
            'institution_id' => $this->pmi->id,
            'slot_date' => $date,
            'start_time' => '08:00:00',
            'end_time' => '10:00:00',
            'capacity' => 10,
            'booked_count' => 0,
            'type' => 'regular',
            'created_by' => $this->pmiStaff->id,
        ]);

        $slot2 = ScheduleSlot::create([
            'institution_id' => $this->pmi->id,
            'slot_date' => $date,
            'start_time' => '10:00:00',
            'end_time' => '12:00:00',
            'capacity' => 10,
            'booked_count' => 0,
            'type' => 'regular',
            'created_by' => $this->pmiStaff->id,
        ]);

        $token = $this->donorUser->createToken('test')->plainTextToken;

        // Booking pertama -> Harus Sukses
        $response1 = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson(route('api.v1.bookings.store'), ['slot_id' => $slot1->id]);
        $response1->assertStatus(201);

        // Booking kedua di hari yang sama -> Harus Ditolak (422)
        $response2 = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson(route('api.v1.bookings.store'), ['slot_id' => $slot2->id]);
        $response2->assertStatus(422)
            ->assertJsonValidationErrors(['booking']);
    }
}
