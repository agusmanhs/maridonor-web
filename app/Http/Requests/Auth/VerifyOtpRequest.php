<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'identifier' => ['required', 'string'],
            'code' => ['required', 'string', 'digits:6'],
            'type' => ['required', 'string', 'in:phone_verify,email_verify,login,password_reset'],
        ];
    }

    public function messages(): array
    {
        return [
            'identifier.required' => 'Identifier wajib diisi.',
            'code.required' => 'Kode OTP wajib diisi.',
            'code.digits' => 'Kode OTP harus terdiri dari 6 digit angka.',
            'type.required' => 'Tipe OTP wajib dipilih.',
            'type.in' => 'Tipe OTP tidak valid.',
        ];
    }
}
