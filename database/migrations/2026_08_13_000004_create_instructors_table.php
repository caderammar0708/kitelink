<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('instructors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('school_id')->nullable()->constrained()->onDelete('set null');
            $table->text('bio')->nullable();
            $table->string('certifications')->nullable();
            $table->integer('experience_years')->nullable();
            $table->string('location')->nullable();
            $table->json('languages')->nullable();
            $table->decimal('hourly_rate', 8, 2)->nullable();
            $table->decimal('daily_rate', 8, 2)->nullable();
            $table->string('profile_photo')->nullable();
            $table->boolean('is_freelance')->default(true);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('instructors');
    }
};
