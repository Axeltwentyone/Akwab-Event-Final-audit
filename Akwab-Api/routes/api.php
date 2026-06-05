<?php

use App\Http\Controllers\Api\OrganisateurController;
use Illuminate\Support\Facades\Route;



// ROUTES PUBLIQUES
Route::get('/organisateurs', [OrganisateurController::class, 'index' ]);
Route::get('/organisateurs/{id} ', [OrganisateurController::class, 'show' ]);


// ROUTES PROTEGEES (UTILISATEURS CONNECTES)
Route::middleware('auth:sanctum')->group(function() {



    // ROUTES ADMIN
    Route::middleware('admin')->group(function() {
        Route::apiResource('/organisateurs', OrganisateurController::class)->except(['index', 'show']);


    });


} );
