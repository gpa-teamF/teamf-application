import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import RemoveTrailingSlash from "./components/common/RemoveTrailingSlash";
import ProblemPage from "./components/pages/ProblemPage";
import Welcome from "./components/pages/WelcomePage";
import DifficultySelectPage from "./components/pages/DifficultySelectPage";
import ResultPage from "./components/pages/Resultpage";

function App() {
  return (
    <BrowserRouter>
      <RemoveTrailingSlash />
      <Routes>
        <Route path="/" element={<Welcome />} />{" "}
        {/* ようこそ画面へのルーティング */}
        <Route path="/problem" element={<ProblemPage />} />{" "}
        {/* 問題画面ページへのルーティング */}
        <Route
          path="/difficultySelect"
          element={<DifficultySelectPage />}
        />{" "}
        {/* 難易度選択画面ページへのルーティング */}
        <Route path="/result" element={<ResultPage />} />{" "}
        {/* リザルト画面ページへのルーティング */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
