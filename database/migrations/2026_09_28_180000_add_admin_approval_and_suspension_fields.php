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
            if (! Schema::hasColumn('users', 'is_suspended')) {
                $table->boolean('is_suspended')->default(false)->after('role');
            }
            if (! Schema::hasColumn('users', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('instructors', function (Blueprint $table) {
            if (Schema::hasColumn('instructors', 'status')) {
                $table->string('status', 30)->default('pending')->change();
            }
            if (! Schema::hasColumn('instructors', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('status');
            }
            if (! Schema::hasColumn('instructors', 'reviewed_by')) {
                $table->foreignId('reviewed_by')->nullable()->after('rejection_reason')->constrained('users')->nullOnDelete();
            }
            if (! Schema::hasColumn('instructors', 'reviewed_at')) {
                $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            }
            if (! Schema::hasColumn('instructors', 'certification_proof')) {
                $table->string('certification_proof')->nullable()->after('certifications');
            }
            if (! Schema::hasColumn('instructors', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('schools', function (Blueprint $table) {
            if (! Schema::hasColumn('schools', 'user_id')) {
                $table->foreignId('user_id')->nullable()->first()->constrained('users')->nullOnDelete();
            }
            if (! Schema::hasColumn('schools', 'status')) {
                $table->string('status', 30)->default('pending')->after('description');
            }
            if (! Schema::hasColumn('schools', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('status');
            }
            if (! Schema::hasColumn('schools', 'reviewed_by')) {
                $table->foreignId('reviewed_by')->nullable()->after('rejection_reason')->constrained('users')->nullOnDelete();
            }
            if (! Schema::hasColumn('schools', 'reviewed_at')) {
                $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            }
            if (! Schema::hasColumn('schools', 'certification_proof')) {
                $table->string('certification_proof')->nullable()->after('reviewed_at');
            }
            if (! Schema::hasColumn('schools', 'logo')) {
                $table->string('logo')->nullable();
            }
            if (! Schema::hasColumn('schools', 'phone')) {
                $table->string('phone')->nullable();
            }
            if (! Schema::hasColumn('schools', 'website')) {
                $table->string('website')->nullable();
            }
            if (! Schema::hasColumn('schools', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('reviews', function (Blueprint $table) {
            if (! Schema::hasColumn('reviews', 'is_hidden')) {
                $table->boolean('is_hidden')->default(false)->after('comment');
            }
            if (! Schema::hasColumn('reviews', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('bookings', function (Blueprint $table) {
            if (! Schema::hasColumn('bookings', 'cancellation_reason')) {
                $table->text('cancellation_reason')->nullable()->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (Schema::hasColumn('bookings', 'cancellation_reason')) {
                $table->dropColumn('cancellation_reason');
            }
        });

        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
            if (Schema::hasColumn('reviews', 'is_hidden')) {
                $table->dropColumn('is_hidden');
            }
        });

        Schema::table('schools', function (Blueprint $table) {
            if (Schema::hasColumn('schools', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
            if (Schema::hasColumn('schools', 'website')) {
                $table->dropColumn(['website', 'phone', 'logo', 'certification_proof', 'reviewed_at']);
            }
            if (Schema::hasColumn('schools', 'reviewed_by')) {
                $table->dropForeign(['reviewed_by']);
                $table->dropColumn('reviewed_by');
            }
            if (Schema::hasColumn('schools', 'rejection_reason')) {
                $table->dropColumn(['rejection_reason', 'status']);
            }
            if (Schema::hasColumn('schools', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
        });

        Schema::table('instructors', function (Blueprint $table) {
            if (Schema::hasColumn('instructors', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
            if (Schema::hasColumn('instructors', 'certification_proof')) {
                $table->dropColumn('certification_proof');
            }
            if (Schema::hasColumn('instructors', 'reviewed_at')) {
                $table->dropColumn('reviewed_at');
            }
            if (Schema::hasColumn('instructors', 'reviewed_by')) {
                $table->dropForeign(['reviewed_by']);
                $table->dropColumn('reviewed_by');
            }
            if (Schema::hasColumn('instructors', 'rejection_reason')) {
                $table->dropColumn('rejection_reason');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
            if (Schema::hasColumn('users', 'is_suspended')) {
                $table->dropColumn('is_suspended');
            }
        });
    }
};
