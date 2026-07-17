<?php

namespace App\Http\Requests\BloodStock;

use App\Enums\BloodComponent;
use App\Enums\BloodType;
use App\Enums\RhesusType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreBloodStockRequest extends FormRequest
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
            'institution_id' => ['required', 'uuid', 'exists:institutions,id'],
            'blood_type' => ['required', new Enum(BloodType::class)],
            'rhesus' => ['required', new Enum(RhesusType::class)],
            'component_type' => ['required', new Enum(BloodComponent::class)],
            'bag_number' => ['required', 'string', 'max:50'],
            'quantity_ml' => ['required', 'integer', 'min:100', 'max:1000'],
            'batch_number' => ['required', 'string', 'max:50'],
            'source_donor_id' => ['nullable', 'uuid', 'exists:donor_profiles,id'],
            'collected_at' => ['required', 'date'],
            'expires_at' => ['nullable', 'date', 'after:collected_at'],
        ];
    }

    public function messages(): array
    {
        return [
            'institution_id.required' => 'ID institusi wajib diisi.',
            'institution_id.exists' => 'Institusi tidak ditemukan.',
            'blood_type.required' => 'Golongan darah wajib dipilih.',
            'rhesus.required' => 'Rhesus wajib dipilih.',
            'component_type.required' => 'Komponen darah wajib dipilih.',
            'bag_number.required' => 'Nomor kantong darah wajib diisi.',
            'quantity_ml.required' => 'Volume darah (ml) wajib diisi.',
            'quantity_ml.min' => 'Volume darah minimal 100 ml.',
            'batch_number.required' => 'Nomor batch wajib diisi.',
            'collected_at.required' => 'Tanggal pengambilan darah wajib diisi.',
        ];
    }
}
