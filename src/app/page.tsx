"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ───────── COLOR TOKENS ───────── */
const C = {
  azure: "#00A9E0", azureLight: "#33BFEF", azureGlow: "rgba(0,169,224,.12)",
  zafre: "#000066", zafreLight: "#1a1a80",
  dark: "#060612", dark2: "#0c0c1e", dark3: "#14142b", dark4: "#1e1e3a",
  green: "#34D399", red: "#F87171", orange: "#FB923C", purple: "#A78BFA", yellow: "#FBBF24",
  t1: "#F0F2FF", t2: "#A0A8C8", t3: "#6670A0",
};

/* ───────── NAV ───────── */
function Nav() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(pct);
      const sections = document.querySelectorAll("[data-section]");
      let current = "";
      sections.forEach((s) => {
        const el = s as HTMLElement;
        if (el.offsetTop - 200 <= window.scrollY) current = el.dataset.section || "";
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "hero", label: "Inicio" },
    { id: "pactia", label: "Pactia" },
    { id: "que-es-ia", label: "Qué es IA" },
    { id: "datos", label: "Datos" },
    { id: "genai", label: "GenAI" },
    { id: "real-estate", label: "Real Estate" },
    { id: "casos", label: "Casos" },
    { id: "oportunidades", label: "Oportunidades" },
    { id: "etica", label: "Ética" },
    { id: "roadmap", label: "Roadmap" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center",
      background: "rgba(6,6,18,.92)", backdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(0,169,224,.08)",
    }}>
      <div style={{ fontWeight: 900, fontSize: ".85rem", color: C.azure, letterSpacing: 2, fontStyle: "italic", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ padding: "4px 12px", background: `linear-gradient(135deg,${C.azure},${C.zafre})`, borderRadius: 12, fontSize: ".6rem", fontWeight: 700, letterSpacing: 1, color: "#fff", fontStyle: "normal" }}>
          SESIÓN 1
        </span>
        SinergIA
      </div>
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {links.map((l) => (
          <a key={l.id} href={`#${l.id}`} style={{
            color: activeSection === l.id ? C.azure : C.t2,
            textDecoration: "none", fontSize: ".65rem", fontWeight: 600,
            padding: "5px 10px", borderRadius: 16, transition: ".3s",
            letterSpacing: ".5px", textTransform: "uppercase",
            background: activeSection === l.id ? C.azureGlow : "transparent",
          }}>
            {l.label}
          </a>
        ))}
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, height: 2, width: `${progress}%`,
        background: `linear-gradient(90deg,${C.azure},${C.purple},${C.azure})`,
        backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite", transition: "width .15s",
      }} />
    </nav>
  );
}

/* ───────── SECTION WRAPPER ───────── */
function Section({ id, children, style }: { id: string; children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} data-section={id} style={{
      minHeight: "100vh", padding: "110px 56px 80px", position: "relative",
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)", transition: ".7s",
      ...style,
    }}>
      {children}
    </section>
  );
}

/* ───────── SN LABEL ───────── */
function SN({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: ".65rem", fontWeight: 700, letterSpacing: 4, textTransform: "uppercase",
      color: C.azure, marginBottom: 10, display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ width: 36, height: 1, background: C.azure, display: "inline-block" }} />
      {children}
    </div>
  );
}

/* ───────── CARD ───────── */
function Card({ children, style, accent }: { children: React.ReactNode; style?: React.CSSProperties; accent?: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: C.dark2, border: `1px solid ${hov ? "rgba(0,169,224,.25)" : C.dark4}`,
      borderRadius: 14, padding: 26, transition: ".35s", position: "relative", overflow: "hidden",
      transform: hov ? "translateY(-3px)" : "translateY(0)",
      boxShadow: hov ? "0 8px 32px rgba(0,169,224,.08)" : "none",
      ...style,
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg,transparent,${accent || C.azure},transparent)`,
        opacity: hov ? 1 : 0, transition: ".35s",
      }} />
      {children}
    </div>
  );
}

/* ───────── COUNTER BOX ───────── */
function Counter({ value, label, sub, color }: { value: string; label: string; sub?: string; color?: string }) {
  return (
    <div style={{
      textAlign: "center", padding: "24px 16px", background: C.dark2,
      border: `1px solid ${C.dark4}`, borderRadius: 14, transition: ".3s",
    }}>
      <div style={{
        fontSize: "2.4rem", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace",
        background: `linear-gradient(135deg,${color || C.azure},${C.azureLight})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{value}</div>
      <div style={{ fontSize: ".72rem", color: C.t3, marginTop: 6, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      {sub && <div style={{ fontSize: ".68rem", color: C.green, marginTop: 3, fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}

/* ───────── BAR ───────── */
function Bar({ label, pct, color, delay }: { label: string; pct: number; color: string; delay: number }) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setW(pct), delay); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct, delay]);
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", margin: "10px 0", gap: 12 }}>
      <div style={{ width: 220, fontSize: ".78rem", fontWeight: 600, textAlign: "right", flexShrink: 0, color: C.t2 }}>{label}</div>
      <div style={{ flex: 1, height: 28, background: C.dark3, borderRadius: 7, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 7, display: "flex", alignItems: "center", paddingLeft: 12,
          fontSize: ".72rem", fontWeight: 700, color: C.dark, width: `${w}%`,
          transition: "width 1.5s cubic-bezier(.25,.46,.45,.94)", background: color,
        }}>{pct}%</div>
      </div>
    </div>
  );
}

/* ───────── TABS ───────── */
function Tabs({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ display: "flex", gap: 3, background: C.dark2, borderRadius: 11, padding: 3, overflowX: "auto" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "10px 18px", background: i === active ? C.azure : "transparent",
            border: "none", color: i === active ? C.dark : C.t2,
            fontFamily: "'Inter',sans-serif", fontSize: ".78rem", fontWeight: 600,
            borderRadius: 9, cursor: "pointer", transition: ".3s", whiteSpace: "nowrap",
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ padding: "24px 0" }}>{tabs[active].content}</div>
    </div>
  );
}

/* ───────── ACCORDION ───────── */
function Accordion({ items }: { items: { title: string; content: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ marginTop: 20 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          background: C.dark2, border: `1px solid ${C.dark4}`, borderRadius: 11, margin: "8px 0", overflow: "hidden",
        }}>
          <div onClick={() => setOpen(open === i ? null : i)} style={{
            padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between",
            alignItems: "center", fontWeight: 600, fontSize: ".9rem", transition: ".3s",
          }}>
            {item.title}
            <span style={{ transition: "transform .3s", color: C.azure, fontSize: "1.1rem", transform: open === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
          </div>
          <div style={{ maxHeight: open === i ? 600 : 0, overflow: "hidden", transition: "max-height .5s", padding: "0 20px" }}>
            <div style={{ padding: "0 0 16px", color: C.t2, fontSize: ".84rem", lineHeight: 1.7 }}>{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────── QUIZ ───────── */
function Quiz({ question, options, correct, feedback }: { question: string; options: string[]; correct: number; feedback: string }) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div style={{ background: C.dark2, border: `1px solid ${C.dark4}`, borderRadius: 16, padding: 30, margin: "24px 0" }}>
      <div style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 18 }}>{question}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((o, i) => {
          const isSelected = sel === i;
          const isCorrect = i === correct;
          const bg = sel !== null ? (isSelected ? (isCorrect ? "rgba(52,211,153,.06)" : "rgba(248,113,113,.06)") : (isCorrect ? "rgba(52,211,153,.06)" : C.dark3)) : C.dark3;
          const border = sel !== null ? (isSelected ? (isCorrect ? C.green : C.red) : (isCorrect ? C.green : C.dark4)) : C.dark4;
          return (
            <div key={i} onClick={() => sel === null && setSel(i)} style={{
              padding: "12px 20px", background: bg, border: `2px solid ${border}`,
              borderRadius: 10, cursor: sel === null ? "pointer" : "default", transition: ".3s",
              fontSize: ".88rem", display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 7, background: C.dark4,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: ".78rem", flexShrink: 0,
              }}>{String.fromCharCode(65 + i)}</span>
              {o}
            </div>
          );
        })}
      </div>
      {sel !== null && (
        <div style={{
          marginTop: 14, padding: 16, borderRadius: 10, fontSize: ".84rem", lineHeight: 1.6,
          background: sel === correct ? "rgba(52,211,153,.08)" : "rgba(248,113,113,.08)",
          color: sel === correct ? C.green : C.red,
        }}>{feedback}</div>
      )}
    </div>
  );
}

/* ───────── CASE CARD ───────── */
function CaseCard({ company, title, desc, metrics, source }: {
  company: string; title: string; desc: string;
  metrics: { value: string; label: string; color: string }[];
  source: string;
}) {
  return (
    <Card style={{ padding: 0 }}>
      <div style={{ padding: "20px 22px 14px", borderBottom: `1px solid ${C.dark4}` }}>
        <div style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.azure, marginBottom: 4 }}>{company}</div>
        <div style={{ fontSize: ".95rem", fontWeight: 700, color: C.t1 }}>{title}</div>
      </div>
      <div style={{ padding: "16px 22px" }}>
        <p style={{ fontSize: ".8rem", color: C.t2, lineHeight: 1.6 }}>{desc}</p>
        <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ textAlign: "center", flex: 1, minWidth: 70 }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: m.color }}>{m.value}</div>
              <div style={{ fontSize: ".6rem", color: C.t3, textTransform: "uppercase", letterSpacing: ".5px", marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "10px 22px", background: C.dark3, fontSize: ".65rem", color: C.t3 }}>{source}</div>
    </Card>
  );
}

