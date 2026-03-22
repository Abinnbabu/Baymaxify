import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";

/* ─── Theme Palettes ─────────────────────────────────────────────────────────── */
const THEMES = {
  blue: {
    bg: "#F0F6FF", surface: "#FFFFFF", card: "#EBF3FF",
    primary: "#2255A4", accent: "#1A3F7A", muted: "#6B8BBF",
    text: "#0F2040", subtle: "#D8E8FF",
    gradient: "linear-gradient(160deg, #F7FAFF 0%, #E8F0FC 50%, #F0F6FF 100%)",
    navBg: "#2255A4", navText: "#FFFFFF", swatch: "#2255A4", label: "Soft Blue",
  },
  green: {
    bg: "#F2FAF5", surface: "#FFFFFF", card: "#E3F5EB",
    primary: "#1E7A4A", accent: "#155235", muted: "#5C9B74",
    text: "#0D2D1C", subtle: "#C8EDD8",
    gradient: "linear-gradient(160deg, #F7FDF9 0%, #E8F7EE 50%, #F2FAF5 100%)",
    navBg: "#1E7A4A", navText: "#FFFFFF", swatch: "#1E7A4A", label: "Sage Green",
  },
  warm: {
    bg: "#FFF8F0", surface: "#FFFFFF", card: "#FFF0DC",
    primary: "#B85C1A", accent: "#7C3A0E", muted: "#C4875A",
    text: "#3D1F08", subtle: "#FFD9B0",
    gradient: "linear-gradient(160deg, #FFFCF8 0%, #FFF3E0 50%, #FFF8F0 100%)",
    navBg: "#B85C1A", navText: "#FFFFFF", swatch: "#B85C1A", label: "Warm Beige",
  },
  dark: {
    bg: "#111827", surface: "#1F2937", card: "#273447",
    primary: "#93C5FD", accent: "#BFDBFE", muted: "#6B8EBF",
    text: "#E2EAF4", subtle: "#2D3F55",
    gradient: "linear-gradient(160deg, #0F172A 0%, #111827 50%, #0F172A 100%)",
    navBg: "#0F172A", navText: "#E2EAF4", swatch: "#93C5FD", label: "Dark Comfort",
  },
};

