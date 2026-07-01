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

    // ==========================================
    //  LECTURE (INDEX & SHOW)
    // ==========================================

    #[Test]
    public function nimporte_qui_peut_lister_les_lieux()
    {
        Lieu::factory()->count(3)->create();

        $this->getJson('/api/lieux')
            ->assertStatus(200)
            ->assertJsonCount(3, 'data'); // Adapte 'data' si ton API ne wrappe pas la réponse
    }

    #[Test]
    public function nimporte_qui_peut_voir_un_lieu_par_son_id()
    {
        $lieu = Lieu::factory()->create(['nom' => 'Sofitel Hotel Ivoire']);

        $this->getJson("/api/lieux/{$lieu->id_lieu}")
            ->assertStatus(200)
            ->assertJsonFragment(['nom' => 'Sofitel Hotel Ivoire']);
    }

    #[Test]
    public function voir_un_lieu_inexistant_retourne_404()
    {
        $this->getJson('/api/lieux/999')
            ->assertStatus(404);
    }

    // ==========================================
    //  CRÉATION (STORE)
    // ==========================================

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
    public function un_utilisateur_normal_ne_peut_pas_creer_un_lieu()
    {
        $user = $this->normalUser();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/lieux', [
                'nom'      => 'Palais de la Culture',
                'adresse'  => 'Treichville',
                'ville'    => 'Abidjan',
            ])->assertStatus(403);
    }

    #[Test]
    public function un_visiteur_ne_peut_pas_creer_un_lieu()
    {
        $this->postJson('/api/lieux', ['nom' => 'Test'])
            ->assertStatus(401);
    }

    #[Test]
    public function la_creation_dun_lieu_echoue_sans_donnees_valides()
    {
        $admin = $this->adminUser();

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/lieux', []) // On envoie rien
            ->assertStatus(422)
            ->assertJsonValidationErrors(['nom', 'adresse', 'ville']); // Adapte selon tes règles de StoreLieuRequest
    }

    // ==========================================
    //  MODIFICATION (UPDATE)
    // ==========================================

    #[Test]
    public function un_admin_peut_modifier_un_lieu()
    {
        $admin = $this->adminUser();
        $lieu  = Lieu::factory()->create();

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/lieux/{$lieu->id_lieu}", [
                'nom'     => 'Nouveau lieu',
                'adresse' => 'Cocody, Abidjan',
                'ville'   => 'Abidjan',
            ])->assertStatus(200)
            ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('lieux', ['nom' => 'Nouveau lieu']);
    }

    #[Test]
    public function un_utilisateur_normal_ne_peut_pas_modifier_un_lieu()
    {
        $user = $this->normalUser();
        $lieu = Lieu::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->putJson("/api/lieux/{$lieu->id_lieu}", [
                'nom' => 'Hack Lieu',
            ])->assertStatus(403);
    }

    #[Test]
    public function la_modification_dun_lieu_inexistant_retourne_404()
    {
        $admin = $this->adminUser();

        $this->actingAs($admin, 'sanctum')
            ->putJson('/api/lieux/999', [
                'nom'     => 'Inexistant',
                'adresse' => 'Nulle part',
                'ville'   => 'Inconnue',
            ])->assertStatus(404);
    }

    // ==========================================
    //  SUPPRESSION (DESTROY)
    // ==========================================

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

    #[Test]
    public function un_utilisateur_normal_ne_peut_pas_supprimer_un_lieu()
    {
        $user = $this->normalUser();
        $lieu = Lieu::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/lieux/{$lieu->id_lieu}")
            ->assertStatus(403);
    }

    #[Test]
    public function la_suppression_dun_lieu_inexistant_retourne_404()
    {
        $admin = $this->adminUser();

        $this->actingAs($admin, 'sanctum')
            ->deleteJson('/api/lieux/999')
            ->assertStatus(404);
    }
}
