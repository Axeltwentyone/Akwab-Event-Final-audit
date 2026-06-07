<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrganisateurController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// ROUTES PUBLIQUES
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register/organisateur', [AuthController::class, 'registerOrganisateur']);
Route::post('/register/admin', [AuthController::class, 'registerAdmin']);
Route::post('/login', [AuthController::class, 'login']);



// ROUTES PROTÉGÉES(utilisateurs connectés)
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);



// ROUTES ADMIN
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::apiResource('organisateurs', OrganisateurController::class);
    });
