<?php

namespace App\Http\Requests\BloodStock;

use Illuminate\Foundation\Http\FormRequest;

class DiscardBloodStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && (
            $user->role->value === 'pmi_staff' ||
            $user->role->value === 'pmi_admin' ||
            $user->role->value === 'rs_staff' ||
            $user->role->value === 'rs_admin' ||
            $user->role->value === 'super_admin'
        );
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'Alasan pembuangan kantong darah wajib diisi.',
            'reason.max' => 'Alasan pembuangan maksimal 500 karakter.',
        ];
    }
}
