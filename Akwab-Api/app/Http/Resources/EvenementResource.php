<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EvenementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_evenement'  => $this->id_evenement,
            'nom'  => $this->nom,
            'date'  => $this->date,
            'description'  => $this->description,
            'image'  => $this->image
                ? asset('storage/' . $this->image)
                : null,

            'categories' => $this->categories ? [
                'id_categorie' => $this->categories->id_categorie,
                'libelle' => $this->categories->libelle,
            ] : null,


            'lieux' => $this->lieux ? [
                'id_lieu' => $this->lieux->id_lieu,
                'nom' => $this->lieux->nom,
                'ville' => $this->lieux->ville,
                'adresse' => $this->lieux->adresse,
            ] : null,

            'organisateurs' => $this->organisateurs ? [
                'id_organisateur' => $this->organisateurs->id_organisateur,
                'nom' => $this->organisateurs->nom,
                'email' => $this->organisateurs->email,
            ] : null,

            'types_tickets' => TypeTicketResource::collection(
                $this->whenLoaded('types_tickets')
            ),

            'likes_count'  => $this->whenCounted('utilisateursAiment')

        ];
    }
}
