<?php

namespace App\Services\Article;

use App\Models\Article;
use App\Models\Faq;
use App\Repositories\Contracts\ArticleRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ArticleService
{
    public function __construct(
        private readonly ArticleRepositoryInterface $articleRepo
    ) {}

    public function listArticles(array $filters): Collection
    {
        return $this->articleRepo->getArticles($filters);
    }

    public function getArticleDetailBySlug(string $slug): ?Article
    {
        $article = $this->articleRepo->findArticleBySlug($slug);

        if ($article) {
            $this->articleRepo->incrementViews($article->id);
            // Refresh model agar memuat total views yang baru ditambahkan
            $article->refresh();
        }

        return $article;
    }

    public function createArticle(array $data, string $authorId): Article
    {
        $slug = Str::slug($data['title']);

        // Cegah tabrakan slug
        $originalSlug = $slug;
        $count = 1;
        while (\App\Models\Article::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $this->articleRepo->createArticle(array_merge($data, [
            'slug' => $slug,
            'author_id' => $authorId,
            'view_count' => 0,
            'published_at' => $data['status'] === 'published' ? now() : null,
        ]));
    }

    public function updateArticle(string $id, array $data): bool
    {
        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }
        
        if (isset($data['status']) && $data['status'] === 'published') {
            $data['published_at'] = now();
        }

        return $this->articleRepo->updateArticle($id, $data);
    }

    public function listFaqs(array $filters): Collection
    {
        return $this->articleRepo->getFaqs($filters);
    }

    public function createFaq(array $data): Faq
    {
        return $this->articleRepo->createFaq($data);
    }

    public function updateFaq(string $id, array $data): bool
    {
        return $this->articleRepo->updateFaq($id, $data);
    }
}
