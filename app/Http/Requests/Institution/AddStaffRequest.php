<?php

namespace App\Http\Requests\Institution;

use Illuminate\Foundation\Http\FormRequest;

class AddStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Hanya Admin PMI / Admin RS / Super Admin yang boleh menambah staff
        $user = $this->user();
        return $user && (
            $user->role->value === 'pmi_admin' || 
            $user->role->value === 'rs_admin' || 
            $user->role->value === 'super_admin'
        );
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'role' => ['required', 'string', 'in:admin,staff'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email staff wajib diisi.',
            'email.email' => 'Format email staff tidak valid.',
            'role.required' => 'Role staff wajib diisi.',
            'role.in' => 'Role staff tidak valid (pilih admin atau staff).',
        ];
    }
}
