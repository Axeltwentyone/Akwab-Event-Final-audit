<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evenement extends Model
{
    use HasFactory;

    protected $table = 'evenements';

    protected $primaryKey = 'id_evenement';

    protected $fillable = [
        'nom',
        'date',
        'description',
        'image',
        'quantite_ticket_totale',
        'quantite_ticket_restante',
    ];
}
