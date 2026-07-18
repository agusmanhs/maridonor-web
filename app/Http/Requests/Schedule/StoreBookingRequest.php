<?php

namespace App\Http\Requests\Schedule;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'slot_id' => ['required', 'uuid', 'exists:schedule_slots,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'slot_id.required' => 'ID slot jadwal donor wajib dipilih.',
            'slot_id.exists' => 'Slot jadwal donor tidak ditemukan.',
        ];
    }
}
