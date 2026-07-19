<?php

namespace App\Http\Controllers\Web\BloodRequest;

use App\Http\Controllers\Controller;
use App\Models\BloodStock;
use App\Models\Institution;
use App\Services\BloodRequest\BloodRequestService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebBloodRequestController extends Controller
{
    public function __construct(
        private readonly BloodRequestService $bloodRequestService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $staffRecord = $user->institutionStaff()->first();
        $institutionId = $staffRecord ? $staffRecord->institution_id : null;

        if ($user->role->value === 'super_admin' && !$institutionId) {
            $type = $request->query('type', 'pmi');
            if ($type === 'hospital') {
                $institutionId = Institution::where('type', 'hospital')->first()?->id;
            } else {
                $institutionId = Institution::where('type', 'pmi')->first()?->id;
            }
        }

        if (!$institutionId) {
            abort(403, 'Anda tidak terasosiasi dengan institusi medis manapun.');
        }

        $filters = $request->only(['urgency_level', 'status']);
        $currentInstitution = Institution::find($institutionId);

        // Jika user adalah RS, filter agar hanya melihat request RS-nya sendiri
        if ($currentInstitution && $currentInstitution->type->value === 'hospital') {
            $filters['destination_hospital_id'] = $institutionId;
        }

        $requests = $this->bloodRequestService->list($filters);

        return Inertia::render('BloodRequest/Index', [
            'requests' => $requests,
            'filters' => $filters,
            'currentInstitution' => $currentInstitution,
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                ]
            ]
        ]);
    }

    public function show(Request $request, string $id): Response
    {
        $user = $request->user();
        $staffRecord = $user->institutionStaff()->first();
        $institutionId = $staffRecord ? $staffRecord->institution_id : null;

        if ($user->role->value === 'super_admin' && !$institutionId) {
            $type = $request->query('type', 'pmi');
            if ($type === 'hospital') {
                $institutionId = Institution::where('type', 'hospital')->first()?->id;
            } else {
                $institutionId = Institution::where('type', 'pmi')->first()?->id;
            }
        }

        $bloodRequest = $this->bloodRequestService->detail($id);

        if (!$bloodRequest) {
            abort(404, 'Permohonan darah tidak ditemukan.');
        }

        $currentInstitution = Institution::find($institutionId);

        // Cari stok darah yang cocok di UDD PMI saat ini jika yang membuka adalah PMI
        $matchingStocks = [];
        if ($currentInstitution && $currentInstitution->type->value === 'pmi') {
            $matchingStocks = BloodStock::where('institution_id', $institutionId)
                ->where('status', \App\Enums\StockStatus::Available)
                ->where('blood_type', $bloodRequest->blood_type)
                ->where('rhesus', $bloodRequest->rhesus)
                ->where('component_type', $bloodRequest->component_type)
                ->get(['id', 'bag_number', 'quantity_ml', 'collected_at', 'expires_at']);
        }

        return Inertia::render('BloodRequest/Show', [
            'bloodRequest' => $bloodRequest,
            'matchingStocks' => $matchingStocks,
            'currentInstitution' => $currentInstitution,
            'auth' => [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                ]
            ]
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $staffRecord = $user->institutionStaff()->first();
        $institutionId = $staffRecord ? $staffRecord->institution_id : null;

        if ($user->role->value === 'super_admin' && !$institutionId) {
            $institutionId = Institution::where('type', 'hospital')->first()?->id;
        }

        if (!$institutionId) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'patient_birth_year' => 'nullable|integer|min:1900|max:' . now()->year,
            'medical_record_number' => 'required|string|max:100',
            'diagnosis' => 'required|string|max:500',
            'blood_type' => 'required|string|in:A,B,AB,O',
            'rhesus' => 'required|string|in:positive,negative',
            'component_type' => 'required|string|in:whole_blood,prc,ffp,platelet,cryo',
            'quantity_needed' => 'required|integer|min:1|max:100',
            'urgency_level' => 'required|string|in:normal,urgent,emergency',
            'contact_name' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'deadline_at' => 'required|date|after:now',
            'notes' => 'nullable|string|max:1000',
        ]);

        $this->bloodRequestService->requestBlood(
            array_merge($validated, ['destination_hospital_id' => $institutionId]),
            $user->id
        );

        return redirect()->route('blood-requests.index')->with('success', 'Permohonan darah darurat berhasil dikirim ke PMI.');
    }

    public function fulfill(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'blood_stock_ids' => 'required|array|min:1',
            'blood_stock_ids.*' => 'required|uuid|exists:blood_stocks,id',
        ]);

        $this->bloodRequestService->fulfillRequest($id, $validated['blood_stock_ids'], $user->id);

        return redirect()->route('blood-requests.show', $id)->with('success', 'Alokasi kantong darah berhasil diserahkan.');
    }
}
