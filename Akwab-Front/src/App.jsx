import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import Login from "./Authentification/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
