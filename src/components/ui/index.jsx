// ══════════════════════════════════════════════════════════════════
// 공통 UI 컴포넌트
// ══════════════════════════════════════════════════════════════════

const CHAR_IMG = "/character.png";

export function Stars() {
  const stars = Array.from({length:60}, (_,i) => ({
    id:i, x:Math.random()*100, y:Math.random()*100,
    s:Math.random()*2+.4, d:Math.random()*3+1.5,
  }));
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
      {stars.map(s => (
        <div key={s.id} style={{
          position:"absolute", left:`${s.x}%`, top:`${s.y}%`,
          width:s.s, height:s.s, borderRadius:"50%", background:"white",
          opacity:.5, animation:`twinkle ${s.d}s ease-in-out infinite alternate`,
        }}/>
      ))}
      <style>{`
        @keyframes twinkle { from{opacity:.1} to{opacity:.8} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{text-shadow:0 0 10px #c084fc,0 0 24px #7c3aed} 50%{text-shadow:0 0 20px #e9d5ff,0 0 40px #a78bfa} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-5px);opacity:1} }
        @keyframes particleFloat { 0%{transform:translateY(0) translateX(0);opacity:0} 20%{opacity:1} 100%{transform:translateY(-80px) translateX(20px);opacity:0} }
        @keyframes shimmer { 0%{opacity:.4} 50%{opacity:1} 100%{opacity:.4} }
      `}</style>
    </div>
  );
}

export function CharAvatar({ size=64, src=CHAR_IMG, name="월령선녀" }) {
  return (
    <div style={{flexShrink:0,textAlign:"center"}}>
      <div style={{
        width:size, height:size, borderRadius:"50%",
        border:"1.5px solid rgba(192,132,252,.5)",
        background:`url(${src}) center top / cover, linear-gradient(160deg,#1a0533,#0f0a2e)`,
      }}/>
      <div style={{color:"#a78bfa",fontSize:9,marginTop:3,letterSpacing:.5}}>{name}</div>
    </div>
  );
}

export function Bubble({children, style={}}) {
  return (
    <div style={{
      background:"rgba(15,5,40,.9)", border:"1px solid rgba(192,132,252,.35)",
      borderRadius:"6px 18px 18px 18px", padding:"14px 18px",
      boxShadow:"0 4px 20px rgba(109,40,217,.25)", backdropFilter:"blur(12px)",
      ...style,
    }}>
      {children}
    </div>
  );
}

export function CharRow({text, children, charSrc=CHAR_IMG, charName="월령선녀"}) {
  return (
    <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:18,animation:"fadeIn .5s ease"}}>
      <CharAvatar size={56} src={charSrc} name={charName}/>
      <div style={{flex:1}}>
        <Bubble>
          {text && <p style={{color:"#e9d5ff",margin:0,lineHeight:1.95,fontSize:14,whiteSpace:"pre-wrap"}}>{text}</p>}
          {children}
        </Bubble>
      </div>
    </div>
  );
}

export function UserRow({text}) {
  return (
    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:18,animation:"fadeIn .4s ease"}}>
      <div style={{
        maxWidth:"70%", background:"rgba(109,40,217,.28)",
        border:"1px solid rgba(167,139,250,.4)",
        borderRadius:"18px 6px 18px 18px", padding:"12px 16px",
      }}>
        <p style={{color:"#e9d5ff",margin:0,fontSize:14,lineHeight:1.8}}>{text}</p>
      </div>
    </div>
  );
}

export function TypingRow({ charSrc=CHAR_IMG, charName="월령선녀" }) {
  return (
    <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:18}}>
      <CharAvatar size={56} src={charSrc} name={charName}/>
      <Bubble style={{padding:"14px 18px"}}>
        <div style={{display:"flex",gap:5}}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:7, height:7, borderRadius:"50%", background:"#a78bfa",
              animation:`bounce .9s ${i*.2}s infinite ease-in-out`,
            }}/>
          ))}
        </div>
      </Bubble>
    </div>
  );
}

export function InputRow({placeholder, value, onChange, onSubmit, type="text"}) {
  return (
    <div style={{display:"flex",gap:8,marginTop:4}}>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key==="Enter" && onSubmit()}
        placeholder={placeholder}
        style={{
          flex:1, padding:"12px 16px", borderRadius:12,
          background:"rgba(255,255,255,.06)", border:"1px solid rgba(167,139,250,.4)",
          color:"#e9d5ff", fontSize:14, outline:"none", fontFamily:"inherit",
        }}
      />
      <button onClick={onSubmit} style={{
        padding:"12px 20px", borderRadius:12, cursor:"pointer",
        background:"linear-gradient(135deg,#7c3aed,#db2777)",
        border:"none", color:"white", fontSize:14, fontWeight:700,
        fontFamily:"inherit", whiteSpace:"nowrap",
      }}>전송 →</button>
    </div>
  );
}

export function ChoiceRow({options}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
      {options.map(({label, emoji, onClick}) => (
        <button key={label} onClick={onClick}
          style={{
            padding:"13px 18px", borderRadius:12, cursor:"pointer", textAlign:"left",
            background:"rgba(109,40,217,.12)", border:"1px solid rgba(167,139,250,.25)",
            color:"#e9d5ff", fontSize:14, display:"flex", alignItems:"center", gap:10,
            fontFamily:"inherit", transition:"all .2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background="rgba(167,139,250,.2)"; e.currentTarget.style.borderColor="#a78bfa"; }}
          onMouseLeave={e => { e.currentTarget.style.background="rgba(109,40,217,.12)"; e.currentTarget.style.borderColor="rgba(167,139,250,.25)"; }}
        >
          {emoji && <span style={{fontSize:20}}>{emoji}</span>}
          <span style={{flex:1}}>{label}</span>
          <span style={{color:"#7c3aed",fontSize:12}}>→</span>
        </button>
      ))}
    </div>
  );
}

// 공통 헤더 (뒤로가기 버튼 포함)
export function SessionHeader({ title, onBack }) {
  return (
    <div style={{
      position:"sticky", top:0, zIndex:20,
      background:"rgba(10,5,24,.92)", backdropFilter:"blur(12px)",
      borderBottom:"1px solid rgba(167,139,250,.2)",
      padding:"12px 0", marginBottom:20,
      display:"flex", alignItems:"center", gap:12,
    }}>
      <button onClick={onBack} style={{
        background:"rgba(167,139,250,.12)", border:"1px solid rgba(167,139,250,.25)",
        color:"#c4b5fd", borderRadius:8, padding:"7px 14px",
        cursor:"pointer", fontSize:13, fontFamily:"inherit",
      }}>← 돌아가기</button>
      <div style={{flex:1,textAlign:"center"}}>
        <span style={{color:"#c4b5fd",fontWeight:700,fontSize:15}}>{title}</span>
      </div>
    </div>
  );
}
