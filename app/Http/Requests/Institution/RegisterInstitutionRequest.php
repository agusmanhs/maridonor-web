<?php

namespace App\Http\Requests\Institution;

use Illuminate\Foundation\Http\FormRequest;

class RegisterInstitutionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Institution info
            'institution_name' => ['required', 'string', 'max:255'],
            'institution_type' => ['required', 'string', 'in:pmi,hospital'],
            'license_number' => ['required', 'string', 'max:100'],
            'npwp' => ['nullable', 'string', 'max:30'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'string', 'email', 'unique:institutions,email'],
            'operational_hours' => ['nullable', 'array'],

            // Address info
            'province' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'district' => ['required', 'string', 'max:100'],
            'sub_district' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:10'],
            'street_address' => ['required', 'string'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],

            // Corporate Admin User info
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'string', 'email', 'unique:users,email'],
            'admin_password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'institution_name.required' => 'Nama institusi wajib diisi.',
            'institution_type.required' => 'Tipe institusi wajib dipilih.',
            'license_number.required' => 'Nomor izin operasional wajib diisi.',
            'phone.required' => 'Nomor telepon institusi wajib diisi.',
            'email.required' => 'Email institusi wajib diisi.',
            'email.unique' => 'Email institusi sudah terdaftar.',
            'province.required' => 'Provinsi wajib diisi.',
            'city.required' => 'Kota/Kabupaten wajib diisi.',
            'district.required' => 'Kecamatan wajib diisi.',
            'sub_district.required' => 'Kelurahan wajib diisi.',
            'postal_code.required' => 'Kode pos wajib diisi.',
            'street_address.required' => 'Alamat jalan wajib diisi.',
            'admin_name.required' => 'Nama admin wajib diisi.',
            'admin_email.required' => 'Email admin wajib diisi.',
            'admin_email.unique' => 'Email admin sudah terdaftar.',
            'admin_password.required' => 'Password admin wajib diisi.',
            'admin_password.min' => 'Password admin minimal terdiri dari 8 karakter.',
            'admin_password.confirmed' => 'Konfirmasi password admin tidak cocok.',
        ];
    }
}
