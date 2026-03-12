import { useState } from "react";
import { Stars } from "./components/ui";
import MainPage from "./pages/MainPage";
import SajuSession from "./pages/SajuSession";

export default function App() {
  const [page, setPage] = useState("main");

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg,#0a0518 0%,#130828 50%,#080510 100%)",
      fontFamily:"'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif",
      position:"relative", overflowX:"hidden",
    }}>
      <Stars/>
      {/* 상단 포인트 라인 */}
      <div style={{position:"fixed",top:0,left:0,right:0,height:2,zIndex:30,
        background:"linear-gradient(90deg,transparent,#7c3aed,#c084fc,#7c3aed,transparent)"}}/>

      {page==="main" && <MainPage onStart={p => setPage(p)}/>}
      {page==="saju" && <SajuSession onBack={() => setPage("main")}/>}
      {/* Phase 2: 아래 주석 해제하며 서비스 추가 */}
      {/* {page==="tarot" && <TarotSession onBack={() => setPage("main")}/>} */}
      {/* {page==="palm"  && <PalmSession  onBack={() => setPage("main")}/>} */}
      {/* {page==="name"  && <NameSession  onBack={() => setPage("main")}/>} */}
    </div>
  );
}