/* ─── Global CSS ─────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }

  @keyframes drift1 {
    0%   { transform: translate(0px,   0px)  scale(1);    }
    33%  { transform: translate(28px, -52px) scale(1.06); }
    66%  { transform: translate(-18px, 28px) scale(0.96); }
    100% { transform: translate(0px,   0px)  scale(1);    }
  }
  @keyframes drift2 {
    0%   { transform: translate(0px,   0px)  scale(1);    }
    40%  { transform: translate(-42px, 58px) scale(1.08); }
    80%  { transform: translate(18px, -28px) scale(0.94); }
    100% { transform: translate(0px,   0px)  scale(1);    }
  }
  @keyframes drift3 {
    0%   { transform: translate(0px,  0px)  scale(1);   }
    50%  { transform: translate(48px, 38px) scale(1.1); }
    100% { transform: translate(0px,  0px)  scale(1);   }
  }
  @keyframes drift4 {
    0%   { transform: translate(0px,   0px)  scale(1);    }
    45%  { transform: translate(-28px,-58px) scale(1.05); }
    100% { transform: translate(0px,   0px)  scale(1);    }
  }
  @keyframes drift5 {
    0%   { transform: translate(0px,  0px)  scale(1);    }
    55%  { transform: translate(58px,-18px) scale(1.07); }
    100% { transform: translate(0px,  0px)  scale(1);    }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes dropDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0);     }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 0  8px rgba(100,150,255,.15); }
    50%     { box-shadow: 0 0 52px 6px rgba(100,150,255,.32); }
  }

  .chip-el           { transition: all .2s ease; cursor: pointer; user-select: none; }
  .chip-el:hover     { transform: translateY(-2px); }
  .cta-btn           { transition: all .22s ease; cursor: pointer; }
  .cta-btn:hover     { transform: translateY(-2px); opacity: .92; }
  .nav-btn           { transition: background .2s ease; cursor: pointer; }
  .nav-btn:hover     { background: rgba(255,255,255,0.22) !important; }
  .palette-row       { transition: background .15s ease; cursor: pointer; border-radius: 10px; }
  .palette-row:hover { background: rgba(128,128,128,.08) !important; }

  select:focus, textarea:focus { outline: none; }

  input[type=range] {
    -webkit-appearance: none;
    width: 100%; height: 5px;
    border-radius: 99px;
    cursor: pointer; outline: none;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px; height: 20px;
    border-radius: 50%;
    transition: transform .2s;
  }
  input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.25); }
  ::placeholder { opacity: .45; }
`;

/* ─── Bubble Canvas ──────────────────────────────────────────────────────────── */
function BubbleCanvas({ primary }) {
  const bubbles = [
    { w:460, h:460, top:"-12%", left:"-10%", anim:"drift1 24s ease-in-out infinite",         op:.055 },
    { w:340, h:340, top:"58%",  left:"72%",  anim:"drift2 30s ease-in-out infinite",         op:.05  },
    { w:280, h:280, top:"28%",  left:"52%",  anim:"drift3 36s ease-in-out infinite",         op:.045 },
    { w:220, h:220, top:"68%",  left:"8%",   anim:"drift4 28s ease-in-out infinite",         op:.06  },
    { w:190, h:190, top:"4%",   left:"68%",  anim:"drift5 32s ease-in-out infinite",         op:.05  },
    { w:140, h:140, top:"44%",  left:"88%",  anim:"drift1 40s ease-in-out infinite reverse", op:.045 },
    { w:100, h:100, top:"82%",  left:"50%",  anim:"drift3 22s ease-in-out infinite reverse", op:.04  },
  ];
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {bubbles.map((b, i) => (
        <div key={i} style={{
          position:     "absolute",
          width:        b.w, height: b.h,
          top:          b.top, left: b.left,
          borderRadius: "50%",
          background:   `radial-gradient(circle at 35% 30%, ${primary}2A, ${primary}06)`,
          border:       `1px solid ${primary}18`,
          opacity:      b.op,
          animation:    b.anim,
          transition:   "background .5s ease, border .5s ease",
        }} />
      ))}
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────────────── */
function Navbar({ T, themeKey, setThemeKey }) {
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const close = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const navBtn = {
    display:        "flex",
    alignItems:     "center",
    gap:            7,
    background:     "rgba(255,255,255,0.13)",
    backdropFilter: "blur(10px)",
    border:         "1.5px solid rgba(255,255,255,0.28)",
    borderRadius:   10,
    padding:        "8px 18px",
    color:          T.navText,
    fontFamily:     "'DM Sans', sans-serif",
    fontWeight:     500,
    fontSize:       "0.84rem",
    letterSpacing:  ".03em",
  };

  const IconHome = () => (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L10 3l7 6.5" />
      <path d="M5 8.5v8h3.5v-4.5h3V16.5H15v-8" />
    </svg>
  );

  const IconPalette = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z" />
      <circle cx="8"  cy="13" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="10" cy="9"  r="1.2" fill="currentColor" stroke="none" />
      <circle cx="14" cy="9"  r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="13" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );

  const IconChevron = ({ up }) => (
    <svg width="9" height="9" viewBox="0 0 10 6" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={up ? "M1 5l4-4 4 4" : "M1 1l4 4 4-4"} />
    </svg>
  );

  return (
    <nav style={{
      position:   "sticky",
      top:        0,
      zIndex:     50,
      background: T.navBg,
      padding:    "13px 32px",
      display:    "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow:  "0 4px 24px rgba(0,0,0,0.12)",
      transition: "background .45s ease",
    }}>
      {/* Brand */}
      <span style={{
        fontFamily:    "'DM Serif Display', serif",
        fontSize:      "1.25rem",
        fontStyle:     "italic",
        color:         T.navText,
        opacity:       .92,
        letterSpacing: ".01em",
      }}>
        MindEase
      </span>

      {/* Right side */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>

        {/* Home button */}
        <button className="nav-btn" style={navBtn} onClick={() => navigate("/home")}>
          <IconHome />
          Home
        </button>

        {/* Palette dropdown */}
        <div ref={dropRef} style={{ position:"relative" }}>
          <button
            className="nav-btn"
            style={navBtn}
            onClick={() => setOpen(p => !p)}
          >
            <IconPalette />
            Palette
            <IconChevron up={open} />
          </button>

          {open && (
            <div style={{
              position:     "absolute",
              top:          "calc(100% + 10px)",
              right:        0,
              background:   T.surface,
              border:       `1px solid ${T.subtle}`,
              borderRadius: 16,
              padding:      8,
              width:        218,
              boxShadow:    "0 20px 56px rgba(0,0,0,.18)",
              animation:    "dropDown .18s ease both",
              zIndex:       100,
            }}>
              {Object.entries(THEMES).map(([key, th]) => (
                <div
                  key={key}
                  className="palette-row"
                  onClick={() => { setThemeKey(key); setOpen(false); }}
                  style={{
                    display:     "flex",
                    alignItems:  "center",
                    gap:         12,
                    padding:     "10px 12px",
                    background:  key === themeKey ? `${T.primary}14` : "transparent",
                  }}
                >
                  {/* Swatch */}
                  <div style={{
                    width:        22,
                    height:       22,
                    borderRadius: "50%",
                    background:   th.swatch,
                    flexShrink:   0,
                    boxShadow:    key === themeKey ? `0 0 0 3px ${th.swatch}44` : "none",
                    transition:   "box-shadow .2s",
                  }} />
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize:   "0.88rem",
                    fontWeight: key === themeKey ? 600 : 400,
                    color:      T.text,
                  }}>
                    {th.label}
                  </span>
                  {key === themeKey && (
                    <svg style={{ marginLeft:"auto" }} width="13" height="13" viewBox="0 0 14 14"
                      fill="none" stroke={T.primary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 7l4 4 6-6" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

/* ─── Field label ────────────────────────────────────────────────────────────── */
function FieldLabel({ T, children }) {
  return (
    <div style={{
      fontWeight:    500,
      fontSize:      "0.72rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color:         T.muted,
      marginBottom:  10,
    }}>
      {children}
    </div>
  );
}

/* ─── Divider ────────────────────────────────────────────────────────────────── */
function Divider({ T }) {
  return <div style={{ height:1, background:`${T.primary}14`, margin:"30px 0" }} />;
}

/* ─── Main SurveyPage ────────────────────────────────────────────────────────── */
export default function SurveyPage() {
  const { themeKey, setThemeKey } = useContext(ThemeContext);
  const [surveyDone,  setSurveyDone]  = useState(false);
  const [breathPhase, setBreathPhase] = useState(null);
  const [breathScale, setBreathScale] = useState(1);
  const [intensity,   setIntensity]   = useState(5);
  const [emotions,    setEmotions]    = useState([]);
  const ivRef = useRef(null);

  const T = THEMES[themeKey];

  const toggleEmotion = (e) =>
    setEmotions(p => p.includes(e) ? p.filter(x => x !== e) : [...p, e]);

  const startBreathing = () => {
    clearInterval(ivRef.current);
    const phases = ["Inhale", "Hold", "Exhale", "Hold"];
    let i = 0;
    setBreathPhase(phases[0]);
    setBreathScale(1.5);

    ivRef.current = setInterval(() => {
      i = (i + 1) % 4;
      setBreathPhase(phases[i]);
      if (i === 0) setBreathScale(1.5);
      if (i === 2) setBreathScale(1);
    }, 4000);

    setTimeout(() => {
      clearInterval(ivRef.current);
      setBreathPhase(null);
      setBreathScale(1);
    }, 60000);
  };

  useEffect(() => () => clearInterval(ivRef.current), []);

  /* shared input style — derived from current theme */
  const selectStyle = {
    width:            "100%",
    border:           `1.5px solid ${T.subtle}`,
    borderRadius:     12,
    padding:          "11px 40px 11px 16px",
    background:       T.surface,
    color:            T.text,
    fontSize:         "0.92rem",
    fontFamily:       "'DM Sans', sans-serif",
    appearance:       "none",
    WebkitAppearance: "none",
    backgroundImage:  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.8' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat:   "no-repeat",
    backgroundPosition: "right 16px center",
    boxShadow:        "0 2px 8px rgba(0,0,0,.03)",
    transition:       "border .2s",
    cursor:           "pointer",
  };

  const breathHint = {
    Inhale: "Breathe in slowly and steadily through the nose",
    Hold:   "Hold — still, calm, and fully present",
    Exhale: "Release gently and completely through the mouth",
  };

  const emotionList = ["Calm", "Overwhelmed", "Anxious", "Sad", "Irritated", "Motivated"];

  /* card shared style */
  const card = {
    background:   T.surface,
    borderRadius: 24,
    border:       `1px solid ${T.subtle}`,
    boxShadow:    "0 8px 48px rgba(0,0,0,.06), 0 2px 16px rgba(0,0,0,.04)",
    transition:   "background .4s, border .4s, box-shadow .4s",
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* Dynamic range thumb colour */}
      <style>{`
        input[type=range]::-webkit-slider-runnable-track { background: ${T.subtle}; border-radius: 99px; }
        input[type=range]::-webkit-slider-thumb { background: ${T.primary}; box-shadow: 0 2px 10px ${T.primary}70; }
      `}</style>

      {/* Animated bubbles */}
      <BubbleCanvas primary={T.primary} />

      {/* Full page wrapper */}
      <div style={{
        minHeight:  "100vh",
        background: T.gradient,
        color:      T.text,
        transition: "background .45s ease",
        position:   "relative",
        zIndex:     1,
      }}>

        {/* ── Navbar ── */}
        <Navbar T={T} themeKey={themeKey} setThemeKey={setThemeKey} />

        {/* ── Content ── */}
        <div style={{ padding:"56px 20px 100px", position:"relative", zIndex:1 }}>
          <div style={{ maxWidth:720, margin:"0 auto" }}>

            {/* Page header */}
            <div style={{
              textAlign:    "center",
              marginBottom: 52,
              animation:    "fadeSlideUp .55s ease both",
            }}>
              <p style={{
                fontWeight:    500,
                fontSize:      "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color:         T.muted,
                marginBottom:  14,
              }}>
                Daily Check-In
              </p>
              <h1 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize:   "clamp(2rem,5vw,2.9rem)",
                fontWeight: 400,
                color:      T.accent,
                lineHeight: 1.15,
                transition: "color .4s",
              }}>
                Wellness Survey
              </h1>
              <div style={{
                width:48, height:3, borderRadius:99,
                background: T.primary, opacity:.45,
                margin:"18px auto 0",
                transition:"background .4s",
              }} />
            </div>

            {/* ── Form card ── */}
            <div style={{ ...card, padding:"44px 48px", marginBottom:20, animation:"fadeSlideUp .6s ease .08s both" }}>

              <p style={{
                fontFamily:  "'DM Serif Display', serif",
                fontSize:    "1.08rem",
                fontStyle:   "italic",
                color:       T.muted,
                textAlign:   "center",
                marginBottom:36,
              }}>
                Understand Your Current State
              </p>

              {/* Emotional state chips */}
              <FieldLabel T={T}>Emotional State</FieldLabel>
              <div style={{
                display:             "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(118px,1fr))",
                gap:                 9,
              }}>
                {emotionList.map(item => {
                  const active = emotions.includes(item);
                  return (
                    <div key={item} className="chip-el" onClick={() => toggleEmotion(item)}
                      style={{
                        padding:      "10px 12px",
                        borderRadius: 12,
                        textAlign:    "center",
                        fontSize:     "0.86rem",
                        fontWeight:   active ? 600 : 400,
                        background:   active ? T.primary : T.card,
                        color:        active ? "#fff"     : T.text,
                        border:       `1.5px solid ${active ? T.primary : T.subtle}`,
                        transition:   "all .2s ease",
                      }}>
                      {item}
                    </div>
                  );
                })}
              </div>

              <Divider T={T} />

              {/* Primary Trigger */}
              <FieldLabel T={T}>Primary Trigger</FieldLabel>
              <select style={selectStyle}>
                {["Academic / Work pressure","Relationships","Health concerns","Lack of sleep","No specific reason"]
                  .map(o => <option key={o}>{o}</option>)}
              </select>

              <Divider T={T} />

              {/* Intensity */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:14 }}>
                <FieldLabel T={T}>Intensity Level</FieldLabel>
                <span style={{
                  fontFamily:  "'DM Serif Display', serif",
                  fontSize:    "2rem",
                  color:       T.primary,
                  lineHeight:  1,
                  marginBottom:10,
                  transition:  "color .4s",
                }}>
                  {intensity}
                  <span style={{ fontSize:".75rem", color:T.muted, fontFamily:"'DM Sans',sans-serif" }}>
                    &thinsp;/ 10
                  </span>
                </span>
              </div>
              <input
                type="range" min="1" max="10" value={intensity}
                onChange={e => setIntensity(Number(e.target.value))}
                style={{ marginBottom:8 }}
              />
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <span key={n} style={{
                    fontSize:  ".66rem",
                    fontWeight: n === intensity ? 700 : 400,
                    color:     n <= intensity ? T.primary : `${T.muted}55`,
                    transition:"color .2s",
                  }}>{n}</span>
                ))}
              </div>

              <Divider T={T} />

              {/* Impact */}
              <FieldLabel T={T}>Impact on You</FieldLabel>
              <select style={selectStyle}>
                {["Difficulty focusing","Low motivation","Physical tension","Racing thoughts","Emotional withdrawal"]
                  .map(o => <option key={o}>{o}</option>)}
              </select>

              <Divider T={T} />

              {/* Notes */}
              <FieldLabel T={T}>What happened today?</FieldLabel>
              <textarea rows={4}
                placeholder="Write freely — this is your private space."
                style={{
                  width:        "100%",
                  border:       `1.5px solid ${T.subtle}`,
                  borderRadius: 14,
                  padding:      "14px 16px",
                  background:   T.surface,
                  color:        T.text,
                  fontSize:     "0.92rem",
                  fontFamily:   "'DM Sans', sans-serif",
                  lineHeight:   1.75,
                  resize:       "vertical",
                  transition:   "border .2s, background .4s, color .4s",
                  boxShadow:    "0 2px 8px rgba(0,0,0,.03)",
                }}
              />

              {/* Submit */}
              <div style={{ textAlign:"center", marginTop:38 }}>
                <button className="cta-btn" onClick={() => setSurveyDone(true)}
                  style={{
                    background:    T.primary,
                    color:         "#fff",
                    border:        "none",
                    borderRadius:  14,
                    padding:       "15px 54px",
                    fontFamily:    "'DM Sans', sans-serif",
                    fontWeight:    600,
                    fontSize:      "0.92rem",
                    letterSpacing: ".05em",
                    boxShadow:     `0 8px 28px ${T.primary}45`,
                    transition:    "background .4s, box-shadow .4s",
                  }}>
                  Complete Check-In
                </button>
              </div>
            </div>

            {/* ── Feedback card ── */}
            <div style={{
              ...card,
              background:   surveyDone ? T.primary : T.surface,
              padding:      "28px 36px",
              textAlign:    "center",
              marginBottom: 20,
              boxShadow:    surveyDone
                ? `0 14px 44px ${T.primary}45`
                : "0 4px 20px rgba(0,0,0,.04)",
              animation:    "fadeSlideUp .65s ease .16s both",
            }}>
              {surveyDone ? (
                <>
                  <p style={{
                    fontFamily:   "'DM Serif Display', serif",
                    fontSize:     "1.12rem",
                    fontStyle:    "italic",
                    color:        "#fff",
                    marginBottom: 8,
                  }}>
                    Thank you for checking in.
                  </p>
                  <p style={{ color:"rgba(255,255,255,.72)", fontSize:".86rem", margin:0 }}>
                    Your awareness is a powerful first step toward balance.
                  </p>
                </>
              ) : (
                <p style={{ color:T.muted, fontSize:".86rem", margin:0 }}>
                  Complete the check-in above to receive personalised guidance.
                </p>
              )}
            </div>

            {/* ── Breathing card ── */}
            <div style={{ ...card, padding:"48px 48px", textAlign:"center", animation:"fadeSlideUp .7s ease .24s both" }}>
              <p style={{
                fontWeight:    500,
                fontSize:      "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color:         T.muted,
                marginBottom:  12,
              }}>
                Mindfulness
              </p>
              <h2 style={{
                fontFamily:   "'DM Serif Display', serif",
                fontSize:     "1.7rem",
                fontWeight:   400,
                color:        T.accent,
                marginBottom: 10,
                transition:   "color .4s",
              }}>
                4 · 4 · 4 · 4 Breathing
              </h2>
              <p style={{
                color:      T.muted,
                fontSize:   ".87rem",
                lineHeight: 1.75,
                maxWidth:   460,
                margin:     "0 auto",
                marginBottom: breathPhase ? 40 : 36,
              }}>
                Inhale for 4 counts, hold for 4, exhale for 4, hold for 4 —<br />
                a clinically-backed method to reduce stress instantly.
              </p>

              {/* Breathing circle — only shown after start */}
              {breathPhase && (
                <div style={{ marginBottom:36 }}>
                  <div style={{
                    width:        150,
                    height:       150,
                    borderRadius: "50%",
                    background:   `radial-gradient(circle at 36% 34%, ${T.primary}CC, ${T.accent})`,
                    margin:       "0 auto 50px",
                    transform:    `scale(${breathScale})`,
                    transition:   "transform 4s ease-in-out, background .5s",
                    animation:    "pulseGlow 4s ease-in-out infinite",
                  }} />
                  <p style={{
                    fontFamily:   "'DM Serif Display', serif",
                    fontSize:     "1.5rem",
                    fontStyle:    "italic",
                    color:        T.primary,
                    marginTop:    16,
                    marginBottom: 6,
                    transition:   "color .4s",
                  }}>
                    {breathPhase}
                  </p>
                  <p style={{ color:T.muted, fontSize:".82rem" }}>
                    {breathHint[breathPhase]}
                  </p>
                </div>
              )}

              <button className="cta-btn" onClick={startBreathing}
                style={{
                  background:    breathPhase ? "transparent" : T.primary,
                  color:         breathPhase ? T.primary      : "#fff",
                  border:        `2px solid ${T.primary}`,
                  borderRadius:  14,
                  padding:       "14px 46px",
                  fontFamily:    "'DM Sans', sans-serif",
                  fontWeight:    600,
                  fontSize:      "0.9rem",
                  letterSpacing: ".05em",
                  boxShadow:     breathPhase ? "none" : `0 6px 24px ${T.primary}45`,
                  transition:    "all .3s ease",
                }}>
                {breathPhase ? "Restart Session" : "Begin Breathing Session"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}