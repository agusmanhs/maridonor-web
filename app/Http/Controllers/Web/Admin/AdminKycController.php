<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\KycDocument;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminKycController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['status']);
        $statusFilter = $filters['status'] ?? 'pending';

        $kycDocuments = KycDocument::where('status', $statusFilter)
            ->with(['user.donorProfile'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Kyc/Index', [
            'kycDocuments' => $kycDocuments,
            'filters' => ['status' => $statusFilter],
            'auth' => [
                'user' => [
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role->value,
                ]
            ]
        ]);
    }

    public function updateStatus(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:approved,rejected'],
            'rejection_reason' => ['required_if:status,rejected', 'nullable', 'string', 'max:500'],
        ]);

        $kycDocument = KycDocument::findOrFail($id);
        $user = User::findOrFail($kycDocument->user_id);

        DB::transaction(function () use ($kycDocument, $user, $validated, $request) {
            $kycDocument->update([
                'status' => $validated['status'],
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'rejection_reason' => $validated['status'] === 'rejected' ? $validated['rejection_reason'] : null,
            ]);

            if ($validated['status'] === 'approved') {
                $user->update([
                    'kyc_level' => 1,
                ]);
            }
        });

        $message = $validated['status'] === 'approved' 
            ? 'Dokumen KYC berhasil disetujui. Akun pendonor telah terverifikasi.' 
            : 'Dokumen KYC telah ditolak dengan alasan: ' . $validated['rejection_reason'];

        return redirect()->route('admin.kyc.index')->with('success', $message);
    }
}
