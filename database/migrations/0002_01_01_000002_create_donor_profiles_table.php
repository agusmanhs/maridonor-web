<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donor_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('restrict');
            $table->string('nik_encrypted', 500)->nullable()->unique();
            $table->string('gender', 10);
            $table->date('birth_date');
            $table->string('blood_type', 5);
            $table->string('rhesus', 10);
            $table->decimal('weight_kg', 5, 2)->nullable();
            $table->foreignUuid('address_id')->nullable()->constrained('addresses')->onDelete('set null');
            $table->string('photo_url', 500)->nullable();
            $table->integer('total_donations')->default(0);
            $table->date('last_donation_date')->nullable();
            $table->date('next_eligible_date')->nullable();
            $table->string('eligibility_status', 30)->default('eligible');
            $table->text('deferral_reason')->nullable();
            $table->date('deferral_until')->nullable();
            $table->integer('points')->default(0);
            $table->smallInteger('level')->default(1);
            $table->string('referral_code', 10)->unique();
            $table->uuid('referred_by')->nullable();
            $table->text('health_notes_encrypted')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone', 20)->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['blood_type', 'rhesus']);
            $table->index('eligibility_status');
            $table->index('next_eligible_date');
        });

        // Add self-referencing foreign key constraint after table creation
        Schema::table('donor_profiles', function (Blueprint $table) {
            $table->foreign('referred_by')->references('id')->on('donor_profiles')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('donor_profiles', function (Blueprint $table) {
            $table->dropForeign(['referred_by']);
        });
        Schema::dropIfExists('donor_profiles');
    }
};
