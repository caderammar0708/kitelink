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
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 50)->nullable()->after('email');
            }
        });

        Schema::table('instructors', function (Blueprint $table) {
            if (! Schema::hasColumn('instructors', 'phone')) {
                $table->string('phone', 50)->nullable()->after('location');
            }
        });

        Schema::table('schools', function (Blueprint $table) {
            if (! Schema::hasColumn('schools', 'registration_number')) {
                $table->string('registration_number', 100)->nullable()->after('name');
            }
            if (! Schema::hasColumn('schools', 'contact_name')) {
                $table->string('contact_name', 255)->nullable()->after('registration_number');
            }
            if (! Schema::hasColumn('schools', 'facilities')) {
                $table->json('facilities')->nullable()->after('description');
            }
            if (! Schema::hasColumn('schools', 'gear_list')) {
                $table->json('gear_list')->nullable()->after('facilities');
            }
            if (! Schema::hasColumn('schools', 'photos')) {
                $table->json('photos')->nullable()->after('gear_list');
            }
            if (! Schema::hasColumn('schools', 'certifications')) {
                $table->text('certifications')->nullable()->after('photos');
            }
            if (! Schema::hasColumn('schools', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('status');
            }
        });

        Schema::table('bookings', function (Blueprint $table) {
            if (! Schema::hasColumn('bookings', 'school_id')) {
                $table->foreignId('school_id')->nullable()->after('instructor_id')->constrained('schools')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (Schema::hasColumn('bookings', 'school_id')) {
                $table->dropForeign(['school_id']);
                $table->dropColumn('school_id');
            }
        });

        Schema::table('schools', function (Blueprint $table) {
            $columnsToDrop = [];
            foreach (['is_active', 'certifications', 'photos', 'gear_list', 'facilities', 'contact_name', 'registration_number'] as $column) {
                if (Schema::hasColumn('schools', $column)) {
                    $columnsToDrop[] = $column;
                }
            }
            if (! empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });

        Schema::table('instructors', function (Blueprint $table) {
            if (Schema::hasColumn('instructors', 'phone')) {
                $table->dropColumn('phone');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'phone')) {
                $table->dropColumn('phone');
            }
        });
    }
};
