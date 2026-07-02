<?php

namespace Tests\Feature\Categories;

use Tests\TestCase;
use App\Models\Utilisateur;
use App\Models\Categorie;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class CategorieTest extends TestCase
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
    public function nimporte_qui_peut_lister_les_categories()
    {
        $this->getJson('/api/categories')
            ->assertStatus(200);
    }

    #[Test]
    public function nimporte_qui_peut_voir_une_categorie()
    {
        $categorie = Categorie::factory()->create();

        $this->getJson("/api/categories/{$categorie->id_categorie}")
            ->assertStatus(200);
    }

    #[Test]
    public function show_retourne_404_si_categorie_inexistante()
    {
        $this->getJson('/api/categories/9999')
            ->assertStatus(404);
    }

    #[Test]
    public function un_admin_peut_creer_une_categorie()
    {
        $admin = $this->adminUser();
        $fakeImage = \Illuminate\Http\UploadedFile::fake()->image('categorie.jpg');
        \Illuminate\Support\Facades\Storage::fake('public');

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/categories', [
                'libelle' => 'Musique',
                'image'   => $fakeImage,
            ])->assertStatus(201)
            ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('categories', ['libelle' => 'Musique']);
    }


    #[Test]
    public function un_visiteur_ne_peut_pas_creer_une_categorie()
    {
        $this->postJson('/api/categories', ['libelle' => 'Test'])
            ->assertStatus(401);
    }

    #[Test]
    public function un_admin_peut_modifier_une_categorie()
    {
        $admin     = $this->adminUser();
        $categorie = Categorie::factory()->create();

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/categories/{$categorie->id_categorie}", [
                'libelle' => 'Sport',
            ])->assertStatus(200)
            ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('categories', ['libelle' => 'Sport']);
    }

    #[Test]
    public function un_admin_peut_supprimer_une_categorie()
    {
        $admin     = $this->adminUser();
        $categorie = Categorie::factory()->create();

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/categories/{$categorie->id_categorie}")
            ->assertStatus(200)
            ->assertJsonFragment(['success' => true]);

        $this->assertSoftDeleted('categories', ['id_categorie' => $categorie->id_categorie]);
    }

}
