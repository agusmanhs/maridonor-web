<?php

namespace App\Http\Requests\BloodRequest;

use App\Enums\BloodComponent;
use App\Enums\BloodType;
use App\Enums\RhesusType;
use App\Enums\UrgencyLevel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreBloodRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && (
            $user->role->value === 'rs_staff' ||
            $user->role->value === 'rs_admin' ||
            $user->role->value === 'super_admin'
        );
    }

    public function rules(): array
    {
        return [
            'patient_name' => ['required', 'string', 'max:255'],
            'patient_birth_year' => ['nullable', 'integer', 'min:1900', 'max:' . date('Y')],
            'medical_record_number' => ['nullable', 'string', 'max:100'],
            'diagnosis' => ['nullable', 'string'],
            'blood_type' => ['required', new Enum(BloodType::class)],
            'rhesus' => ['required', new Enum(RhesusType::class)],
            'component_type' => ['required', new Enum(BloodComponent::class)],
            'quantity_needed' => ['required', 'integer', 'min:1', 'max:50'],
            'urgency_level' => ['required', new Enum(UrgencyLevel::class)],
            'destination_hospital_id' => ['required', 'uuid', 'exists:institutions,id'],
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_phone' => ['required', 'string', 'max:20'],
            'notes' => ['nullable', 'string'],
            'deadline_at' => ['required', 'date', 'after:now'],
        ];
    }

    public function messages(): array
    {
        return [
            'patient_name.required' => 'Nama pasien wajib diisi.',
            'blood_type.required' => 'Golongan darah wajib dipilih.',
            'rhesus.required' => 'Rhesus wajib dipilih.',
            'component_type.required' => 'Komponen darah wajib dipilih.',
            'quantity_needed.required' => 'Jumlah kantong darah wajib diisi.',
            'quantity_needed.min' => 'Jumlah kantong minimal 1.',
            'urgency_level.required' => 'Tingkat urgensi wajib dipilih.',
            'destination_hospital_id.required' => 'Rumah sakit tujuan wajib dipilih.',
            'destination_hospital_id.exists' => 'Rumah sakit tujuan tidak valid.',
            'contact_name.required' => 'Nama kontak wajib diisi.',
            'contact_phone.required' => 'Nomor telepon kontak wajib diisi.',
            'deadline_at.required' => 'Batas waktu permohonan wajib diisi.',
            'deadline_at.after' => 'Batas waktu harus berada di masa depan.',
        ];
    }
}
