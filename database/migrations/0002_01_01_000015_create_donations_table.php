<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('donor_id')->constrained('donor_profiles')->onDelete('restrict');
            $table->foreignUuid('institution_id')->constrained('institutions')->onDelete('restrict');
            $table->foreignUuid('blood_request_id')->nullable()->constrained('blood_requests')->onDelete('set null');
            $table->foreignUuid('booking_id')->nullable()->constrained('bookings')->onDelete('set null');
            $table->foreignUuid('blood_stock_id')->nullable()->constrained('blood_stocks')->onDelete('set null');
            $table->string('blood_type', 5);
            $table->string('rhesus', 10);
            $table->string('component_type', 20);
            $table->integer('volume_ml');
            $table->timestamp('donated_at');
            $table->string('status', 15);
            $table->decimal('hemoglobin', 4, 1)->nullable();
            $table->smallInteger('systolic_bp')->nullable();
            $table->smallInteger('diastolic_bp')->nullable();
            $table->decimal('weight_at_donation', 5, 2)->nullable();
            $table->text('deferred_reason')->nullable();
            $table->text('officer_notes')->nullable();
            $table->foreignUuid('officer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->integer('points_earned')->default(0);
            $table->string('certificate_url', 500)->nullable();
            $table->timestamps();

            $table->index('donor_id');
            $table->index('institution_id');
            $table->index('donated_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
