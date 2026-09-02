<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('instructors', function (Blueprint $table) {
            if (! Schema::hasColumn('instructors', 'languages')) {
                $table->json('languages')->nullable()->after('location');
            }
            if (! Schema::hasColumn('instructors', 'daily_rate')) {
                $table->decimal('daily_rate', 8, 2)->nullable()->after('hourly_rate');
            }
            if (! Schema::hasColumn('instructors', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('instructors', function (Blueprint $table) {
            $table->dropColumn(['languages', 'daily_rate', 'is_active']);
        });
    }
};
