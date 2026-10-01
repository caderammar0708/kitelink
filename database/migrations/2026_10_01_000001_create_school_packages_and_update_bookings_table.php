<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('school_packages')) {
            Schema::create('school_packages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
                $table->string('name');
                $table->enum('type', ['course', 'rental', 'camp', 'private'])->default('course');
                $table->string('duration_label');
                $table->decimal('price', 10, 2);
                $table->text('description')->nullable();
                $table->json('features')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        Schema::table('bookings', function (Blueprint $table) {
            if (! Schema::hasColumn('bookings', 'school_id')) {
                $table->foreignId('school_id')->nullable()->after('instructor_id')->constrained('schools')->nullOnDelete();
            }

            if (! Schema::hasColumn('bookings', 'package_id')) {
                $table->foreignId('package_id')->nullable()->after('school_id')->constrained('school_packages')->nullOnDelete();
            }

            // Allow package bookings without a specific instructor assigned yet
            $table->foreignId('instructor_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (Schema::hasColumn('bookings', 'package_id')) {
                $table->dropForeign(['package_id']);
                $table->dropColumn('package_id');
            }
        });

        Schema::dropIfExists('school_packages');
    }
};
