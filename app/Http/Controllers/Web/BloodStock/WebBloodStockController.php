<?php

namespace App\Http\Controllers\Web\BloodStock;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use App\Services\BloodStock\BloodStockService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebBloodStockController extends Controller
{
    public function __construct(
        private readonly BloodStockService $bloodStockService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $staffRecord = $user->institutionStaff()->first();
        $institutionId = $staffRecord ? $staffRecord->institution_id : null;

        if ($user->role->value === 'super_admin' && !$institutionId) {
            // Super admin fallback ke institusi pertama
            $institutionId = Institution::first()?->id;
        }

        if (!$institutionId) {
            abort(403, 'Anda tidak terasosiasi dengan institusi medis manapun.');
        }

        $filters = $request->only(['blood_type', 'component_type', 'status']);
        
        // Dapatkan data stok
        $stocks = $this->bloodStockService->list($institutionId, $filters);

        // Jika user adalah PMI, ambil daftar RS tujuan untuk menu dropdown distribusi
        $hospitals = [];
        $currentInstitution = Institution::find($institutionId);
        if ($currentInstitution && $currentInstitution->type->value === 'pmi') {
            $hospitals = Institution::where('type', 'hospital')
                ->where('status', 'approved')
                ->get(['id', 'name']);
        }

        return Inertia::render('BloodStock/Index', [
            'stocks' => $stocks,
            'hospitals' => $hospitals,
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

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $staffRecord = $user->institutionStaff()->first();
        $institutionId = $staffRecord ? $staffRecord->institution_id : null;

        if ($user->role->value === 'super_admin' && !$institutionId) {
            $institutionId = Institution::first()?->id;
        }

        if (!$institutionId) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        $validated = $request->validate([
            'bag_number' => 'required|string|max:50',
            'blood_type' => 'required|string|in:A,B,AB,O',
            'rhesus' => 'required|string|in:positive,negative',
            'component_type' => 'required|string|in:whole_blood,prc,ffp,platelet,cryo',
            'quantity_ml' => 'required|integer|min:50|max:1000',
            'collected_at' => 'required|date',
            'expires_at' => 'nullable|date|after:collected_at',
        ]);

        $this->bloodStockService->addStock(
            array_merge($validated, ['institution_id' => $institutionId]),
            $user->id
        );

        return redirect()->route('blood-stocks.index')->with('success', 'Kantong darah berhasil didaftarkan.');
    }

    public function distribute(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'to_institution_id' => 'required|uuid|exists:institutions,id',
        ]);

        $this->bloodStockService->distributeStock($id, $validated['to_institution_id'], $user->id);

        return redirect()->route('blood-stocks.index')->with('success', 'Kantong darah berhasil didistribusikan.');
    }
}
