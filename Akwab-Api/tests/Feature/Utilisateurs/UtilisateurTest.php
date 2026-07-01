<?php

namespace Tests\Feature\Utilisateurs;

use Tests\TestCase;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class UtilisateurTest extends TestCase
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
    public function un_utilisateur_peut_voir_son_profil()
    {
        $user = $this->normalUser();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/profile')
            ->assertStatus(200)
            ->assertJsonFragment(['success' => true]);
    }

    #[Test]
    public function un_visiteur_ne_peut_pas_voir_son_profil()
    {
        $this->getJson('/api/profile')
            ->assertStatus(401);
    }

    #[Test]
    public function un_utilisateur_peut_modifier_son_profil()
    {
        $user = $this->normalUser();

        $this->actingAs($user, 'sanctum')
            ->putJson('/api/profileupdate', [
                'nom'     => 'Nouveau',
                'prenoms' => 'Prénom',
                'email'   => $user->email,
            ])->assertStatus(200)
            ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('utilisateurs', ['nom' => 'Nouveau']);
    }

    #[Test]
    public function un_admin_peut_lister_tous_les_utilisateurs()
    {
        $admin = $this->adminUser();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/utilisateurs')
            ->assertStatus(200);
    }

    #[Test]
    public function un_visiteur_ne_peut_pas_lister_les_utilisateurs()
    {
        $this->getJson('/api/utilisateurs')
            ->assertStatus(401);
    }

    #[Test]
    public function un_admin_peut_voir_un_utilisateur()
    {
        $admin = $this->adminUser();
        $user  = $this->normalUser();

        $this->actingAs($admin, 'sanctum')
            ->getJson("/api/utilisateurs/{$user->id_utilisateur}")
            ->assertStatus(200);
    }

    #[Test]
    public function show_retourne_404_si_utilisateur_inexistant()
    {
        $admin = $this->adminUser();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/utilisateurs/9999')
            ->assertStatus(404);
    }

    #[Test]
    public function un_admin_peut_supprimer_un_utilisateur()
    {
        $admin = $this->adminUser();
        $user  = $this->normalUser();

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/utilisateurs/{$user->id_utilisateur}")
            ->assertStatus(200)
            ->assertJsonFragment(['success' => true]);

        $this->assertSoftDeleted('utilisateurs', ['id_utilisateur' => $user->id_utilisateur]);
    }
}
