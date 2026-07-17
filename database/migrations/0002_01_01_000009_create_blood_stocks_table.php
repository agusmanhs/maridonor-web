<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blood_stocks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('institution_id')->constrained('institutions')->onDelete('restrict');
            $table->string('blood_type', 5);
            $table->string('rhesus', 10);
            $table->string('component_type', 20);
            $table->string('bag_number', 50)->unique();
            $table->integer('quantity_ml');
            $table->string('status', 20)->default('available');
            $table->string('batch_number', 50);
            $table->foreignUuid('source_donor_id')->nullable()->constrained('donor_profiles')->onDelete('set null');
            $table->timestamp('collected_at');
            $table->timestamp('expires_at');
            $table->foreignUuid('distributed_to')->nullable()->constrained('institutions')->onDelete('set null');
            $table->timestamp('distributed_at')->nullable();
            $table->text('discarded_reason')->nullable();
            $table->timestamp('discarded_at')->nullable();
            $table->foreignUuid('created_by')->constrained('users')->onDelete('restrict');
            $table->timestamps();

            // Indexes
            $table->index('institution_id');
            $table->index(['blood_type', 'rhesus', 'component_type']);
            $table->index('status');
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blood_stocks');
    }
};
