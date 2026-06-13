import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ListUtilisateur() {
  const navigate = useNavigate();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const parPage = 8;

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  async function fetchUtilisateurs() {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/utilisateurs", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUtilisateurs(data.data);
      } else {
        setError("Impossible de charger les utilisateurs.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/utilisateurs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUtilisateurs(utilisateurs.filter((u) => u.id !== id));
      }
    } catch {
      setError("Erreur lors de la suppression.");
    }
  }

  const totalPages = Math.ceil(utilisateurs.length / parPage);
  const pagines = utilisateurs.slice((page - 1) * parPage, page * parPage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-600 tracking-wide">
          Liste des utilisateurs
        </h1>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-400 py-10">Chargement...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-purple-500 text-xs uppercase border-b border-gray-100">
                <th className="py-4 px-4 text-left">Nom</th>
                <th className="py-4 px-4 text-left">Prénoms</th>
                <th className="py-4 px-4 text-left">Email</th>
                <th className="py-4 px-4 text-center">Nb évènements aimés</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {pagines.map((u, i) => (
                <tr
                  key={u.id}
                  className={`border-b border-gray-50 hover:bg-purple-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                >
                  <td className="py-4 px-4 font-medium text-gray-700">
                    {u.nom}
                  </td>
                  <td className="py-4 px-4 text-gray-500">{u.prenoms}</td>
                  <td className="py-4 px-4 text-gray-500">{u.email}</td>
                  <td className="py-4 px-4 text-center text-gray-500">
                    {u.nb_evenements_aimes ?? 0}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/utilisateurs/${u.id}`)
                        }
                        className="text-teal-500 font-semibold hover:underline text-xs"
                      >
                        Voir
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-500 font-semibold hover:underline text-xs"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40"
          >
            ←
          </button>
          <span className="text-sm text-gray-500">
            {page}/{totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
