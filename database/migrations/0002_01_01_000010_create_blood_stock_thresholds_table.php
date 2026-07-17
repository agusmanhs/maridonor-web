<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blood_stock_thresholds', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('institution_id')->constrained('institutions')->onDelete('cascade');
            $table->string('blood_type', 5);
            $table->string('rhesus', 10);
            $table->string('component_type', 20);
            $table->integer('critical_threshold')->default(5);
            $table->integer('low_threshold')->default(10);
            $table->timestamps();

            $table->unique(['institution_id', 'blood_type', 'rhesus', 'component_type'], 'idx_stock_thresholds_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blood_stock_thresholds');
    }
};
