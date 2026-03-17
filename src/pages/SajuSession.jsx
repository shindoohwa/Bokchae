import { useState, useEffect, useRef } from "react";
import { askClaude } from "../utils/api";
import { PERSONA } from "../components/ui";
import {
  천간오행, 지지오행, 오행색,
  getYearGanji, getMonthGanji, getDayGanji, getHourGanji,
  analyzeOhaeng, getDominantOhaeng, getDaeun,
} from "../utils/saju";

const PERSONA_KEY = "taeo";
const p = PERSONA[PERSONA_KEY];

const SECTION_ICONS = ["🌟", "🧠", "📅", "💕", "💰", "🌿", "💬"];

const LOADING_TEXTS = [
  "천간과 지지를 살피는 중...",
  "오행의 균형을 분석하는 중...",
  "타고난 기운을 읽는 중...",
  "운명의 실타래를 풀어가는 중...",
  "당신만의 사주를 완성하는 중...",
];

// ── 웹툰 말풍선 컴포넌트
function WebtoonBubble({ section, icon, idx }) {
  const isRight = idx % 2 === 1;

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      marginBottom: 28,
      flexDirection: isRight ? "row-reverse" : "row",
      animation: "fadeUp .5s ease",
    }}>
      {/* 캐릭터 */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{
          width: 54, height: 54, borderRadius: "50%",
          background: p.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26,
          boxShadow: `0 4px 16px ${p.color}44`,
        }}>☯️</div>
        <span style={{ fontSize: 10, color: p.color, fontWeight: 700, letterSpacing: 0.3 }}>태오</span>
      </div>

      {/* 말풍선 */}
      <div style={{ flex: 1, position: "relative" }}>
        {/* 꼬리 외곽 */}
        <div style={{
          position: "absolute",
          ...(isRight ? { right: -14 } : { left: -14 }),
          top: 20,
          width: 0, height: 0,
          borderTop: "9px solid transparent",
          borderBottom: "9px solid transparent",
          ...(isRight
            ? { borderLeft: "14px solid #1A1A2E" }
            : { borderRight: "14px solid #1A1A2E" }),
        }} />
        {/* 꼬리 내부 */}
        <div style={{
          position: "absolute",
          ...(isRight ? { right: -10 } : { left: -10 }),
          top: 22,
          width: 0, height: 0,
          borderTop: "7px solid transparent",
          borderBottom: "7px solid transparent",
          ...(isRight
            ? { borderLeft: "10px solid #FFFFFF" }
            : { borderRight: "10px solid #FFFFFF" }),
        }} />

        {/* 말풍선 본체 */}
        <div style={{
          background: "#FFFFFF",
          border: "2px solid #1A1A2E",
          borderRadius: isRight ? "16px 16px 0 16px" : "16px 16px 16px 0",
          padding: "16px 18px",
          boxShadow: "3px 4px 0 #1A1A2E22",
        }}>
          <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: p.color, letterSpacing: -0.3 }}>
              {section.title}
            </span>
          </div>
          <p style={{
            margin: 0, fontSize: 14.5, lineHeight: 2,
            color: "#222", whiteSpace: "pre-wrap",
          }}>
            {section.body}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── 사주 원국 카드
