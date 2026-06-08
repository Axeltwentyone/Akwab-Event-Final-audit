<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\StoreOrganisateurRequest;
use App\Http\Resources\UtilisateurResource;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Organisateur;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $utilisateur = Utilisateur::create([
            ...$request->safe()->except('mot_de_passe_confirmation'),
            'id_role' => 2,
        ]);

        $token = $utilisateur->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie',
            'token'   => $token,
            'user'    => new UtilisateurResource($utilisateur),
        ], 201);
    }

    public function registerOrganisateur(StoreOrganisateurRequest $request)
    {
        $organisateur = Organisateur::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Organisateur créé avec succès',
            'data'    => $organisateur,
        ], 201);
    }


    public function registerAdmin(RegisterRequest $request)
    {
        $utilisateur = Utilisateur::create([
            ...$request->safe()->except('mot_de_passe_confirmation'),
            'id_role' => 1,
        ]);

        $token = $utilisateur->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Administrateur créé',
            'token'   => $token,
            'user'    => new UtilisateurResource($utilisateur),
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $utilisateur = Utilisateur::where('email', $request->email)->first();

        if (!$utilisateur || !Hash::check($request->mot_de_passe, $utilisateur->mot_de_passe)) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect',
            ], 401);
        }

        $token = $utilisateur->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'token'   => $token,
            'user'    => new UtilisateurResource($utilisateur),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie',
        ]);
    }
}
