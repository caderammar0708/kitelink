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
        if (! Schema::hasTable('admin_actions')) {
            Schema::create('admin_actions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
                $table->string('action'); // approve, reject, suspend, reactivate, delete, cancel_booking, hide_review, update_settings, request_info
                $table->string('target_type');
                $table->unsignedBigInteger('target_id')->nullable();
                $table->string('target_name')->nullable();
                $table->json('details')->nullable();
                $table->string('ip_address', 45)->nullable();
                $table->timestamps();

                $table->index(['target_type', 'target_id']);
                $table->index('action');
                $table->index('created_at');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_actions');
    }
};
