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
    { id: "que-es-ia", label: "Que es IA" },
    { id: "genai", label: "GenAI" },
    { id: "real-estate", label: "Real Estate" },
    { id: "casos", label: "Casos" },
    { id: "oportunidades", label: "Oportunidades" },
    { id: "etica", label: "Etica" },
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
          SESION 1
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
            Sesion inaugural del programa <strong style={{ color: C.azure }}>SinergIA: IA y Analitica</strong>.
            Comprendamos juntos los conceptos clave de la Inteligencia Artificial, Big Data y analitica avanzada, y su
            impacto directo en el negocio de Pactia.
          </p>

          <div style={{ display: "flex", gap: 44, marginTop: 44, flexWrap: "wrap" }}>
            {[
              { v: "36h", l: "Programa total" },
              { v: "6", l: "Modulos" },
              { v: "170", l: "Participantes" },
              { v: "3h", l: "Esta sesion" },
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
          Pactia: Lider en inversion inmobiliaria
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700, marginBottom: 8 }}>
          Gestor profesional de portafolios de inversion inmobiliaria. Asignan capital en los proyectos con mayor
          potencial de rentabilidad, buscando ser <strong style={{ color: C.azure }}>la primera opcion en inversion inmobiliaria en Colombia</strong>.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, margin: "36px 0" }}>
          <Counter value="COP 3.6T" label="Activos bajo administracion" />
          <Counter value="42" label="Activos en operacion" sub="683,498 m2 arrendables" />
          <Counter value="90.9%" label="Ocupacion fisica" sub="Portafolio no hotelero" />
          <Counter value="IPC+7.5%" label="Expectativa de rentabilidad" color={C.green} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 36 }}>
          <Card accent={C.azure}>
            <div style={{ fontSize: "2rem", marginBottom: 14 }}>🏬</div>
            <h3>Diversificacion</h3>
            <p style={{ color: C.t2, fontSize: ".86rem", lineHeight: 1.6 }}>
              <strong style={{ color: C.t1 }}>14</strong> activos comerciales &bull; <strong style={{ color: C.t1 }}>13</strong> almacenamiento &bull;{" "}
              <strong style={{ color: C.t1 }}>11</strong> oficinas &bull; <strong style={{ color: C.t1 }}>4</strong> alojamiento<br />
              Presencia en <strong style={{ color: C.t1 }}>11 departamentos</strong> de Colombia + Panama
            </p>
          </Card>
          <Card accent={C.green}>
            <div style={{ fontSize: "2rem", marginBottom: 14 }}>🌱</div>
            <h3 style={{ color: C.green }}>Sostenibilidad</h3>
            <p style={{ color: C.t2, fontSize: ".86rem", lineHeight: 1.6 }}>
              <strong style={{ color: C.t1 }}>79</strong> hectareas de bosques protegidos &bull;{" "}
              <strong style={{ color: C.t1 }}>844</strong> toneladas CO2 reducidas &bull;{" "}
              <strong style={{ color: C.t1 }}>+4,000</strong> paneles solares instalados &bull;{" "}
              <strong style={{ color: C.t1 }}>43%</strong> recuperacion de residuos
            </p>
          </Card>
          <Card accent={C.orange}>
            <div style={{ fontSize: "2rem", marginBottom: 14 }}>📈</div>
            <h3 style={{ color: C.orange }}>Capacidad de proyectos</h3>
            <p style={{ color: C.t2, fontSize: ".86rem", lineHeight: 1.6 }}>
              <strong style={{ color: C.t1 }}>$1.1 billones COP</strong> en proyectos desarrollados &bull;{" "}
              <strong style={{ color: C.t1 }}>450,000 m2</strong> construidos &bull; Marcas:{" "}
              <strong style={{ color: C.t1 }}>Gran Plaza, Logica, Buro, U-Storage</strong>
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
              Con <strong style={{ color: C.t1 }}>42 activos diversificados</strong>, millones de m2 en operacion y un
              compromiso firme con la sostenibilidad, Pactia tiene la escala y complejidad perfecta para que la IA
              genere valor real: desde <strong style={{ color: C.t1 }}>optimizar operaciones</strong> hasta{" "}
              <strong style={{ color: C.t1 }}>predecir tendencias del mercado</strong> y{" "}
              <strong style={{ color: C.t1 }}>potenciar decisiones de inversion</strong>.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══════ QUE ES IA ═══════ */}
      <Section id="que-es-ia">
        <SN>Fundamentos</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ¿Que es la Inteligencia Artificial?
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          La IA no es una sola tecnologia: es un <strong style={{ color: C.t1 }}>ecosistema de capacidades</strong> que permite
          a las maquinas aprender, razonar y actuar. Entender sus capas es clave para identificar oportunidades reales.
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
              {["ChatGPT / Claude / Gemini", "Generacion de imagenes", "Asistentes conversacionales"].map((t, i) => (
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
                { t: "Machine Learning", d: "Modelos que aprenden de datos historicos" },
                { t: "Deep Learning", d: "Redes neuronales para patrones complejos" },
                { t: "NLP", d: "Procesamiento de lenguaje natural" },
                { t: "Computer Vision", d: "Analisis automatizado de imagenes" },
                { t: "Analitica Predictiva", d: "Anticipar comportamientos y tendencias" },
                { t: "Sistemas de Recomendacion", d: "Personalizar experiencias y decisiones" },
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
          question="¿Cual de estas afirmaciones sobre la IA es correcta?"
          options={[
            "La IA reemplazara todos los empleos humanos en los proximos 5 anos",
            "La IA es una herramienta que potencia la toma de decisiones humanas",
            "Solo las empresas de tecnologia pueden beneficiarse de la IA",
            "La IA funciona sin necesidad de datos",
          ]}
          correct={1}
          feedback="Correcto. La IA es una herramienta poderosa que potencia las decisiones humanas, no las reemplaza. En el contexto de Pactia, la IA puede analizar millones de datos del mercado inmobiliario para informar mejor las decisiones de inversion, pero el juicio estrategico sigue siendo humano."
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
                  <h3>¿Que es la IA Generativa?</h3>
                  <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7 }}>
                    Es la rama de la IA que <strong style={{ color: C.t1 }}>crea contenido nuevo</strong>: texto, imagenes,
                    codigo, analisis, reportes. A diferencia de la IA clasica que clasifica o predice, la GenAI genera.
                  </p>
                  <div style={{ marginTop: 20 }}>
                    <h3>Aplicaciones para Pactia</h3>
                    <ul style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.8, paddingLeft: 20 }}>
                      <li>Generacion automatica de reportes de activos</li>
                      <li>Analisis de contratos de arrendamiento</li>
                      <li>Chatbots para atencion a arrendatarios</li>
                      <li>Creacion de contenido de marketing para activos</li>
                      <li>Sintesis de estudios de mercado</li>
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
                    <span style={{ color: C.azure }}>&ldquo;</span>Analiza los datos de ocupacion del portafolio comercial
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
                    <h3>¿Que es un LLM?</h3>
                    <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7 }}>
                      Los <strong style={{ color: C.t1 }}>Large Language Models</strong> son modelos de IA entrenados con
                      billones de palabras que pueden entender y generar lenguaje humano. Son la base de herramientas
                      como ChatGPT, Claude y Gemini.
                    </p>
                  </div>
                  <div>
                    <h3>Capacidades clave</h3>
                    <ul style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.8, paddingLeft: 20 }}>
                      <li><strong style={{ color: C.t1 }}>Comprension:</strong> Entienden contexto, intenciones, matices</li>
                      <li><strong style={{ color: C.t1 }}>Generacion:</strong> Producen texto coherente y util</li>
                      <li><strong style={{ color: C.t1 }}>Razonamiento:</strong> Analizan datos y sacan conclusiones</li>
                      <li><strong style={{ color: C.t1 }}>Traduccion:</strong> Convierten entre idiomas y formatos</li>
                      <li><strong style={{ color: C.t1 }}>Codigo:</strong> Escriben y explican programacion</li>
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
                        { v: "Volumen", d: "Terabytes de datos de operacion, mercado, sensores" },
                        { v: "Velocidad", d: "Datos en tiempo real de ocupacion, energia, trafico" },
                        { v: "Variedad", d: "Contratos, sensores IoT, imagenes, reportes" },
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
                      { title: "Datos operacionales", content: "Consumo energetico de 42 activos, estado de equipos HVAC, ascensores, sistemas de seguridad. Oportunidad: mantenimiento predictivo que reduce costos hasta 40%." },
                      { title: "Datos comerciales", content: "Contratos de arrendamiento, tasas de ocupacion, pricing por m2, perfil de arrendatarios, rotacion. Oportunidad: optimizacion de pricing dinamico." },
                      { title: "Datos de mercado", content: "Tendencias del sector inmobiliario, tasas de interes, indices de construccion, oferta nueva. Oportunidad: decision de inversion basada en datos." },
                      { title: "Datos de sostenibilidad", content: "Huella de carbono, consumo de agua, generacion solar de los +4,000 paneles, residuos. Oportunidad: reportes ESG automatizados y optimizacion energetica." },
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
          La IA esta transformando el Real Estate
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          El sector inmobiliario vive una revolucion silenciosa. Los lideres globales ya estan usando IA para
          tomar mejores decisiones y operar con mayor eficiencia.
        </p>

        {/* Market stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, margin: "36px 0" }}>
          <Counter value="$303B" label="Mercado IA en Real Estate 2025" sub="Business Research Co." />
          <Counter value="$989B" label="Proyeccion 2029" sub="CAGR 33.9%" color={C.green} />
          <Counter value="90%+" label="Firmas lider con IA como prioridad" color={C.purple} />
          <Counter value="72%" label="Propietarios planean invertir en IA" color={C.orange} />
        </div>

        <h3 style={{ marginTop: 36, marginBottom: 16 }}>Adopcion de IA por area de aplicacion</h3>
        <Bar label="Valuacion automatizada (AVMs)" pct={85} color={C.azure} delay={0} />
        <Bar label="Eficiencia energetica / Smart Buildings" pct={78} color={C.green} delay={200} />
        <Bar label="Mantenimiento predictivo" pct={60} color={C.purple} delay={400} />
        <Bar label="Analitica de inquilinos" pct={55} color={C.orange} delay={600} />
        <Bar label="Decision de inversion con IA" pct={45} color={C.yellow} delay={800} />

        <div style={{
          marginTop: 36, padding: 28, background: `linear-gradient(135deg,${C.dark2},${C.dark3})`,
          border: `1px solid ${C.dark4}`, borderRadius: 14,
        }}>
          <h3 style={{ color: C.green }}>Dato clave: Colombia es lider en construccion verde</h3>
          <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7 }}>
            Colombia ocupa el <strong style={{ color: C.t1 }}>2do lugar mundial en m2 certificados EDGE</strong> (22.2 millones de m2).
            Con 490+ proyectos LEED registrados, reduciendo <strong style={{ color: C.t1 }}>190,277 toneladas de CO2 anuales</strong>.
            La Resolucion 0194 de 2025 establece parametros mas ambiciosos &mdash; la IA sera clave para cumplirlos eficientemente.
          </p>
        </div>
      </Section>

      {/* ═══════ CASOS REALES ═══════ */}
      <Section id="casos">
        <SN>Casos de Exito</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Quienes ya lo estan haciendo
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          Los lideres globales del real estate ya integran IA en sus operaciones con resultados medibles.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 28 }}>
          <CaseCard
            company="JLL"
            title="Carbon Pathfinder + IA Generativa"
            desc="JLL analiza 25+ trillones de puntos de datos con IA. Su Carbon Pathfinder logra 10% de reduccion energetica ($2M USD de ahorro por 10M ft2). Su asistente de IA abstrae contratos 60% mas rapido."
            metrics={[
              { value: "10%", label: "Reduccion energetica", color: C.green },
              { value: "60%", label: "Mas rapido en contratos", color: C.azure },
              { value: "$2M", label: "Ahorro anual", color: C.orange },
            ]}
            source="Fuente: JLL Research 2025"
          />
          <CaseCard
            company="Prologis"
            title="Logistica inteligente con IA + IoT"
            desc="El mayor REIT de logistica del mundo logra 20% de reduccion energetica con IA+IoT en bodegas. 30% de espacios logisticos ahora automatizados. Plan de $8B para 20+ data centers."
            metrics={[
              { value: "20%", label: "Menos energia", color: C.green },
              { value: "30%", label: "Espacios automatizados", color: C.purple },
              { value: "$8B", label: "Inversion data centers", color: C.yellow },
            ]}
            source="Fuente: Prologis Smart Warehouse Report"
          />
          <CaseCard
            company="CBRE"
            title="Facilities Management con IA"
            desc="CBRE usa IA para gestionar 20,000 sitios y 1,000+ millones de ft2. Sistemas de IA generativa permiten a gerentes interactuar con datos de operacion en lenguaje natural."
            metrics={[
              { value: "20K", label: "Sitios gestionados", color: C.azure },
              { value: "1B+", label: "ft2 con IA", color: C.green },
              { value: "17.6%", label: "Reduccion costos op.", color: C.orange },
            ]}
            source="Fuente: CBRE / Facilities Dive 2025"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 20 }}>
          <CaseCard
            company="Royal London"
            title="Edificio inteligente en Birmingham"
            desc="Implementacion de IA para optimizacion energetica en un solo edificio comercial. Resultado: 21% de reduccion energetica con un ROI de 708%."
            metrics={[
              { value: "21%", label: "Menos energia", color: C.green },
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
              { value: "35%", label: "Reduccion costos HVAC", color: C.green },
              { value: "84%", label: "Planean mas IA", color: C.purple },
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
            label: "Gestion de activos",
            content: (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {[
                  { t: "Valuacion automatizada", d: "Modelos de IA (AVMs) con error mediano de solo 2.8%, vs 10-15% tradicional. Revaluacion del portafolio completo en minutos.", icon: "📊", impact: "Alto" },
                  { t: "Seleccion de sitios", d: "IA reduce tiempo de evaluacion de sitios en 80-90%. Analisis de datos sociodemograficos, transito y competencia.", icon: "📍", impact: "Alto" },
                  { t: "Optimizacion de ocupacion", d: "Con 90.9% de ocupacion, IA puede identificar patrones para alcanzar y mantener >95% con pricing dinamico.", icon: "🏢", impact: "Medio-Alto" },
                  { t: "Inteligencia de contratos", d: "IA abstrae contratos 60% mas rapido. JLL descubrio $1M+ en clausulas de escalamiento no ejecutadas.", icon: "📄", impact: "Alto" },
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
                  { t: "Chatbots 24/7", d: "Atencion automatizada para arrendatarios en Gran Plaza, Buro y U-Storage. Manejo de consultas, solicitudes de mantenimiento y preguntas frecuentes.", icon: "💬" },
                  { t: "Prediccion de rotacion", d: "Modelos que analizan patrones de pago, solicitudes de mantenimiento y comunicacion para identificar arrendatarios en riesgo antes del vencimiento.", icon: "🔮" },
                  { t: "Smart Parking y trafico", d: "Para los centros comerciales Gran Plaza: analitica de patrones de visitantes para optimizar mix de inquilinos y areas comunes.", icon: "🅿️" },
                  { t: "Engagement personalizado", d: "Segmentar arrendatarios por comportamiento y ofrecer amenidades, pricing o incentivos de renovacion personalizados.", icon: "🎯" },
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
                    { t: "Ascensores y escaleras", d: "Los centros comerciales Gran Plaza dependen de circulacion vertical. IA reduce 90% de fallas inesperadas." },
                    { t: "Techos y estructuras", d: "Los techos de las bodegas Logica son costosos de reparar reactivamente. IA monitorea y alerta tempranamente." },
                    { t: "Red de sensores IoT", d: "Monitoreo centralizado de los 683,498 m2 del portafolio. Dashboard unificado con alertas automaticas." },
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
                    { t: "Optimizacion HVAC con IA", d: "35% de reduccion en costos energeticos. Complementa los 4,500+ paneles solares de Pactia optimizando cuando usar solar vs. red.", icon: "⚡" },
                    { t: "Digital Twins", d: "Gemelos digitales del portafolio para simular escenarios de descarbonizacion antes de invertir capital. Probar retrofits virtuales.", icon: "🔄" },
                    { t: "Reportes ESG automatizados", d: "IA automatiza la recopilacion y generacion de reportes de sostenibilidad. Reduce carga operativa y mejora precision.", icon: "📋" },
                    { t: "Iluminacion inteligente", d: "LED + sensores de ocupacion + programacion IA. 10-20% de ahorro adicional en los 42 activos del portafolio.", icon: "💡" },
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
          question="¿Cual seria el mayor impacto inmediato de IA para un fondo inmobiliario como Pactia?"
          options={[
            "Reemplazar a todo el equipo de gestion de activos con robots",
            "Usar IA para analisis automatizado de contratos, mantenimiento predictivo y optimizacion energetica",
            "Construir un algoritmo de trading bursatil",
            "Eliminar la necesidad de datos historicos",
          ]}
          correct={1}
          feedback="Exacto. Los quick wins de IA para Pactia estan en: 1) Analisis de contratos (60% mas rapido, detectar clausulas perdidas), 2) Mantenimiento predictivo (40% menos costos), y 3) Optimizacion energetica (35% ahorro en HVAC). Estos tres generan ROI medible en 6-12 meses."
        />
      </Section>

      {/* ═══════ ETICA Y GOBERNANZA ═══════ */}
      <Section id="etica">
        <SN>Principios</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Etica y gobernanza de la IA
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          La IA poderosa exige uso responsable. No basta con adoptar la tecnologia &mdash; debemos definir
          <strong style={{ color: C.t1 }}> como y con que limites</strong> la usamos.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 36 }}>
          {[
            { t: "Transparencia", d: "Los modelos de IA deben poder explicar sus recomendaciones. En decisiones de inversion, Pactia necesita entender el 'por que' detras de cada sugerencia.", icon: "🔍", color: C.azure },
            { t: "Privacidad de datos", d: "Los datos de arrendatarios, contratos y operaciones son sensibles. Definir que datos se comparten con modelos de IA y cuales se mantienen internos.", icon: "🔒", color: C.green },
            { t: "Sesgo y equidad", d: "Los modelos pueden heredar sesgos. En pricing y seleccion de arrendatarios, hay que auditar que la IA no discrimine injustamente.", icon: "⚖️", color: C.purple },
            { t: "Supervision humana", d: "La IA apoya, no reemplaza. Las decisiones criticas de inversion y estrategia siempre requieren validacion humana. Human-in-the-loop.", icon: "👤", color: C.orange },
            { t: "Seguridad", d: "Proteger los modelos de IA contra manipulacion. Un modelo comprometido podria generar valoraciones erroneas o exponer datos confidenciales.", icon: "🛡️", color: C.red },
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
                <li>Tomar decisiones estrategicas sin supervision</li>
                <li>Reemplazar relaciones con inversionistas y arrendatarios</li>
                <li>Manejar negociaciones complejas con empatia</li>
                <li>Entender contexto politico/regulatorio local</li>
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
                <li>Procesar grandes volumenes de datos rapidamente</li>
                <li>Identificar patrones invisibles al ojo humano</li>
                <li>Automatizar tareas repetitivas y analisis rutinarios</li>
                <li>Generar reportes y borradores instantaneos</li>
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
            { n: "01", name: "Entender", hours: "3h", desc: "Fundamentos de IA y Big Data para no tecnicos. Conceptos clave y su relacion con el negocio de Pactia.", status: "En curso", color: C.azure, active: true },
            { n: "02", name: "Explorar", hours: "3h", desc: "IA aplicada al Real Estate y a la estrategia. Gestion de portafolios, evaluacion de activos, inteligencia de mercados.", status: "Proximo", color: C.purple, active: false },
            { n: "03", name: "Hacer", hours: "6h", desc: "Analisis de datos y automatizacion con IA. Ejercicios practicos con datos y escenarios reales de Pactia.", status: "Proximamente", color: C.green, active: false },
            { n: "04", name: "Transformar", hours: "8h", desc: "IA generativa y Data Storytelling. Narrar con datos para lideres, creacion de contenidos estrategicos.", status: "Proximamente", color: C.orange, active: false },
            { n: "05", name: "Construir", hours: "8h", desc: "Proyectos aplicados por equipos. Definicion de retos reales, desarrollo de prototipos y automatizaciones.", status: "Proximamente", color: C.yellow, active: false },
            { n: "06", name: "Apropiar", hours: "8h", desc: "Cierre y transferencia al negocio. Presentacion de proyectos, validacion en contexto real, lecciones aprendidas.", status: "Proximamente", color: C.red, active: false },
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
                El programa completo combina contenidos conceptuales con <strong style={{ color: C.t1 }}>ejercicios practicos
                aplicados al contexto de Pactia</strong>. Los modulos 1 y 2 (6h) son para todo el grupo de 170 personas.
                Los modulos 3 a 6 (30h) se trabajan en grupos de maximo 25, con mentoria directa y desarrollo de proyectos reales.
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
            La pregunta ya no es si adoptar IA, sino que tan rapido
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
          Sesion 1 de 6 &bull; Modulo: Entender &bull; 2026
        </div>
      </footer>
    </>
  );
}
