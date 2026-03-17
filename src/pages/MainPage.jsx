// ══════════════════════════════════════════════════════════════════
// 메인 페이지 — 순백 배경 / 페르소나 원색 카드
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
      minHeight: "100vh", background: "#FFFFFF",
      display: "flex", flexDirection: "column",
    }}>
      {/* 앱 헤더 */}
      <header style={{
        padding: "28px 20px 0",
        maxWidth: 480, margin: "0 auto", width: "100%",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#1A1A2E", letterSpacing: -1 }}>
            복채
          </h1>
          <span style={{ fontSize: 13, color: "#AAAAAA", letterSpacing: 0.3 }}>
            AI 운세 · 사주 · 타로
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#BBBBBB", marginTop: 6 }}>
          당신의 페르소나를 선택하세요
        </p>
      </header>

      {/* 페르소나 카드 그리드 */}
      <main style={{
        flex: 1, maxWidth: 480, margin: "0 auto", width: "100%",
        padding: "20px 20px 40px",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 16, alignContent: "start",
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
                border: available ? `2px solid ${p.color}30` : "2px solid #F0F0F0",
                borderRadius: 20,
                padding: 0, cursor: available ? "pointer" : "default",
                textAlign: "left", overflow: "hidden",
                boxShadow: available ? `0 4px 24px ${p.color}18` : "0 2px 8px rgba(0,0,0,.04)",
                transition: "transform .15s, box-shadow .15s",
                opacity: available ? 1 : 0.5,
              }}
              onMouseEnter={e => {
                if (!available) return;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 12px 36px ${p.color}30`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = available
                  ? `0 4px 24px ${p.color}18`
                  : "0 2px 8px rgba(0,0,0,.04)";
              }}
            >
              {/* 캐릭터 일러스트 영역 — 페르소나 원색 배경 */}
              <div style={{
                width: "100%", paddingBottom: "100%", position: "relative",
                background: p.color,
                borderRadius: "18px 18px 0 0",
                overflow: "hidden",
              }}>
                {/* 캐릭터 이미지 or 이모지 */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url(${p.img})`,
                  backgroundSize: "cover", backgroundPosition: "center top",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 72, filter: "drop-shadow(0 4px 12px rgba(0,0,0,.18))" }}>
                    {p.emoji}
                  </span>
                </div>

                {/* 준비중 뱃지 */}
                {!available && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    background: "rgba(0,0,0,.45)", color: "#fff",
                    fontSize: 10, fontWeight: 700, padding: "3px 8px",
                    borderRadius: 20, letterSpacing: 0.5,
                  }}>준비중</div>
                )}

                {/* 오픈 뱃지 */}
                {available && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    background: "rgba(255,255,255,.9)", color: p.color,
                    fontSize: 10, fontWeight: 800, padding: "3px 8px",
                    borderRadius: 20, letterSpacing: 0.5,
                  }}>오픈</div>
                )}
              </div>

              {/* 정보 */}
              <div style={{ padding: "12px 14px 16px" }}>
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
        textAlign: "center", padding: "0 0 28px",
        color: "#DDDDDD", fontSize: 11,
      }}>
        복채 · AI 기반 운세 서비스
      </footer>
    </div>
  );
}
