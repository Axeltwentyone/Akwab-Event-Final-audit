import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateCategorie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    libelle: "",
    image: "",
  });

  useEffect(() => {
    fetchCategorie();
  }, [id]);

  async function fetchCategorie() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const cat = data.data ?? data;
        setForm({ libelle: cat.libelle ?? "", image: cat.image ?? "" });
      } else {
        setError(data.message ?? "Catégorie introuvable.");
      }
    } catch {
      setError("Impossible de charger la catégorie.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.libelle.trim()) errs.libelle = "Requis";
    if (!form.image.trim()) errs.image = "Requis";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Token:", localStorage.getItem("token")); 
    if (!validate()) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log(data);
      console.log("Token:", localStorage.getItem("token"));

      if (data.success || res.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard/categories"), 1200);
      } else if (data.errors) {
        setFieldErrors(data.errors);
      } else {
        setError(data.message ?? "Erreur lors de la modification.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 py-8 w-full">
      <div className="flex flex-col gap-6 max-w-xl w-full">
        {/* H1 centré */}
        <h1 className="text-2xl font-bold text-purple-600 tracking-wide text-center">
          Éditer une catégorie
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            Catégorie mise à jour. Redirection...
          </div>
        )}

        {loading && (
          <div className="text-center py-16 text-purple-500 font-medium">
            Chargement...
          </div>
        )}

        {!loading && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <form
              onSubmit={handleSubmit}
              className="px-6 py-6 flex flex-col gap-4"
            >
              {/* Libellé */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Libellé <span className="text-red-400">*</span>
                </label>
                <input
                  name="libelle"
                  type="text"
                  value={form.libelle}
                  onChange={handleChange}
                  placeholder="Ex: Musique, Sport, Art..."
                  className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors ${
                    fieldErrors.libelle
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-white"
                  }`}
                />
                {fieldErrors.libelle && (
                  <p className="text-xs text-red-500">{fieldErrors.libelle}</p>
                )}
              </div>

              {/* Image */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Image <span className="text-red-400">*</span>
                </label>
                <input
                  name="image"
                  type="text"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Ex: /logos/musique.png"
                  className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors ${
                    fieldErrors.image
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-white"
                  }`}
                />
                {fieldErrors.image && (
                  <p className="text-xs text-red-500">{fieldErrors.image}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/categories")}
                  className="px-4 py-2 text-sm text-purple-600 font-medium border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Retour
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
        )}
      </div>
    </div>
  );
}
