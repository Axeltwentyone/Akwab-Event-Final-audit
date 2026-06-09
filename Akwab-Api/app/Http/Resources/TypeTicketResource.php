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
            'prix_ticket' => $this->prix_ticket,

            'pivot' => $this->whenPivotLoaded('evenement_type_ticket', function () {
                return [
                    'total_ticket_evenement' => $this->pivot->total_ticket_evenement,
                    'quantite_ticket_restante' => $this->pivot->quantite_ticket_restante,
                    'quantite_type_ticket' => $this->pivot->quantite_type_ticket,
                ];
            } ),
        ];
    }
}
