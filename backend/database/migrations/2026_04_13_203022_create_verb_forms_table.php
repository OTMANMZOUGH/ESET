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
        Schema::create('verb_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('verb_id')->constrained()->onDelete('cascade');
            $table->string('tense');
            $table->string('person');
            $table->string('form');
            $table->timestamps();

            $table->index(['verb_id', 'tense', 'person']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verb_forms');
    }
};
