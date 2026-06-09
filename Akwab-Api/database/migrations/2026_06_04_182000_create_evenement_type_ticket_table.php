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
        Schema::create('evenement_type_ticket', function (Blueprint $table) {
            $table->primary(['id_evenement', 'id_type_ticket']);

            $table->integer('total_ticket_evenement');
            $table->integer('quantite_ticket_restante');
            $table->integer('quantite_type_ticket');

            $table->unsignedBigInteger('id_evenement');
            $table->foreign('id_evenement')
                ->references('id_evenement')
                ->on('evenements')
                ->onDelete('cascade');

            $table->unsignedBigInteger('id_type_ticket');
            $table->foreign('id_type_ticket')
                ->references('id_type_ticket')
                ->on('types_tickets')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evenement_type_ticket');
    }
};
