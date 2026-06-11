import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../src/assets/Image/logo.png";

export default function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex flex-col items-center justify-center relative">

      {/* Logo + Titre */}
      <div className="flex flex-col items-center gap-4 animate-[fadeInBounce_0.7s_cubic-bezier(.34,1.56,.64,1)_forwards]">
        <img
          src={logo}
          alt="Akwab Event"
          className="w-28 h-28 rounded-[28px] object-contain"
        />
      </div>

      {/* Points de chargement */}
      <div className="absolute bottom-16 flex gap-2 items-center">
        <span className="w-2 h-2 rounded-full bg-[#7F77DD] animate-[dotsAnim_1.2s_ease-in-out_0s_infinite]" />
        <span className="w-2 h-2 rounded-full bg-[#7F77DD] animate-[dotsAnim_1.2s_ease-in-out_0.2s_infinite]" />
        <span className="w-2 h-2 rounded-full bg-[#7F77DD] animate-[dotsAnim_1.2s_ease-in-out_0.4s_infinite]" />
      </div>
    </div>
  );
}