<?php

namespace App\Repositories\Eloquent;

use App\Models\Article;
use App\Models\Faq;
use App\Repositories\Contracts\ArticleRepositoryInterface;
use Illuminate\Support\Collection;

class ArticleRepository implements ArticleRepositoryInterface
{
    public function findArticleById(string $id): ?Article
    {
        return Article::with('author')->find($id);
    }

    public function findArticleBySlug(string $slug): ?Article
    {
        return Article::with('author')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->first();
    }

    public function getArticles(array $filters): Collection
    {
        $query = Article::with('author');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        } else {
            // Default publik hanya melihat artikel terbit (published)
            $query->where('status', 'published');
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        return $query->latest('published_at')->get();
    }

    public function createArticle(array $data): Article
    {
        return Article::create($data);
    }

    public function updateArticle(string $id, array $data): bool
    {
        $article = $this->findArticleById($id);
        if ($article) {
            return $article->update($data);
        }
        return false;
    }

    public function incrementViews(string $id): void
    {
        $article = Article::find($id);
        if ($article) {
            $article->increment('view_count');
        }
    }

    public function getFaqs(array $filters): Collection
    {
        $query = Faq::query();

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        } else {
            $query->where('is_active', true);
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('question', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('answer', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderBy('category')->get();
    }

    public function createFaq(array $data): Faq
    {
        return Faq::create($data);
    }

    public function updateFaq(string $id, array $data): bool
    {
        $faq = Faq::find($id);
        if ($faq) {
            return $faq->update($data);
        }
        return false;
    }
}
