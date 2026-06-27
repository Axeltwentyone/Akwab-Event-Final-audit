export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Image gauche — 60% — cachée sur mobile */}
      <div className="hidden md:block md:w-3/5 relative overflow-hidden">
        <img
          src="../../public/image.png"
          alt="Akwab Event"
          className="w-full h-full object-cover"
        />

      </div>

      {/* Formulaire droite — 40% */}
      <div className="w-full md:w-2/5 flex items-center justify-center px-8 py-10 bg-white relative overflow-hidden">
        {/* Cercle décoratif haut */}
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: "#F59A1E" }}
        />
        {/* Cercle décoratif bas */}
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: "#253C96" }}
        />

        <div
          className="w-full max-w-sm flex flex-col items-center gap-6 relative z-10"
          style={{ animation: "slideUp 0.5s ease both" }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(24px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          {children}
        </div>
      </div>
    </div>
  );
}
