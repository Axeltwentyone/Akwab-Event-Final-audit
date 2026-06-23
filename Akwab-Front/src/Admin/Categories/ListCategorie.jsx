import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ListCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    fetchCategories(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  async function fetchCategories(page, searchTerm) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page });
      if (searchTerm) params.append("search", searchTerm);
      const res = await fetch(
        `http://127.0.0.1:8000/api/categories?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const data = await res.json();
      setCategories(data.data || []);
      setTotalPages(data.meta?.last_page || 1);
      setTotalItems(data.meta?.total ?? (data.data ? data.data.length : 0));
    } catch {
      setError("Impossible de charger les catégories.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setDeleteConfirm(null);
        fetchCategories(currentPage, debouncedSearch);
      } else {
        alert(data.message ?? "Erreur lors de la suppression.");
      }
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-600 tracking-wide">
            Catégories
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {totalItems} catégorie{totalItems !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/categories/create")}
          className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
        >
          Créer une catégorie
        </button>
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher par libellé..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-[#4D027A] rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 w-full shadow-sm"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-16 text-purple-500 font-medium">
          Chargement...
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs text-gray-400 uppercase tracking-wide font-medium">
                    Image
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 uppercase tracking-wide font-medium">
                    Libellé
                  </th>
                  <th className="text-right px-4 py-3 text-xs text-gray-400 uppercase tracking-wide font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-16 text-gray-400">
                      {debouncedSearch
                        ? "Aucune catégorie ne correspond à votre recherche."
                        : "Aucune catégorie pour le moment."}
                    </td>
                  </tr>
                ) : (
                  categories.map((categorie) => (
                    <tr
                      key={categorie.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {/* Image */}
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-lg bg-purple-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                          <img
                            src={categorie.image}
                            alt={categorie.libelle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentNode.innerHTML = `<i class="ti ti-photo" style="font-size:20px;color:#7F77DD"></i>`;
                            }}
                          />
                        </div>
                      </td>
                      {/* Libellé */}
                      <td className="px-4 py-3 font-medium text-[#4D027A]">
                        {categorie.libelle}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/categories/${categorie.id}/edit`,
                              )
                            }
                            className="flex items-center gap-1 px-3 py-1.5 text-xs border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                          >
                            <i
                              className="ti ti-edit"
                              style={{ fontSize: 13 }}
                            />
                            Modifier
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(categorie.id)}
                            className="px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <i
                              className="ti ti-trash"
                              style={{ fontSize: 13 }}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center sm:justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              <span className="text-sm font-semibold bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1 rounded-lg">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">
              Supprimer cette catégorie ?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Cette action est irréversible. Les événements liés à cette
              catégorie pourraient être affectés.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
