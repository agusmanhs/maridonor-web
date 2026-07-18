<?php

namespace App\Http\Resources\Article;

use App\Http\Resources\Auth\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'category' => $this->category,
            'thumbnail_url' => $this->thumbnail_url,
            'view_count' => (int) $this->view_count,
            'status' => $this->status,
            'author_id' => $this->author_id,
            'author' => new UserResource($this->whenLoaded('author')),
            'published_at' => $this->published_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
