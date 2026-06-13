import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ShowUtilisateur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [utilisateur, setUtilisateur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setUtilisateur(data.data);
      } else {
        setError("Impossible de charger l'utilisateur.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  function getInitiales(nom, prenoms) {
    const n = nom?.[0] ?? "";
    const p = prenoms?.[0] ?? "";
    return (n + p).toUpperCase();
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-center text-gray-400 py-20">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard/utilisateurs")}
          className="text-gray-400 hover:text-purple-500 transition-colors"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-purple-600 tracking-wide">
          Détail utilisateur
        </h1>
      </div>

      {/* Carte profil */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-purple-100 to-teal-50" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-sm">
              {getInitiales(utilisateur?.nom, utilisateur?.prenoms)}
            </div>
            <div className="pb-1">
              <p className="text-xl font-bold text-gray-800">
                {utilisateur?.prenoms} {utilisateur?.nom}
              </p>
              <p className="text-sm text-gray-400">{utilisateur?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Nom" value={utilisateur?.nom} />
            <InfoCard label="Prénoms" value={utilisateur?.prenoms} />
            <InfoCard label="Email" value={utilisateur?.email} />
            <InfoCard label="Téléphone" value={utilisateur?.telephone} />
            <InfoCard label="Rôle" value={utilisateur?.role ?? "Utilisateur"} />
            <InfoCard
              label="Évènements aimés"
              value={utilisateur?.nb_evenements_aimes ?? 0}
              highlight
            />
            {utilisateur?.created_at && (
              <InfoCard
                label="Inscrit le"
                value={new Date(utilisateur.created_at).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  },
                )}
              />
            )}
          </div>
        </div>
      </div>

      {/* Évènements aimés */}
      {utilisateur?.evenements_aimes?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
              Évènements aimés
            </h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {utilisateur.evenements_aimes.map((ev) => (
              <li
                key={ev.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-purple-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {ev.titre ?? ev.nom ?? `Évènement #${ev.id}`}
                </span>
                <div className="flex items-center gap-4">
                  {utilisateur?.telephone && (
                    <span className="text-xs text-gray-400">
                      {utilisateur.telephone}
                    </span>
                  )}
                  <span className="text-xs text-teal-500 font-semibold">
                    {ev.date_debut
                      ? new Date(ev.date_debut).toLocaleDateString("fr-FR")
                      : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value, highlight }) {
  return (
    <div
      className={`rounded-lg px-4 py-3 border ${
        highlight ? "border-teal-100 bg-teal-50" : "border-gray-100 bg-gray-50"
      }`}
    >
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p
        className={`text-sm font-semibold ${highlight ? "text-teal-600" : "text-gray-700"}`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}
