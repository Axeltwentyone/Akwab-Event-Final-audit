import { Link } from "react-router-dom";
import logo from "../assets/Image/logo.png";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#F0ECF1] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-black rounded-xl p-6 flex flex-col items-center gap-5">
        <img src={logo} alt="Akwab Event" className="w-20" />

        <div className="text-center">
          <h2
            className="text-2xl font-bold text-gray-800"
            style={{ fontFamily: "monospace" }}
          >
            Bonjour !!
          </h2>
          <p className="text-sm text-gray-400 mt-1">Bienvenue à Akwab'Event</p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <div className="flex items-center justify-between text-xs text-gray-400">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-purple-500" />
              Se souvenir de moi
            </label>
            <Link to="/forgot-password" className="text-purple-500 font-medium">
              Mot de passe oublié ?
            </Link>
          </div>

          <button className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-all active:scale-[0.98]">
            Se connecter
          </button>
        </div>

        <p className="text-sm text-gray-400">
          Vous n'avez pas de compte ?{" "}
          <Link
            to="/register"
            className="text-purple-500 font-medium hover:underline"
          >
            créez votre compte
          </Link>
        </p>
      </div>
    </div>
  );
}
