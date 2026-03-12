// ══════════════════════════════════════════════════════════════════
// 메인 페이지 — 웹툰 페르소나 카드 스타일
// ══════════════════════════════════════════════════════════════════
import { PERSONA } from "../components/ui";

const SERVICES = [
  { id: "saju",  persona: "taeo",   available: true  },
  { id: "tarot", persona: "luna",   available: false },
  { id: "palm",  persona: "kairos", available: false },
  { id: "name",  persona: "gaon",   available: false },
];

export default function MainPage({ onStart }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#F7F8FA",
      display: "flex", flexDirection: "column",
    }}>
      {/* 앱 헤더 */}
      <header style={{
        padding: "20px 20px 0",
        maxWidth: 480, margin: "0 auto", width: "100%",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1A1A2E", letterSpacing: -1 }}>
            복채
          </h1>
          <span style={{ fontSize: 13, color: "#999", letterSpacing: 0.3 }}>
            AI 운세 · 사주 · 타로
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#AAAAAA", marginTop: 4 }}>
          당신의 페르소나를 선택하세요
        </p>
      </header>

      {/* 페르소나 카드 그리드 */}
      <main style={{
        flex: 1, maxWidth: 480, margin: "0 auto", width: "100%",
        padding: "20px 20px 40px",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 14, alignContent: "start",
      }}>
        {SERVICES.map(({ id, persona, available }) => {
          const p = PERSONA[persona];
          return (
            <button
              key={id}
              onClick={() => available && onStart(id)}
              disabled={!available}
              style={{
                background: "#FFFFFF",
                border: available ? `2px solid ${p.color}33` : "2px solid #F0F0F0",
                borderRadius: 20,
                padding: 0, cursor: available ? "pointer" : "default",
                textAlign: "left", overflow: "hidden",
                boxShadow: available ? "0 4px 20px rgba(0,0,0,.07)" : "none",
                transition: "transform .15s, box-shadow .15s",
                opacity: available ? 1 : 0.55,
              }}
              onMouseEnter={e => {
                if (!available) return;
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,.12)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = available ? "0 4px 20px rgba(0,0,0,.07)" : "none";
              }}
            >
              {/* 캐릭터 일러스트 영역 */}
              <div style={{
                width: "100%", paddingBottom: "100%", position: "relative",
                background: p.bg,
                borderRadius: "18px 18px 0 0",
                overflow: "hidden",
              }}>
                {/* 캐릭터 이미지 */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url(${p.img})`,
                  backgroundSize: "cover", backgroundPosition: "center top",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {/* 이미지 없을 때 이모지 fallback */}
                  <span style={{ fontSize: 60 }}>{p.emoji}</span>
                </div>

                {/* 준비중 뱃지 */}
                {!available && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    background: "rgba(0,0,0,.55)", color: "#fff",
                    fontSize: 10, fontWeight: 700, padding: "3px 8px",
                    borderRadius: 20, letterSpacing: 0.5,
                  }}>준비중</div>
                )}

                {/* 오픈 뱃지 */}
                {available && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    background: p.color, color: "#fff",
                    fontSize: 10, fontWeight: 700, padding: "3px 8px",
                    borderRadius: 20, letterSpacing: 0.5,
                  }}>오픈</div>
                )}
              </div>

              {/* 정보 */}
              <div style={{ padding: "12px 14px 14px" }}>
                <div style={{
                  fontSize: 11, color: p.color, fontWeight: 700,
                  letterSpacing: 0.5, marginBottom: 3,
                }}>{p.role}</div>
                <div style={{
                  fontSize: 18, fontWeight: 800, color: "#1A1A2E",
                  letterSpacing: -0.5,
                }}>{p.name}</div>
              </div>
            </button>
          );
        })}
      </main>

      {/* 하단 푸터 */}
      <footer style={{
        textAlign: "center", padding: "0 0 24px",
        color: "#CCCCCC", fontSize: 11,
      }}>
        복채 · AI 기반 운세 서비스
      </footer>
    </div>
  );
}
