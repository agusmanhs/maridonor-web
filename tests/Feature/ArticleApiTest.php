<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ArticleApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $donor;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Setup Admin
        $this->admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'role' => UserRole::SuperAdmin,
        ]);

        // 2. Setup Donor
        $this->donor = User::create([
            'name' => 'Donor User',
            'email' => 'donor@example.com',
            'phone' => '081234567892',
            'password' => Hash::make('password'),
            'role' => UserRole::Donor,
        ]);
    }

    public function test_admin_can_create_article_successfully(): void
    {
        $token = $this->admin->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->postJson(route('api.v1.articles.store'), [
                'title' => 'Manfaat Donor Darah Bagi Kesehatan Jantung',
                'excerpt' => 'Mendonorkan darah secara teratur membantu kesehatan jantung...',
                'content' => 'Mendonorkan darah secara teratur membantu mengurangi kekentalan darah...',
                'category' => 'Edukasi',
                'status' => 'published',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.slug', 'manfaat-donor-darah-bagi-kesehatan-jantung');

        $this->assertDatabaseHas('articles', [
            'slug' => 'manfaat-donor-darah-bagi-kesehatan-jantung',
            'status' => 'published',
        ]);
    }

    public function test_public_can_view_published_articles(): void
    {
        // Buat artikel draft dan published
        Article::create([
            'title' => 'Artikel Published',
            'slug' => 'artikel-published',
            'excerpt' => 'Excerpt published...',
            'content' => 'Content...',
            'category' => 'Health',
            'status' => 'published',
            'author_id' => $this->admin->id,
            'published_at' => now(),
        ]);

        Article::create([
            'title' => 'Artikel Draft',
            'slug' => 'artikel-draft',
            'excerpt' => 'Excerpt draft...',
            'content' => 'Content...',
            'category' => 'Health',
            'status' => 'draft',
            'author_id' => $this->admin->id,
        ]);

        // Request list artikel (Public)
        $response = $this->getJson(route('api.v1.articles.index'));

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data') // Hanya mengembalikan 1 artikel (published)
            ->assertJsonPath('data.0.slug', 'artikel-published');
    }

    public function test_article_increment_views_count_on_show(): void
    {
        $article = Article::create([
            'title' => 'Artikel Edukasi',
            'slug' => 'artikel-edukasi',
            'excerpt' => 'Excerpt edukasi...',
            'content' => 'Content...',
            'category' => 'Health',
            'status' => 'published',
            'author_id' => $this->admin->id,
            'view_count' => 5,
            'published_at' => now(),
        ]);

        // Request detail artikel
        $response = $this->getJson(route('api.v1.articles.show', $article->slug));

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.view_count', 6); // Views bertambah jadi 6
    }
}
