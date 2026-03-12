// ══════════════════════════════════════════════════════════════════
// 공통 UI 컴포넌트 — 클린 화이트 / 웹툰 페르소나 스타일
// ══════════════════════════════════════════════════════════════════

// 페르소나별 테마 컬러
export const PERSONA = {
  taeo: {
    name: "태오",
    role: "사주팔자",
    emoji: "☯️",
    img: "/characters/taeo.png",
    color: "#2D6BE4",       // 진한 블루
    bg: "#EEF4FF",          // 연한 블루
    badge: "#2D6BE4",
  },
  luna: {
    name: "루나",
    role: "타로카드",
    emoji: "🃏",
    img: "/characters/luna.png",
    color: "#9B59B6",
    bg: "#F5EEF8",
    badge: "#9B59B6",
  },
  kairos: {
    name: "카이로스",
    role: "손금 분석",
    emoji: "✋",
    img: "/characters/kairos.png",
    color: "#27AE60",
    bg: "#EAFAF1",
    badge: "#27AE60",
  },
  gaon: {
    name: "가온",
    role: "이름풀이",
    emoji: "📜",
    img: "/characters/gaon.png",
    color: "#E67E22",
    bg: "#FEF9E7",
    badge: "#E67E22",
  },
};

// ── 페르소나 아바타
export function PersonaAvatar({ persona, size = 48 }) {
  const p = PERSONA[persona] ?? PERSONA.taeo;
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `${p.bg} url(${p.img}) center/cover no-repeat`,
        border: `2px solid ${p.color}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.45,
        overflow: "hidden",
      }}>
        {/* 이미지 없으면 이모지 fallback */}
        <span style={{ lineHeight: 1 }}>{p.emoji}</span>
      </div>
      <p style={{
        textAlign: "center", fontSize: 10, color: "#999",
        marginTop: 3, letterSpacing: 0.3,
      }}>{p.name}</p>
    </div>
  );
}

// ── 캐릭터 말풍선 (웹툰 스타일)
export function CharBubble({ persona = "taeo", text, children }) {
  const p = PERSONA[persona] ?? PERSONA.taeo;
  return (
    <div style={{
      display: "flex", gap: 10, alignItems: "flex-start",
      marginBottom: 16, animation: "fadeUp .35s ease",
    }}>
      <PersonaAvatar persona={persona} size={44} />
      <div style={{
        maxWidth: "78%",
        background: "#FFFFFF",
        border: `1.5px solid ${p.color}22`,
        borderRadius: "4px 16px 16px 16px",
        padding: "12px 16px",
        boxShadow: "0 2px 12px rgba(0,0,0,.06)",
      }}>
        {text && (
          <p style={{
            color: "#1A1A2E", margin: 0, lineHeight: 1.85,
            fontSize: 14, whiteSpace: "pre-wrap",
          }}>{text}</p>
        )}
        {children}
      </div>
    </div>
  );
}

// ── 유저 말풍선
export function UserBubble({ text }) {
  return (
    <div style={{
      display: "flex", justifyContent: "flex-end",
      marginBottom: 16, animation: "fadeUp .3s ease",
    }}>
      <div style={{
        maxWidth: "72%",
        background: "#1A1A2E",
        borderRadius: "16px 4px 16px 16px",
        padding: "12px 16px",
      }}>
        <p style={{ color: "#FFFFFF", margin: 0, fontSize: 14, lineHeight: 1.8 }}>{text}</p>
      </div>
    </div>
  );
}

// ── 타이핑 인디케이터
export function TypingBubble({ persona = "taeo" }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 16 }}>
      <PersonaAvatar persona={persona} size={44} />
      <div style={{
        background: "#FFFFFF", border: "1.5px solid #E8E8E8",
        borderRadius: "4px 16px 16px 16px", padding: "14px 18px",
        boxShadow: "0 2px 12px rgba(0,0,0,.06)",
      }}>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: "50%", background: "#CCCCCC",
              animation: `bounce .9s ${i * .2}s infinite ease-in-out`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 텍스트 입력창
export function ChatInput({ placeholder, value, onChange, onSubmit, type = "text" }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onSubmit()}
        placeholder={placeholder}
        style={{
          flex: 1, padding: "13px 16px", borderRadius: 12,
          background: "#FFFFFF", border: "1.5px solid #E4E4E4",
          color: "#1A1A2E", fontSize: 14, outline: "none",
          transition: "border-color .2s",
        }}
        onFocus={e => e.target.style.borderColor = "#2D6BE4"}
        onBlur={e => e.target.style.borderColor = "#E4E4E4"}
      />
      <button onClick={onSubmit} style={{
        padding: "13px 20px", borderRadius: 12, cursor: "pointer",
        background: "#1A1A2E", border: "none",
        color: "white", fontSize: 14, fontWeight: 700,
        whiteSpace: "nowrap", transition: "opacity .2s",
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = ".8"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >전송</button>
    </div>
  );
}

// ── 선택지 버튼
export function ChoiceButtons({ options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {options.map(({ label, emoji, onClick }) => (
        <button key={label} onClick={onClick} style={{
          padding: "13px 18px", borderRadius: 12, cursor: "pointer",
          textAlign: "left", background: "#FFFFFF",
          border: "1.5px solid #E4E4E4",
          color: "#1A1A2E", fontSize: 14,
          display: "flex", alignItems: "center", gap: 10,
          transition: "all .15s",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#F0F4FF";
            e.currentTarget.style.borderColor = "#2D6BE4";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#FFFFFF";
            e.currentTarget.style.borderColor = "#E4E4E4";
          }}
        >
          {emoji && <span style={{ fontSize: 18 }}>{emoji}</span>}
          <span style={{ flex: 1 }}>{label}</span>
          <span style={{ color: "#BBBBBB", fontSize: 12 }}>›</span>
        </button>
      ))}
    </div>
  );
}

// ── 세션 헤더
export function SessionHeader({ title, subtitle, onBack, persona = "taeo" }) {
  const p = PERSONA[persona] ?? PERSONA.taeo;
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 20,
      background: "rgba(247,248,250,.95)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid #EEEEEE",
      padding: "12px 16px", marginBottom: 16,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <button onClick={onBack} style={{
        background: "none", border: "1.5px solid #E4E4E4",
        color: "#666", borderRadius: 8, padding: "7px 12px",
        cursor: "pointer", fontSize: 13, flexShrink: 0,
      }}>← 뒤로</button>
      <div style={{ flex: 1, textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A2E" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: "#999", marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: `${p.bg} url(${p.img}) center/cover`,
        border: `2px solid ${p.color}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
      }}>{p.emoji}</div>
    </div>
  );
}