/* ───────── TOKEN DEMO ───────── */
function TokenDemo() {
  const [text, setText] = useState("Pactia gestiona un portafolio diversificado de activos inmobiliarios en Colombia y Panamá");

  const tokenize = (input: string): string[] => {
    if (!input) return [];
    const tokens: string[] = [];
    const words = input.split(/(\s+)/);
    for (const word of words) {
      if (/^\s+$/.test(word)) { tokens.push(word); continue; }
      if (word.length <= 3) { tokens.push(word); continue; }
      // Simulate BPE-like splitting
      const parts: string[] = [];
      let remaining = word;
      while (remaining.length > 0) {
        const len = remaining.length <= 4 ? remaining.length : Math.min(2 + Math.floor(Math.random() * 3), remaining.length);
        parts.push(remaining.slice(0, len));
        remaining = remaining.slice(len);
      }
      tokens.push(...parts);
    }
    return tokens;
  };

  const colors = [
    "rgba(0,169,224,.15)", "rgba(52,211,153,.15)", "rgba(167,139,250,.15)",
    "rgba(251,146,60,.15)", "rgba(251,191,36,.15)", "rgba(248,113,113,.15)",
    "rgba(0,169,224,.25)", "rgba(52,211,153,.25)",
  ];
  const borderColors = [
    "rgba(0,169,224,.4)", "rgba(52,211,153,.4)", "rgba(167,139,250,.4)",
    "rgba(251,146,60,.4)", "rgba(251,191,36,.4)", "rgba(248,113,113,.4)",
    "rgba(0,169,224,.5)", "rgba(52,211,153,.5)",
  ];

  const tokens = tokenize(text);
  const nonSpaceTokens = tokens.filter(t => !/^\s+$/.test(t));

  return (
    <div style={{ background: C.dark2, border: `1px solid ${C.dark4}`, borderRadius: 14, padding: 24, margin: "24px 0" }}>
      <h3>Tokenizador interactivo</h3>
      <p style={{ color: C.t3, fontSize: ".78rem", marginBottom: 14 }}>Escribe cualquier texto y observa cómo se divide en tokens. Así es como un LLM &ldquo;lee&rdquo; la información.</p>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe algo aquí..."
        style={{
          width: "100%", padding: "14px 18px", background: C.dark3,
          border: `1px solid ${C.dark4}`, borderRadius: 10, color: C.t1,
          fontFamily: "'Inter',sans-serif", fontSize: ".9rem", outline: "none",
        }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 14, minHeight: 36 }}>
        {tokens.map((t, i) => {
          if (/^\s+$/.test(t)) return <span key={i} style={{ width: 8 }} />;
          const ci = i % colors.length;
          return (
            <span key={i} style={{
              padding: "5px 10px", borderRadius: 6, fontSize: ".72rem",
              fontWeight: 600, fontFamily: "'JetBrains Mono',monospace",
              background: colors[ci], border: `1px solid ${borderColors[ci]}`,
              transition: ".2s", cursor: "default",
            }}>{t}</span>
          );
        })}
      </div>
      <div style={{ marginTop: 10, fontSize: ".78rem", color: C.t3, display: "flex", gap: 24 }}>
        <span><strong style={{ color: C.azure, fontFamily: "'JetBrains Mono',monospace" }}>{nonSpaceTokens.length}</strong> tokens</span>
        <span><strong style={{ color: C.green, fontFamily: "'JetBrains Mono',monospace" }}>{text.length}</strong> caracteres</span>
        <span>Ratio: <strong style={{ color: C.orange, fontFamily: "'JetBrains Mono',monospace" }}>{text.length > 0 ? (nonSpaceTokens.length / text.split(/\s+/).filter(Boolean).length).toFixed(1) : "0"}</strong> tokens/palabra</span>
      </div>
    </div>
  );
}

/* ───────── DATA PIPELINE STEP ───────── */
function PipelineStep({ step, title, desc, icon, color, active, onClick }: {
  step: number; title: string; desc: string; icon: string; color: string; active: boolean; onClick: () => void;
}) {
  return (
    <div onClick={onClick} style={{
      flex: 1, padding: "20px 16px", textAlign: "center", cursor: "pointer",
      transition: ".3s", borderRight: `1px solid ${C.dark4}`,
      background: active ? `${color}08` : C.dark2,
      borderBottom: active ? `2px solid ${color}` : "2px solid transparent",
    }}>
      <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{icon}</div>
      <div style={{
        fontSize: "1.4rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
        color: active ? color : C.t3, opacity: active ? 1 : 0.4, marginBottom: 4,
      }}>0{step}</div>
      <div style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: active ? color : C.t2 }}>{title}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
