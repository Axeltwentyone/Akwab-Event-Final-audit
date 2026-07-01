<?php

namespace Tests\Feature\Aimer;

use App\Models\Evenement;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Facades\DB;

class AimerTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): Utilisateur
    {
        return Utilisateur::factory()->admin()->create();
    }

    private function normalUser(): Utilisateur
    {
        return Utilisateur::factory()->create();
    }



    #[Test]
    public function un_visiteur_ne_peut_pas_voir_les_evenements_aimes()
    {
        $this->getJson('/api/mes-evenements-aimes')
            ->assertStatus(401);
    }



    #[Test]
    public function un_utilisateur_normal_ne_peut_pas_lister_tous_les_likes()
    {
        $user = $this->normalUser();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/likes')
            ->assertStatus(403);
    }

    #[Test]
    public function un_visiteur_ne_peut_pas_lister_tous_les_likes()
    {
        $this->getJson('/api/likes')
            ->assertStatus(401);
    }

    #[Test]
    public function les_evenements_populaires_sont_accessibles_publiquement()
    {
        Evenement::factory(3)->create();

        $this->getJson('/api/evenements/populaires')
            ->assertStatus(200);
    }
}
