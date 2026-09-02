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
        Schema::create('school_hire_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->foreignId('instructor_id')->constrained()->onDelete('cascade');
            $table->date('proposed_start');
            $table->date('proposed_end');
            $table->decimal('proposed_rate', 8, 2);
            $table->string('location')->nullable();
            $table->text('message')->nullable();
            $table->enum('status', ['pending', 'accepted', 'declined', 'countered'])->default('pending');
            $table->decimal('counter_rate', 8, 2)->nullable();
            $table->text('counter_message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_hire_requests');
    }
};
