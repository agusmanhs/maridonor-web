<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blood_request_donors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('blood_request_id')->constrained('blood_requests')->onDelete('cascade');
            $table->foreignUuid('donor_id')->constrained('donor_profiles')->onDelete('cascade');
            $table->string('response', 20);
            $table->timestamp('responded_at');
            $table->string('status', 20)->default('confirmed');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['blood_request_id', 'donor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blood_request_donors');
    }
};
