<?php



use App\Http\Controllers\Api\EvenementController;
use App\Http\Controllers\Api\OrganisateurController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\TypeTicketController;
use Database\Factories\TypeTicketFactory;
use App\Http\Controllers\Api\UtilisateurController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\LieuController;
use App\Http\Controllers\Api\AimerController;


// ROUTES PUBLIQUES
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register/organisateur', [AuthController::class, 'registerOrganisateur']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/evenements/populaires', [AimerController::class, 'populaires']);

Route::get('/evenements', [EvenementController::class, 'index']);
Route::get('/evenements/{id}', [EvenementController::class, 'show']);
Route::get('/types-tickets', [TypeTicketController::class, 'index']);
Route::get('/types-tickets/{id}', [TypeTicketController::class, 'show']);
Route::get('/lieux', [LieuController::class, 'index']);
Route::get('/lieux/{id}', [LieuController::class, 'show']);
Route::get('/categories', [CategorieController::class, 'index']);
Route::get('/categories/{id}', [CategorieController::class, 'show']);


Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password',  [AuthController::class, 'resetPassword']);



// ROUTES PROTÉGÉES(utilisateurs connectés)

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('categories', CategorieController::class)->except(['index', 'show']);

    Route::get('/profile', [UtilisateurController::class, 'profile']);
    Route::put('/profileupdate', [UtilisateurController::class, 'updateProfile']);
    Route::get('/mes-tickets', [TicketController::class, 'mesTickets']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::post('/evenements/{id}/aimer', [AimerController::class, 'toggle']);
    Route::get('/mes-evenements-aimes', [AimerController::class, 'mesEvenementsAimes']);

    // ROUTES ADMIN SEULEMENT
    Route::middleware('admin')->group(function () {
        Route::post('/register/admin', [AuthController::class, 'registerAdmin']);
        Route::apiResource('/organisateurs', OrganisateurController::class);
        Route::apiResource('/evenements', EvenementController::class)->except(['index', 'show']);
        Route::apiResource('/types-tickets', TypeTicketController::class)->except(['index', 'show']);
        Route::apiResource('utilisateurs', UtilisateurController::class)->except(['store']);
        Route::apiResource('lieux', LieuController::class)->except(['index', 'show']);
        Route::get('/likes', [AimerController::class, 'index']);
        Route::get('/tickets', [TicketController::class, 'index']);
        Route::put('/tickets/{id}', [TicketController::class, 'update']);
        Route::delete('/tickets/{id}', [TicketController::class, 'destroy']);


        Route::post('/categories', [CategorieController::class, 'store']);
        Route::post('/categories', [CategorieController::class, 'store']);
        Route::post('/categories/{id}', [CategorieController::class, 'update']);
        Route::put('/categories/{id}', [CategorieController::class, 'update']);
        Route::delete('/categories/{id}', [CategorieController::class, 'destroy']);
    });
});


Route::post('/debug-evenement', function (\Illuminate\Http\Request $request) {
    try {
        $evenement = \App\Models\Evenement::create($request->all());
        return response()->json(['success' => true, 'evenement' => $evenement]);
    } catch (\Throwable $e) {
        return response()->json([
            'error' => true,
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ], 500);
    }
});
Route::post('/debug-evenement-full', function (\Illuminate\Http\Request $request) {
    try {
        $evenement = \App\Models\Evenement::create($request->only([
            'nom', 'description', 'date', 'id_lieu', 'id_categorie', 'id_organisateur'
        ]));

        foreach ($request->input('tickets', []) as $ticket) {
            $typeTicket = \App\Models\Type_ticket::create([
                'libelle' => $ticket['libelle'] ?? null,
                'prix_ticket' => $ticket['prix_ticket'] ?? null,
            ]);

            $quantite = $ticket['quantite_type_ticket'] ?? 0;

            $evenement->types_tickets()->attach($typeTicket->id_type_ticket, [
                'total_ticket_evenement' => $quantite,
                'quantite_ticket_restante' => $quantite,
                'quantite_type_ticket' => $quantite,
            ]);
        }

        return response()->json([
            'success' => true,
            'evenement' => $evenement->load('types_tickets'),
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'error' => true,
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ], 500);
    }
});
