<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrganisateurRequest;
use App\Http\Requests\UpdateCategorieRequest;
use App\Http\Requests\UpdateOrganisateurRequest;
use App\Http\Resources\OrganisateurResource;
use App\Models\Organisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class OrganisateurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $page = $request->input('page', 1);

        $organisateurs = Cache::remember("organisateurs.tous.page.{$page}", 3600, function () {
            return Organisateur::orderBy('created_at', 'desc')
                ->paginate(10);
        });
        return OrganisateurResource::collection($organisateurs)->response()->getData(true);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(StoreOrganisateurRequest $request)
    {
        $organisateur = Organisateur::create($request->validated());

        $this->invalidateListeCache();

        return response()->json([
            'success' => true,
            'message' => 'Organisateur créé avec succès.',
            'organisateur'  => new OrganisateurResource($organisateur),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $organisateur = Cache::remember("organisateur.{$id}", 3600, function () use ($id) {
            return Organisateur::findOrFail($id);
        });
        return new OrganisateurResource($organisateur);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrganisateurRequest $request, string $id)
    {
        $organisateur = Organisateur::find($id);
        $organisateur->update($request->validated());

        Cache::forget("organisateur.{$id}");
        $this->invalidateListeCache();

        return response()->json([
            'success' => true,
            'message' => 'Organisateur mis à jour',
            'data'    => new OrganisateurResource($organisateur),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $organisateur = Organisateur::find($id);
        $organisateur->delete();

        Cache::forget("organisateur.{$id}");
        $this->invalidateListeCache();

        return response()->json([
            'success' => true,
            'message' => 'Organisateur supprimé avec succès'
        ]);
    }


    private function invalidateListeCache(): void
    {
        DB::table('cache')
            ->where('key', 'LIKE', '%organisateurs.tous.page%')
            ->delete();
    }
}
