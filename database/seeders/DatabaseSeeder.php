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
    }
}
