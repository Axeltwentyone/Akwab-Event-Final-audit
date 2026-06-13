import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateUtilisateur() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenoms: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchUtilisateur();
  }, [id]);

  async function fetchUtilisateur() {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/utilisateurs/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        const u = data.data;
        setForm({
          nom: u.nom ?? "",
          prenoms: u.prenoms ?? "",
          email: u.email ?? "",
          role: u.role ?? "",
          password: "",
          password_confirmation: "",
        });
      } else {
        setError("Impossible de charger l'utilisateur.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    setFieldErrors({});

    // Validation mot de passe côté client
    if (form.password && form.password !== form.password_confirmation) {
      setFieldErrors({ password_confirmation: "Les mots de passe ne correspondent pas." });
      setSaving(false);
      return;
    }

    const payload = {
      nom: form.nom,
      prenoms: form.prenoms,
      email: form.email,
      role: form.role,
    };
    if (form.password) {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/utilisateurs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess("Utilisateur mis à jour avec succès.");
        setTimeout(() => navigate(`/dashboard/utilisateurs/${id}`), 1200);
      } else if (data.errors) {
        setFieldErrors(data.errors);
      } else {
        setError(data.message ?? "Erreur lors de la mise à jour.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-center text-gray-400 py-20">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/dashboard/utilisateurs/${id}`)}
          className="text-gray-400 hover:text-purple-500 transition-colors"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-purple-600 tracking-wide">
          Modifier l'utilisateur
        </h1>
      </div>

      {/* Alertes globales */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-teal-50 border border-teal-200 text-teal-600 text-sm rounded-lg px-4 py-3">
          {success}
        </div>
      )}

      {/* Formulaire */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Section identité */}
          <SectionTitle>Informations personnelles</SectionTitle>
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Nom"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              error={fieldErrors.nom}
              required
            />
            <Field
              label="Prénoms"
              name="prenoms"
              value={form.prenoms}
              onChange={handleChange}
              error={fieldErrors.prenoms}
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={fieldErrors.email}
              required
              className="md:col-span-2"
            />
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Rôle
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
              >
                <option value="">— Sélectionner un rôle —</option>
                <option value="admin">Admin</option>
                <option value="organisateur">Organisateur</option>
                <option value="utilisateur">Utilisateur</option>
              </select>
              {fieldErrors.role && (
                <p className="text-xs text-red-500">{fieldErrors.role}</p>
              )}
            </div>
          </div>

          {/* Section mot de passe */}
          <SectionTitle>Changer le mot de passe</SectionTitle>
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-xs text-gray-400 md:col-span-2 -mt-2">
              Laissez vide pour ne pas modifier le mot de passe.
            </p>
            <Field
              label="Nouveau mot de passe"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={fieldErrors.password}
            />
            <Field
              label="Confirmer le mot de passe"
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              error={fieldErrors.password_confirmation}
            />
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/utilisateurs/${id}`)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
      <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide">
        {children}
      </p>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, error, required, className = "" }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={name}
        className="text-xs text-gray-500 font-medium uppercase tracking-wide"
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors ${
          error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}