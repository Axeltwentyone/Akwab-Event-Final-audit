<?php

namespace Tests\Feature\Lieux;

use Tests\TestCase;
use App\Models\Utilisateur;
use App\Models\Lieu;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class LieuTest extends TestCase
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
    public function un_admin_peut_creer_un_lieu()
    {
        $admin = $this->adminUser();

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/lieux', [
                'nom'      => 'Palais de la Culture',
                'adresse'  => 'Treichville',
                'ville'    => 'Abidjan',
            ])->assertStatus(201)
            ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('lieux', ['nom' => 'Palais de la Culture']);
    }


    #[Test]
    public function un_visiteur_ne_peut_pas_creer_un_lieu()
    {
        $this->postJson('/api/lieux', ['nom' => 'Test'])
            ->assertStatus(401);
    }

    #[Test]
    public function un_admin_peut_modifier_un_lieu()
    {
        $admin = $this->adminUser();
        $lieu  = Lieu::factory()->create();

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/lieux/{$lieu->id_lieu}", [
                'nom'     => 'Nouveau lieu',
                'adresse' => 'Cocody, Abidjan',
            ])->assertStatus(200)
            ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('lieux', ['nom' => 'Nouveau lieu']);
    }

    #[Test]
    public function un_admin_peut_supprimer_un_lieu()
    {
        $admin = $this->adminUser();
        $lieu  = Lieu::factory()->create();

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/lieux/{$lieu->id_lieu}")
            ->assertStatus(200)
            ->assertJsonFragment(['success' => true]);

        $this->assertSoftDeleted('lieux', ['id_lieu' => $lieu->id_lieu]);
    }

}
