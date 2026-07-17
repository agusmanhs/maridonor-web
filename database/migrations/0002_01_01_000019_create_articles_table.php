<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('author_id')->constrained('users')->onDelete('restrict');
            $table->foreignUuid('institution_id')->nullable()->constrained('institutions')->onDelete('set null');
            $table->string('title', 500);
            $table->string('slug', 500)->unique();
            $table->text('excerpt');
            $table->text('content');
            $table->string('thumbnail_url', 500)->nullable();
            $table->string('category', 30);
            $table->string('status', 15)->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->integer('view_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
