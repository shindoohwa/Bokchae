import { useState } from "react";
import MainPage from "./pages/MainPage";
import SajuSession from "./pages/SajuSession";

export default function App() {
  const [page, setPage] = useState("main");

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>
      {page === "main" && <MainPage onStart={p => setPage(p)} />}
      {page === "saju" && <SajuSession onBack={() => setPage("main")} />}
    </div>
  );
}
