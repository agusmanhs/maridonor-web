<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Address;
use App\Enums\InstitutionStatus;
use Illuminate\Support\Facades\DB;

class AdminInstitutionController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'type', 'status']);

        $query = Institution::query();

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('code', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $institutions = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Institutions/Index', [
            'institutions' => $institutions,
            'filters' => $filters,
            'auth' => [
                'user' => [
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role->value,
                ]
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:pmi,hospital'],
            'code' => ['required', 'string', 'max:50', 'unique:institutions,code'],
            'license_number' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'string', 'email', 'unique:institutions,email'],
            
            // address info
            'street_address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:100'],
            'province' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:10'],
            'district' => ['required', 'string', 'max:100'],
            'sub_district' => ['required', 'string', 'max:100'],
        ]);

        DB::transaction(function () use ($validated) {
            $address = Address::create([
                'street_address' => $validated['street_address'],
                'city' => $validated['city'],
                'province' => $validated['province'],
                'postal_code' => $validated['postal_code'],
                'district' => $validated['district'],
                'sub_district' => $validated['sub_district'],
            ]);

            Institution::create([
                'name' => $validated['name'],
                'type' => $validated['type'],
                'code' => $validated['code'],
                'license_number' => $validated['license_number'],
                'phone' => $validated['phone'],
                'email' => $validated['email'],
                'address_id' => $address->id,
                'status' => InstitutionStatus::Approved,
            ]);
        });

        return redirect()->route('admin.institutions.index')->with('success', 'Institusi baru berhasil didaftarkan.');
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:approved,rejected,under_review,pending'],
        ]);

        $institution = Institution::findOrFail($id);
        $institution->update([
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.institutions.index')->with('success', 'Status institusi berhasil diperbarui.');
    }
}
