<?php

namespace App\Http\Requests\Auth;

use App\Enums\BloodType;
use App\Enums\RhesusType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use Carbon\Carbon;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
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
            'blood_type' => ['required', new Enum(BloodType::class)],
            'rhesus' => ['required', new Enum(RhesusType::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'phone.required' => 'Nomor HP wajib diisi.',
            'phone.regex' => 'Format nomor HP tidak valid (gunakan format Indonesia seperti 0812xxxx).',
            'phone.unique' => 'Nomor HP sudah terdaftar.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal terdiri dari 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'gender.required' => 'Jenis kelamin wajib dipilih.',
            'birth_date.required' => 'Tanggal lahir wajib diisi.',
            'birth_date.date' => 'Format tanggal lahir tidak valid.',
        ];
    }
}
