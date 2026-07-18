<?php

namespace App\Http\Requests\BloodRequest;

use Illuminate\Foundation\Http\FormRequest;

class ProcessBloodRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && (
            $user->role->value === 'pmi_staff' ||
            $user->role->value === 'pmi_admin' ||
            $user->role->value === 'super_admin'
        );
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:approved,rejected'],
            'rejection_reason' => ['required_if:status,rejected', 'nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Keputusan status wajib ditentukan.',
            'status.in' => 'Status keputusan tidak valid.',
            'rejection_reason.required_if' => 'Alasan penolakan permohonan wajib diisi jika ditolak.',
        ];
    }
}
