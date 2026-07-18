<?php

namespace App\Repositories\Eloquent;

use App\Enums\RequestStatus;
use App\Enums\StockStatus;
use App\Models\BloodRequest;
use App\Models\BloodStock;
use App\Models\Donation;
use App\Models\DonorProfile;
use App\Repositories\Contracts\DashboardRepositoryInterface;
use Illuminate\Support\Facades\DB;

class DashboardRepository implements DashboardRepositoryInterface
{
    public function getPmiMetrics(string $pmiInstitutionId): array
    {
        // 1. Total Stok Darah Tersedia (Berdasarkan Institution ID)
        $totalBags = BloodStock::where('institution_id', $pmiInstitutionId)
            ->where('status', StockStatus::Available)
            ->count();

        // 2. Total Permohonan Darah Aktif (Global)
        $activeRequests = BloodRequest::whereIn('status', [RequestStatus::Open, RequestStatus::PartiallyFulfilled])
            ->count();

        // 3. Total Pendonor Terdaftar
        $totalDonors = DonorProfile::count();

        // 4. Hitung Tren Donasi Sukses (6 Bulan Terakhir)
        $sixMonthsAgo = now()->subMonths(6)->startOfMonth();
        $donationTrends = Donation::select(
                DB::raw("strftime('%Y-%m', created_at) as month"), // Kompatibel SQLite & PostgreSQL
                DB::raw("count(id) as total")
            )
            ->where('status', \App\Enums\DonationStatus::Completed ?? 'completed')
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->toArray();

        return [
            'total_available_stock_bags' => $totalBags,
            'active_requests_count' => $activeRequests,
            'total_registered_donors' => $totalDonors,
            'donation_trends' => $donationTrends,
        ];
    }

    public function getHospitalMetrics(string $hospitalInstitutionId): array
    {
        // 1. Total Permohonan Darah yang dikirim oleh RS bersangkutan
        $totalSent = BloodRequest::where('destination_hospital_id', $hospitalInstitutionId)->count();

        // 2. Total Permohonan Darah yang telah dipenuhi/selesai
        $totalFulfilled = BloodRequest::where('destination_hospital_id', $hospitalInstitutionId)
            ->where('status', RequestStatus::Fulfilled)
            ->count();

        // 3. Permohonan Darah Aktif milik RS bersangkutan
        $activeRequests = BloodRequest::where('destination_hospital_id', $hospitalInstitutionId)
            ->whereIn('status', [RequestStatus::Open, RequestStatus::PartiallyFulfilled])
            ->count();

        // 4. Stok Darah Terdistribusi ke RS ini (dari PMI) yang masih disimpan di RS
        $bloodInHospital = BloodStock::where('distributed_to', $hospitalInstitutionId)
            ->where('status', StockStatus::Distributed)
            ->count();

        return [
            'total_requests_sent' => $totalSent,
            'total_requests_fulfilled' => $totalFulfilled,
            'active_requests_count' => $activeRequests,
            'hospital_stock_bags' => $bloodInHospital,
        ];
    }
}
