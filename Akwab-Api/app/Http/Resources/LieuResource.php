<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LieuResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         return [
            'id'      => $this->id_lieu,
            'nom'     => $this->nom,
            'ville'   => $this->ville,
            'adresse' => $this->adresse,
        ];
    }
}
