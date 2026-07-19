<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\User;
use App\Models\DonorProfile;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Enums\EligibilityStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class WebAuthController extends Controller
{
    public function showRegisterForm(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'regex:/^(08|62)\d{8,11}$/', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'gender' => ['required', 'string', 'in:male,female'],
            'birth_date' => [
                'required',
                'date',
                'date_format:Y-m-d',
                function ($attribute, $value, $fail) {
                    $age = Carbon::parse($value)->age;
                    if ($age < 17) {
                        $fail('Usia minimal untuk menjadi pendonor adalah 17 tahun.');
                    }
                },
            ],
            'blood_type' => ['required', 'string', 'in:A,B,AB,O'],
            'rhesus' => ['required', 'string', 'in:positive,negative'],
        ]);

        $user = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'password' => bcrypt($validated['password']),
                'role' => UserRole::Donor,
                'status' => UserStatus::Active,
            ]);

            DonorProfile::create([
                'user_id' => $user->id,
                'gender' => $validated['gender'],
                'birth_date' => $validated['birth_date'],
                'blood_type' => $validated['blood_type'],
                'rhesus' => $validated['rhesus'],
                'eligibility_status' => EligibilityStatus::Eligible,
                'points' => 0,
                'total_donations' => 0,
            ]);

            return $user;
        });

        Auth::login($user);

        return redirect('/dashboard/donor')->with('success', 'Registrasi mandiri berhasil dilakukan. Selamat datang di Maridonor!');
    }

    public function showLoginForm(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = Auth::user();

            if (in_array($user->role->value, ['pmi_staff', 'pmi_admin', 'super_admin'])) {
                return redirect()->intended('/dashboard/pmi');
            } elseif (in_array($user->role->value, ['rs_staff', 'rs_admin'])) {
                return redirect()->intended('/dashboard/hospital');
            } elseif ($user->role->value === 'donor') {
                return redirect()->intended('/dashboard/donor');
            }

            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            throw ValidationException::withMessages([
                'email' => 'Akses ditolak. Portal web ini hanya diperuntukkan untuk staf PMI dan Rumah Sakit.',
            ]);
        }

        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
