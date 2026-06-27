<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EvenementResource;
use App\Models\Evenement;
use Illuminate\Http\Request;

class AimerController extends Controller
{

    public function index()
    {
        $evenements = Evenement::withCount('utilisateursAiment')->get();

        return response()->json([
            'success' => true,
            'data'    => $evenements,
        ]);
    }
    public function toggle(Request $request, $id)
    {
        $user = $request->user();
        $evenement = Evenement::find($id);

        if (!$evenement) {
            return response()->json([
                'success' => false,
                'message' => 'Événement non trouvé',
            ], 404);
        }

        $user->evenementsAimes()->toggle($id);

        $liked = $user->evenementsAimes()
            ->where('evenements.id_evenement', $id)
            ->exists();

        $count = $evenement->utilisateursAiment()->count();

        return response()->json([
            'success' => true,
            'liked'   => $liked,
            'count'   => $count,
        ]);
    }

    public function mesEvenementsAimes(Request $request)
    {
        $evenements = $request->user()
            ->evenementsAimes()
            ->with([
                'lieux',
                'organisateurs',
                'types_tickets'
            ])
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $evenements,
        ]);
    }


    public function populaires()
    {
        $evenements = Evenement::with(['categories', 'lieux', 'organisateurs', 'types_tickets'])
            ->withCount('utilisateursAiment')
            ->orderBy('utilisateurs_aiment_count', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => EvenementResource::collection($evenements),
        ]);
    }
}
