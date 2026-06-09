<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EvenementTypeTicket extends Model
{
    use HasFactory;

    protected $table = 'evenement_type_ticket';


    protected $fillable = [
        'id_evenement',
        'id_type_ticket',
        'total_ticket_evenement',
        'quantite_ticket_restante',
        'quantite_type_ticket',
    ];
}
