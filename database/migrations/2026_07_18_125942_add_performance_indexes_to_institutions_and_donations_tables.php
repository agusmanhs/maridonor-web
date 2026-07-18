<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('institutions', function (Blueprint $table) {
            $table->index(['latitude', 'longitude'], 'institutions_coords_idx');
        });

        Schema::table('donations', function (Blueprint $table) {
            $table->index(['status', 'created_at'], 'donations_status_created_idx');
        });
    }

    public function down(): void
    {
        Schema::table('institutions', function (Blueprint $table) {
            $table->dropIndex('institutions_coords_idx');
        });

        Schema::table('donations', function (Blueprint $table) {
            $table->dropIndex('donations_status_created_idx');
        });
    }
};
