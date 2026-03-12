import { useState, useEffect, useRef } from "react";
import { askClaude } from "../utils/api";
import {
  CharRow, UserRow, TypingRow, InputRow, ChoiceRow, SessionHeader
} from "../components/ui";
import {
  천간오행, 지지오행, 오행색, 오행이모지,
  getYearGanji, getMonthGanji, getDayGanji, getHourGanji,
  analyzeOhaeng, getDominantOhaeng, getDaeun
} from "../utils/saju";

// 사주 세션에서 사용하는 캐릭터 설정
const CHAR_SRC = "/character.png";
const CHAR_NAME = "월령선녀";

// 오행 → localStorage에 프로필 저장 (타로 등 다른 서비스에서 참조)
function saveOhaengProfile(ohaeng, name) {
  try {
    const dominant = getDominantOhaeng(ohaeng);
    localStorage.setItem("bokchae_ohaeng", JSON.stringify({ ohaeng, dominant, name }));
  } catch {}
}

export default function SajuSession({ onBack }) {
  const [step, setStep] = useState("init");
  const [ud, setUd] = useState({ name:"", gender:"", year:"", month:"", day:"", hour:"" });
  const [inp, setInp] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [result, setResult] = useState(null);
  const [sections, setSections] = useState([]);
  const [shown, setShown] = useState(0);
  const [loadingAI, setLoadingAI] = useState(false);
  const bottomRef = useRef(null);

  const scroll = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:"smooth" }), 80);
  const addC = (text) => { setMsgs(p => [...p, { t:"c", text, id:Date.now()+Math.random() }]); scroll(); };
  const addU = (text) => { setMsgs(p => [...p, { t:"u", text, id:Date.now()+Math.random() }]); scroll(); };

  useEffect(() => {
    setTimeout(() => {
      addC("어서 오세요...\n달빛이 당신을 이곳으로 이끌었군요.\n\n저는 월령선녀입니다. 사주팔자로 당신 운명의 실을 읽어드리겠습니다.\n\n먼저 이름을 알려주시겠어요?");
      setStep("name");
    }, 700);
  }, []);

  const doName = () => {
    if (!inp.trim()) return;
    const name = inp.trim(); setUd(p => ({...p,name})); addU(name); setInp("");
    setTimeout(() => { addC(`${name}님이시군요, 좋은 이름입니다.\n\n성별을 알려주세요.`); setStep("gender"); }, 500);
    scroll();
  };
  const doGender = (g) => {
    setUd(p => ({...p,gender:g})); addU(g==="여"?"여성":"남성");
    setTimeout(() => { addC("알겠습니다.\n\n태어난 연도를 알려주세요. (예: 1995)"); setStep("year"); }, 500);
    scroll();
  };
  const doYear = () => {
    const y = parseInt(inp); if (!y||y<1900||y>2010) return;
    setUd(p => ({...p,year:inp})); addU(`${inp}년`); setInp("");
    setTimeout(() => { addC("태어난 월을 알려주세요. (1~12)"); setStep("month"); }, 500);
    scroll();
  };
  const doMonth = () => {
    const m = parseInt(inp); if (!m||m<1||m>12) return;
    setUd(p => ({...p,month:inp})); addU(`${inp}월`); setInp("");
    setTimeout(() => { addC("태어난 일을 알려주세요. (1~31)"); setStep("day"); }, 500);
    scroll();
  };
  const doDay = () => {
    const d = parseInt(inp); if (!d||d<1||d>31) return;
    setUd(p => ({...p,day:inp})); addU(`${inp}일`); setInp("");
    setTimeout(() => { addC("태어난 시각을 알고 계신가요?\n정확할수록 사주가 더욱 세밀해집니다."); setStep("hour_ask"); }, 500);
    scroll();
  };
  const doHourAsk = (know) => {
    if (know) {
      addU("알고 있습니다");
      setTimeout(() => { addC("태어난 시각을 입력해주세요. (0~23)"); setStep("hour"); }, 500);
    } else {
      setUd(p => ({...p,hour:""})); addU("모릅니다");
      setTimeout(() => doConfirm({...ud,hour:""}), 500);
    }
    scroll();
  };
  const doHour = () => {
    const h = parseInt(inp); if (isNaN(h)||h<0||h>23) return;
    const updated = {...ud,hour:inp}; setUd(updated); addU(`${inp}시`); setInp("");
    setTimeout(() => doConfirm(updated), 500);
    scroll();
  };
  const doConfirm = (u) => {
    const info = u || ud;
    addC(`감사합니다, ${info.name}님.\n\n입력하신 정보입니다.\n\n이름: ${info.name}\n성별: ${info.gender}성\n생년월일: ${info.year}년 ${info.month}월 ${info.day}일${info.hour?` ${info.hour}시`:""}\n\n이대로 사주를 풀어드릴까요?`);
    setUd(info); setStep("confirm"); scroll();
  };

  const doStart = async (u) => {
    addU("맞습니다, 풀어주세요");
    const y=parseInt(u.year), m=parseInt(u.month), d=parseInt(u.day), h=u.hour?parseInt(u.hour):null;
    const 년=getYearGanji(y), 월=getMonthGanji(y,m), 일=getDayGanji(y,m,d);
    const 시=h!==null?getHourGanji(h,일.간):null;
    const saju=[년,월,일,...(시?[시]:[])];
    const ohaeng=analyzeOhaeng(saju);
    const daeun=getDaeun(년,월,u.gender,y);
    setResult({년,월,일,시,ohaeng,daeun,일간:일.간});
    // 오행 프로필 저장 → 타로 등 다른 서비스에서 참조
    saveOhaengProfile(ohaeng, u.name);
    setLoadingAI(true); setStep("reading"); scroll();

    const sajuStr=`년주:${년.간}${년.지} 월주:${월.간}${월.지} 일주:${일.간}${일.지}${시?` 시주:${시.간}${시.지}`:""}`;
    const ohStr=Object.entries(ohaeng).map(([k,v])=>`${k}(${v})`).join(" ");

    try {
      const text = await askClaude({
        system: "당신은 월령선녀입니다. 달빛과 별빛으로 사주를 읽는 신비로운 무녀로서, 따뜻하고 시적인 말투로 1인칭 대화체로 한국어로 답하세요.",
        prompt: `[의뢰인] ${u.name}(${u.gender}성), ${u.year}년생\n[사주] ${sajuStr}\n[오행] ${ohStr}\n\n당신은 '월령선녀'라는 신비로운 무녀입니다. 의뢰인에게 직접 말하듯 1인칭으로 사주를 풀어주세요.\n\n아래 순서대로 ## 제목 형식으로:\n## 타고난 기운\n## 성격과 기질\n## 올해의 운세 (${new Date().getFullYear()}년)\n## 사랑과 인연\n## 재물과 직업\n## 건강\n## 월령선녀의 한마디\n\n각 항목 3~4문장, ${u.name}님을 자연스럽게 포함, 시적이고 신비로운 말투로.`,
      });
      const secs = text.split(/(?=^## )/m).filter(Boolean).map(s => {
        const lines = s.trim().split("\n");
        return { title: lines[0].replace("## ","").trim(), body: lines.slice(1).join("\n").trim() };
      });
      setSections(secs); setLoadingAI(false); setStep("reveal");
      for (let i=0; i<secs.length; i++) {
        await new Promise(r => setTimeout(r, i===0?300:1000));
        setShown(i+1); scroll();
      }
      setStep("done");
    } catch {
      setLoadingAI(false);
      addC("기운이 흐트러졌습니다... 다시 시도해주세요.");
    }
    scroll();
  };

  const icons = ["🌟","🧠","📅","💕","💰","🌿","🌙"];

  return (
    <div style={{maxWidth:640,margin:"0 auto",padding:"0 16px 100px",position:"relative",zIndex:1}}>
      <SessionHeader title="☯️ 월령선녀의 사주풀이" onBack={onBack} />

      {msgs.map(msg => msg.t==="c"
        ? <CharRow key={msg.id} text={msg.text} charSrc={CHAR_SRC} charName={CHAR_NAME}/>
        : <UserRow key={msg.id} text={msg.text}/>
      )}
      {loadingAI && <TypingRow charSrc={CHAR_SRC} charName={CHAR_NAME}/>}

      {(step==="reveal"||step==="done") && sections.slice(0,shown).map((sec,i) => (
        <CharRow key={i} charSrc={CHAR_SRC} charName={CHAR_NAME}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <span style={{fontSize:20}}>{icons[i]||"✨"}</span>
            <span style={{color:"#c4b5fd",fontWeight:700,fontSize:15}}>{sec.title}</span>
          </div>
          <p style={{color:"#e9d5ff",margin:0,lineHeight:2,fontSize:14,whiteSpace:"pre-wrap"}}>{sec.body}</p>
        </CharRow>
      ))}

      {step==="done" && result && (
        <CharRow charSrc={CHAR_SRC} charName={CHAR_NAME}>
          <p style={{color:"#c4b5fd",fontWeight:700,fontSize:14,margin:"0 0 12px"}}>📋 사주 원국 & 대운</p>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${result.시?4:3},1fr)`,gap:6,marginBottom:12}}>
            {[
              {l:"년주",g:result.년,r:"초년"},
              {l:"월주",g:result.월,r:"청년"},
              {l:"일주",g:result.일,r:"중년"},
              ...(result.시?[{l:"시주",g:result.시,r:"말년"}]:[]),
            ].map(p => (
              <div key={p.l} style={{background:"rgba(0,0,0,.35)",borderRadius:10,padding:"10px 4px",textAlign:"center"}}>
                <div style={{color:"#6d28d9",fontSize:10,marginBottom:3}}>{p.l}</div>
                <div style={{fontSize:22,fontWeight:800,color:오행색[천간오행[p.g.간]]}}>{p.g.간}</div>
                <div style={{fontSize:18,fontWeight:700,color:오행색[지지오행[p.g.지]]}}>{p.g.지}</div>
                <div style={{fontSize:9,color:"rgba(167,139,250,.5)",marginTop:2}}>{p.r}</div>
              </div>
            ))}
          </div>
          <div style={{overflowX:"auto",paddingBottom:4}}>
            <div style={{display:"flex",gap:5,minWidth:"max-content"}}>
              {result.daeun.map((du,i) => (
                <div key={i} style={{
                  minWidth:52, background:"rgba(109,40,217,.2)",
                  border:"1px solid rgba(167,139,250,.2)",
                  borderRadius:8, padding:"7px 4px", textAlign:"center",
                }}>
                  <div style={{color:"#6d28d9",fontSize:9}}>{du.시작년}~</div>
                  <div style={{fontSize:15,fontWeight:800,color:오행색[천간오행[du.간]]}}>{du.간}</div>
                  <div style={{fontSize:13,fontWeight:700,color:오행색[지지오행[du.지]]}}>{du.지}</div>
                  <div style={{color:"#a78bfa",fontSize:9,marginTop:1}}>{du.나이}대</div>
                </div>
              ))}
            </div>
          </div>
        </CharRow>
      )}

      {step==="done" && <CharRow text="풀이를 마칩니다. 달빛이 언제나 당신 곁을 비추기를... 🌙" charSrc={CHAR_SRC} charName={CHAR_NAME}/>}
      {step==="done" && (
        <button onClick={onBack} style={{
          width:"100%", padding:"14px 0", borderRadius:12, cursor:"pointer",
          background:"rgba(109,40,217,.2)", border:"1px solid rgba(167,139,250,.35)",
          color:"#c4b5fd", fontSize:15, fontFamily:"inherit", marginTop:4,
        }}>🌙 처음으로 돌아가기</button>
      )}

      <div ref={bottomRef}/>

      <div style={{
        position:"fixed", bottom:0, left:0, right:0,
        background:"rgba(10,5,24,.95)", borderTop:"1px solid rgba(167,139,250,.2)",
        padding:"12px 16px", zIndex:20, backdropFilter:"blur(12px)",
      }}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          {step==="name"      && <InputRow placeholder="이름을 입력하세요" value={inp} onChange={setInp} onSubmit={doName}/>}
          {step==="gender"    && <ChoiceRow options={[{label:"여성",emoji:"👩",onClick:()=>doGender("여")},{label:"남성",emoji:"👨",onClick:()=>doGender("남")}]}/>}
          {step==="year"      && <InputRow placeholder="출생 연도 (예: 1995)" value={inp} onChange={setInp} onSubmit={doYear} type="number"/>}
          {step==="month"     && <InputRow placeholder="출생 월 (1~12)" value={inp} onChange={setInp} onSubmit={doMonth} type="number"/>}
          {step==="day"       && <InputRow placeholder="출생 일 (1~31)" value={inp} onChange={setInp} onSubmit={doDay} type="number"/>}
          {step==="hour_ask"  && <ChoiceRow options={[{label:"시각을 알고 있어요",emoji:"⏰",onClick:()=>doHourAsk(true)},{label:"잘 모릅니다",emoji:"❓",onClick:()=>doHourAsk(false)}]}/>}
          {step==="hour"      && <InputRow placeholder="태어난 시각 (0~23)" value={inp} onChange={setInp} onSubmit={doHour} type="number"/>}
          {step==="confirm"   && (
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>doStart(ud)} style={{
                flex:2, padding:"13px 0", borderRadius:12, cursor:"pointer",
                background:"linear-gradient(135deg,#7c3aed,#db2777)",
                border:"none", color:"white", fontSize:15, fontWeight:700, fontFamily:"inherit",
              }}>✨ 사주 풀어주세요</button>
              <button onClick={()=>{
                setMsgs([]); setUd({name:"",gender:"",year:"",month:"",day:"",hour:""});
                setTimeout(()=>{ addC("다시 처음부터 시작하겠습니다.\n이름을 알려주세요."); setStep("name"); },300);
              }} style={{
                flex:1, padding:"13px 0", borderRadius:12, cursor:"pointer",
                background:"rgba(255,255,255,.05)", border:"1px solid rgba(167,139,250,.3)",
                color:"#a78bfa", fontSize:14, fontFamily:"inherit",
              }}>다시 입력</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
