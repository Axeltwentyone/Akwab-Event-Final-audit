<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organisateur extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'organisateurs';

    protected $primaryKey = 'id_organisateur';

    protected $fillable = [
        'nom',
        'description',
        'email',
        'telephone'
    ];

    public function evenements()
    {
        return $this->hasMany(Evenement::class, 'id_organisateur');
    }
}
