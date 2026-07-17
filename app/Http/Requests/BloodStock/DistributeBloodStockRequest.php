<?php

namespace App\Http\Requests\BloodStock;

use Illuminate\Foundation\Http\FormRequest;

class DistributeBloodStockRequest extends FormRequest
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
            'distributed_to' => ['required', 'uuid', 'exists:institutions,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'distributed_to.required' => 'Institusi tujuan distribusi wajib dipilih.',
            'distributed_to.exists' => 'Institusi tujuan tidak ditemukan.',
        ];
    }
}
