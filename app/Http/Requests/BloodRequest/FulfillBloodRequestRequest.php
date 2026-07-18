<?php

namespace App\Http\Requests\BloodRequest;

use Illuminate\Foundation\Http\FormRequest;

class FulfillBloodRequestRequest extends FormRequest
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
            'blood_stock_ids' => ['required', 'array', 'min:1'],
            'blood_stock_ids.*' => ['required', 'uuid', 'exists:blood_stocks,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'blood_stock_ids.required' => 'Kantong darah yang akan dialokasikan wajib ditentukan.',
            'blood_stock_ids.min' => 'Pilih minimal 1 kantong darah untuk dialokasikan.',
            'blood_stock_ids.*.exists' => 'Salah satu kantong darah pilihan tidak valid atau tidak terdaftar.',
        ];
    }
}
