import { useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import logo from "../assets/Image/logo.png";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const navItems = [
    { label: "Dashboard", path: "/Admin/Dashboard" },
    { label: "Utilisateurs", path: "/Admin/Utilisateurs" },
    { label: "Organisateurs", path: "/Admin/Organisateurs" },
    { label: "Évènements", path: "/Admin/Evenements" },
    { label: "Catégories", path: "/Admin/Categories" },
    { label: "Lieu", path: "/Admin/Lieux" },
    { label: "Tickets", path: "/Admin/Tickets" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Bouton hamburger — mobile uniquement */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-[#19244E] text-white shadow-md"
      >
        {isOpen ? (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Overlay sombre derrière le drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-56 bg-[#253C96] flex flex-col items-center py-8 gap-6
          fixed h-full z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <img src={logo} alt="Akwab Event" className="w-14" />

        <nav className="flex flex-col w-full px-3 gap-1 mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  text-sm font-medium px-4 py-2.5 rounded-lg transition-colors text-center
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto mb-2 w-36 py-2.5 rounded-lg bg-[#F36B2E] hover:bg-[#d85a22] text-white text-sm font-semibold transition-colors"
        >
          Déconnexion
        </button>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 min-w-0 md:ml-56 p-4 pt-14 sm:p-6 md:p-10 md:pt-10">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
