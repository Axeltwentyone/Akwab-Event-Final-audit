<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TypeTicketResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_type_ticket' => $this->id_type_ticket,
            'libelle' => $this->libelle,
            'prix' => $this->prix,
            'quantite_type_ticket' => $this->quantite_type_ticket
        ];
    }
}
