<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('institution_staff', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('institution_id')->constrained('institutions')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('role', 10)->default('staff');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['institution_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('institution_staff');
    }
};
