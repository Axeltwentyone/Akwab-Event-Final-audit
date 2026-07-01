<?php

namespace Database\Factories;

use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UtilisateurFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function admin(): static
    {
        return $this->state(function () {
            $role = Role::where('libelle', 'admin')->first()
                ?? Role::where('libelle', 'Admin')->first()
                ?? Role::first();

            return ['id_role' => $role->id_role];
        });
    }

    public function definition(): array
    {
        return [
            'nom'  => $this->faker->lastName(),
            'prenoms' => $this->faker->firstName(),
            'email'   => $this->faker->unique()->safeEmail(),
            'telephone' => $this->faker->phoneNumber(),
            'mot_de_passe' => bcrypt('password'),
            'id_role' => Role::inRandomOrder()->first()->id_role ?? Role::factory()->create()->id_role,
        ];
    }

    public function admin(): static
    {
        return $this->state(['id_role' => 1]);
    }
}
