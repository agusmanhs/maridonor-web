<?php

namespace App\Repositories\Contracts;

use App\Models\Article;
use App\Models\Faq;
use Illuminate\Support\Collection;

interface ArticleRepositoryInterface
{
    public function findArticleById(string $id): ?Article;

    public function findArticleBySlug(string $slug): ?Article;

    public function getArticles(array $filters): Collection;

    public function createArticle(array $data): Article;

    public function updateArticle(string $id, array $data): bool;

    public function incrementViews(string $id): void;

    public function getFaqs(array $filters): Collection;

    public function createFaq(array $data): Faq;

    public function updateFaq(string $id, array $data): bool;
}
