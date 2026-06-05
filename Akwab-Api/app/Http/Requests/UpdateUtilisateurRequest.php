<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUtilisateurRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
          return [
            'nom'          => 'sometimes|string|max:255',
            'prenoms'      => 'sometimes|string|max:255',
            'email'        => 'sometimes|email|max:255|unique:utilisateurs,email,' . $this->utilisateur . ',id_utilisateurs',
            'telephone'    => 'sometimes|string|max:20',
            'mot_de_passe' => 'sometimes|string|min:8|confirmed',
            'id_role'      => 'sometimes|exists:roles,id_role',
        ];
    }
}
