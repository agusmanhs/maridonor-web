<?php

namespace App\Http\Requests\Schedule;

use Illuminate\Foundation\Http\FormRequest;

class StoreScheduleSlotRequest extends FormRequest
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
            'institution_id' => ['required', 'uuid', 'exists:institutions,id'],
            'slot_date' => ['required', 'date', 'date_format:Y-m-d', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i:s'],
            'end_time' => ['required', 'date_format:H:i:s', 'after:start_time'],
            'capacity' => ['required', 'integer', 'min:1'],
            'type' => ['required', 'string', 'in:regular,event'],
            'event_name' => ['required_if:type,event', 'nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'institution_id.required' => 'ID institusi wajib diisi.',
            'institution_id.exists' => 'Institusi tidak ditemukan.',
            'slot_date.required' => 'Tanggal slot wajib diisi.',
            'slot_date.after_or_equal' => 'Tanggal slot tidak boleh di masa lalu.',
            'start_time.required' => 'Waktu mulai wajib diisi.',
            'end_time.required' => 'Waktu selesai wajib diisi.',
            'end_time.after' => 'Waktu selesai harus setelah waktu mulai.',
            'capacity.required' => 'Kapasitas slot wajib diisi.',
            'capacity.min' => 'Kapasitas minimal 1.',
        ];
    }
}
