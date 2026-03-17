import { useState, useEffect, useRef } from "react";
import { askClaude } from "../utils/api";
import {
  PERSONA, CharBubble, UserBubble, TypingBubble,
  ChatInput, ChoiceButtons, SessionHeader,
} from "../components/ui";
import {
  천간오행, 지지오행, 오행색,
  getYearGanji, getMonthGanji, getDayGanji, getHourGanji,
  analyzeOhaeng, getDominantOhaeng, getDaeun,
} from "../utils/saju";

const PERSONA_KEY = "taeo";
const p = PERSONA[PERSONA_KEY];

// 오행 → localStorage 저장
function saveOhaengProfile(ohaeng, name) {
  try {
    localStorage.setItem("bokchae_ohaeng", JSON.stringify({
      ohaeng, dominant: getDominantOhaeng(ohaeng), name,
    }));
  } catch {}
}

const SECTION_ICONS = ["🌟", "🧠", "📅", "💕", "💰", "🌿", "💬"];

export default function SajuSession({ onBack }) {
  const [step, setStep] = useState("init");
  const [ud, setUd] = useState({ name:"", gender:"", year:"", month:"", day:"", hour:"" });
  const [inp, setInp] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [result, setResult] = useState(null);
  const [sections, setSections] = useState([]);
  const [shown, setShown] = useState(0);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const scroll = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  const addC = text => { setMsgs(m => [...m, { t:"c", text, id: Date.now() + Math.random() }]); scroll(); };
  const addU = text => { setMsgs(m => [...m, { t:"u", text, id: Date.now() + Math.random() }]); scroll(); };

  useEffect(() => {
    setTimeout(() => {
      addC("안녕하세요.\n저는 태오입니다. 사주팔자로 당신의 운명을 읽어드릴게요.\n\n먼저 이름을 알려주시겠어요?");
      setStep("name");
    }, 600);
  }, []);

  const doName = () => {
    if (!inp.trim()) return;
    const name = inp.trim();
    setUd(u => ({...u, name})); addU(name); setInp("");
    setTimeout(() => { addC(`${name}님이군요.\n성별을 알려주세요.`); setStep("gender"); }, 400);
  };
  const doGender = g => {
    setUd(u => ({...u, gender:g})); addU(g === "여" ? "여성" : "남성");
    setTimeout(() => { addC("태어난 연도를 알려주세요. (예: 1995)"); setStep("year"); }, 400);
  };
  const doYear = () => {
    const y = parseInt(inp);
    if (!y || y < 1900 || y > 2010) return;
    setUd(u => ({...u, year:inp})); addU(`${inp}년`); setInp("");
    setTimeout(() => { addC("태어난 월을 알려주세요. (1~12)"); setStep("month"); }, 400);
  };
  const doMonth = () => {
    const m = parseInt(inp);
    if (!m || m < 1 || m > 12) return;
    setUd(u => ({...u, month:inp})); addU(`${inp}월`); setInp("");
    setTimeout(() => { addC("태어난 일을 알려주세요. (1~31)"); setStep("day"); }, 400);
  };
  const doDay = () => {
    const d = parseInt(inp);
    if (!d || d < 1 || d > 31) return;
    setUd(u => ({...u, day:inp})); addU(`${inp}일`); setInp("");
    setTimeout(() => { addC("태어난 시각을 알고 계신가요?"); setStep("hour_ask"); }, 400);
  };
  const doHourAsk = know => {
    if (know) {
      addU("알고 있어요");
      setTimeout(() => { addC("태어난 시각을 입력해주세요. (0~23)"); setStep("hour"); }, 400);
    } else {
      setUd(u => ({...u, hour:""})); addU("모르겠어요");
      setTimeout(() => doConfirm({...ud, hour:""}), 400);
    }
  };
  const doHour = () => {
    const h = parseInt(inp);
    if (isNaN(h) || h < 0 || h > 23) return;
    const updated = {...ud, hour:inp};
    setUd(updated); addU(`${inp}시`); setInp("");
    setTimeout(() => doConfirm(updated), 400);
  };
  const doConfirm = info => {
    const u = info || ud;
    addC(`확인할게요.\n\n이름: ${u.name}\n성별: ${u.gender}성\n생년월일: ${u.year}년 ${u.month}월 ${u.day}일${u.hour ? ` ${u.hour}시` : ""}\n\n이대로 사주를 풀어드릴까요?`);
    setUd(u); setStep("confirm");
  };

  const doStart = async u => {
    addU("네, 풀어주세요");
    const y = parseInt(u.year), m = parseInt(u.month), d = parseInt(u.day);
    const h = u.hour ? parseInt(u.hour) : null;
    const 년 = getYearGanji(y), 월 = getMonthGanji(y, m), 일 = getDayGanji(y, m, d);
    const 시 = h !== null ? getHourGanji(h, 일.간) : null;
    const saju = [년, 월, 일, ...(시 ? [시] : [])];
    const ohaeng = analyzeOhaeng(saju);
    const daeun = getDaeun(년, 월, u.gender, y);
    setResult({ 년, 월, 일, 시, ohaeng, daeun });
    saveOhaengProfile(ohaeng, u.name);
    setLoading(true); setStep("reading"); scroll();

    const sajuStr = `년주:${년.간}${년.지} 월주:${월.간}${월.지} 일주:${일.간}${일.지}${시 ? ` 시주:${시.간}${시.지}` : ""}`;
    const ohStr = Object.entries(ohaeng).map(([k,v]) => `${k}(${v})`).join(" ");

    try {
      const text = await askClaude({
        system: "당신은 태오입니다. 사주팔자를 읽는 AI 페르소나로서, 차분하고 통찰력 있는 말투로 1인칭 대화체로 한국어로 답하세요.",
        prompt: `[의뢰인] ${u.name}(${u.gender}성), ${u.year}년생\n[사주] ${sajuStr}\n[오행] ${ohStr}\n\n아래 순서대로 ## 제목 형식으로 사주를 풀어주세요:\n## 타고난 기운\n## 성격과 기질\n## 올해의 운세 (${new Date().getFullYear()}년)\n## 사랑과 인연\n## 재물과 직업\n## 건강\n## 태오의 한마디\n\n각 항목 3~4문장, ${u.name}님을 자연스럽게 포함, 차분하고 진지한 말투로.`,
      });
      const secs = text.split(/(?=^## )/m).filter(Boolean).map(s => {
        const lines = s.trim().split("\n");
        return { title: lines[0].replace("## ", "").trim(), body: lines.slice(1).join("\n").trim() };
      });
      setSections(secs); setLoading(false); setStep("reveal");
      for (let i = 0; i < secs.length; i++) {
        await new Promise(r => setTimeout(r, i === 0 ? 300 : 900));
        setShown(i + 1); scroll();
      }
      setStep("done");
    } catch {
      setLoading(false);
      addC("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      <SessionHeader
        title="태오의 사주풀이"
        subtitle="사주팔자 · 오행 분석"
        onBack={onBack}
        persona="taeo"
      />

      {/* 메시지 영역 */}
      <div style={{ flex: 1, maxWidth: 640, margin: "0 auto", width: "100%", padding: "0 16px 120px" }}>

        {msgs.map(msg =>
          msg.t === "c"
            ? <CharBubble key={msg.id} persona="taeo" text={msg.text} />
            : <UserBubble key={msg.id} text={msg.text} />
        )}

        {loading && <TypingBubble persona="taeo" />}

        {/* 사주 풀이 섹션 순차 공개 */}
        {(step === "reveal" || step === "done") && sections.slice(0, shown).map((sec, i) => (
          <CharBubble key={i} persona="taeo">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{SECTION_ICONS[i] || "✨"}</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#1A1A2E" }}>{sec.title}</span>
            </div>
            <p style={{ color: "#333", margin: 0, lineHeight: 1.9, fontSize: 14, whiteSpace: "pre-wrap" }}>
              {sec.body}
            </p>
          </CharBubble>
        ))}

        {/* 사주 원국 & 대운 */}
        {step === "done" && result && (
          <CharBubble persona="taeo">
            <p style={{ fontWeight: 700, fontSize: 13, color: "#1A1A2E", marginBottom: 12 }}>📋 사주 원국 & 대운</p>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${result.시 ? 4 : 3}, 1fr)`,
              gap: 6, marginBottom: 14,
            }}>
              {[
                { l:"년주", g:result.년, r:"초년" },
                { l:"월주", g:result.월, r:"청년" },
                { l:"일주", g:result.일, r:"중년" },
                ...(result.시 ? [{ l:"시주", g:result.시, r:"말년" }] : []),
              ].map(({ l, g, r }) => (
                <div key={l} style={{
                  background: "#F7F8FA", borderRadius: 10,
                  padding: "10px 4px", textAlign: "center",
                  border: "1px solid #EEEEEE",
                }}>
                  <div style={{ fontSize: 10, color: "#AAAAAA", marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 오행색[천간오행[g.간]] }}>{g.간}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 오행색[지지오행[g.지]] }}>{g.지}</div>
                  <div style={{ fontSize: 9, color: "#CCCCCC", marginTop: 3 }}>{r}</div>
                </div>
              ))}
            </div>
            <div style={{ overflowX: "auto", paddingBottom: 4 }}>
              <div style={{ display: "flex", gap: 5, minWidth: "max-content" }}>
                {result.daeun.map((du, i) => (
                  <div key={i} style={{
                    minWidth: 50, background: "#FFFFFF",
                    border: "1px solid #EEEEEE",
                    borderRadius: 8, padding: "7px 4px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 9, color: "#CCCCCC" }}>{du.시작년}~</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 오행색[천간오행[du.간]] }}>{du.간}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 오행색[지지오행[du.지]] }}>{du.지}</div>
                    <div style={{ fontSize: 9, color: "#AAAAAA", marginTop: 1 }}>{du.나이}대</div>
                  </div>
                ))}
              </div>
            </div>
          </CharBubble>
        )}

        {step === "done" && (
          <CharBubble persona="taeo" text="풀이를 마칩니다. 길한 날을 고르는 데 도움이 되길 바랍니다." />
        )}
        {step === "done" && (
          <button onClick={onBack} style={{
            width: "100%", padding: "14px", borderRadius: 12,
            background: p.color, border: "none",
            color: "#FFFFFF", fontSize: 15, fontWeight: 700,
            cursor: "pointer", marginTop: 4,
          }}>처음으로 돌아가기</button>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 하단 입력 고정 */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(255,255,255,.97)", borderTop: `1px solid ${p.color}22`,
        padding: "12px 16px", backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {step === "name"      && <ChatInput placeholder="이름을 입력하세요" value={inp} onChange={setInp} onSubmit={doName} color={p.color} />}
          {step === "gender"    && <ChoiceButtons color={p.color} options={[
            { label:"여성", emoji:"👩", onClick:()=>doGender("여") },
            { label:"남성", emoji:"👨", onClick:()=>doGender("남") },
          ]}/>}
          {step === "year"      && <ChatInput placeholder="출생 연도 (예: 1995)" value={inp} onChange={setInp} onSubmit={doYear} type="number" color={p.color} />}
          {step === "month"     && <ChatInput placeholder="출생 월 (1~12)" value={inp} onChange={setInp} onSubmit={doMonth} type="number" color={p.color} />}
          {step === "day"       && <ChatInput placeholder="출생 일 (1~31)" value={inp} onChange={setInp} onSubmit={doDay} type="number" color={p.color} />}
          {step === "hour_ask"  && <ChoiceButtons color={p.color} options={[
            { label:"시각을 알고 있어요", emoji:"⏰", onClick:()=>doHourAsk(true) },
            { label:"잘 모르겠어요",     emoji:"❓", onClick:()=>doHourAsk(false) },
          ]}/>}
          {step === "hour"      && <ChatInput placeholder="태어난 시각 (0~23)" value={inp} onChange={setInp} onSubmit={doHour} type="number" color={p.color} />}
          {step === "confirm"   && (
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => doStart(ud)} style={{
                flex: 2, padding: "13px", borderRadius: 12, cursor: "pointer",
                background: p.color, border: "none",
                color: "white", fontSize: 15, fontWeight: 700,
              }}>사주 풀어주세요 ✨</button>
              <button onClick={() => {
                setMsgs([]); setUd({ name:"", gender:"", year:"", month:"", day:"", hour:"" });
                setTimeout(() => { addC("다시 시작할게요.\n이름을 알려주세요."); setStep("name"); }, 200);
              }} style={{
                flex: 1, padding: "13px", borderRadius: 12, cursor: "pointer",
                background: "#F0F0F0", border: "none", color: "#666", fontSize: 14,
              }}>다시 입력</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
