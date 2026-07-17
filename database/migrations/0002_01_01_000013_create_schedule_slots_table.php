<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedule_slots', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('institution_id')->constrained('institutions')->onDelete('cascade');
            $table->date('slot_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('capacity');
            $table->integer('booked_count')->default(0);
            $table->string('type', 15)->default('regular');
            $table->string('event_name')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_cancelled')->default(false);
            $table->text('cancellation_reason')->nullable();
            $table->foreignUuid('created_by')->constrained('users')->onDelete('restrict');
            $table->timestamps();

            $table->index(['institution_id', 'slot_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedule_slots');
    }
};
