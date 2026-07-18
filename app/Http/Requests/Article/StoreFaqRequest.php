<?php

namespace App\Http\Requests\Article;

use Illuminate\Foundation\Http\FormRequest;

class StoreFaqRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && $user->role->value === 'super_admin';
    }

    public function rules(): array
    {
        return [
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
            'category' => ['required', 'string', 'max:100'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'question.required' => 'Pertanyaan FAQ wajib diisi.',
            'answer.required' => 'Jawaban FAQ wajib diisi.',
            'category.required' => 'Kategori FAQ wajib diisi.',
            'is_active.required' => 'Status aktif FAQ wajib ditentukan.',
        ];
    }
}
