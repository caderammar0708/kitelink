<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('admin_actions') && ! Schema::hasTable('audit_logs')) {
            // Rename existing admin_actions table to audit_logs to preserve all data
            Schema::rename('admin_actions', 'audit_logs');
        }

        if (! Schema::hasTable('audit_logs')) {
            Schema::create('audit_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('user_name')->nullable();
                $table->string('user_role')->nullable();
                $table->string('event'); // login, logout, login_failed, created, updated, deleted, approved, rejected, suspended, reactivated, password_changed, etc.
                $table->string('auditable_type')->nullable();
                $table->unsignedBigInteger('auditable_id')->nullable();
                $table->text('description')->nullable();
                $table->json('old_values')->nullable();
                $table->json('new_values')->nullable();
                $table->string('ip_address', 45)->nullable();
                $table->text('user_agent')->nullable();
                $table->string('url')->nullable();
                $table->string('method', 10)->nullable();

                // Legacy columns for backward compatibility with existing code
                $table->unsignedBigInteger('admin_id')->nullable();
                $table->string('action')->nullable();
                $table->string('target_type')->nullable();
                $table->unsignedBigInteger('target_id')->nullable();
                $table->string('target_name')->nullable();
                $table->json('details')->nullable();

                $table->timestamps();

                $table->index('user_id');
                $table->index('event');
                $table->index('auditable_type');
                $table->index('created_at');
                $table->index(['auditable_type', 'auditable_id']);
            });
        } else {
            // Table was renamed from admin_actions, now add missing columns
            Schema::table('audit_logs', function (Blueprint $table) {
                // Drop FK on admin_id if exists so it can be nullable
                if (DB::getDriverName() !== 'sqlite') {
                    try {
                        $table->dropForeign('admin_actions_admin_id_foreign');
                    } catch (Throwable) {
                    }
                }

                if (! Schema::hasColumn('audit_logs', 'user_id')) {
                    $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
                }
                if (! Schema::hasColumn('audit_logs', 'user_name')) {
                    $table->string('user_name')->nullable()->after('user_id');
                }
                if (! Schema::hasColumn('audit_logs', 'user_role')) {
                    $table->string('user_role')->nullable()->after('user_name');
                }
                if (! Schema::hasColumn('audit_logs', 'event')) {
                    $table->string('event')->nullable()->after('user_role');
                }
                if (! Schema::hasColumn('audit_logs', 'auditable_type')) {
                    $table->string('auditable_type')->nullable()->after('event');
                }
                if (! Schema::hasColumn('audit_logs', 'auditable_id')) {
                    $table->unsignedBigInteger('auditable_id')->nullable()->after('auditable_type');
                }
                if (! Schema::hasColumn('audit_logs', 'description')) {
                    $table->text('description')->nullable()->after('auditable_id');
                }
                if (! Schema::hasColumn('audit_logs', 'old_values')) {
                    $table->json('old_values')->nullable()->after('description');
                }
                if (! Schema::hasColumn('audit_logs', 'new_values')) {
                    $table->json('new_values')->nullable()->after('old_values');
                }
                if (! Schema::hasColumn('audit_logs', 'user_agent')) {
                    $table->text('user_agent')->nullable()->after('ip_address');
                }
                if (! Schema::hasColumn('audit_logs', 'url')) {
                    $table->string('url')->nullable()->after('user_agent');
                }
                if (! Schema::hasColumn('audit_logs', 'method')) {
                    $table->string('method', 10)->nullable()->after('url');
                }
            });

            // Modify admin_id and action to be nullable
            try {
                DB::statement('ALTER TABLE audit_logs MODIFY admin_id BIGINT UNSIGNED NULL');
                DB::statement('ALTER TABLE audit_logs MODIFY action VARCHAR(255) NULL');
                DB::statement('ALTER TABLE audit_logs MODIFY target_type VARCHAR(255) NULL');
            } catch (Throwable) {
            }

            // Add indexes
            Schema::table('audit_logs', function (Blueprint $table) {
                try {
                    $table->index('user_id');
                } catch (Throwable) {
                }
                try {
                    $table->index('event');
                } catch (Throwable) {
                }
                try {
                    $table->index('auditable_type');
                } catch (Throwable) {
                }
                try {
                    $table->index(['auditable_type', 'auditable_id']);
                } catch (Throwable) {
                }
            });

            // Populate newly added columns for existing records
            try {
                $existing = DB::table('audit_logs')->whereNull('event')->get();
                foreach ($existing as $row) {
                    $admin = isset($row->admin_id) ? DB::table('users')->where('id', $row->admin_id)->first() : null;
                    $details = ! empty($row->details) ? json_decode($row->details, true) : [];
                    $summary = $details['summary'] ?? $details['reason'] ?? 'Admin action';

                    $eventMap = [
                        'approve' => 'approved',
                        'reject' => 'rejected',
                        'suspend' => 'suspended',
                        'reactivate' => 'reactivated',
                        'delete' => 'deleted',
                        'delete_user' => 'deleted',
                        'cancel_booking' => 'cancelled',
                        'update_settings' => 'settings_changed',
                        'request_info' => 'request_info',
                    ];
                    $event = $eventMap[$row->action ?? ''] ?? ($row->action ?? 'admin_action');

                    DB::table('audit_logs')->where('id', $row->id)->update([
                        'user_id' => $row->admin_id,
                        'user_name' => $admin?->name ?? 'Admin',
                        'user_role' => $admin?->role ?? 'admin',
                        'event' => $event,
                        'auditable_type' => ! empty($row->target_type) ? (str_contains($row->target_type, '\\') ? $row->target_type : 'App\\Models\\'.$row->target_type) : null,
                        'auditable_id' => $row->target_id,
                        'description' => $summary,
                        'new_values' => $row->details,
                        'method' => 'POST',
                    ]);
                }
            } catch (Throwable) {
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Additive migration: preserve data
    }
};
