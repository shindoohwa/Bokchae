import { useState } from "react";
import MainPage from "./pages/MainPage";
import SajuSession from "./pages/SajuSession";

export default function App() {
  const [page, setPage] = useState("main");

  const goTo = (p) => {
    window.scrollTo(0, 0);
    setPage(p);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>
      {page === "main" && <MainPage onStart={p => goTo(p)} />}
      {page === "saju" && <SajuSession onBack={() => goTo("main")} />}
    </div>
  );
}
