<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('donor_id')->constrained('donor_profiles')->onDelete('cascade');
            $table->foreignUuid('slot_id')->constrained('schedule_slots')->onDelete('restrict');
            $table->string('qr_code', 100)->unique();
            $table->integer('queue_number')->nullable();
            $table->string('status', 15)->default('booked');
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->foreignUuid('cancelled_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index(['donor_id', 'status']);
            $table->index('slot_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
