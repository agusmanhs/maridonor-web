<?php

namespace App\Http\Controllers\Web\Certificate;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Inertia\Inertia;
use Inertia\Response;

class WebCertificateController extends Controller
{
    public function show(string $id): Response
    {
        $donation = Donation::with(['donorProfile.user', 'institution.address'])
            ->where('id', $id)
            ->first();

        if (!$donation) {
            abort(404, 'Data transaksi donasi tidak ditemukan.');
        }

        if ($donation->status->value !== 'completed') {
            abort(403, 'Sertifikat belum tersedia untuk transaksi donasi ini.');
        }

        // Dekripsi/samarkan NIK pendonor jika diperlukan demi kerahasiaan
        $nik = $donation->donorProfile->nik_encrypted ?? '-';
        if ($nik !== '-' && strlen($nik) > 8) {
            $nik = substr($nik, 0, 6) . '******' . substr($nik, -4);
        }

        return Inertia::render('Certificate/Print', [
            'donation' => [
                'id' => $donation->id,
                'blood_type' => $donation->blood_type->value,
                'rhesus' => $donation->rhesus->value,
                'component_type' => $donation->component_type->value,
                'volume_ml' => $donation->volume_ml,
                'donated_at' => $donation->donated_at->format('Y-m-d H:i:s'),
                'donor_name' => $donation->donorProfile->user->name,
                'donor_nik' => $nik,
                'pmi_name' => $donation->institution->name,
                'pmi_city' => $donation->institution->address->city ?? 'Bandung',
                'pmi_phone' => $donation->institution->phone,
            ]
        ]);
    }
}
