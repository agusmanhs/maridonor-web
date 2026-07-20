<?php

namespace App\Http\Controllers\Web\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class WebProfileController extends Controller
{
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->role->value === 'donor') {
            $donorProfile = \App\Models\DonorProfile::where('user_id', $user->id)->firstOrFail();

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'phone' => ['required', 'string', 'regex:/^(08|62)\d{8,11}$/', 'unique:users,phone,' . $user->id],
                'gender' => ['required', 'string', 'in:male,female'],
                'birth_date' => [
                    'required',
                    'date',
                    'date_format:Y-m-d',
                    function ($attribute, $value, $fail) {
                        $age = \Carbon\Carbon::parse($value)->age;
                        if ($age < 17) {
                            $fail('Usia minimal untuk menjadi pendonor adalah 17 tahun.');
                        }
                    },
                ],
                'blood_type' => ['required', 'string', 'in:A,B,AB,O'],
                'rhesus' => ['required', 'string', 'in:positive,negative'],
            ]);

            DB::transaction(function () use ($user, $donorProfile, $validated) {
                $user->update([
                    'name' => $validated['name'],
                    'phone' => $validated['phone'],
                ]);

                $donorProfile->update([
                    'gender' => $validated['gender'],
                    'birth_date' => $validated['birth_date'],
                    'blood_type' => $validated['blood_type'],
                    'rhesus' => $validated['rhesus'],
                ]);
            });
        } else {
            // PMI staff, RS staff, Admin, Super Admin
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'phone' => ['required', 'string', 'regex:/^(08|62)\d{8,11}$/', 'unique:users,phone,' . $user->id],
            ]);

            $user->update([
                'name' => $validated['name'],
                'phone' => $validated['phone'],
            ]);
        }

        return redirect()->back()->with('success', 'Profil berhasil diperbarui.');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'string', 'current_password'],
            'password' => ['required', 'string', Password::defaults(), 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Kata sandi berhasil diperbarui.');
    }
}
