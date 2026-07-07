import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import BoardPage from "./pages/BoardPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import LandingPage from "./pages/LandingPage";
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/tablero/:id" element={<BoardPage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
        <Route path="/login/oauth2/code/google" element={<OAuthCallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App