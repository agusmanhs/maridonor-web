<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blood_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('request_code', 20)->unique();
            $table->foreignUuid('requester_id')->constrained('users')->onDelete('restrict');
            $table->foreignUuid('institution_id')->nullable()->constrained('institutions')->onDelete('restrict');
            $table->string('patient_name');
            $table->smallInteger('patient_birth_year')->nullable();
            $table->string('medical_record_number', 100)->nullable();
            $table->text('diagnosis')->nullable();
            $table->string('blood_type', 5);
            $table->string('rhesus', 10);
            $table->string('component_type', 20);
            $table->integer('quantity_needed');
            $table->integer('quantity_fulfilled')->default(0);
            $table->string('urgency_level', 15);
            $table->string('status', 25)->default('draft');
            $table->foreignUuid('destination_hospital_id')->constrained('institutions')->onDelete('restrict');
            $table->string('contact_name');
            $table->string('contact_phone', 20);
            $table->text('notes')->nullable();
            $table->timestamp('deadline_at');
            $table->timestamp('opened_at')->nullable();
            $table->timestamp('fulfilled_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancelled_reason')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('status');
            $table->index(['urgency_level', 'status']);
            $table->index(['blood_type', 'rhesus', 'component_type']);
            $table->index('deadline_at');
            $table->index('requester_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blood_requests');
    }
};