function SajuChart({ result }) {
  return (
    <div style={{
      marginBottom: 28,
      animation: "fadeUp .5s ease",
    }}>
      {/* 캐릭터 + 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: p.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>☯️</div>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#1A1A2E" }}>📋 사주 원국 & 대운</span>
      </div>

      <div style={{
        background: "#FFFFFF",
        border: "2px solid #1A1A2E",
        borderRadius: 16,
        padding: "18px",
        boxShadow: "3px 4px 0 #1A1A2E1A",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${result.시 ? 4 : 3}, 1fr)`,
          gap: 8, marginBottom: 16,
        }}>
          {[
            { l: "년주", g: result.년, r: "초년" },
            { l: "월주", g: result.월, r: "청년" },
            { l: "일주", g: result.일, r: "중년" },
            ...(result.시 ? [{ l: "시주", g: result.시, r: "말년" }] : []),
          ].map(({ l, g, r }) => (
            <div key={l} style={{
              background: "#FAFAF8", borderRadius: 10,
              padding: "10px 4px", textAlign: "center",
              border: "1px solid #E8E8E8",
            }}>
              <div style={{ fontSize: 10, color: "#AAAAAA", marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 오행색[천간오행[g.간]] }}>{g.간}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 오행색[지지오행[g.지]] }}>{g.지}</div>
              <div style={{ fontSize: 9, color: "#CCCCCC", marginTop: 3 }}>{r}</div>
            </div>
          ))}
        </div>

        <div style={{ overflowX: "auto", paddingBottom: 4 }}>
          <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
            {result.daeun.map((du, i) => (
              <div key={i} style={{
                minWidth: 52, background: "#FAFAF8",
                border: "1px solid #E8E8E8",
                borderRadius: 8, padding: "8px 4px", textAlign: "center",
              }}>
                <div style={{ fontSize: 9, color: "#CCCCCC" }}>{du.시작년}~</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 오행색[천간오행[du.간]] }}>{du.간}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 오행색[지지오행[du.지]] }}>{du.지}</div>
                <div style={{ fontSize: 9, color: "#AAAAAA", marginTop: 1 }}>{du.나이}대</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Field 래퍼
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 8 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const baseInput = {
  padding: "13px 16px", borderRadius: 12,
  background: "#FFF", border: "1.5px solid #E8E8E8",
  color: "#1A1A2E", fontSize: 14, outline: "none",
  boxSizing: "border-box", transition: "border-color .2s",
  width: "100%",
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function SajuSession({ onBack }) {
  const [step, setStep] = useState("intro");
  const [ud, setUd] = useState({ name: "", gender: "여", year: "", month: "", day: "", hour: "" });
  const [sections, setSections] = useState([]);
  const [shown, setShown] = useState(0);
  const [result, setResult] = useState(null);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (step !== "reading") return;
    const id = setInterval(() => setLoadingIdx(i => (i + 1) % LOADING_TEXTS.length), 2200);
    return () => clearInterval(id);
  }, [step]);

  const scroll = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);

  const handleSubmit = async () => {
    const { name, gender, year, month, day, hour } = ud;
    const y = parseInt(year), m = parseInt(month), d = parseInt(day);
    if (!name.trim() || !y || !m || !d) {
      setError("이름과 생년월일을 입력해주세요.");
      return;
    }
    setError("");
    setStep("reading");

    const h = hour ? parseInt(hour) : null;
    const 년 = getYearGanji(y), 월 = getMonthGanji(y, m), 일 = getDayGanji(y, m, d);
    const 시 = h !== null ? getHourGanji(h, 일.간) : null;
    const saju = [년, 월, 일, ...(시 ? [시] : [])];
    const ohaeng = analyzeOhaeng(saju);
    const daeun = getDaeun(년, 월, gender, y);
    setResult({ 년, 월, 일, 시, ohaeng, daeun });

    try {
      localStorage.setItem("bokchae_ohaeng", JSON.stringify({
        ohaeng, dominant: getDominantOhaeng(ohaeng), name,
      }));
    } catch {}

    const sajuStr = `년주:${년.간}${년.지} 월주:${월.간}${월.지} 일주:${일.간}${일.지}${시 ? ` 시주:${시.간}${시.지}` : ""}`;
    const ohStr = Object.entries(ohaeng).map(([k, v]) => `${k}(${v})`).join(" ");

    try {
      const text = await askClaude({
        system: "당신은 태오입니다. 사주팔자를 읽는 AI 페르소나로서, 차분하고 통찰력 있는 말투로 1인칭 대화체로 한국어로 답하세요.",
        prompt: `[의뢰인] ${name}(${gender}성), ${year}년생\n[사주] ${sajuStr}\n[오행] ${ohStr}\n\n아래 순서대로 ## 제목 형식으로 사주를 풀어주세요:\n## 타고난 기운\n## 성격과 기질\n## 올해의 운세 (${new Date().getFullYear()}년)\n## 사랑과 인연\n## 재물과 직업\n## 건강\n## 태오의 한마디\n\n각 항목 3~4문장, ${name}님을 자연스럽게 포함, 차분하고 진지한 말투로.`,
      });
      const secs = text.split(/(?=^## )/m).filter(Boolean).map(s => {
        const lines = s.trim().split("\n");
        return { title: lines[0].replace("## ", "").trim(), body: lines.slice(1).join("\n").trim() };
      });
      setSections(secs);
      setStep("result");
      for (let i = 0; i < secs.length; i++) {
        await new Promise(r => setTimeout(r, i === 0 ? 400 : 1000));
        setShown(i + 1);
        scroll();
      }
    } catch {
      setStep("form");
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // ━━━ INTRO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (step === "intro") return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 20px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#BBBBBB", fontSize: 13 }}>
          ← 뒤로
        </button>
      </div>

      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 28px 64px",
        animation: "fadeUp .6s ease",
      }}>
        <div style={{
          width: 180, height: 180, borderRadius: "50%",
          background: p.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 88, marginBottom: 36,
          boxShadow: `0 24px 64px ${p.color}44`,
        }}>☯️</div>

        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: p.color, fontWeight: 700, letterSpacing: 3, marginBottom: 10 }}>
            사주팔자
          </div>
          <h2 style={{ fontSize: 42, fontWeight: 900, color: "#1A1A2E", letterSpacing: -2, margin: "0 0 14px" }}>
            태오
          </h2>
          <p style={{ fontSize: 16, color: "#888", lineHeight: 1.9, maxWidth: 240, margin: "0 auto" }}>
            당신의 사주팔자,<br />태오가 직접 읽어드립니다
          </p>
        </div>

        <button onClick={() => setStep("form")} style={{
          padding: "18px 60px",
          background: p.color, color: "#FFF",
          border: "none", borderRadius: 16,
          fontSize: 17, fontWeight: 800, cursor: "pointer",
          boxShadow: `0 10px 36px ${p.color}44`,
          letterSpacing: -0.3,
        }}>
          사주 보기
        </button>
      </div>
    </div>
  );

  // ━━━ FORM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (step === "form") return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      {/* 캐릭터 배너 */}
      <div style={{ background: p.color, padding: "20px 20px 28px", flexShrink: 0 }}>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,.2)", border: "none",
          color: "#FFF", borderRadius: 8, padding: "6px 14px",
          cursor: "pointer", fontSize: 13, fontWeight: 600,
        }}>← 뒤로</button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "rgba(255,255,255,.22)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 30,
          }}>☯️</div>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", letterSpacing: 1.5 }}>사주팔자</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#FFF", letterSpacing: -0.5 }}>태오</div>
          </div>
        </div>

        {/* 말풍선 */}
        <div style={{ position: "relative", marginTop: 18 }}>
          {/* 꼬리 */}
          <div style={{
            position: "absolute", left: 30, top: -10,
            width: 0, height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "10px solid rgba(255,255,255,.2)",
          }} />
          <div style={{
            background: "rgba(255,255,255,.2)",
            borderRadius: "0 14px 14px 14px",
            padding: "13px 16px",
            color: "#FFF", fontSize: 14, lineHeight: 1.8,
          }}>
            몇 가지를 알려주시면,<br />당신의 운명을 읽어드리겠습니다.
          </div>
        </div>
      </div>

      {/* 폼 */}
      <div style={{
        flex: 1, padding: "28px 20px 48px",
        maxWidth: 480, margin: "0 auto", width: "100%",
        boxSizing: "border-box",
      }}>
        <Field label="이름">
          <input
            value={ud.name}
            onChange={e => setUd(u => ({ ...u, name: e.target.value }))}
            placeholder="이름을 입력하세요"
            style={baseInput}
            onFocus={e => e.target.style.borderColor = p.color}
            onBlur={e => e.target.style.borderColor = "#E8E8E8"}
          />
        </Field>

        <Field label="성별">
          <div style={{ display: "flex", gap: 10 }}>
            {[["여", "👩 여성"], ["남", "👨 남성"]].map(([g, label]) => (
              <button key={g} onClick={() => setUd(u => ({ ...u, gender: g }))} style={{
                flex: 1, padding: "13px", borderRadius: 12, cursor: "pointer",
                border: ud.gender === g ? `2px solid ${p.color}` : "2px solid #E8E8E8",
                background: ud.gender === g ? `${p.color}12` : "#FFF",
                color: ud.gender === g ? p.color : "#999",
                fontSize: 15, fontWeight: 700, transition: "all .15s",
              }}>{label}</button>
            ))}
          </div>
        </Field>

        <Field label="생년월일">
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { key: "year",  ph: "년도 (1995)", flex: 2 },
              { key: "month", ph: "월",           flex: 1 },
              { key: "day",   ph: "일",           flex: 1 },
            ].map(({ key, ph, flex }) => (
              <input key={key}
                value={ud[key]}
                onChange={e => setUd(u => ({ ...u, [key]: e.target.value }))}
                placeholder={ph} type="number"
                style={{ ...baseInput, flex, width: "auto" }}
                onFocus={e => e.target.style.borderColor = p.color}
                onBlur={e => e.target.style.borderColor = "#E8E8E8"}
              />
            ))}
          </div>
        </Field>

        <Field label={<>태어난 시각 <span style={{ color: "#CCC", fontWeight: 400 }}>(선택, 0~23)</span></>}>
          <input
            value={ud.hour}
            onChange={e => setUd(u => ({ ...u, hour: e.target.value }))}
            placeholder="모르면 비워두세요" type="number"
            style={baseInput}
            onFocus={e => e.target.style.borderColor = p.color}
            onBlur={e => e.target.style.borderColor = "#E8E8E8"}
          />
        </Field>

        {error && <p style={{ color: "#E74C3C", fontSize: 13, marginBottom: 16, marginTop: -8 }}>{error}</p>}

        <button onClick={handleSubmit} style={{
          width: "100%", padding: "17px",
          background: p.color, color: "#FFF",
          border: "none", borderRadius: 14,
          fontSize: 16, fontWeight: 800, cursor: "pointer",
          boxShadow: `0 8px 28px ${p.color}38`,
          letterSpacing: -0.3,
        }}>
          태오에게 사주 풀어달라기 ✨
        </button>
      </div>
    </div>
  );

  // ━━━ READING (로딩) ━━━━━━━━━━━━━━━━━━━━━━
  if (step === "reading") return (
    <div style={{
      minHeight: "100vh", background: "#FFFFFF",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
    }}>
      <div style={{
        width: 136, height: 136, borderRadius: "50%",
        background: p.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 66, marginBottom: 36,
        boxShadow: `0 0 0 18px ${p.color}18, 0 0 0 36px ${p.color}0A`,
        animation: "pulse 2s ease-in-out infinite",
      }}>☯️</div>

      <p key={loadingIdx} style={{
        fontSize: 15, color: p.color, fontWeight: 700,
        marginBottom: 10, textAlign: "center",
        animation: "fadeIn .5s ease",
      }}>
        {LOADING_TEXTS[loadingIdx]}
      </p>
      <p style={{ fontSize: 13, color: "#CCCCCC", textAlign: "center" }}>잠시만 기다려주세요</p>
    </div>
  );

  // ━━━ RESULT (웹툰 스트립) ━━━━━━━━━━━━━━━━
  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      {/* 스티키 헤더 */}
      <div style={{
        background: p.color, padding: "16px 20px",
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(255,255,255,.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>☯️</div>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.65)", letterSpacing: 1 }}>사주팔자</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#FFF" }}>태오의 풀이</div>
        </div>
      </div>

      {/* 인사 말풍선 */}
      <div style={{ padding: "24px 20px 8px", maxWidth: 640, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{
          display: "flex", gap: 14, alignItems: "flex-start",
          animation: "fadeUp .5s ease",
        }}>
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 54, height: 54, borderRadius: "50%",
              background: p.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26,
              boxShadow: `0 4px 16px ${p.color}44`,
            }}>☯️</div>
            <span style={{ fontSize: 10, color: p.color, fontWeight: 700 }}>태오</span>
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{
              position: "absolute", left: -14, top: 20,
              width: 0, height: 0,
              borderTop: "9px solid transparent",
              borderBottom: "9px solid transparent",
              borderRight: "14px solid #1A1A2E",
            }} />
            <div style={{
              position: "absolute", left: -10, top: 22,
              width: 0, height: 0,
              borderTop: "7px solid transparent",
              borderBottom: "7px solid transparent",
              borderRight: "10px solid #FFFFFF",
            }} />
            <div style={{
              background: "#FFFFFF",
              border: "2px solid #1A1A2E",
              borderRadius: "16px 16px 16px 0",
              padding: "14px 18px",
              boxShadow: "3px 4px 0 #1A1A2E22",
            }}>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.9, color: "#222" }}>
                {ud.name}님의 사주를 모두 읽었습니다.<br />지금부터 하나하나 풀어드리겠습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 웹툰 섹션들 */}
      <div style={{
        flex: 1, padding: "16px 20px 48px",
        maxWidth: 640, margin: "0 auto", width: "100%",
        boxSizing: "border-box",
      }}>
        {sections.slice(0, shown).map((sec, i) => (
          <WebtoonBubble key={i} section={sec} icon={SECTION_ICONS[i] || "✨"} idx={i} />
        ))}

        {shown >= sections.length && sections.length > 0 && result && (
          <SajuChart result={result} />
        )}

        {shown >= sections.length && sections.length > 0 && (
          <button onClick={onBack} style={{
            width: "100%", padding: "17px",
            background: p.color, color: "#FFF",
            border: "none", borderRadius: 14,
            fontSize: 15, fontWeight: 800, cursor: "pointer",
            boxShadow: `0 8px 28px ${p.color}38`,
            animation: "fadeUp .5s ease",
          }}>
            처음으로 돌아가기
          </button>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
