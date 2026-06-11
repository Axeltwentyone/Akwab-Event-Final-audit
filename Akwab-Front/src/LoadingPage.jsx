import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/Image/logo.png";

export default function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-[#F0ECF1] flex items-center justify-center">
      <img src={logo} alt="Akwab Event" className="w-32 animate-fadeInLeft" />
    </div>
  );
}
