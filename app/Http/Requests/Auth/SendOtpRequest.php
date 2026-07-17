<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class SendOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'identifier' => ['required', 'string'],
            'type' => ['required', 'string', 'in:phone_verify,email_verify,login,password_reset'],
        ];
    }

    public function messages(): array
    {
        return [
            'identifier.required' => 'Identifier (email/nomor HP) wajib diisi.',
            'type.required' => 'Tipe OTP wajib dipilih.',
            'type.in' => 'Tipe OTP tidak valid.',
        ];
    }
}
