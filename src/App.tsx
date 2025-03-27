import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ProblemPage from "./components/pages/ProblemPage";
import Welcome from "./components/pages/WelcomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />{" "}
        {/* ようこそ画面へのルーティング */}
        <Route path="/problem" element={<ProblemPage />} />{" "}
        {/* 問題画面ページへのルーティング */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
