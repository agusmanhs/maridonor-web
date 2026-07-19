<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Institution;
use App\Models\InstitutionStaff;
use App\Models\DonorProfile;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'role', 'status']);

        $query = User::query();

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $users = $query->latest()->paginate(15)->withQueryString();

        $institutions = Institution::where('status', \App\Enums\InstitutionStatus::Approved)
            ->orderBy('name')
            ->get(['id', 'name', 'type']);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $filters,
            'institutions' => $institutions,
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
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'regex:/^(08|62)\d{8,11}$/', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', 'in:super_admin,pmi_staff,pmi_admin,rs_staff,rs_admin,donor'],
            
            // conditional staff fields
            'institution_id' => ['required_if:role,pmi_staff,pmi_admin,rs_staff,rs_admin', 'nullable', 'uuid', 'exists:institutions,id'],
            
            // conditional donor fields
            'gender' => ['required_if:role,donor', 'nullable', 'string', 'in:male,female'],
            'birth_date' => [
                'required_if:role,donor',
                'nullable',
                'date',
                'date_format:Y-m-d',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $age = Carbon::parse($value)->age;
                        if ($age < 17) {
                            $fail('Usia minimal untuk menjadi pendonor adalah 17 tahun.');
                        }
                    }
                },
            ],
            'blood_type' => ['required_if:role,donor', 'nullable', 'string', 'in:A,B,AB,O'],
            'rhesus' => ['required_if:role,donor', 'nullable', 'string', 'in:positive,negative'],
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => bcrypt($validated['password']),
                'role' => $validated['role'],
                'status' => 'active',
            ]);

            if (in_array($validated['role'], ['pmi_staff', 'pmi_admin', 'rs_staff', 'rs_admin'])) {
                InstitutionStaff::create([
                    'institution_id' => $validated['institution_id'],
                    'user_id' => $user->id,
                    'role' => $validated['role'],
                    'is_active' => true,
                ]);
            } elseif ($validated['role'] === 'donor') {
                DonorProfile::create([
                    'user_id' => $user->id,
                    'gender' => $validated['gender'],
                    'birth_date' => $validated['birth_date'],
                    'blood_type' => $validated['blood_type'],
                    'rhesus' => $validated['rhesus'],
                    'eligibility_status' => \App\Enums\EligibilityStatus::Eligible,
                    'points' => 0,
                    'total_donations' => 0,
                ]);
            }
        });

        return redirect()->route('admin.users.index')->with('success', 'Pengguna baru berhasil ditambahkan.');
    }
}
