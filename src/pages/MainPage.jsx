// ══════════════════════════════════════════════════════════════════
// 메인 페이지 — 4대 서비스 선택
// ══════════════════════════════════════════════════════════════════

const CHAR_IMG = "/character.png";

const SERVICES = [
  {
    id: "saju",
    emoji: "☯️",
    title: "사주팔자 풀이",
    desc: "내 운명의 길을 읽어드립니다",
    available: true,
    color: "linear-gradient(135deg,#5b21b6,#7c3aed,#9333ea)",
    glow: "rgba(124,58,237,.5)",
  },
  {
    id: "tarot",
    emoji: "🃏",
    title: "타로카드",
    desc: "무의식의 거울로 현재를 봅니다",
    available: false,
    color: "linear-gradient(135deg,#1e3a5f,#2563eb,#3b82f6)",
    glow: "rgba(37,99,235,.4)",
  },
  {
    id: "palm",
    emoji: "✋",
    title: "손금 분석",
    desc: "손바닥의 인생 항로 지도",
    available: false,
    color: "linear-gradient(135deg,#14532d,#16a34a,#22c55e)",
    glow: "rgba(22,163,74,.4)",
  },
  {
    id: "name",
    emoji: "📜",
    title: "이름풀이",
    desc: "이름의 기운과 소리를 읽습니다",
    available: false,
    color: "linear-gradient(135deg,#713f12,#b45309,#d97706)",
    glow: "rgba(180,83,9,.4)",
  },
];

export default function MainPage({ onStart }) {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",position:"relative",zIndex:1}}>
      {/* 히어로 캐릭터 */}
      <div style={{width:"100%",maxWidth:480,margin:"0 auto",paddingTop:24,position:"relative"}}>
        <div style={{
          width:"100%", paddingBottom:"80%", position:"relative",
          overflow:"hidden", borderRadius:"24px 24px 0 0",
          boxShadow:"0 0 60px rgba(192,132,252,.3)",
        }}>
          <div style={{
            position:"absolute", inset:0,
            background:`url(${CHAR_IMG}) center top / cover, linear-gradient(160deg,#1a0533,#0f0a2e)`,
          }}/>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:"35%",background:"linear-gradient(transparent,#0a0518)"}}/>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              position:"absolute", width:5, height:5, borderRadius:"50%",
              background:["#c084fc","#fbbf24","#a78bfa","#60a5fa","#f9a8d4"][i],
              left:`${[15,75,30,85,50][i]}%`, top:`${[70,50,80,65,40][i]}%`,
              animation:`particleFloat ${2.5+i*.4}s ease-in-out ${i*.5}s infinite`,
            }}/>
          ))}
        </div>
      </div>

      {/* 소개 & 서비스 카드 */}
      <div style={{maxWidth:480,margin:"0 auto",width:"100%",padding:"0 20px 40px"}}>
        <div style={{
          background:"linear-gradient(160deg,rgba(109,40,217,.3),rgba(15,10,40,.97))",
          borderRadius:"0 0 24px 24px",
          border:"1px solid rgba(192,132,252,.2)", borderTop:"none",
          padding:"20px 24px 28px",
        }}>
          <h1 style={{fontSize:28,fontWeight:800,color:"#e9d5ff",margin:"0 0 4px",textAlign:"center",animation:"glow 3s ease-in-out infinite"}}>
            복채
          </h1>
          <p style={{color:"#a78bfa",fontSize:13,margin:"0 0 20px",letterSpacing:1,textAlign:"center"}}>
            AI가 읽는 당신의 운명
          </p>

          {/* 서비스 목록 */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {SERVICES.map(svc => (
              <button
                key={svc.id}
                onClick={() => svc.available && onStart(svc.id)}
                disabled={!svc.available}
                style={{
                  width:"100%", padding:"15px 20px", borderRadius:14, cursor: svc.available ? "pointer" : "default",
                  background: svc.available ? svc.color : "rgba(255,255,255,.04)",
                  border: svc.available ? "1px solid rgba(192,132,252,.4)" : "1px solid rgba(255,255,255,.08)",
                  color: svc.available ? "white" : "rgba(167,139,250,.4)",
                  fontSize:15, fontWeight:700, fontFamily:"inherit",
                  boxShadow: svc.available ? `0 4px 20px ${svc.glow}` : "none",
                  display:"flex", alignItems:"center", gap:12,
                  transition:"transform .2s, box-shadow .2s",
                  opacity: svc.available ? 1 : 0.5,
                }}
                onMouseEnter={e => { if (svc.available) e.currentTarget.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; }}
              >
                <span style={{fontSize:22}}>{svc.emoji}</span>
                <div style={{textAlign:"left",flex:1}}>
                  <div>{svc.title}</div>
                  <div style={{fontSize:12,opacity:.75,fontWeight:400,marginTop:2}}>{svc.desc}</div>
                </div>
                <span style={{fontSize:16,opacity:.7}}>
                  {svc.available ? "→" : "준비중"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
