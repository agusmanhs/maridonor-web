<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\BloodRequest;
use App\Models\BloodStock;
use App\Models\BloodStockThreshold;
use App\Models\Donation;
use App\Models\DonorProfile;
use App\Models\Institution;
use App\Models\InstitutionStaff;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Institutions
        $pmiAddress = Address::create([
            'street_address' => 'Jl. Aceh No. 79',
            'city' => 'Bandung',
            'district' => 'Sumur Bandung',
            'sub_district' => 'Merdeka',
            'province' => 'Jawa Barat',
            'postal_code' => '40114',
        ]);

        $pmi = Institution::create([
            'name' => 'PMI Kota Bandung',
            'type' => \App\Enums\InstitutionType::Pmi,
            'code' => 'PMI-BDG',
            'license_number' => 'LIC-PMI-12345',
            'email' => 'pmi.bandung@maridonor.com',
            'phone' => '0224207052',
            'address_id' => $pmiAddress->id,
            'latitude' => -6.91238400,
            'longitude' => 107.61838400,
            'status' => \App\Enums\InstitutionStatus::Approved,
        ]);

        $rsAddress = Address::create([
            'street_address' => 'Jl. Kopo No. 161',
            'city' => 'Bandung',
            'district' => 'Bojongloa Kaler',
            'sub_district' => 'Situsaeur',
            'province' => 'Jawa Barat',
            'postal_code' => '40233',
        ]);

        $rs = Institution::create([
            'name' => 'RS Immanuel Bandung',
            'type' => \App\Enums\InstitutionType::Hospital,
            'code' => 'RS-IMM',
            'license_number' => 'LIC-RS-54321',
            'email' => 'rs.immanuel@maridonor.com',
            'phone' => '0225201656',
            'address_id' => $rsAddress->id,
            'latitude' => -6.93839200,
            'longitude' => 107.59589200,
            'status' => \App\Enums\InstitutionStatus::Approved,
        ]);

        // 2. Create Users & Staff Associations (Password: 'password')
        $superAdmin = User::create([
            'name' => 'Super Admin Maridonor',
            'email' => 'admin@maridonor.com',
            'phone' => '081111111111',
            'password' => bcrypt('password'),
            'role' => \App\Enums\UserRole::SuperAdmin,
            'status' => \App\Enums\UserStatus::Active,
        ]);

        $pmiStaff = User::create([
            'name' => 'Siti Aminah (PMI Staff)',
            'email' => 'pmi@maridonor.com',
            'phone' => '082222222222',
            'password' => bcrypt('password'),
            'role' => \App\Enums\UserRole::PmiStaff,
            'status' => \App\Enums\UserStatus::Active,
        ]);

        InstitutionStaff::create([
            'institution_id' => $pmi->id,
            'user_id' => $pmiStaff->id,
            'role' => 'pmi_staff',
            'is_active' => true,
        ]);

        $rsStaff = User::create([
            'name' => 'Dr. Robert (RS Staff)',
            'email' => 'rs@maridonor.com',
            'phone' => '083333333333',
            'password' => bcrypt('password'),
            'role' => \App\Enums\UserRole::RsStaff,
            'status' => \App\Enums\UserStatus::Active,
        ]);

        InstitutionStaff::create([
            'institution_id' => $rs->id,
            'user_id' => $rsStaff->id,
            'role' => 'rs_staff',
            'is_active' => true,
        ]);

        $donor = User::create([
            'name' => 'Ahmad Hidayat (Donor)',
            'email' => 'donor@maridonor.com',
            'phone' => '084444444444',
            'password' => bcrypt('password'),
            'role' => \App\Enums\UserRole::Donor,
            'status' => \App\Enums\UserStatus::Active,
        ]);

        $donorProfile = DonorProfile::create([
            'user_id' => $donor->id,
            'nik_encrypted' => '3273010101010001',
            'gender' => 'male',
            'birth_date' => '1990-01-01',
            'blood_type' => 'O',
            'rhesus' => 'positive',
            'points' => 350,
            'referral_code' => 'AHM123',
        ]);

        // 3. Create Blood Stock Thresholds
        foreach (['A', 'B', 'AB', 'O'] as $bt) {
            foreach (['prc', 'platelet'] as $comp) {
                BloodStockThreshold::create([
                    'institution_id' => $pmi->id,
                    'blood_type' => $bt,
                    'rhesus' => 'positive',
                    'component_type' => $comp,
                    'low_threshold' => 10,
                    'critical_threshold' => 5,
                ]);
            }
        }

        // 4. Create Blood Stocks (Stok PMI & RS)
        // PMI Stocks (Available)
        $bloodTypes = ['A', 'B', 'AB', 'O'];
        for ($i = 0; $i < 30; $i++) {
            $bt = $bloodTypes[$i % 4];
            BloodStock::create([
                'institution_id' => $pmi->id,
                'blood_type' => $bt,
                'rhesus' => 'positive',
                'component_type' => 'prc',
                'bag_number' => 'BAG-PMI-' . Str::upper(Str::random(8)),
                'quantity_ml' => 350,
                'status' => \App\Enums\StockStatus::Available,
                'batch_number' => 'BATCH-001',
                'source_donor_id' => $donorProfile->id,
                'collected_at' => now()->subDays($i % 10),
                'expires_at' => now()->addDays(35 - ($i % 10)),
                'created_by' => $pmiStaff->id,
            ]);
        }

        // RS Stocks (Distributed/Tersimpan di RS)
        for ($i = 0; $i < 5; $i++) {
            BloodStock::create([
                'institution_id' => $pmi->id,
                'blood_type' => 'O',
                'rhesus' => 'positive',
                'component_type' => 'prc',
                'bag_number' => 'BAG-RS-' . Str::upper(Str::random(8)),
                'quantity_ml' => 350,
                'status' => \App\Enums\StockStatus::Distributed,
                'batch_number' => 'BATCH-RS',
                'source_donor_id' => $donorProfile->id,
                'collected_at' => now()->subDays(2),
                'expires_at' => now()->addDays(33),
                'distributed_to' => $rs->id,
                'distributed_at' => now()->subDay(),
                'created_by' => $pmiStaff->id,
            ]);
        }

        // 5. Create Blood Requests (Permintaan RS)
        BloodRequest::create([
            'request_code' => 'REQ-001',
            'requester_id' => $rsStaff->id,
            'institution_id' => $rs->id,
            'patient_name' => 'Budi Santoso',
            'patient_birth_year' => 1980,
            'medical_record_number' => 'MR-12345',
            'diagnosis' => 'Anemia Akut',
            'blood_type' => 'O',
            'rhesus' => 'positive',
            'component_type' => 'prc',
            'quantity_needed' => 4,
            'quantity_fulfilled' => 1,
            'urgency_level' => 'emergency',
            'status' => 'open',
            'destination_hospital_id' => $rs->id,
            'contact_name' => 'Dr. Robert',
            'contact_phone' => '083333333333',
            'deadline_at' => now()->addHours(12),
        ]);

        BloodRequest::create([
            'request_code' => 'REQ-002',
            'requester_id' => $rsStaff->id,
            'institution_id' => $rs->id,
            'patient_name' => 'Siti Rahma',
            'patient_birth_year' => 1995,
            'medical_record_number' => 'MR-54321',
            'diagnosis' => 'Pendarahan Melahirkan',
            'blood_type' => 'A',
            'rhesus' => 'positive',
            'component_type' => 'prc',
            'quantity_needed' => 2,
            'quantity_fulfilled' => 2,
            'urgency_level' => 'urgent',
            'status' => 'fulfilled',
            'destination_hospital_id' => $rs->id,
            'contact_name' => 'Dr. Robert',
            'contact_phone' => '083333333333',
            'deadline_at' => now()->subDay(),
            'fulfilled_at' => now()->subDay(),
        ]);

        // 6. Create Historical Donations (Agregasi 6 Bulan Terakhir untuk grafik)
        for ($month = 0; $month < 6; $month++) {
            $donationDate = now()->subMonths($month)->startOfMonth()->addDays(10);
            // Jumlah donasi berkisar 5 s/d 15 per bulan
            $donationsCount = 5 + ($month * 2);
            for ($k = 0; $k < $donationsCount; $k++) {
                Donation::create([
                    'donor_id' => $donorProfile->id,
                    'institution_id' => $pmi->id,
                    'blood_type' => 'O',
                    'rhesus' => 'positive',
                    'component_type' => 'prc',
                    'volume_ml' => 350,
                    'donated_at' => $donationDate,
                    'status' => 'completed',
                    'created_at' => $donationDate,
                ]);
            }
        }

        // 7. Create Sample KYC Documents
        \App\Models\KycDocument::create([
            'user_id' => $donor->id,
            'type' => \App\Enums\KycDocumentType::KtpPhoto,
            'file_url' => 'https://placehold.co/600x400/27272a/ef4444?text=Foto+KTP+Ahmad+Hidayat',
            'status' => 'pending',
        ]);

        // 8. Create Sample Articles
        \App\Models\Article::create([
            'author_id' => $superAdmin->id,
            'title' => 'Pentingnya Menjaga Kadar Hemoglobin Sebelum Donor',
            'slug' => 'pentingnya-menjaga-kadar-hemoglobin-sebelum-donor',
            'excerpt' => 'Hemoglobin yang cukup merupakan syarat mutlak agar Anda dapat mendonorkan darah secara aman dan sehat.',
            'content' => 'Kadar hemoglobin (Hb) yang normal bagi pendonor berkisar antara 12.5 hingga 17.0 g/dL. Jika kadar Hb terlalu rendah, Anda akan ditangguhkan untuk mendonor karena berisiko mengalami anemia atau kelelahan setelah berdonasi. Untuk menjaga kadar Hb tetap ideal, konsumsilah makanan kaya zat besi seperti daging merah, bayam, kacang-kacangan, dan hati ayam beberapa hari sebelum jadwal donor Anda.',
            'category' => 'Kesehatan',
            'status' => 'published',
            'published_at' => now(),
        ]);

        \App\Models\Article::create([
            'author_id' => $superAdmin->id,
            'title' => 'Daftar Makanan Terbaik untuk Mempercepat Regenerasi Sel Darah',
            'slug' => 'daftar-makanan-terbaik-untuk-mempercepat-regenerasi-sel-darah',
            'excerpt' => 'Ketahui jenis makanan bernutrisi tinggi yang wajib dikonsumsi pendonor setelah mendonorkan darah.',
            'content' => 'Setelah mendonorkan darah, tubuh Anda membutuhkan nutrisi tambahan untuk memproduksi sel darah merah baru. Mengonsumsi protein berkualitas tinggi, buah-buahan kaya Vitamin C (untuk membantu penyerapan zat besi), serta minum air putih yang cukup (minimal 8-10 gelas) sangat direkomendasikan dalam 24 jam pertama pasca donor. Hindari minuman berkafein seperti kopi dan teh segera setelah donor karena dapat menghambat penyerapan nutrisi.',
            'category' => 'Gaya Hidup',
            'status' => 'published',
            'published_at' => now(),
        ]);

        \App\Models\Article::create([
            'author_id' => $superAdmin->id,
            'title' => 'Panduan Langkah Demi Langkah bagi Pendonor Pemula',
            'slug' => 'panduan-langkah-demi-langkah-bagi-pendonor-pemula',
            'excerpt' => 'Merasa gugup untuk donor pertama kali? Simak alur lengkap dan persiapan praktis ini.',
            'content' => 'Bagi Anda yang baru pertama kali mendonorkan darah, wajar jika merasa sedikit khawatir. Persiapan terbaik adalah tidur cukup minimal 7-8 jam sebelum donor, pastikan sudah makan makanan ringan 2-3 jam sebelum berdonasi, dan minum banyak air. Di lokasi, Anda akan melalui tahap registrasi, screening medis (tensi dan kadar Hb), barulah proses donor yang hanya memakan waktu sekitar 10 menit. Setelah selesai, Anda diwajibkan beristirahat sejenak sambil menikmati makanan ringan yang disediakan petugas.',
            'category' => 'Informasi',
            'status' => 'published',
            'published_at' => now(),
        ]);

        // 9. Create Sample Announcements
        \App\Models\Announcement::create([
            'author_id' => $superAdmin->id,
            'title' => 'Event Donor Darah Massal Semarak Ramadhan PMI Bandung',
            'content' => 'PMI Kota Bandung mengadakan kegiatan donor darah massal spesial menyambut bulan suci Ramadhan di Aula Balai Kota Bandung pada Sabtu ini mulai pukul 08.00 - 14.00 WIB. Dapatkan souvenir menarik bagi 100 pendonor pertama!',
            'type' => 'event',
            'target_audience' => 'all',
            'is_pinned' => true,
            'published_at' => now(),
        ]);

        \App\Models\Announcement::create([
            'author_id' => $superAdmin->id,
            'title' => 'Kebutuhan Siaga Darurat Golongan Darah O Positif',
            'content' => 'UDD RS Immanuel Bandung saat ini mendesak membutuhkan 4 kantong golongan darah O Rhesus Positif untuk menangani pasien bedah darurat malam ini. Mohon bagi rekan pendonor yang memenuhi syarat dapat merapat ke lokasi secepatnya.',
            'type' => 'warning',
            'target_audience' => 'donor',
            'is_pinned' => false,
            'published_at' => now(),
        ]);
    }
}