export default function Home() {
  const [scrollTop, setScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Nav />

      {/* ═══════ HERO ═══════ */}
      <Section id="hero" style={{ display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 70% 50%,rgba(0,169,224,.06) 0%,transparent 60%),radial-gradient(ellipse at 20% 80%,rgba(0,0,102,.08) 0%,transparent 50%)",
        }} />
        {/* Particles */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute", width: 2, height: 2, background: C.azure, borderRadius: "50%",
              opacity: 0, animation: `fp 8s infinite ${i * 0.6}s`,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            }} />
          ))}
        </div>
        <style>{`@keyframes fp{0%{opacity:0;transform:translateY(100vh)}10%{opacity:.4}90%{opacity:.4}100%{opacity:0;transform:translateY(-20vh)}}@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}@keyframes pl{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.5)}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px",
            background: C.azureGlow, border: "1px solid rgba(0,169,224,.2)", borderRadius: 24,
            fontSize: ".75rem", color: C.azure, fontWeight: 600, marginBottom: 28, letterSpacing: 1,
          }}>
            <span style={{ width: 6, height: 6, background: C.green, borderRadius: "50%", animation: "pl 2s infinite" }} />
            PACTIA x NODO EAFIT &mdash; Programa SinergIA 2026
          </div>

          <h1 style={{
            fontSize: "clamp(2.2rem,4.5vw,4rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: 20,
            background: `linear-gradient(135deg,#fff,${C.azureLight})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Entender la IA:<br />Fundamentos para<br />el negocio inmobiliario
          </h1>

          <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
            Sesión inaugural del programa <strong style={{ color: C.azure }}>SinergIA: IA y Analítica</strong>.
            Comprendamos juntos los conceptos clave de la Inteligencia Artificial, Big Data y analítica avanzada, y su
            impacto directo en el negocio de Pactia.
          </p>

          <div style={{ display: "flex", gap: 44, marginTop: 44, flexWrap: "wrap" }}>
            {[
              { v: "36h", l: "Programa total" },
              { v: "6", l: "Módulos" },
              { v: "6", l: "Sesiones" },
              { v: "3h", l: "Esta sesión" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: "2.2rem", fontWeight: 900, color: C.azure, fontFamily: "'JetBrains Mono',monospace" }}>{s.v}</div>
                <div style={{ fontSize: ".72rem", color: C.t3, textTransform: "uppercase", letterSpacing: 1, marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════ PACTIA CONTEXT ═══════ */}
      <Section id="pactia">
        <SN>Contexto</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Pactia: Líder en inversión inmobiliaria
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700, marginBottom: 8 }}>
          Gestor profesional de portafolios de inversión inmobiliaria. Asignan capital en los proyectos con mayor
          potencial de rentabilidad, buscando ser <strong style={{ color: C.azure }}>la primera opción en inversión inmobiliaria en Colombia</strong>.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 36 }}>
          <Card accent={C.azure}>
            <div style={{ fontSize: "2rem", marginBottom: 14 }}>🏬</div>
            <h3>Diversificación</h3>
            <p style={{ color: C.t2, fontSize: ".86rem", lineHeight: 1.6 }}>
              Portafolio diversificado con activos <strong style={{ color: C.t1 }}>comerciales, de almacenamiento,
              oficinas y alojamiento</strong>.<br />
              Presencia en <strong style={{ color: C.t1 }}>múltiples departamentos</strong> de Colombia + Panamá
            </p>
          </Card>
          <Card accent={C.green}>
            <div style={{ fontSize: "2rem", marginBottom: 14 }}>🌱</div>
            <h3 style={{ color: C.green }}>Sostenibilidad</h3>
            <p style={{ color: C.t2, fontSize: ".86rem", lineHeight: 1.6 }}>
              Compromiso con <strong style={{ color: C.t1 }}>bosques protegidos, reducción de CO2,
              energía solar</strong> y <strong style={{ color: C.t1 }}>economía circular</strong>.
              Sostenibilidad como motor de cambio positivo.
            </p>
          </Card>
          <Card accent={C.orange}>
            <div style={{ fontSize: "2rem", marginBottom: 14 }}>📈</div>
            <h3 style={{ color: C.orange }}>Trayectoria</h3>
            <p style={{ color: C.t2, fontSize: ".86rem", lineHeight: 1.6 }}>
              Amplio historial de <strong style={{ color: C.t1 }}>proyectos desarrollados</strong> con
              cientos de miles de m2 construidos. Marcas reconocidas en los segmentos comercial,
              logístico, corporativo y de almacenamiento.
            </p>
          </Card>
        </div>

        <div style={{
          marginTop: 36, padding: 28, background: C.dark2, border: `1px solid ${C.dark4}`, borderRadius: 14,
          display: "flex", alignItems: "center", gap: 24,
        }}>
          <div style={{ fontSize: "2.5rem" }}>💡</div>
          <div>
            <h3>¿Por que IA para Pactia?</h3>
            <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7 }}>
              Con un <strong style={{ color: C.t1 }}>portafolio diversificado</strong>, amplia presencia geográfica y un
              compromiso firme con la sostenibilidad, Pactia tiene la escala y complejidad perfecta para que la IA
              genere valor real: desde <strong style={{ color: C.t1 }}>optimizar operaciones</strong> hasta{" "}
              <strong style={{ color: C.t1 }}>predecir tendencias del mercado</strong> y{" "}
              <strong style={{ color: C.t1 }}>potenciar decisiones de inversión</strong>.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══════ QUE ES IA ═══════ */}
      <Section id="que-es-ia">
        <SN>Fundamentos</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ¿Qué es la Inteligencia Artificial?
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          La IA no es una sola tecnologia: es un <strong style={{ color: C.t1 }}>ecosistema de capacidades</strong> que permite
          a las máquinas aprender, razonar y actuar. Entender sus capas es clave para identificar oportunidades reales.
        </p>

        {/* Iceberg visual */}
        <div style={{
          position: "relative", width: "100%", maxWidth: 800, margin: "36px auto", minHeight: 500,
          background: C.dark2, borderRadius: 16, border: `1px solid ${C.dark4}`, overflow: "hidden",
        }}>
          {/* Water line */}
          <div style={{
            position: "absolute", top: "30%", left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg,transparent,${C.azure},transparent)`,
          }} />
          <div style={{
            position: "absolute", top: "30%", left: 0, right: 0, bottom: 0,
            background: `linear-gradient(180deg,rgba(0,169,224,.04),rgba(0,0,102,.12))`,
          }} />

          {/* Visible part */}
          <div style={{ padding: "30px 40px", position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
              Lo que vemos: IA Generativa
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {["ChatGPT / Claude / Gemini", "Generación de imágenes", "Asistentes conversacionales"].map((t, i) => (
                <div key={i} style={{ padding: "12px 16px", background: "rgba(251,146,60,.06)", border: "1px solid rgba(251,146,60,.15)", borderRadius: 8, fontSize: ".82rem", color: C.t2 }}>{t}</div>
              ))}
            </div>
          </div>

          {/* Hidden part */}
          <div style={{ padding: "20px 40px 30px", position: "relative", zIndex: 2, marginTop: 30 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.azure, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
              Lo que hay debajo: el verdadero poder
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { t: "Machine Learning", d: "Modelos que aprenden de datos históricos" },
                { t: "Deep Learning", d: "Redes neuronales para patrones complejos" },
                { t: "NLP", d: "Procesamiento de lenguaje natural" },
                { t: "Computer Vision", d: "Análisis automatizado de imágenes" },
                { t: "Analítica Predictiva", d: "Anticipar comportamientos y tendencias" },
                { t: "Sistemas de Recomendación", d: "Personalizar experiencias y decisiones" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px",
                  background: "rgba(0,0,102,.12)", border: "1px solid rgba(0,169,224,.08)", borderRadius: 9,
                }}>
                  <div>
                    <div style={{ fontSize: ".82rem", fontWeight: 700, color: C.azureLight, marginBottom: 2 }}>{item.t}</div>
                    <div style={{ fontSize: ".7rem", color: C.t3, lineHeight: 1.3 }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Quiz
          question="¿Cuál de estas afirmaciones sobre la IA es correcta?"
          options={[
            "La IA reemplazara todos los empleos humanos en los proximos 5 anos",
            "La IA es una herramienta que potencia la toma de decisiones humanas",
            "Solo las empresas de tecnologia pueden beneficiarse de la IA",
            "La IA funciona sin necesidad de datos",
          ]}
          correct={1}
          feedback="Correcto. La IA es una herramienta poderosa que potencia las decisiones humanas, no las reemplaza. En el contexto de Pactia, la IA puede analizar millones de datos del mercado inmobiliario para informar mejor las decisiones de inversión, pero el juicio estratégico sigue siendo humano."
        />
      </Section>

      {/* ═══════ DATOS, BIG DATA, TOKENIZACION ═══════ */}
      <Section id="datos">
        <SN>El combustible de la IA</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Datos: sin datos no hay IA
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          La Inteligencia Artificial no es magia &mdash; es <strong style={{ color: C.t1 }}>matemática aplicada a datos</strong>.
          La calidad, volumen y estructura de los datos determinan el 80% del exito de cualquier proyecto de IA.
          Antes de hablar de algoritmos, hablemos de lo que realmente importa: <strong style={{ color: C.azure }}>los datos</strong>.
        </p>

        {/* Expectativa vs Realidad */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, margin: "36px 0" }}>
          {/* Cómo creen que es */}
          <div style={{
            background: C.dark2, border: `1px solid ${C.dark4}`, borderRadius: 16, padding: 32, position: "relative",
          }}>
            <div style={{
              fontSize: ".65rem", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
              color: C.red, marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.red }} />
              Expectativa
            </div>
            <h3 style={{ color: C.t1, fontSize: "1.2rem", marginBottom: 24 }}>Como creen las empresas que es la IA</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              {[
                { label: "Datos", color: C.azure, bg: "rgba(0,169,224,.12)" },
                { label: "→", color: C.t3, bg: "transparent" },
                { label: "IA", color: C.purple, bg: "rgba(167,139,250,.12)" },
                { label: "→", color: C.t3, bg: "transparent" },
                { label: "Valor", color: C.green, bg: "rgba(52,211,153,.12)" },
              ].map((item, i) => (
                item.label === "→" ? (
                  <div key={i} style={{ fontSize: "1.5rem", color: C.t3, fontWeight: 900 }}>→</div>
                ) : (
                  <div key={i} style={{
                    padding: "28px 32px", background: item.bg, borderRadius: 12,
                    border: `1px solid ${item.color}30`, textAlign: "center", flex: 1,
                  }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: item.color }}>{item.label}</div>
                  </div>
                )
              ))}
            </div>
            <p style={{ color: C.t3, fontSize: ".78rem", textAlign: "center", marginTop: 16, fontStyle: "italic" }}>
              &ldquo;Tenemos datos, metemos IA, y sale valor&rdquo; — el mito de los 3 pasos
            </p>
          </div>

          {/* Cómo es en realidad */}
          <div style={{
            background: C.dark2, border: `1px solid rgba(52,211,153,.2)`, borderRadius: 16, padding: 32,
          }}>
            <div style={{
              fontSize: ".65rem", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
              color: C.green, marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
              Realidad
            </div>
            <h3 style={{ color: C.t1, fontSize: "1.2rem", marginBottom: 20 }}>Como es en realidad</h3>

            {/* Three main columns */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              {/* Datos column */}
              <div style={{ flex: 1 }}>
                <div style={{
                  padding: "8px 12px", background: "rgba(0,169,224,.1)", borderRadius: "8px 8px 0 0",
                  textAlign: "center", fontWeight: 700, fontSize: ".78rem", color: C.azure,
                  borderBottom: `1px solid ${C.azure}30`,
                }}>Datos</div>
                <div style={{ background: "rgba(0,169,224,.04)", borderRadius: "0 0 8px 8px", padding: "8px 6px" }}>
                  {["Recopilación", "Almacenamiento", "Sintesis"].map((t, i) => (
                    <div key={i} style={{
                      padding: "5px 8px", margin: "3px 0", background: C.dark3, borderRadius: 6,
                      fontSize: ".65rem", color: C.t2, textAlign: "center", fontWeight: 600,
                    }}>{t}</div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", color: C.t3, fontSize: "1.2rem", fontWeight: 900 }}>→</div>

              {/* Ciencia de datos column */}
              <div style={{ flex: 2 }}>
                <div style={{
                  padding: "8px 12px", background: "rgba(52,211,153,.1)", borderRadius: "8px 8px 0 0",
                  textAlign: "center", fontWeight: 700, fontSize: ".78rem", color: C.green,
                  borderBottom: `1px solid ${C.green}30`,
                }}>Ciencia de datos</div>
                <div style={{ background: "rgba(52,211,153,.04)", borderRadius: "0 0 8px 8px", padding: "8px 6px" }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    <div style={{ flex: 1, padding: "4px 6px", background: "rgba(0,169,224,.08)", borderRadius: 6, fontSize: ".6rem", color: C.azure, textAlign: "center", fontWeight: 600 }}>Ing. de Datos</div>
                    <div style={{ flex: 1, padding: "4px 6px", background: "rgba(167,139,250,.08)", borderRadius: 6, fontSize: ".6rem", color: C.purple, textAlign: "center", fontWeight: 600 }}>Modelado</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3 }}>
                    {["Exploración", "Limpieza", "Normalización", "Escalado", "Selección", "Entrenamiento", "Evaluación", "Ajuste"].map((t, i) => (
                      <div key={i} style={{
                        padding: "4px 3px", background: i < 4 ? "rgba(0,169,224,.06)" : "rgba(167,139,250,.06)",
                        borderRadius: 4, fontSize: ".55rem", color: C.t2, textAlign: "center", fontWeight: 600,
                      }}>{t}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", color: C.t3, fontSize: "1.2rem", fontWeight: 900 }}>→</div>

              {/* Valor column */}
              <div style={{ flex: 1 }}>
                <div style={{
                  padding: "8px 12px", background: "rgba(251,191,36,.1)", borderRadius: "8px 8px 0 0",
                  textAlign: "center", fontWeight: 700, fontSize: ".78rem", color: C.yellow,
                  borderBottom: `1px solid ${C.yellow}30`,
                }}>Valor</div>
                <div style={{ background: "rgba(251,191,36,.04)", borderRadius: "0 0 8px 8px", padding: "8px 6px" }}>
                  <div style={{
                    padding: "4px 8px", margin: "3px 0", background: "rgba(251,191,36,.08)", borderRadius: 6,
                    fontSize: ".62rem", color: C.yellow, textAlign: "center", fontWeight: 600,
                  }}>Puesta en producción</div>
                  {["Registro", "Despliegue", "Monitoreo", "Reentrenamiento"].map((t, i) => (
                    <div key={i} style={{
                      padding: "4px 8px", margin: "3px 0", background: C.dark3, borderRadius: 6,
                      fontSize: ".6rem", color: C.t2, textAlign: "center", fontWeight: 600,
                    }}>{t}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Restricciones */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: ".65rem", fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Restricciones transversales:</div>
              {[
                { label: "Legal", color: "rgba(167,139,250,.15)", text: C.purple },
                { label: "Ética / Transparencia", color: "rgba(0,169,224,.1)", text: C.azure },
                { label: "Histórico (sesgos)", color: "rgba(251,191,36,.1)", text: C.yellow },
                { label: "Seguridad", color: "rgba(248,113,113,.1)", text: C.red },
              ].map((r, i) => (
                <div key={i} style={{
                  padding: "5px 12px", margin: "3px 0", background: r.color, borderRadius: 6,
                  fontSize: ".65rem", color: r.text, fontWeight: 600, textAlign: "center",
                }}>{r.label}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          padding: 20, background: "rgba(0,169,224,.04)", borderRadius: 12, borderLeft: `3px solid ${C.azure}`,
          marginBottom: 12,
        }}>
          <p style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.7 }}>
            <strong style={{ color: C.t1 }}>La lección clave:</strong> La IA no es solo &ldquo;meter datos y sacar valor&rdquo;.
            Hay un proceso completo de <strong style={{ color: C.azure }}>recopilación, limpieza, ingenieria, modelado, evaluación y despliegue</strong>,
            cruzado por restricciones de ética, seguridad y legalidad. Entender esto desde el inicio evita expectativas
            irreales y proyectos fallidos. <strong style={{ color: C.green }}>El 85% de los proyectos de IA que fracasan
            lo hacen por problemas de datos, no de algoritmos.</strong>
          </p>
        </div>

        {/* Big Data: Las 5 V expandidas */}
        <h3 style={{ marginTop: 40 }}>Big Data: Las 5 V que todo líder debe entender</h3>
        <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7, marginBottom: 24 }}>
          Big Data no es solo &ldquo;muchos datos&rdquo;. Es un fenómeno que se define por cinco dimensiones.
          Para Pactia, cada V tiene implicaciones directas en cómo pueden aprovechar la IA.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, marginBottom: 36 }}>
          {[
            {
              v: "Volumen", icon: "📊", color: C.azure,
              what: "La cantidad masiva de datos generados",
              pactia: "Los activos inmobiliarios generan datos de ocupación, energía, mantenimiento y financieros las 24 horas. Cada sensor IoT produce ~500 MB/día. Un solo centro comercial genera miles de transacciones diarias.",
              number: "~2.5 quintillones de bytes de datos se crean cada dia en el mundo"
            },
            {
              v: "Velocidad", icon: "⚡", color: C.green,
              what: "La rapidez con que se generan y deben procesarse",
              pactia: "Los datos de consumo energético, paneles solares, sistemas HVAC, el tráfico peatonal en centros comerciales — todo llega en tiempo real. La diferencia entre detectar un pico de consumo en minutos vs. días puede significar miles de dólares.",
              number: "Los sistemas modernos procesan millones de eventos por segundo"
            },
            {
              v: "Variedad", icon: "🔀", color: C.purple,
              what: "Los diferentes tipos y formatos de datos",
              pactia: "Pactia maneja: contratos PDF, imágenes de activos, datos de sensores, hojas de cálculo financieras, correos, reportes de mercado, datos de georreferenciación. Cada fuente tiene formato diferente — integrarlos es el reto.",
              number: "80% de los datos empresariales son no estructurados (textos, imágenes, PDFs)"
            },
            {
              v: "Veracidad", icon: "✅", color: C.orange,
              what: "La confiabilidad y precision de los datos",
              pactia: "Un sensor de temperatura descalibrado, un contrato mal digitalizado, un dato de mercado desactualizado — un solo dato erróneo puede llevar a decisiones de inversión equivocadas. La veracidad es crítica en un fondo de inversión inmobiliaria de esta escala.",
              number: "IBM estima que datos de mala calidad cuestan $3.1 trillones anuales solo en EE.UU."
            },
            {
              v: "Valor", icon: "💎", color: C.yellow,
              what: "La capacidad de extraer insights accionables",
              pactia: "El valor no está en tener datos, sino en convertirlos en decisiones: ¿Cuál activo tiene mayor riesgo de vacancia? ¿Dónde invertir en eficiencia energética? ¿Qué arrendatario necesita atención? Sin análisis, los datos son solo ruido.",
              number: "Solo el 32% de los datos empresariales se usa efectivamente (Forrester)"
            },
          ].map((item, i) => (
            <Card key={i} accent={item.color} style={{ padding: 20 }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{item.icon}</div>
              <h3 style={{ color: item.color, fontSize: "1.1rem" }}>{item.v}</h3>
              <p style={{ color: C.t1, fontSize: ".82rem", fontWeight: 600, marginBottom: 8 }}>{item.what}</p>
              <p style={{ color: C.t2, fontSize: ".78rem", lineHeight: 1.6, marginBottom: 12 }}>{item.pactia}</p>
              <div style={{
                padding: "8px 12px", background: `${item.color}10`, borderRadius: 8,
                fontSize: ".7rem", color: item.color, fontWeight: 600, borderLeft: `3px solid ${item.color}`,
              }}>{item.number}</div>
            </Card>
          ))}
        </div>

        {/* Tipos de datos */}
        <h3 style={{ marginTop: 48 }}>Tipos de datos: estructurados vs. no estructurados</h3>
        <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7, marginBottom: 24 }}>
          Entender la diferencia es fundamental porque la IA trabaja de forma diferente con cada tipo.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          <Card accent={C.azure}>
            <div style={{
              fontSize: ".65rem", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
              color: C.azure, marginBottom: 12, padding: "4px 10px", background: C.azureGlow,
              borderRadius: 8, display: "inline-block",
            }}>Estructurados</div>
            <p style={{ color: C.t1, fontSize: ".88rem", fontWeight: 600, marginBottom: 8 }}>
              Datos organizados en filas y columnas
            </p>
            <p style={{ color: C.t2, fontSize: ".82rem", lineHeight: 1.6, marginBottom: 12 }}>
              Tienen un formato predefinido, viven en bases de datos o hojas de cálculo. Son los más fáciles de analizar.
            </p>
            <div style={{ borderTop: `1px solid ${C.dark4}`, paddingTop: 12 }}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.t3, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Ejemplos en Pactia:</div>
              <ul style={{ color: C.t2, fontSize: ".78rem", lineHeight: 1.8, paddingLeft: 16 }}>
                <li>Tabla de ocupación por activo (% mensual)</li>
                <li>Ingresos por arrendamiento en Excel</li>
                <li>Datos de sensores IoT (temperatura, kWh)</li>
                <li>Base de datos de arrendatarios</li>
                <li>Indicadores financieros (ROI, NOI)</li>
              </ul>
            </div>
          </Card>
          <Card accent={C.purple}>
            <div style={{
              fontSize: ".65rem", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
              color: C.purple, marginBottom: 12, padding: "4px 10px", background: "rgba(167,139,250,.08)",
              borderRadius: 8, display: "inline-block",
            }}>Semi-estructurados</div>
            <p style={{ color: C.t1, fontSize: ".88rem", fontWeight: 600, marginBottom: 8 }}>
              Tienen alguna organización pero no rígida
            </p>
            <p style={{ color: C.t2, fontSize: ".82rem", lineHeight: 1.6, marginBottom: 12 }}>
              Contienen etiquetas o marcadores pero no siguen un esquema tabular estricto. Requieren procesamiento para ser analizados.
            </p>
            <div style={{ borderTop: `1px solid ${C.dark4}`, paddingTop: 12 }}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.t3, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Ejemplos en Pactia:</div>
              <ul style={{ color: C.t2, fontSize: ".78rem", lineHeight: 1.8, paddingLeft: 16 }}>
                <li>Correos con solicitudes de arrendatarios</li>
                <li>Reportes JSON de APIs inmobiliarias</li>
                <li>XML de integraciones con bancos</li>
                <li>Logs de sistemas de control de acceso</li>
                <li>Feeds RSS de noticias del sector</li>
              </ul>
            </div>
          </Card>
          <Card accent={C.orange}>
            <div style={{
              fontSize: ".65rem", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
              color: C.orange, marginBottom: 12, padding: "4px 10px", background: "rgba(251,146,60,.08)",
              borderRadius: 8, display: "inline-block",
            }}>No estructurados</div>
            <p style={{ color: C.t1, fontSize: ".88rem", fontWeight: 600, marginBottom: 8 }}>
              Sin formato predefinido &mdash; el 80% de los datos
            </p>
            <p style={{ color: C.t2, fontSize: ".82rem", lineHeight: 1.6, marginBottom: 12 }}>
              La mayoria de la información valiosa está aquí. Antes de la IA generativa, era muy difícil analizarlos. Ahora es posible.
            </p>
            <div style={{ borderTop: `1px solid ${C.dark4}`, paddingTop: 12 }}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.t3, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Ejemplos en Pactia:</div>
              <ul style={{ color: C.t2, fontSize: ".78rem", lineHeight: 1.8, paddingLeft: 16 }}>
                <li>Contratos de arrendamiento (PDFs)</li>
                <li>Fotografias de estado de activos</li>
                <li>Grabaciones de reuniones con clientes</li>
                <li>Notas de inspección de propiedades</li>
                <li>Planos arquitectonicos y renders</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Tokenización */}
        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: "clamp(1.3rem,2.5vw,2rem)", marginBottom: 8 }}>Tokenización: cómo la IA &ldquo;lee&rdquo; los datos</h3>
          <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7, maxWidth: 700, marginBottom: 8 }}>
            Los modelos de IA no leen texto como nosotros. Primero lo dividen en <strong style={{ color: C.azure }}>tokens</strong>: fragmentos de palabras
            que el modelo puede procesar matemáticamente. Entender esto es crucial porque:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, margin: "20px 0" }}>
            {[
              { t: "Define el costo", d: "Los LLMs cobran por token. Un contrato de 50 páginas puede costar centavos o dólares dependiendo del modelo.", icon: "💰", color: C.green },
              { t: "Limita el contexto", d: "Cada modelo tiene un límite de tokens (ventana de contexto). GPT-4o: 128K tokens, Claude: 200K tokens. Más contexto = mejor comprensión.", icon: "📏", color: C.azure },
              { t: "Afecta la calidad", d: "Cómo tokenizas la información que le das al modelo determina qué tan buena será su respuesta. Basura entra = basura sale.", icon: "🎯", color: C.orange },
            ].map((item, i) => (
              <Card key={i} accent={item.color} style={{ padding: 20 }}>
                <div style={{ fontSize: "1.3rem", marginBottom: 8 }}>{item.icon}</div>
                <h3 style={{ color: item.color, fontSize: ".95rem" }}>{item.t}</h3>
                <p style={{ color: C.t2, fontSize: ".78rem", lineHeight: 1.6 }}>{item.d}</p>
              </Card>
            ))}
          </div>

          {/* Visualización de tokenización paso a paso */}
          <div style={{
            background: C.dark2, border: `1px solid ${C.dark4}`, borderRadius: 14, padding: 28, margin: "24px 0",
          }}>
            <h3>¿Cómo funciona la tokenización?</h3>
            <p style={{ color: C.t3, fontSize: ".78rem", marginBottom: 20 }}>El proceso paso a paso de cómo un LLM convierte texto en números que puede procesar</p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              {[
                { step: "1. Texto original", example: "Pactia gestiona activos", color: C.t1, bg: C.dark3 },
                { step: "2. División en tokens", example: "[Pact] [ia] [gest] [iona] [activ] [os]", color: C.azure, bg: C.azureGlow },
                { step: "3. Token IDs", example: "[8291] [412] [7755] [3901] [6632] [521]", color: C.purple, bg: "rgba(167,139,250,.08)" },
                { step: "4. Embeddings (vectores)", example: "[0.23, -0.41, 0.87, ...]", color: C.green, bg: "rgba(52,211,153,.08)" },
              ].map((item, i) => (
                <div key={i} style={{ flex: 1, minWidth: 180 }}>
                  <div style={{
                    padding: "16px 14px", background: item.bg, borderRadius: 10,
                    border: `1px solid ${item.color}20`, textAlign: "center",
                  }}>
                    <div style={{ fontSize: ".65rem", fontWeight: 700, color: item.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{item.step}</div>
                    <div style={{ fontSize: ".78rem", fontFamily: "'JetBrains Mono',monospace", color: item.color, fontWeight: 600 }}>{item.example}</div>
                  </div>
                  {i < 3 && <div style={{ textAlign: "center", color: C.t3, fontSize: "1.2rem", margin: "4px 0" }}>→</div>}
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 20, padding: 16, background: "rgba(0,169,224,.04)", borderRadius: 10,
              borderLeft: `3px solid ${C.azure}`,
            }}>
              <p style={{ color: C.t2, fontSize: ".82rem", lineHeight: 1.6 }}>
                <strong style={{ color: C.t1 }}>¿Por que importa?</strong> Cuando le envias un contrato de arrendamiento a un LLM,
                este lo divide en miles de tokens. Un contrato tipico de Pactia (~10 páginas) puede generar entre
                <strong style={{ color: C.azure }}> 3,000 y 5,000 tokens</strong>. Con Claude (200K tokens de contexto), podrias analizar
                simultáneamente <strong style={{ color: C.azure }}>~40 contratos completos</strong> en una sola conversación.
              </p>
            </div>
          </div>

          {/* Interactive tokenizer */}
          <TokenDemo />

          {/* Token comparison table */}
          <div style={{
            background: C.dark2, border: `1px solid ${C.dark4}`, borderRadius: 14, padding: 24, margin: "24px 0",
          }}>
            <h3>Ventana de contexto: ¿cuanto &ldquo;cabe&rdquo; en cada modelo?</h3>
            <p style={{ color: C.t3, fontSize: ".78rem", marginBottom: 16 }}>Comparación de capacidad de los principales LLMs para procesar información</p>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.dark4}` }}>
              <thead>
                <tr>
                  {["Modelo", "Ventana de contexto", "Equivalente aprox.", "Ideal para"].map((h, i) => (
                    <th key={i} style={{ background: C.dark3, padding: "12px 16px", fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.azure, textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { model: "GPT-4o", tokens: "128K tokens", equiv: "~96,000 palabras / ~300 páginas", use: "Análisis de múltiples documentos", color: C.green },
                  { model: "Claude Opus/Sonnet", tokens: "200K tokens", equiv: "~150,000 palabras / ~500 páginas", use: "Contratos extensos, códigos legales", color: C.azure },
                  { model: "Gemini 2.5 Pro", tokens: "1M tokens", equiv: "~750,000 palabras / ~2,500 páginas", use: "Portafolios completos, due diligence", color: C.yellow },
                  { model: "GPT-4o mini", tokens: "128K tokens", equiv: "~96,000 palabras / ~300 páginas", use: "Tareas rápidas, alto volumen, bajo costo", color: C.t3 },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "10px 16px", fontSize: ".82rem", color: row.color, fontWeight: 700, borderBottom: `1px solid ${C.dark4}`, background: C.dark2, fontFamily: "'JetBrains Mono',monospace" }}>{row.model}</td>
                    <td style={{ padding: "10px 16px", fontSize: ".82rem", color: C.t2, borderBottom: `1px solid ${C.dark4}`, background: C.dark2, fontFamily: "'JetBrains Mono',monospace" }}>{row.tokens}</td>
                    <td style={{ padding: "10px 16px", fontSize: ".82rem", color: C.t2, borderBottom: `1px solid ${C.dark4}`, background: C.dark2 }}>{row.equiv}</td>
                    <td style={{ padding: "10px 16px", fontSize: ".82rem", color: C.t2, borderBottom: `1px solid ${C.dark4}`, background: C.dark2 }}>{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Levantamiento de Información */}
        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: "clamp(1.3rem,2.5vw,2rem)", marginBottom: 8 }}>Levantamiento de información: el primer paso crítico</h3>
          <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7, maxWidth: 700, marginBottom: 24 }}>
            Antes de aplicar cualquier modelo de IA, necesitamos saber <strong style={{ color: C.t1 }}>que datos tenemos,
            donde estan, en que formato y que tan confiables son</strong>. Este proceso de levantamiento es lo que
            separa los proyectos de IA exitosos de los que fracasan.
          </p>

          {/* Pipeline visual */}
          <Tabs tabs={[
            {
              label: "1. Identificar fuentes",
              content: (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div>
                    <h3 style={{ color: C.azure }}>¿Donde estan los datos de Pactia?</h3>
                    <p style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.7, marginBottom: 16 }}>
                      El primer paso es hacer un inventario completo de todas las fuentes de datos.
                      Muchas organizaciones descubren que tienen datos valiosos que nunca han utilizado.
                    </p>
                    <Accordion items={[
                      { title: "Sistemas internos (ERP, CRM)", content: "SAP, Oracle, o sistemas propios de gestión de activos. Aquí viven los datos financieros, contratos, inventarios. Son la columna vertebral pero a menudo están aislados en silos." },
                      { title: "Sensores IoT y Building Management", content: "Los sistemas BMS de los activos generan datos continuos: temperatura, humedad, consumo eléctrico, HVAC, ascensores. Cada sensor es una fuente de datos que la IA puede aprovechar." },
                      { title: "Documentos físicos y digitales", content: "Contratos PDF, planos CAD, fotografías de inspecciones, actas de reunión. El 80% de la información valiosa está en formatos no estructurados que ahora la GenAI puede procesar." },
                      { title: "Datos externos y de mercado", content: "DANE, Camacol, Galería Inmobiliaria, datos catastrales, índices de construcción. Complementan los datos internos para decisiones de inversión más informadas." },
                      { title: "Datos de terceros y arrendatarios", content: "Historiales crediticios, patrones de pago, feedback de encuestas de satisfaccion. Permiten predecir rotacion y personalizar la experiencia." },
                    ]} />
                  </div>
                  <Card>
                    <h3 style={{ color: C.orange }}>Errores comunes en el levantamiento</h3>
                    <div style={{ marginTop: 12 }}>
                      {[
                        { err: "Asumir que todos los datos estan digitalizados", fix: "Auditar datos en papel, notas manuscritas, correos personales" },
                        { err: "Ignorar datos no estructurados", fix: "Los PDFs, imágenes y correos contienen el 80% de la información valiosa" },
                        { err: "No validar la calidad desde el inicio", fix: "Un campo vacío en el 30% de los registros invalida todo el análisis" },
                        { err: "Olvidar los silos organizacionales", fix: "El área comercial y la de operaciones a menudo no comparten datos" },
                        { err: "Subestimar temas de privacidad", fix: "Datos de arrendatarios y financieros tienen restricciones legales" },
                      ].map((item, i) => (
                        <div key={i} style={{
                          padding: "12px 0", borderBottom: i < 4 ? `1px solid ${C.dark4}` : "none",
                        }}>
                          <div style={{ fontSize: ".82rem", fontWeight: 600, color: C.red, marginBottom: 4 }}>
                            ✗ {item.err}
                          </div>
                          <div style={{ fontSize: ".78rem", color: C.green }}>
                            ✓ {item.fix}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ),
            },
            {
              label: "2. Evaluar calidad",
              content: (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
                    <Counter value="80%" label="Tiempo en limpiar datos" sub="En un proyecto tipico de IA" color={C.red} />
                    <Counter value="$3.1T" label="Costo de mala calidad" sub="Anual en EE.UU. (IBM)" color={C.orange} />
                    <Counter value="1 de 3" label="Registros con errores" sub="Promedio empresarial" color={C.yellow} />
                    <Counter value="27%" label="Datos de ingresos incorrectos" sub="Promedio por empresa (Gartner)" color={C.purple} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <Card accent={C.green}>
                      <h3 style={{ color: C.green }}>6 dimensiones de calidad de datos</h3>
                      {[
                        { dim: "Completitud", desc: "¿Hay campos vacíos? ¿Faltan períodos? Un dataset de ocupación con meses faltantes no sirve para predicción.", pct: 95 },
                        { dim: "Exactitud", desc: "¿Los valores son correctos? Un área arrendable mal registrada distorsiona toda la valuación.", pct: 90 },
                        { dim: "Consistencia", desc: "¿El mismo concepto se registra igual en todos los sistemas? Si un activo se llama de una forma en un sistema y diferente en otro, la IA no los conecta.", pct: 85 },
                        { dim: "Oportunidad", desc: "¿Los datos están actualizados? Datos de ocupación de hace 6 meses son irrelevantes para decisiones de hoy.", pct: 80 },
                        { dim: "Validez", desc: "¿Los datos cumplen las reglas del negocio? Una tasa de ocupación de 120% indica un problema de registro.", pct: 88 },
                        { dim: "Unicidad", desc: "¿Hay registros duplicados? Dos entradas para el mismo arrendatario generan reportes incorrectos.", pct: 92 },
                      ].map((item, i) => (
                        <div key={i} style={{ margin: "14px 0" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: ".82rem", fontWeight: 700, color: C.t1 }}>{item.dim}</span>
                            <span style={{ fontSize: ".72rem", fontFamily: "'JetBrains Mono',monospace", color: C.green }}>{item.pct}% meta</span>
                          </div>
                          <p style={{ fontSize: ".75rem", color: C.t3, lineHeight: 1.5, marginBottom: 6 }}>{item.desc}</p>
                          <div style={{ height: 4, background: C.dark4, borderRadius: 2 }}>
                            <div style={{ height: "100%", width: `${item.pct}%`, background: C.green, borderRadius: 2 }} />
                          </div>
                        </div>
                      ))}
                    </Card>
                    <Card accent={C.azure}>
                      <h3>Framework de evaluación rápida</h3>
                      <p style={{ color: C.t2, fontSize: ".82rem", lineHeight: 1.6, marginBottom: 16 }}>
                        Preguntas clave para cada fuente de datos que identifiques en Pactia:
                      </p>
                      {[
                        "¿Quien es el dueno/responsable de estos datos?",
                        "¿Cada cuanto se actualizan?",
                        "¿Que porcentaje de campos esta completo?",
                        "¿Hay un proceso de validación al ingresar datos?",
                        "¿Se pueden exportar o tienen API disponible?",
                        "¿Hay restricciones legales o de privacidad?",
                        "¿Cuantos anos de historia hay disponibles?",
                        "¿Existen respaldos/backups confiables?",
                      ].map((q, i) => (
                        <div key={i} style={{
                          padding: "10px 16px", margin: "6px 0",
                          background: C.dark3, borderLeft: `3px solid ${C.azure}`,
                          borderRadius: "0 8px 8px 0", fontSize: ".82rem", color: C.t2, lineHeight: 1.5,
                        }}>{q}</div>
                      ))}
                    </Card>
                  </div>
                </div>
              ),
            },
            {
              label: "3. Estructurar y preparar",
              content: (
                <div>
                  <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7, marginBottom: 24 }}>
                    Una vez identificados y evaluados los datos, el siguiente paso es prepararlos para que la IA pueda consumirlos.
                    Este proceso se conoce como <strong style={{ color: C.t1 }}>ETL (Extract, Transform, Load)</strong> y es donde se
                    invierte la mayor parte del esfuerzo.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                    <Card accent={C.azure}>
                      <div style={{
                        fontSize: "2rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
                        color: C.azure, marginBottom: 8,
                      }}>E</div>
                      <h3>Extraer</h3>
                      <p style={{ color: C.t2, fontSize: ".82rem", lineHeight: 1.6 }}>
                        Conectar a las fuentes y extraer los datos en crudo. APIs, scraping de PDFs, lectura de sensores,
                        exportacion de Excel. Para Pactia: extraer datos del BMS de cada activo, digitalizar contratos,
                        conectar con APIs de mercado.
                      </p>
                    </Card>
                    <Card accent={C.purple}>
                      <div style={{
                        fontSize: "2rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
                        color: C.purple, marginBottom: 8,
                      }}>T</div>
                      <h3>Transformar</h3>
                      <p style={{ color: C.t2, fontSize: ".82rem", lineHeight: 1.6 }}>
                        Limpiar, normalizar y enriquecer. Estandarizar nombres de activos, convertir unidades,
                        rellenar valores faltantes, validar rangos. Ejemplo: unificar &ldquo;m2&rdquo;, &ldquo;mts2&rdquo;, &ldquo;metros cuadrados&rdquo;
                        en un solo formato.
                      </p>
                    </Card>
                    <Card accent={C.green}>
                      <div style={{
                        fontSize: "2rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
                        color: C.green, marginBottom: 8,
                      }}>L</div>
                      <h3>Cargar</h3>
                      <p style={{ color: C.t2, fontSize: ".82rem", lineHeight: 1.6 }}>
                        Almacenar en un repositorio unificado: data lake, data warehouse o base vectorial.
                        Para IA generativa, se necesita ademas crear embeddings (representaciones vectoriales)
                        de los documentos para poder buscar semanticamente.
                      </p>
                    </Card>
                  </div>
                </div>
              ),
            },
            {
              label: "4. Gobernar y mantener",
              content: (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div>
                    <h3 style={{ color: C.orange }}>Gobernanza de datos: no es opcional</h3>
                    <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7, marginBottom: 16 }}>
                      Sin gobernanza, los datos se degradan con el tiempo. Para un fondo como Pactia que maneja
                      esta magnitud, la gobernanza de datos es un imperativo de negocio, no solo un tema de TI.
                    </p>
                    {[
                      { t: "Propietarios de datos claros", d: "Cada dataset tiene un responsable que garantiza su calidad y acceso." },
                      { t: "Catálogo de datos centralizado", d: "Un inventario vivo de todos los datos: que hay, donde esta, quien lo posee, que tan actualizado esta." },
                      { t: "Políticas de acceso y seguridad", d: "Quién puede ver qué datos. Los datos financieros y de arrendatarios requieren controles estrictos." },
                      { t: "Linaje de datos (data lineage)", d: "Trazabilidad de dónde viene cada dato, qué transformaciones ha sufrido y dónde se consume." },
                      { t: "Métricas de calidad continuas", d: "Dashboards que monitorean completitud, exactitud y frescura de los datos críticos." },
                    ].map((item, i) => (
                      <div key={i} style={{
                        padding: "12px 16px", margin: "8px 0", background: C.dark3,
                        borderRadius: 10, borderLeft: `3px solid ${C.orange}`,
                      }}>
                        <div style={{ fontSize: ".84rem", fontWeight: 700, color: C.t1 }}>{item.t}</div>
                        <div style={{ fontSize: ".78rem", color: C.t3, marginTop: 4 }}>{item.d}</div>
                      </div>
                    ))}
                  </div>
                  <Card accent={C.green}>
                    <h3 style={{ color: C.green }}>Madurez de datos: ¿donde esta Pactia?</h3>
                    <p style={{ color: C.t3, fontSize: ".78rem", marginBottom: 16 }}>Modelo de madurez tipico en gestion de datos organizacional</p>
                    {[
                      { level: 1, name: "Inicial", desc: "Datos en silos, Excel dispersos, sin estandares", color: C.red, w: "20%" },
                      { level: 2, name: "Gestionado", desc: "Algunos procesos definidos, bases de datos centrales", color: C.orange, w: "40%" },
                      { level: 3, name: "Definido", desc: "Catálogo de datos, propietarios asignados, politicas claras", color: C.yellow, w: "60%" },
                      { level: 4, name: "Medido", desc: "Métricas de calidad, linaje, monitoreo continuo", color: C.azure, w: "80%" },
                      { level: 5, name: "Optimizado", desc: "IA integrada, datos como activo estratégico, mejora continua", color: C.green, w: "100%" },
                    ].map((item, i) => (
                      <div key={i} style={{ margin: "12px 0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: ".82rem", fontWeight: 700, color: item.color }}>
                            Nivel {item.level}: {item.name}
                          </span>
                        </div>
                        <p style={{ fontSize: ".72rem", color: C.t3, lineHeight: 1.4, marginBottom: 6 }}>{item.desc}</p>
                        <div style={{ height: 6, background: C.dark4, borderRadius: 3 }}>
                          <div style={{ height: "100%", width: item.w, background: item.color, borderRadius: 3, transition: "width 1s" }} />
                        </div>
                      </div>
                    ))}
                    <div style={{
                      marginTop: 16, padding: 12, background: "rgba(52,211,153,.04)", borderRadius: 8,
                      borderLeft: `3px solid ${C.green}`, fontSize: ".78rem", color: C.t2, lineHeight: 1.5,
                    }}>
                      <strong style={{ color: C.green }}>Meta del programa SinergIA:</strong> Ayudar a Pactia a identificar su nivel actual
                      y disenar un plan para avanzar al menos un nivel durante los 6 modulos.
                    </div>
                  </Card>
                </div>
              ),
            },
          ]} />
        </div>

        {/* Quiz datos */}
        <Quiz
          question="En un proyecto de IA, ¿qué actividad consume más tiempo típicamente?"
          options={[
            "Entrenar el modelo de IA",
            "Limpiar, preparar y estructurar los datos",
            "Elegir el algoritmo correcto",
            "Presentar los resultados",
          ]}
          correct={1}
          feedback="Correcto. Se estima que el 80% del tiempo de un proyecto de IA se invierte en la preparación de datos (limpieza, transformación, validación). Por eso el levantamiento de información y la calidad de los datos son el factor #1 de éxito. No importa qué tan avanzado sea el modelo si los datos están incompletos, inconsistentes o desactualizados."
        />

        <Quiz
          question="Un contrato de arrendamiento de Pactia (10 páginas en PDF) se envía a un LLM para análisis. ¿Qué pasa primero?"
          options={[
            "El modelo lee el PDF directamente como un humano",
            "El PDF se convierte en texto y luego se tokeniza en fragmentos numericos",
            "El modelo memoriza el contrato completo para siempre",
            "El PDF se convierte en una imagen que el modelo interpreta",
          ]}
          correct={1}
          feedback="Exacto. El proceso es: PDF → extracción de texto (OCR si es escaneado) → tokenización (división en tokens) → conversión a números (embeddings) → procesamiento por el modelo. El contrato de 10 páginas genera aproximadamente 3,000-5,000 tokens. El modelo NO memoriza — solo procesa dentro de su ventana de contexto actual."
        />
      </Section>

      {/* ═══════ GEN AI / LLM / BIG DATA ═══════ */}
      <Section id="genai">
        <SN>Conceptos Clave</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          GenAI, LLM y Big Data
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          Tres conceptos que estan transformando todas las industrias, incluyendo el real estate.
        </p>

        <Tabs tabs={[
          {
            label: "IA Generativa",
            content: (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
                <div>
                  <h3>¿Qué es la IA Generativa?</h3>
                  <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7 }}>
                    Es la rama de la IA que <strong style={{ color: C.t1 }}>crea contenido nuevo</strong>: texto, imagenes,
                    codigo, analisis, reportes. A diferencia de la IA clasica que clasifica o predice, la GenAI genera.
                  </p>
                  <div style={{ marginTop: 20 }}>
                    <h3>Aplicaciones para Pactia</h3>
                    <ul style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.8, paddingLeft: 20 }}>
                      <li>Generación automática de reportes de activos</li>
                      <li>Análisis de contratos de arrendamiento</li>
                      <li>Chatbots para atención a arrendatarios</li>
                      <li>Creación de contenido de marketing para activos</li>
                      <li>Síntesis de estudios de mercado</li>
                    </ul>
                  </div>
                </div>
                <Card>
                  <h3>Ejemplo real: Prompt para Pactia</h3>
                  <div style={{
                    background: C.dark3, borderRadius: 10, padding: 16, marginTop: 12,
                    fontFamily: "'JetBrains Mono',monospace", fontSize: ".78rem", color: C.t2, lineHeight: 1.7,
                    border: `1px solid ${C.dark4}`,
                  }}>
                    <span style={{ color: C.azure }}>&ldquo;</span>Analiza los datos de ocupación del portafolio comercial
                    de Pactia en los ultimos 12 meses. Identifica tendencias, activos con mayor riesgo de vacancia
                    y genera recomendaciones para optimizar la estrategia de pricing.<span style={{ color: C.azure }}>&rdquo;</span>
                  </div>
                  <p style={{ color: C.t3, fontSize: ".75rem", marginTop: 12 }}>
                    Un LLM puede procesar y sintetizar informacion que a un analista le tomaria dias compilar.
                  </p>
                </Card>
              </div>
            ),
          },
          {
            label: "LLM (Modelos de Lenguaje)",
            content: (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
                  <div>
                    <h3>¿Qué es un LLM?</h3>
                    <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7 }}>
                      Los <strong style={{ color: C.t1 }}>Large Language Models</strong> son modelos de IA entrenados con
                      billones de palabras que pueden entender y generar lenguaje humano. Son la base de herramientas
                      como ChatGPT, Claude y Gemini.
                    </p>
                  </div>
                  <div>
                    <h3>Capacidades clave</h3>
                    <ul style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.8, paddingLeft: 20 }}>
                      <li><strong style={{ color: C.t1 }}>Comprensión:</strong> Entienden contexto, intenciones, matices</li>
                      <li><strong style={{ color: C.t1 }}>Generación:</strong> Producen texto coherente y util</li>
                      <li><strong style={{ color: C.t1 }}>Razonamiento:</strong> Analizan datos y sacan conclusiones</li>
                      <li><strong style={{ color: C.t1 }}>Traducción:</strong> Convierten entre idiomas y formatos</li>
                      <li><strong style={{ color: C.t1 }}>Código:</strong> Escriben y explican programacion</li>
                    </ul>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 28 }}>
                  {[
                    { name: "GPT-4o", org: "OpenAI", color: C.green },
                    { name: "Claude 4", org: "Anthropic", color: C.azure },
                    { name: "Gemini 2.5", org: "Google", color: C.yellow },
                    { name: "Llama 4", org: "Meta (Open Source)", color: C.purple },
                  ].map((m, i) => (
                    <Card key={i} accent={m.color}>
                      <div style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: m.color }}>{m.name}</div>
                      <div style={{ fontSize: ".75rem", color: C.t3, marginTop: 4 }}>{m.org}</div>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          },
          {
            label: "Big Data y Analitica",
            content: (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
                  <div>
                    <h3>Las 5 V del Big Data</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
                      {[
                        { v: "Volumen", d: "Terabytes de datos de operación, mercado, sensores" },
                        { v: "Velocidad", d: "Datos en tiempo real de ocupación, energía, tráfico" },
                        { v: "Variedad", d: "Contratos, sensores IoT, imágenes, reportes" },
                        { v: "Veracidad", d: "Calidad y confiabilidad de los datos" },
                        { v: "Valor", d: "Insights accionables para el negocio" },
                      ].map((item, i) => (
                        <Card key={i} style={{ padding: 16 }}>
                          <div style={{ fontSize: ".82rem", fontWeight: 700, color: C.azure }}>{item.v}</div>
                          <div style={{ fontSize: ".75rem", color: C.t3, marginTop: 4 }}>{item.d}</div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3>Datos en el contexto de Pactia</h3>
                    <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7, marginBottom: 16 }}>
                      Pactia genera y puede aprovechar datos de multiples fuentes:
                    </p>
                    <Accordion items={[
                      { title: "Datos operacionales", content: "Consumo energético de los activos del portafolio, estado de equipos HVAC, ascensores, sistemas de seguridad. Oportunidad: mantenimiento predictivo que reduce costos hasta 40%." },
                      { title: "Datos comerciales", content: "Contratos de arrendamiento, tasas de ocupación, pricing por m2, perfil de arrendatarios, rotación. Oportunidad: optimización de pricing dinámico." },
                      { title: "Datos de mercado", content: "Tendencias del sector inmobiliario, tasas de interes, índices de construcción, oferta nueva. Oportunidad: decisión de inversión basada en datos." },
                      { title: "Datos de sostenibilidad", content: "Huella de carbono, consumo de agua, generación solar de los paneles instalados, residuos. Oportunidad: reportes ESG automatizados y optimización energética." },
                    ]} />
                  </div>
                </div>
              </div>
            ),
          },
        ]} />
      </Section>

      {/* ═══════ IA EN REAL ESTATE ═══════ */}
      <Section id="real-estate">
        <SN>IA en la Industria</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          La IA está transformando el Real Estate
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          El sector inmobiliario vive una revolución silenciosa. Los lideres globales ya estan usando IA para
          tomar mejores decisiones y operar con mayor eficiencia.
        </p>

        {/* Market stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, margin: "36px 0" }}>
          <Counter value="$303B" label="Mercado IA en Real Estate 2025" sub="Business Research Co." />
          <Counter value="$989B" label="Proyección 2029" sub="CAGR 33.9%" color={C.green} />
          <Counter value="90%+" label="Firmas líder con IA como prioridad" color={C.purple} />
          <Counter value="72%" label="Propietarios planean invertir en IA" color={C.orange} />
        </div>

        <h3 style={{ marginTop: 36, marginBottom: 16 }}>Adopción de IA por area de aplicación</h3>
        <Bar label="Valuación automatizada (AVMs)" pct={85} color={C.azure} delay={0} />
        <Bar label="Eficiencia energética / Smart Buildings" pct={78} color={C.green} delay={200} />
        <Bar label="Mantenimiento predictivo" pct={60} color={C.purple} delay={400} />
        <Bar label="Analitica de inquilinos" pct={55} color={C.orange} delay={600} />
        <Bar label="Decisión de inversión con IA" pct={45} color={C.yellow} delay={800} />

        <div style={{
          marginTop: 36, padding: 28, background: `linear-gradient(135deg,${C.dark2},${C.dark3})`,
          border: `1px solid ${C.dark4}`, borderRadius: 14,
        }}>
          <h3 style={{ color: C.green }}>Dato clave: Colombia es lider en construcción verde</h3>
          <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7 }}>
            Colombia ocupa el <strong style={{ color: C.t1 }}>2do lugar mundial en m2 certificados EDGE</strong> (22.2 millones de m2).
            Con 490+ proyectos LEED registrados, reduciendo <strong style={{ color: C.t1 }}>190,277 toneladas de CO2 anuales</strong>.
            La Resolución 0194 de 2025 establece parámetros más ambiciosos &mdash; la IA será clave para cumplirlos eficientemente.
          </p>
        </div>
      </Section>

      {/* ═══════ CASOS REALES ═══════ */}
      <Section id="casos">
        <SN>Casos de Exito</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Quiénes ya lo están haciendo
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          Los lideres globales del real estate ya integran IA en sus operaciones con resultados medibles.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 28 }}>
          <CaseCard
            company="JLL"
            title="Carbon Pathfinder + IA Generativa"
            desc="JLL analiza 25+ trillones de puntos de datos con IA. Su Carbon Pathfinder logra 10% de reducción energética ($2M USD de ahorro por 10M ft2). Su asistente de IA abstrae contratos 60% más rápido."
            metrics={[
              { value: "10%", label: "Reducción energética", color: C.green },
              { value: "60%", label: "Más rápido en contratos", color: C.azure },
              { value: "$2M", label: "Ahorro anual", color: C.orange },
            ]}
            source="Fuente: JLL Research 2025"
          />
          <CaseCard
            company="Prologis"
            title="Logistica inteligente con IA + IoT"
            desc="El mayor REIT de logística del mundo logra 20% de reducción energética con IA+IoT en bodegas. 30% de espacios logísticos ahora automatizados. Plan de $8B para 20+ data centers."
            metrics={[
              { value: "20%", label: "Menos energía", color: C.green },
              { value: "30%", label: "Espacios automatizados", color: C.purple },
              { value: "$8B", label: "Inversion data centers", color: C.yellow },
            ]}
            source="Fuente: Prologis Smart Warehouse Report"
          />
          <CaseCard
            company="CBRE"
            title="Facilities Management con IA"
            desc="CBRE usa IA para gestionar 20,000 sitios y 1,000+ millones de ft2. Sistemas de IA generativa permiten a gerentes interactuar con datos de operación en lenguaje natural."
            metrics={[
              { value: "20K", label: "Sitios gestionados", color: C.azure },
              { value: "1B+", label: "ft2 con IA", color: C.green },
              { value: "17.6%", label: "Reducción costos op.", color: C.orange },
            ]}
            source="Fuente: CBRE / Facilities Dive 2025"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 20 }}>
          <CaseCard
            company="Royal London"
            title="Edificio inteligente en Birmingham"
            desc="Implementación de IA para optimización energética en un solo edificio comercial. Resultado: 21% de reducción energética con un ROI de 708%."
            metrics={[
              { value: "21%", label: "Menos energía", color: C.green },
              { value: "708%", label: "ROI", color: C.orange },
              { value: "148K", label: "GBP ahorro anual", color: C.azure },
            ]}
            source="Fuente: Smart Buildings Alliance"
          />
          <CaseCard
            company="Honeywell"
            title="Agentes IA para HVAC"
            desc="Los agentes de IA para sistemas HVAC reducen costos energeticos en 35%. 84% de tomadores de decision en edificios comerciales planean aumentar el uso de IA."
            metrics={[
              { value: "35%", label: "Reducción costos HVAC", color: C.green },
              { value: "84%", label: "Planean más IA", color: C.purple },
              { value: "14%", label: "Ahorro promedio smart building", color: C.azure },
            ]}
            source="Fuente: Honeywell / Panorad AI 2025"
          />
          <CaseCard
            company="McKinsey & Harvard"
            title="Impacto de IA en productividad"
            desc="McKinsey estima $110-180B de valor potencial de IA en real estate. Harvard Business School: consultores usando IA producen trabajo de 40% mayor calidad."
            metrics={[
              { value: "$180B", label: "Valor potencial", color: C.yellow },
              { value: "40%", label: "Mas calidad con IA", color: C.green },
              { value: "$34B", label: "Eficiencia 2030 (Morgan Stanley)", color: C.azure },
            ]}
            source="Fuente: McKinsey / HBS / Morgan Stanley"
          />
        </div>
      </Section>

      {/* ═══════ OPORTUNIDADES PACTIA ═══════ */}
      <Section id="oportunidades">
        <SN>Oportunidades</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          IA aplicada al negocio de Pactia
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          Oportunidades concretas donde la IA puede generar valor medible para Pactia, priorizadas por impacto y viabilidad.
        </p>

        <Tabs tabs={[
          {
            label: "Gestión de activos",
            content: (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {[
                  { t: "Valuación automatizada", d: "Modelos de IA (AVMs) con error mediano de solo 2.8%, vs 10-15% tradicional. Revaluación del portafolio completo en minutos.", icon: "📊", impact: "Alto" },
                  { t: "Selección de sitios", d: "IA reduce tiempo de evaluación de sitios en 80-90%. Análisis de datos sociodemograficos, transito y competencia.", icon: "📍", impact: "Alto" },
                  { t: "Optimización de ocupación", d: "IA puede identificar patrones para optimizar la tasa de ocupación con pricing dinámico.", icon: "🏢", impact: "Medio-Alto" },
                  { t: "Inteligencia de contratos", d: "IA abstrae contratos 60% más rápido. JLL descubrió $1M+ en cláusulas de escalamiento no ejecutadas.", icon: "📄", impact: "Alto" },
                ].map((item, i) => (
                  <Card key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: "1.5rem" }}>{item.icon}</div>
                      <span style={{
                        fontSize: ".65rem", fontWeight: 700, padding: "3px 10px", borderRadius: 12,
                        background: "rgba(52,211,153,.08)", color: C.green,
                      }}>{item.impact}</span>
                    </div>
                    <h3>{item.t}</h3>
                    <p style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.6 }}>{item.d}</p>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            label: "Experiencia del inquilino",
            content: (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {[
                  { t: "Chatbots 24/7", d: "Atención automatizada para arrendatarios en los diferentes activos del portafolio. Manejo de consultas, solicitudes de mantenimiento y preguntas frecuentes.", icon: "💬" },
                  { t: "Predicción de rotación", d: "Modelos que analizan patrones de pago, solicitudes de mantenimiento y comunicacion para identificar arrendatarios en riesgo antes del vencimiento.", icon: "🔮" },
                  { t: "Smart Parking y tráfico", d: "Para los centros comerciales del portafolio: analítica de patrones de visitantes para optimizar mix de inquilinos y áreas comunes.", icon: "🅿️" },
                  { t: "Engagement personalizado", d: "Segmentar arrendatarios por comportamiento y ofrecer amenidades, pricing o incentivos de renovación personalizados.", icon: "🎯" },
                ].map((item, i) => (
                  <Card key={i}>
                    <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>{item.icon}</div>
                    <h3>{item.t}</h3>
                    <p style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.6 }}>{item.d}</p>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            label: "Mantenimiento predictivo",
            content: (
              <div>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28,
                }}>
                  <Counter value="-40%" label="Costo de mantenimiento" sub="Con IA predictiva" color={C.green} />
                  <Counter value="-90%" label="Fallas inesperadas" sub="Equipos monitoreados" color={C.azure} />
                  <Counter value="+30%" label="Vida util de equipos" sub="HVAC, ascensores" color={C.purple} />
                  <Counter value="67%" label="Edificios aun reactivos" sub="Oportunidad enorme" color={C.orange} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  {[
                    { t: "HVAC predictivo", d: "Los 13 activos de almacenamiento y 11 de oficinas tienen sistemas HVAC significativos. Sensores IoT + IA predicen fallas antes de que ocurran." },
                    { t: "Ascensores y escaleras", d: "Los centros comerciales del portafolio dependen de circulación vertical. IA reduce 90% de fallas inesperadas." },
                    { t: "Techos y estructuras", d: "Los techos de las bodegas logísticas son costosos de reparar reactivamente. IA monitorea y alerta tempranamente." },
                    { t: "Red de sensores IoT", d: "Monitoreo centralizado de todo el portafolio. Dashboard unificado con alertas automáticas." },
                  ].map((item, i) => (
                    <Card key={i}>
                      <h3>{item.t}</h3>
                      <p style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.6 }}>{item.d}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          },
          {
            label: "Sostenibilidad con IA",
            content: (
              <div>
                <div style={{
                  padding: 24, background: "rgba(52,211,153,.04)", border: `1px solid rgba(52,211,153,.15)`,
                  borderRadius: 14, marginBottom: 24,
                }}>
                  <h3 style={{ color: C.green }}>Edificios verdes generan mayor rentabilidad</h3>
                  <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7 }}>
                    Los edificios con certificacion verde obtienen <strong style={{ color: C.t1 }}>12-28% de prima en arriendos</strong> en los principales mercados.
                    Los green leases reducen consumo de oficinas en <strong style={{ color: C.t1 }}>11-22%</strong>.
                    La sostenibilidad ya no es compliance &mdash; es un <strong style={{ color: C.green }}>driver de valoracion</strong>.
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  {[
                    { t: "Optimización HVAC con IA", d: "35% de reducción en costos energeticos. Complementa los paneles solares del portafolio optimizando cuando usar solar vs. red.", icon: "⚡" },
                    { t: "Digital Twins", d: "Gemelos digitales del portafolio para simular escenarios de descarbonizacion antes de invertir capital. Probar retrofits virtuales.", icon: "🔄" },
                    { t: "Reportes ESG automatizados", d: "IA automatiza la recopilación y generación de reportes de sostenibilidad. Reduce carga operativa y mejora precisión.", icon: "📋" },
                    { t: "Iluminación inteligente", d: "LED + sensores de ocupación + programación IA. 10-20% de ahorro adicional en todos los activos del portafolio.", icon: "💡" },
                  ].map((item, i) => (
                    <Card key={i}>
                      <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>{item.icon}</div>
                      <h3 style={{ color: C.green }}>{item.t}</h3>
                      <p style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.6 }}>{item.d}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          },
        ]} />

        <Quiz
          question="¿Cuál sería el mayor impacto inmediato de IA para un fondo inmobiliario como Pactia?"
          options={[
            "Reemplazar a todo el equipo de gestión de activos con robots",
            "Usar IA para análisis automatizado de contratos, mantenimiento predictivo y optimización energética",
            "Construir un algoritmo de trading bursatil",
            "Eliminar la necesidad de datos históricos",
          ]}
          correct={1}
          feedback="Exacto. Los quick wins de IA para Pactia están en: 1) Análisis de contratos (60% más rápido, detectar clausulas perdidas), 2) Mantenimiento predictivo (40% menos costos), y 3) Optimización energética (35% ahorro en HVAC). Estos tres generan ROI medible en 6-12 meses."
        />
      </Section>

      {/* ═══════ ETICA Y GOBERNANZA ═══════ */}
      <Section id="etica">
        <SN>Principios</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Ética y gobernanza de la IA
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          La IA poderosa exige uso responsable. No basta con adoptar la tecnologia &mdash; debemos definir
          <strong style={{ color: C.t1 }}> cómo y con qué límites</strong> la usamos.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 36 }}>
          {[
            { t: "Transparencia", d: "Los modelos de IA deben poder explicar sus recomendaciones. En decisiones de inversión, Pactia necesita entender el 'por que' detras de cada sugerencia.", icon: "🔍", color: C.azure },
            { t: "Privacidad de datos", d: "Los datos de arrendatarios, contratos y operaciones son sensibles. Definir qué datos se comparten con modelos de IA y cuáles se mantienen internos.", icon: "🔒", color: C.green },
            { t: "Sesgo y equidad", d: "Los modelos pueden heredar sesgos. En pricing y selección de arrendatarios, hay que auditar que la IA no discrimine injustamente.", icon: "⚖️", color: C.purple },
            { t: "Supervisión humana", d: "La IA apoya, no reemplaza. Las decisiones críticas de inversión y estrategia siempre requieren validación humana. Human-in-the-loop.", icon: "👤", color: C.orange },
            { t: "Seguridad", d: "Proteger los modelos de IA contra manipulacion. Un modelo comprometido podria generar valoraciones erróneas o exponer datos confidenciales.", icon: "🛡️", color: C.red },
            { t: "Responsabilidad", d: "Definir quien es responsable cuando la IA se equivoca. Politicas claras de gobernanza antes de escalar implementaciones.", icon: "📜", color: C.yellow },
          ].map((item, i) => (
            <Card key={i} accent={item.color}>
              <div style={{ fontSize: "1.5rem", marginBottom: 14 }}>{item.icon}</div>
              <h3 style={{ color: item.color }}>{item.t}</h3>
              <p style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.6 }}>{item.d}</p>
            </Card>
          ))}
        </div>

        <div style={{
          marginTop: 36, padding: 28, background: `linear-gradient(135deg,rgba(167,139,250,.04),rgba(0,169,224,.04))`,
          border: `1px solid ${C.dark4}`, borderRadius: 14,
        }}>
          <h3>La IA como apoyo, no como reemplazo</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 16 }}>
            <div style={{
              padding: 20, background: "rgba(248,113,113,.04)", border: "1px solid rgba(248,113,113,.15)", borderRadius: 12,
            }}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                Lo que la IA NO hace bien
              </div>
              <ul style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.8, paddingLeft: 20 }}>
                <li>Tomar decisiones estrategicas sin supervisión</li>
                <li>Reemplazar relaciones con inversionistas y arrendatarios</li>
                <li>Manejar negociaciones complejas con empatia</li>
                <li>Entender contexto político/regulatorio local</li>
                <li>Garantizar resultados (solo probabilidades)</li>
              </ul>
            </div>
            <div style={{
              padding: 20, background: "rgba(52,211,153,.04)", border: "1px solid rgba(52,211,153,.15)", borderRadius: 12,
            }}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                Lo que la IA hace muy bien
              </div>
              <ul style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.8, paddingLeft: 20 }}>
                <li>Procesar grandes volúmenes de datos rapidamente</li>
                <li>Identificar patrones invisibles al ojo humano</li>
                <li>Automatizar tareas repetitivas y análisis rutinarios</li>
                <li>Generar reportes y borradores instantáneos</li>
                <li>Monitorear operaciones 24/7 sin fatiga</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ ROADMAP ═══════ */}
      <Section id="roadmap">
        <SN>Lo que viene</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Roadmap del programa SinergIA
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          Esta es solo la primera de 6 sesiones. Un viaje de 36 horas donde pasaremos de entender la IA
          a construir soluciones reales para Pactia.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 36 }}>
          {[
            { n: "01", name: "Entender", hours: "3h", desc: "Fundamentos de IA y Big Data para no técnicos. Conceptos clave y su relación con el negocio de Pactia.", status: "En curso", color: C.azure, active: true },
            { n: "02", name: "Explorar", hours: "3h", desc: "IA aplicada al Real Estate y a la estrategia. Gestion de portafolios, evaluación de activos, inteligencia de mercados.", status: "Próximo", color: C.purple, active: false },
            { n: "03", name: "Hacer", hours: "6h", desc: "Análisis de datos y automatización con IA. Ejercicios prácticos con datos y escenarios reales de Pactia.", status: "Próximamente", color: C.green, active: false },
            { n: "04", name: "Transformar", hours: "8h", desc: "IA generativa y Data Storytelling. Narrar con datos para líderes, creación de contenidos estratégicos.", status: "Próximamente", color: C.orange, active: false },
            { n: "05", name: "Construir", hours: "8h", desc: "Proyectos aplicados por equipos. Definición de retos reales, desarrollo de prototipos y automatizaciones.", status: "Próximamente", color: C.yellow, active: false },
            { n: "06", name: "Apropiar", hours: "8h", desc: "Cierre y transferencia al negocio. Presentacion de proyectos, validación en contexto real, lecciones aprendidas.", status: "Próximamente", color: C.red, active: false },
          ].map((m, i) => (
            <Card key={i} accent={m.color} style={{ opacity: m.active ? 1 : 0.7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{
                  fontSize: "2rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
                  color: m.active ? m.color : C.t3, opacity: m.active ? 1 : 0.5,
                }}>{m.n}</div>
                <span style={{
                  fontSize: ".6rem", fontWeight: 700, padding: "3px 10px", borderRadius: 12,
                  background: m.active ? `${m.color}15` : `${C.t3}15`, color: m.active ? m.color : C.t3,
                  letterSpacing: 1,
                }}>{m.status}</span>
              </div>
              <h3 style={{ color: m.color }}>{m.name}</h3>
              <div style={{ fontSize: ".72rem", color: C.t3, fontFamily: "'JetBrains Mono',monospace", marginBottom: 8 }}>{m.hours}</div>
              <p style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.6 }}>{m.desc}</p>
            </Card>
          ))}
        </div>

        <div style={{
          marginTop: 36, padding: 28, background: `linear-gradient(135deg,${C.dark2},${C.dark3})`,
          border: `2px solid transparent`,
          backgroundClip: "padding-box",
          borderImage: `linear-gradient(135deg,${C.azure},${C.zafre}) 1`,
          borderRadius: 0, // border-image doesn't work with border-radius
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{
              fontSize: "2.5rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
              background: `linear-gradient(135deg,${C.azure},${C.purple})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>36h</div>
            <div>
              <h3>De Entender a Apropiar</h3>
              <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7 }}>
                El programa completo combina contenidos conceptuales con <strong style={{ color: C.t1 }}>ejercicios prácticos
                aplicados al contexto de Pactia</strong>. Los modulos 1 y 2 (6h) son para todo el grupo completo.
                Los modulos 3 a 6 (30h) se trabajan en grupos de maximo 25, con mentoría directa y desarrollo de proyectos reales.
              </p>
            </div>
          </div>
        </div>

        {/* Cierre inspiracional */}
        <div style={{
          marginTop: 60, textAlign: "center", padding: "60px 40px",
          background: `radial-gradient(ellipse at center,rgba(0,169,224,.06) 0%,transparent 70%)`,
        }}>
          <div style={{ fontSize: ".75rem", fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: C.azure, marginBottom: 16 }}>
            El futuro del real estate es inteligente
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 900, lineHeight: 1.1,
            background: `linear-gradient(135deg,#fff,${C.azureLight},${C.purple})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            maxWidth: 700, margin: "0 auto",
          }}>
            La pregunta ya no es si adoptar IA, sino qué tan rápido
          </h2>
          <p style={{ color: C.t2, fontSize: "1rem", lineHeight: 1.7, maxWidth: 600, margin: "20px auto 0" }}>
            Pactia tiene la escala, los datos y la vision. SinergIA es el camino para convertir esa ventaja en accion.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 32 }}>
            <div style={{
              padding: "10px 24px", background: C.azureGlow, border: `1px solid rgba(0,169,224,.2)`,
              borderRadius: 24, fontSize: ".8rem", color: C.azure, fontWeight: 600,
            }}>
              PACTIA
            </div>
            <div style={{
              padding: "10px 24px", background: "rgba(52,211,153,.08)", border: "1px solid rgba(52,211,153,.2)",
              borderRadius: 24, fontSize: ".8rem", color: C.green, fontWeight: 600,
            }}>
              NODO EAFIT
            </div>
          </div>
        </div>
      </Section>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          position: "fixed", bottom: 24, right: 24, width: 44, height: 44,
          background: C.azure, border: "none", borderRadius: 12, color: C.dark,
          fontSize: "1.2rem", cursor: "pointer", opacity: scrollTop ? 1 : 0,
          transition: ".3s", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        ↑
      </button>

      {/* Footer */}
      <footer style={{
        padding: "40px 56px", borderTop: `1px solid ${C.dark4}`, display: "flex",
        justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20,
      }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: ".85rem", color: C.azure, letterSpacing: 2, fontStyle: "italic" }}>SinergIA</div>
          <div style={{ fontSize: ".72rem", color: C.t3, marginTop: 4 }}>IA y Analitica &mdash; Pactia x NODO EAFIT</div>
        </div>
        <div style={{ fontSize: ".7rem", color: C.t3 }}>
          Sesión 1 de 6 &bull; Módulo: Entender &bull; 2026
        </div>
      </footer>
    </>
  );
}
