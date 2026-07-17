<?php

namespace App\Services\Institution;

use App\Enums\InstitutionStatus;
use App\Enums\UserRole;
use App\Models\Address;
use App\Models\Institution;
use App\Repositories\Contracts\InstitutionRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class InstitutionService
{
    public function __construct(
        private readonly InstitutionRepositoryInterface $institutionRepo,
        private readonly UserRepositoryInterface $userRepo
    ) {}

    public function list(array $filters): Collection
    {
        return $this->institutionRepo->getActiveList($filters);
    }

    public function detail(string $id): ?Institution
    {
        return $this->institutionRepo->findById($id);
    }

    public function register(array $data): Institution
    {
        return DB::transaction(function () use ($data) {
            // 1. Create Address
            $address = Address::create([
                'province' => $data['province'],
                'city' => $data['city'],
                'district' => $data['district'],
                'sub_district' => $data['sub_district'],
                'postal_code' => $data['postal_code'],
                'street_address' => $data['street_address'],
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
            ]);

            // 2. Create Institution
            $institution = $this->institutionRepo->create([
                'name' => $data['institution_name'],
                'type' => $data['institution_type'], // pmi / hospital
                'code' => $data['institution_type'] === 'pmi' ? 'PMI-' . rand(100, 999) : 'RS-' . rand(100, 999),
                'license_number' => $data['license_number'],
                'npwp' => $data['npwp'] ?? null,
                'address_id' => $address->id,
                'phone' => $data['phone'],
                'email' => $data['email'],
                'operational_hours' => $data['operational_hours'] ?? null,
                'latitude' => $data['latitude'] ?? 0,
                'longitude' => $data['longitude'] ?? 0,
                'status' => InstitutionStatus::Pending, // Menunggu approval Super Admin
            ]);

            // 3. Create Admin User for the Institution
            $adminRole = $data['institution_type'] === 'pmi' ? UserRole::PmiAdmin : UserRole::RsAdmin;
            $admin = $this->userRepo->create([
                'name' => $data['admin_name'],
                'email' => $data['admin_email'],
                'phone' => $data['phone'], // Menggunakan nomor kantor untuk admin awal
                'password' => Hash::make($data['admin_password']),
                'role' => $adminRole,
                'status' => \App\Enums\UserStatus::Active,
                'kyc_level' => 1, // Auto approve KYC level 1 untuk corporate admin
            ]);

            // 4. Link User Admin to Institution Staff table
            $this->institutionRepo->addStaff($institution->id, $admin->id, 'admin');

            return $institution;
        });
    }

    public function addStaff(string $institutionId, string $email, string $role): bool
    {
        $user = $this->userRepo->findByEmail($email);

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['User dengan email ini belum terdaftar di MARIDONOR.'],
            ]);
        }

        // Tentukan role baru staff di tabel users (pmi_staff / rs_staff)
        $institution = $this->detail($institutionId);
        $newRole = $institution->type === \App\Enums\InstitutionType::Pmi ? UserRole::PmiStaff : UserRole::RsStaff;

        return DB::transaction(function () use ($institutionId, $user, $newRole, $role) {
            // Promote user role
            $this->userRepo->update($user->id, [
                'role' => $newRole,
            ]);

            // Link ke institution staff
            return $this->institutionRepo->addStaff($institutionId, $user->id, $role);
        });
    }

    public function removeStaff(string $institutionId, string $userId): bool
    {
        $staffList = $this->institutionRepo->getStaffList($institutionId);
        $staff = $staffList->where('user_id', $userId)->first();

        if (!$staff) {
            return false;
        }

        return DB::transaction(function () use ($institutionId, $userId) {
            // Demote role user kembali ke donor biasa
            $this->userRepo->update($userId, [
                'role' => UserRole::Donor,
            ]);

            // Hapus dari staff institusi
            return $this->institutionRepo->removeStaff($institutionId, $userId);
        });
    }

    public function getStaff(string $institutionId): Collection
    {
        return $this->institutionRepo->getStaffList($institutionId);
    }
}
