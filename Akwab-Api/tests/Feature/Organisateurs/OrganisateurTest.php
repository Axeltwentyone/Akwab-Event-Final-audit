<?php

namespace Tests\Feature\Organisateurs;

use Tests\TestCase;
use App\Models\Utilisateur;
use App\Models\Organisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class OrganisateurTest extends TestCase
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
    public function un_admin_peut_creer_un_organisateur()
    {
        $admin = $this->adminUser();

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/organisateurs', [
                'nom'         => 'Akwab Events',
                'email'       => 'akwab@example.com',
                'telephone'   => '0700000000',
                'description' => 'Organisateur principal',
            ])->assertStatus(201)
            ->assertJsonFragment(['success' => true]);
    }


    #[Test]
    public function un_visiteur_ne_peut_pas_creer_un_organisateur()
    {
        $this->postJson('/api/organisateurs', ['nom' => 'Test'])
            ->assertStatus(401);
    }

    #[Test]
    public function un_admin_peut_modifier_un_organisateur()
    {
        $admin        = $this->adminUser();
        $organisateur = Organisateur::factory()->create();

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/organisateurs/{$organisateur->id_organisateur}", [
                'nom'     => 'Nouveau nom',
                'contact' => '0700000001',
            ])->assertStatus(200)
            ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('organisateurs', ['nom' => 'Nouveau nom']);
    }


    #[Test]
    public function un_admin_peut_supprimer_un_organisateur()
    {
        $admin        = $this->adminUser();
        $organisateur = Organisateur::factory()->create();

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/organisateurs/{$organisateur->id_organisateur}")
            ->assertStatus(200)
            ->assertJsonFragment(['success' => true]);

        $this->assertSoftDeleted('organisateurs', ['id_organisateur' => $organisateur->id_organisateur]);
    }

}
