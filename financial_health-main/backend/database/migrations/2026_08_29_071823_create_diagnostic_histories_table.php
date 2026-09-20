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
        Schema::create('diagnostic_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->decimal('total_score', 5, 2);
            $table->string('grade', 5);
            $table->decimal('net_cashflow', 18, 2);
            $table->decimal('runway_months', 8, 2);
            $table->json('inputs')->nullable();
            $table->json('sub_scores')->nullable();
            $table->json('action_plan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diagnostic_histories');
    }
};
