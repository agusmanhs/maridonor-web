<?php

namespace App\Http\Requests\Notification;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && (
            $user->role->value === 'super_admin' ||
            $user->role->value === 'pmi_admin'
        );
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'type' => ['required', 'string', 'in:info,warning,emergency'],
            'target_audience' => ['required', 'string', 'in:all,donors,institutions'],
            'is_pinned' => ['required', 'boolean'],
            'expires_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul pengumuman wajib diisi.',
            'content.required' => 'Konten pengumuman wajib diisi.',
            'type.required' => 'Tipe pengumuman wajib diisi.',
            'target_audience.required' => 'Target audiens wajib ditentukan.',
            'is_pinned.required' => 'Status pin pengumuman wajib ditentukan.',
        ];
    }
}
