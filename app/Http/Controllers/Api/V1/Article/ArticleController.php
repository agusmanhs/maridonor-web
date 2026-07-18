<?php

namespace App\Http\Controllers\Api\V1\Article;

use App\Http\Controllers\Controller;
use App\Http\Requests\Article\StoreArticleRequest;
use App\Http\Requests\Article\StoreFaqRequest;
use App\Http\Resources\Article\ArticleResource;
use App\Http\Resources\Article\FaqResource;
use App\Services\Article\ArticleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function __construct(
        private readonly ArticleService $articleService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'category', 'search']);
        
        // Non-admin hanya bisa melihat artikel yang dipublikasikan (published)
        $user = $request->user();
        if (!$user || !in_array($user->role->value, ['super_admin', 'pmi_admin', 'rs_admin'])) {
            $filters['status'] = 'published';
        }

        $articles = $this->articleService->listArticles($filters);

        return response()->json([
            'success' => true,
            'data' => ArticleResource::collection($articles),
        ], 200);
    }

    public function show(string $slug): JsonResponse
    {
        $article = $this->articleService->getArticleDetailBySlug($slug);

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Artikel tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new ArticleResource($article),
        ], 200);
    }

    public function store(StoreArticleRequest $request): JsonResponse
    {
        $article = $this->articleService->createArticle(
            $request->validated(),
            $request->user()->id
        );

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil disimpan.',
            'data' => new ArticleResource($article),
        ], 201);
    }

    public function indexFaqs(Request $request): JsonResponse
    {
        $filters = $request->only(['category', 'search', 'is_active']);
        
        // Non-admin hanya bisa melihat FAQ yang aktif
        $user = $request->user();
        if (!$user || $user->role->value !== 'super_admin') {
            $filters['is_active'] = true;
        }

        $faqs = $this->articleService->listFaqs($filters);

        return response()->json([
            'success' => true,
            'data' => FaqResource::collection($faqs),
        ], 200);
    }

    public function storeFaq(StoreFaqRequest $request): JsonResponse
    {
        $faq = $this->articleService->createFaq($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'FAQ berhasil ditambahkan.',
            'data' => new FaqResource($faq),
        ], 201);
    }
}
