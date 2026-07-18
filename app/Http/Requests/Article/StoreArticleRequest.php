<?php

namespace App\Http\Requests\Article;

use Illuminate\Foundation\Http\FormRequest;

class StoreArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && (
            $user->role->value === 'super_admin' ||
            $user->role->value === 'pmi_admin' ||
            $user->role->value === 'rs_admin'
        );
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['required', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'category' => ['required', 'string', 'max:100'],
            'thumbnail_url' => ['nullable', 'string', 'max:500'],
            'status' => ['required', 'string', 'in:draft,published'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul artikel wajib diisi.',
            'content.required' => 'Konten artikel wajib diisi.',
            'category.required' => 'Kategori artikel wajib diisi.',
            'status.required' => 'Status terbit artikel wajib ditentukan.',
        ];
    }
}
