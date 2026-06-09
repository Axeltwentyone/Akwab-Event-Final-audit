<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EvenementTypeTicketResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_evenement'   => $this->id_evenement,
            'id_type_ticket'   => $this->id_type_ticket,
            'total_ticket_evenement'   => $this->pivot->total_ticket_evenement,
            'quantite_ticket_restante' => $this->pivot->quantite_ticket_restante,
            'quantite_type_ticket'     => $this->pivot->quantite_type_ticket,
        ];
    }
}
