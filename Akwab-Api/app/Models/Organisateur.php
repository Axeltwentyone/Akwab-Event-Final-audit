<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organisateur extends Model
{
    use HasFactory;

    protected $table = 'organisateurs';

    protected $primaryKey = 'id_organisateur';

    protected $fillable = [
        'nom',
        'description',
        'email',
        'telephone'
    ];
}
