<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('institutions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('type', 10);
            $table->string('code', 50)->unique();
            $table->string('license_number', 100);
            $table->string('npwp', 30)->nullable();
            $table->foreignUuid('address_id')->constrained('addresses')->onDelete('restrict');
            $table->string('phone', 20);
            $table->string('email')->unique();
            $table->string('website', 255)->nullable();
            $table->jsonb('operational_hours')->nullable();
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->string('logo_url', 500)->nullable();
            $table->string('status', 20)->default('pending');
            $table->foreignUuid('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('institutions');
    }
};
