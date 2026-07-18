<?php

namespace Tests\Feature;

use App\Enums\NotificationType;
use App\Enums\UserRole;
use App\Models\Announcement;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $donor;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Setup Admin
        $this->admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'role' => UserRole::SuperAdmin,
        ]);

        // 2. Setup Donor
        $this->donor = User::create([
            'name' => 'Donor User',
            'email' => 'donor@example.com',
            'phone' => '081234567892',
            'password' => Hash::make('password'),
            'role' => UserRole::Donor,
        ]);
    }

    public function test_user_can_view_their_notifications(): void
    {
        $token = $this->donor->createToken('test')->plainTextToken;

        // Buat notifikasi dummy
        Notification::create([
            'user_id' => $this->donor->id,
            'type' => NotificationType::ScheduleReminder,
            'title' => 'Janji Donor Disetujui',
            'body' => 'Jadwal janji donor Anda besok pukul 09:00 WIB telah disetujui.',
            'channel' => 'in_app',
            'is_read' => false,
            'sent_at' => now(),
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson(route('api.v1.notifications.index'));

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Janji Donor Disetujui');
    }

    public function test_user_can_mark_notification_as_read(): void
    {
        $token = $this->donor->createToken('test')->plainTextToken;

        $notification = Notification::create([
            'user_id' => $this->donor->id,
            'type' => NotificationType::ScheduleReminder,
            'title' => 'Janji Donor Disetujui',
            'body' => 'Jadwal janji donor Anda besok pukul 09:00 WIB telah disetujui.',
            'channel' => 'in_app',
            'is_read' => false,
            'sent_at' => now(),
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson(route('api.v1.notifications.read', $notification->id));

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('notifications', [
            'id' => $notification->id,
            'is_read' => true,
        ]);
    }

    public function test_admin_can_publish_announcement_successfully(): void
    {
        $token = $this->admin->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson(route('api.v1.announcements.store'), [
                'title' => 'Kebutuhan Darah Golongan O Meningkat Darurat',
                'content' => 'Bagi pendonor dengan golongan darah O+, PMI pusat membutuhkan pasokan tambahan secepatnya.',
                'type' => 'emergency',
                'target_audience' => 'donors',
                'is_pinned' => true,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Kebutuhan Darah Golongan O Meningkat Darurat');

        $this->assertDatabaseHas('announcements', [
            'title' => 'Kebutuhan Darah Golongan O Meningkat Darurat',
            'is_pinned' => true,
        ]);
    }

    public function test_guest_can_view_announcements(): void
    {
        Announcement::create([
            'author_id' => $this->admin->id,
            'title' => 'Pengumuman Rutin PMI',
            'content' => 'Layanan donor darah PMI buka 24 jam selama libur lebaran.',
            'type' => 'info',
            'target_audience' => 'all',
            'is_pinned' => false,
            'published_at' => now(),
        ]);

        $response = $this->getJson(route('api.v1.announcements.index'));

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Pengumuman Rutin PMI');
    }
}
