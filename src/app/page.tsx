"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

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
    { id: "ejercicios", label: "Ejercicios" },
    { id: "etica", label: "Ética" },
    { id: "estrategia", label: "Estrategia" },
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

/* ───────── NEURAL NETWORK ANIMATED BACKGROUND ───────── */
function NeuralNetworkBG() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // 3 layers (input 5, hidden 7, hidden 7, output 4)
    const layers = [5, 7, 7, 4];
    type Node = { x: number; y: number; pulse: number };
    type Pulse = { from: Node; to: Node; t: number; speed: number };
    const nodes: Node[][] = [];
    const pulses: Pulse[] = [];

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      nodes.length = 0;
      const padX = w * 0.08;
      const padY = h * 0.12;
      const usableW = w - padX * 2;
      const usableH = h - padY * 2;
      layers.forEach((count, li) => {
        const arr: Node[] = [];
        const lx = padX + (usableW * li) / (layers.length - 1);
        for (let i = 0; i < count; i++) {
          const ly = padY + (usableH * (i + 0.5)) / count;
          arr.push({ x: lx, y: ly, pulse: 0 });
        }
        nodes.push(arr);
      });
    };

    layout();

    const spawnPulse = () => {
      const layerIdx = Math.floor(Math.random() * (nodes.length - 1));
      const from = nodes[layerIdx][Math.floor(Math.random() * nodes[layerIdx].length)];
      const to = nodes[layerIdx + 1][Math.floor(Math.random() * nodes[layerIdx + 1].length)];
      pulses.push({ from, to, t: 0, speed: 0.005 + Math.random() * 0.01 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Connections
      ctx.lineWidth = 0.4;
      ctx.strokeStyle = "rgba(0,169,224,0.08)";
      for (let li = 0; li < nodes.length - 1; li++) {
        for (const a of nodes[li]) {
          for (const b of nodes[li + 1]) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) {
          p.to.pulse = 1;
          pulses.splice(i, 1);
          continue;
        }
        const x = p.from.x + (p.to.x - p.from.x) * p.t;
        const y = p.from.y + (p.to.y - p.from.y) * p.t;
        // Trail line
        const grad = ctx.createLinearGradient(p.from.x, p.from.y, x, y);
        grad.addColorStop(0, "rgba(0,169,224,0)");
        grad.addColorStop(1, "rgba(0,169,224,0.5)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.from.x, p.from.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        // Head
        ctx.fillStyle = "rgba(51,191,239,0.95)";
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes
      for (const layer of nodes) {
        for (const n of layer) {
          const r = 3 + n.pulse * 4;
          const glow = 0.25 + n.pulse * 0.55;
          ctx.fillStyle = `rgba(0,169,224,${glow})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(240,242,255,${0.55 + n.pulse * 0.45})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
          n.pulse *= 0.94;
        }
      }

      if (Math.random() < 0.12) spawnPulse();
      raf = requestAnimationFrame(draw);
    };

    draw();
    const onResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      layout();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        opacity: 0.55, pointerEvents: "none", zIndex: 1,
      }}
    />
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

/* ───────── COUNTER BOX (with count-up animation) ───────── */
function Counter({ value, label, sub, color }: { value: string; label: string; sub?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [hover, setHover] = useState(false);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!vis) return;
    const match = value.match(/^([^\d.-]*)(-?[\d.,]+)(.*)$/);
    if (!match) { setDisplay(value); return; }
    const prefix = match[1] || "";
    const numStr = match[2].replace(/,/g, "");
    const target = parseFloat(numStr);
    const suffix = match[3] || "";
    if (isNaN(target)) { setDisplay(value); return; }
    const decimals = (numStr.split(".")[1] || "").length;
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      const formatted = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [vis, value]);

  const c = color || C.azure;
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "center", padding: "24px 16px", background: C.dark2,
        border: `1px solid ${hover ? `${c}60` : C.dark4}`, borderRadius: 14,
        transition: ".3s", position: "relative", overflow: "hidden",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hover ? `0 12px 32px ${c}20` : "none",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 50% 0%,${c}12 0%,transparent 70%)`,
        opacity: hover ? 1 : 0.45, transition: ".3s", pointerEvents: "none",
      }} />
      <div style={{
        position: "relative",
        fontSize: "2.4rem", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace",
        background: `linear-gradient(135deg,${c},${C.azureLight})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{display}</div>
      <div style={{ position: "relative", fontSize: ".72rem", color: C.t3, marginTop: 6, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      {sub && <div style={{ position: "relative", fontSize: ".68rem", color: C.green, marginTop: 3, fontWeight: 600 }}>{sub}</div>}
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
      <div style={{
        flex: 1, height: 28, background: C.dark3, borderRadius: 7, overflow: "hidden",
        position: "relative", border: `1px solid ${C.dark4}`,
      }}>
        <div style={{
          height: "100%", borderRadius: 7, display: "flex", alignItems: "center", paddingLeft: 12,
          fontSize: ".72rem", fontWeight: 700, color: C.dark, width: `${w}%`,
          transition: "width 1.5s cubic-bezier(.25,.46,.45,.94)",
          background: `linear-gradient(90deg,${color}AA,${color})`,
          boxShadow: `inset 0 0 16px ${color}30, 0 0 8px ${color}40`,
          position: "relative", overflow: "hidden",
        }}>
          <span style={{ position: "relative", zIndex: 2 }}>{pct}%</span>
          <span style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: 40,
            background: `linear-gradient(90deg,transparent,rgba(255,255,255,.25))`,
            animation: "barShine 2.4s ease-in-out infinite",
          }} />
        </div>
      </div>
      <style>{`@keyframes barShine{0%,100%{opacity:0}50%{opacity:1}}`}</style>
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

/* ───────── EXPECTATIVA VS REALIDAD INTERACTIVO ───────── */
function ExpectativaVsRealidad() {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [showReality, setShowReality] = useState(false);

  const phases = [
    {
      id: "datos", label: "Datos", color: C.azure, icon: "🗄️",
      steps: ["Recopilación", "Almacenamiento", "Síntesis"],
      detail: "Antes de cualquier modelo, hay que identificar, recopilar y organizar los datos. En real estate esto incluye contratos, datos de sensores, reportes financieros, imágenes de activos y datos de mercado. Sin esta base, nada funciona.",
      pct: "20%", effort: "del esfuerzo total",
    },
    {
      id: "ciencia", label: "Ciencia de Datos", color: C.green, icon: "🔬",
      steps: ["Exploración", "Limpieza", "Normalización", "Preparación", "Selección de modelo", "Entrenamiento", "Evaluación", "Ajuste"],
      detail: "El corazón técnico: explorar los datos, limpiarlos (el 80% del tiempo se va aquí), normalizarlos, seleccionar el modelo adecuado, entrenarlo, evaluarlo y ajustarlo. Incluye ingeniería de datos y modelado.",
      pct: "60%", effort: "del esfuerzo total",
    },
    {
      id: "valor", label: "Valor", color: C.yellow, icon: "💎",
      steps: ["Puesta en producción", "Registro", "Despliegue", "Monitorización", "Reentrenamiento"],
      detail: "Llevar el modelo a producción es solo el inicio. Hay que registrarlo, desplegarlo, monitorearlo continuamente y reentrenarlo cuando los datos cambien. Un modelo sin monitoreo se degrada con el tiempo.",
      pct: "20%", effort: "del esfuerzo total",
    },
  ];

  const restrictions = [
    { label: "Legal", desc: "Regulaciones de protección de datos (Ley 1581 en Colombia), contratos de confidencialidad, normativa sectorial", color: C.purple, icon: "⚖️" },
    { label: "Ética / Transparencia", desc: "Explicabilidad de las decisiones de IA, equidad en pricing y selección, documentación de procesos", color: C.azure, icon: "🔍" },
    { label: "Histórico (sesgos)", desc: "Los datos históricos pueden contener sesgos que la IA amplifica: discriminación en valoraciones, patrones desactualizados", color: C.yellow, icon: "⚠️" },
    { label: "Seguridad", desc: "Protección contra ataques adversariales, acceso no autorizado a modelos, filtración de datos sensibles", color: C.red, icon: "🛡️" },
  ];

  return (
    <div style={{ margin: "36px 0" }}>
      {/* Toggle */}
      <div style={{ display: "flex", gap: 4, background: C.dark2, borderRadius: 11, padding: 3, marginBottom: 24 }}>
        <button onClick={() => setShowReality(false)} style={{
          flex: 1, padding: "12px 18px", background: !showReality ? C.red : "transparent",
          border: "none", color: !showReality ? "#fff" : C.t2,
          fontFamily: "'Inter',sans-serif", fontSize: ".82rem", fontWeight: 700,
          borderRadius: 9, cursor: "pointer", transition: ".3s",
        }}>❌ Cómo creen las empresas que es</button>
        <button onClick={() => setShowReality(true)} style={{
          flex: 1, padding: "12px 18px", background: showReality ? C.green : "transparent",
          border: "none", color: showReality ? C.dark : C.t2,
          fontFamily: "'Inter',sans-serif", fontSize: ".82rem", fontWeight: 700,
          borderRadius: 9, cursor: "pointer", transition: ".3s",
        }}>✅ Cómo es en realidad</button>
      </div>

      {!showReality ? (
        /* EXPECTATIVA */
        <div style={{
          background: C.dark2, border: `1px solid rgba(248,113,113,.15)`, borderRadius: 16, padding: 40, textAlign: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 32 }}>
            {[
              { label: "Datos", emoji: "📊", color: C.azure },
              { label: "→", color: C.t3 },
              { label: "IA", emoji: "🤖", color: C.purple },
              { label: "→", color: C.t3 },
              { label: "Valor", emoji: "💰", color: C.green },
            ].map((item, i) => (
              item.label === "→" ? (
                <div key={i} style={{ fontSize: "2rem", color: C.t3, fontWeight: 900 }}>→</div>
              ) : (
                <div key={i} style={{
                  padding: "32px 40px", background: `${item.color}12`, borderRadius: 16,
                  border: `2px solid ${item.color}30`, textAlign: "center", flex: 1, maxWidth: 200,
                }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{item.emoji}</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: item.color }}>{item.label}</div>
                </div>
              )
            ))}
          </div>
          <p style={{ color: C.t3, fontSize: ".9rem", fontStyle: "italic", maxWidth: 500, margin: "0 auto" }}>
            &ldquo;Tenemos datos, metemos IA, y sale valor&rdquo; — el mito de los 3 pasos
          </p>
          <div style={{
            marginTop: 24, padding: 16, background: "rgba(248,113,113,.06)", borderRadius: 10,
            border: "1px solid rgba(248,113,113,.15)",
          }}>
            <p style={{ color: C.red, fontSize: ".82rem", fontWeight: 600 }}>
              ⚠️ El 85% de los proyectos de IA fracasan por esta mentalidad simplista. Haz clic en &ldquo;Cómo es en realidad&rdquo; para ver el proceso completo.
            </p>
          </div>
        </div>
      ) : (
        /* REALIDAD — INTERACTIVO */
        <div style={{ background: C.dark2, border: `1px solid rgba(52,211,153,.2)`, borderRadius: 16, padding: 32 }}>
          {/* Pipeline interactivo */}
          <div style={{ display: "flex", gap: 0, marginBottom: 20, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.dark4}` }}>
            {phases.map((phase, i) => (
              <div key={phase.id} onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)} style={{
                flex: phase.id === "ciencia" ? 2 : 1, padding: "20px 16px", textAlign: "center",
                cursor: "pointer", transition: ".3s",
                borderRight: i < 2 ? `1px solid ${C.dark4}` : "none",
                background: activePhase === phase.id ? `${phase.color}10` : C.dark3,
                borderBottom: activePhase === phase.id ? `3px solid ${phase.color}` : `3px solid transparent`,
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>{phase.icon}</div>
                <div style={{ fontSize: ".85rem", fontWeight: 800, color: activePhase === phase.id ? phase.color : C.t1, marginBottom: 6 }}>{phase.label}</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: phase.color }}>{phase.pct}</div>
                <div style={{ fontSize: ".6rem", color: C.t3, textTransform: "uppercase", letterSpacing: 1 }}>{phase.effort}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 10, justifyContent: "center" }}>
                  {phase.steps.map((s, j) => (
                    <span key={j} style={{
                      padding: "3px 8px", borderRadius: 6, fontSize: ".58rem", fontWeight: 600,
                      background: activePhase === phase.id ? `${phase.color}15` : C.dark4,
                      color: activePhase === phase.id ? phase.color : C.t3,
                      transition: ".3s",
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Detalle expandible */}
          {activePhase && (
            <div style={{
              padding: 20, background: C.dark3, borderRadius: 12, marginBottom: 20,
              borderLeft: `3px solid ${phases.find(p => p.id === activePhase)?.color}`,
            }}>
              <p style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.7 }}>
                {phases.find(p => p.id === activePhase)?.detail}
              </p>
            </div>
          )}

          {/* Restricciones interactivas */}
          <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>
            Restricciones transversales — haz clic para explorar:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {restrictions.map((r, i) => (
              <div key={i} onClick={() => setActivePhase(activePhase === `r-${i}` ? null : `r-${i}`)} style={{
                padding: "10px 12px", background: activePhase === `r-${i}` ? r.color : `${r.color}15`,
                borderRadius: 8, cursor: "pointer", transition: ".3s", textAlign: "center",
                border: `1px solid ${activePhase === `r-${i}` ? r.color : "transparent"}`,
              }}>
                <div style={{ fontSize: "1rem", marginBottom: 4 }}>{r.icon}</div>
                <div style={{ fontSize: ".7rem", fontWeight: 700, color: activePhase === `r-${i}` ? C.dark : r.color }}>{r.label}</div>
              </div>
            ))}
          </div>
          {restrictions.map((r, i) => activePhase === `r-${i}` && (
            <div key={`d-${i}`} style={{
              marginTop: 12, padding: 16, background: C.dark3, borderRadius: 10,
              borderLeft: `3px solid ${r.color}`, fontSize: ".82rem", color: C.t2, lineHeight: 1.6,
            }}>{r.desc}</div>
          ))}

          {/* Callout */}
          <div style={{
            marginTop: 20, padding: 16, background: "rgba(0,169,224,.04)", borderRadius: 10,
            borderLeft: `3px solid ${C.azure}`,
          }}>
            <p style={{ color: C.t2, fontSize: ".82rem", lineHeight: 1.6 }}>
              <strong style={{ color: C.t1 }}>La lección clave:</strong> Hay un proceso completo de{" "}
              <strong style={{ color: C.azure }}>recopilación, limpieza, ingeniería, modelado, evaluación y despliegue</strong>,
              cruzado por restricciones de ética, seguridad y legalidad.{" "}
              <strong style={{ color: C.green }}>El 85% de los proyectos de IA que fracasan lo hacen por problemas de datos, no de algoritmos.</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── TYPING EFFECT ───────── */
function TypingEffect() {
  const phrases = [
    "¿Cómo puede la IA optimizar su portafolio?",
    "¿Qué datos están sin aprovechar?",
    "¿Dónde está el mayor ROI?",
    "¿Cómo reducir costos energéticos con IA?",
    "¿Qué insights esconden sus contratos?",
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    if (!deleting && charIdx < current.length) {
      const t = setTimeout(() => setCharIdx(charIdx + 1), 60);
      return () => clearTimeout(t);
    } else if (!deleting && charIdx === current.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    } else if (deleting && charIdx > 0) {
      const t = setTimeout(() => setCharIdx(charIdx - 1), 30);
      return () => clearTimeout(t);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx((phraseIdx + 1) % phrases.length);
    }
  }, [charIdx, deleting, phraseIdx, phrases]);

  return (
    <div style={{ marginTop: 20, height: 32, display: "flex", alignItems: "center" }}>
      <span style={{
        fontSize: "1.1rem", fontWeight: 600, color: C.azure, fontStyle: "italic",
        borderRight: `2px solid ${C.azure}`, paddingRight: 4,
        animation: "blink 1s step-end infinite",
      }}>
        {phrases[phraseIdx].slice(0, charIdx)}
      </span>
      <style>{`@keyframes blink{0%,100%{border-color:${C.azure}}50%{border-color:transparent}}`}</style>
    </div>
  );
}

/* ───────── MYTH BUSTER ───────── */
function MythBuster() {
  const [flipped, setFlipped] = useState<number | null>(null);

  const myths = [
    {
      myth: "La IA piensa como un humano",
      reality: "La IA no piensa, siente ni tiene consciencia. Es una herramienta estadística que identifica patrones en datos. Los LLMs predicen la siguiente palabra más probable, no 'comprenden' como nosotros.",
      icon: "🧠",
      color: C.purple,
    },
    {
      myth: "La IA siempre tiene razón",
      reality: "Los modelos de IA pueden 'alucinar' (generar información falsa con confianza). Siempre se requiere validación humana, especialmente en decisiones de inversión y valoración de activos.",
      icon: "🎯",
      color: C.red,
    },
    {
      myth: "Solo los programadores pueden usar IA",
      reality: "Herramientas como ChatGPT, Claude y Copilot permiten a cualquier profesional aprovechar la IA sin escribir código. Lo importante es saber hacer las preguntas correctas (prompt engineering).",
      icon: "💻",
      color: C.azure,
    },
    {
      myth: "La IA va a reemplazar todos los trabajos",
      reality: "La IA transforma roles, no los elimina. McKinsey estima que la IA automatizará tareas específicas, pero creará nuevos roles. Los profesionales que sepan usar IA serán más productivos, no reemplazados.",
      icon: "🤖",
      color: C.orange,
    },
    {
      myth: "Implementar IA es muy caro",
      reality: "Hoy existen herramientas de IA accesibles desde $20/mes por usuario. El ROI en análisis de contratos, eficiencia energética y mantenimiento predictivo puede alcanzarse en 3-6 meses con pilotos de bajo costo.",
      icon: "💰",
      color: C.green,
    },
  ];

  return (
    <div style={{ margin: "36px 0" }}>
      <h3 style={{ marginBottom: 8 }}>IA Myth Buster: mitos vs. realidad</h3>
      <p style={{ color: C.t3, fontSize: ".82rem", marginBottom: 20 }}>Haz clic en cada mito para descubrir la realidad</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
        {myths.map((m, i) => (
          <div
            key={i}
            onClick={() => setFlipped(flipped === i ? null : i)}
            style={{
              cursor: "pointer", transition: ".4s", perspective: 800,
              minHeight: flipped === i ? 260 : 180,
            }}
          >
            <div style={{
              background: flipped === i ? `${m.color}12` : C.dark2,
              border: `2px solid ${flipped === i ? m.color : C.dark4}`,
              borderRadius: 14, padding: 20, height: "100%",
              transition: ".4s", position: "relative", overflow: "hidden",
              transform: flipped === i ? "rotateY(0)" : "rotateY(0)",
            }}>
              {/* Top accent bar */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: flipped === i ? m.color : "transparent",
                transition: ".3s",
              }} />
              <div style={{ fontSize: "1.8rem", marginBottom: 10, textAlign: "center" }}>{m.icon}</div>
              {flipped !== i ? (
                <>
                  <div style={{
                    fontSize: ".82rem", fontWeight: 700, color: C.red, textAlign: "center",
                    lineHeight: 1.4, marginBottom: 12,
                  }}>
                    &ldquo;{m.myth}&rdquo;
                  </div>
                  <div style={{
                    fontSize: ".65rem", color: C.t3, textAlign: "center",
                    textTransform: "uppercase", letterSpacing: 1,
                  }}>Clic para ver realidad</div>
                </>
              ) : (
                <>
                  <div style={{
                    fontSize: ".68rem", fontWeight: 700, color: C.red, textTransform: "uppercase",
                    letterSpacing: 1, marginBottom: 6, textDecoration: "line-through", textAlign: "center",
                  }}>Mito</div>
                  <div style={{
                    fontSize: ".78rem", color: C.t2, lineHeight: 1.6,
                  }}>{m.reality}</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── CALCULADORA DE IMPACTO IA ───────── */
function CalculadoraImpactoIA() {
  const [activos, setActivos] = useState(15);
  const [gastoEnergia, setGastoEnergia] = useState(5000);
  const [contratos, setContratos] = useState(50);

  const ahorroEnergia = useMemo(() => ({
    min: activos * gastoEnergia * 12 * 0.10,
    max: activos * gastoEnergia * 12 * 0.20,
  }), [activos, gastoEnergia]);

  const ahorroContratos = useMemo(() => {
    const horasPorContrato = 8;
    const costoHora = 50;
    const reduccion = 0.60;
    return contratos * horasPorContrato * costoHora * reduccion;
  }, [contratos]);

  const ahorroMantenimiento = useMemo(() => {
    const costoMantenimientoAnualPorActivo = 12000;
    return activos * costoMantenimientoAnualPorActivo * 0.25;
  }, [activos]);

  const fmt = (n: number) => n >= 1000000
    ? `$${(n / 1000000).toFixed(1)}M`
    : n >= 1000
      ? `$${(n / 1000).toFixed(0)}K`
      : `$${n.toFixed(0)}`;

  return (
    <div style={{
      margin: "36px 0", background: C.dark2, border: `1px solid ${C.dark4}`,
      borderRadius: 16, padding: 32, overflow: "hidden", position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg,${C.azure},${C.green},${C.purple})`,
      }} />
      <h3 style={{ marginBottom: 4 }}>Calculadora de Impacto IA en Real Estate</h3>
      <p style={{ color: C.t3, fontSize: ".78rem", marginBottom: 28 }}>
        Ajusta los valores para estimar el ahorro potencial con IA (basado en benchmarks verificados de la industria)
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
        {/* Sliders */}
        <div>
          {/* Activos */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: ".82rem", fontWeight: 600, color: C.t1 }}>Activos en portafolio</label>
              <span style={{ fontSize: ".82rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: C.azure }}>{activos}</span>
            </div>
            <input
              type="range" min={1} max={100} value={activos}
              onChange={(e) => setActivos(Number(e.target.value))}
              style={{ width: "100%", accentColor: C.azure, cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".65rem", color: C.t3 }}>
              <span>1</span><span>100</span>
            </div>
          </div>

          {/* Gasto energetico */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: ".82rem", fontWeight: 600, color: C.t1 }}>Gasto energetico mensual/activo (USD)</label>
              <span style={{ fontSize: ".82rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: C.green }}>${gastoEnergia.toLocaleString()}</span>
            </div>
            <input
              type="range" min={500} max={20000} step={500} value={gastoEnergia}
              onChange={(e) => setGastoEnergia(Number(e.target.value))}
              style={{ width: "100%", accentColor: C.green, cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".65rem", color: C.t3 }}>
              <span>$500</span><span>$20,000</span>
            </div>
          </div>

          {/* Contratos */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: ".82rem", fontWeight: 600, color: C.t1 }}>Contratos de arrendamiento</label>
              <span style={{ fontSize: ".82rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: C.purple }}>{contratos}</span>
            </div>
            <input
              type="range" min={5} max={500} step={5} value={contratos}
              onChange={(e) => setContratos(Number(e.target.value))}
              style={{ width: "100%", accentColor: C.purple, cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".65rem", color: C.t3 }}>
              <span>5</span><span>500</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{
            padding: 20, background: "rgba(52,211,153,.06)", border: "1px solid rgba(52,211,153,.2)",
            borderRadius: 12,
          }}>
            <div style={{ fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.green, marginBottom: 6 }}>
              Ahorro energetico anual (10-20%)
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: C.green }}>
              {fmt(ahorroEnergia.min)} - {fmt(ahorroEnergia.max)}
            </div>
            <div style={{ fontSize: ".68rem", color: C.t3, marginTop: 4 }}>Benchmark: Honeywell, JLL, CBRE</div>
          </div>

          <div style={{
            padding: 20, background: "rgba(167,139,250,.06)", border: "1px solid rgba(167,139,250,.2)",
            borderRadius: 12,
          }}>
            <div style={{ fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.purple, marginBottom: 6 }}>
              Ahorro en analisis de contratos (60% mas rapido)
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: C.purple }}>
              {fmt(ahorroContratos)}
            </div>
            <div style={{ fontSize: ".68rem", color: C.t3, marginTop: 4 }}>Benchmark: JLL contract intelligence</div>
          </div>

          <div style={{
            padding: 20, background: "rgba(0,169,224,.06)", border: "1px solid rgba(0,169,224,.2)",
            borderRadius: 12,
          }}>
            <div style={{ fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.azure, marginBottom: 6 }}>
              Ahorro en mantenimiento predictivo (~25%)
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: C.azure }}>
              {fmt(ahorroMantenimiento)}
            </div>
            <div style={{ fontSize: ".68rem", color: C.t3, marginTop: 4 }}>Benchmark: Deloitte / McKinsey</div>
          </div>

          <div style={{
            padding: 16, background: `linear-gradient(135deg,${C.azure}08,${C.green}08)`,
            border: `1px solid ${C.azure}30`, borderRadius: 12, textAlign: "center",
          }}>
            <div style={{ fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.yellow, marginBottom: 6 }}>
              Impacto total estimado anual
            </div>
            <div style={{
              fontSize: "2rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
              background: `linear-gradient(135deg,${C.azure},${C.green})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {fmt(ahorroEnergia.min + ahorroContratos + ahorroMantenimiento)} - {fmt(ahorroEnergia.max + ahorroContratos + ahorroMantenimiento)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── BEFORE VS AFTER RACE ───────── */
function BeforeVsAfterRace() {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [humanStep, setHumanStep] = useState(0);
  const [humanTime, setHumanTime] = useState(0);
  const [aiDone, setAiDone] = useState(false);
  const [aiTime, setAiTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const humanSteps = [
    "Abriendo contrato PDF... (50 pags)",
    "Leyendo contrato... pagina 1 de 50",
    "Leyendo contrato... pagina 12 de 50",
    "Leyendo contrato... pagina 28 de 50",
    "Leyendo contrato... pagina 43 de 50",
    "Buscando cláusulas de terminación...",
    "Revisando fechas de vigencia...",
    "Calculando montos y garantias...",
    "Verificando partes involucradas...",
    "Cruzando con normativa vigente...",
    "Revisando cláusulas de penalidad...",
    "Redactando resumen ejecutivo...",
    "Verificando cifras manualmente...",
    "Análisis completo",
  ];

  const aiResults = [
    "Partes: Pactia S.A.S vs Arrendatario Corp",
    "Vigencia: 01/03/2025 - 28/02/2030",
    "Canon: $45,200,000 COP/mes + IPC",
    "Garantia: $135,600,000 COP",
    "Clausulas de riesgo: 3 detectadas",
    "Resumen ejecutivo: generado",
  ];

  const startRace = useCallback(() => {
    setState("running");
    setHumanStep(0);
    setHumanTime(0);
    setAiDone(false);
    setAiTime(0);

    // Human timer: counts up every 100ms
    let hTime = 0;
    timerRef.current = setInterval(() => {
      hTime += 0.1;
      setHumanTime(parseFloat(hTime.toFixed(1)));
    }, 100);

    // Human steps: appear one by one
    let step = 0;
    stepRef.current = setInterval(() => {
      step++;
      if (step < humanSteps.length) {
        setHumanStep(step);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        if (stepRef.current) clearInterval(stepRef.current);
        setState("done");
      }
    }, 3200);

    // AI: waits 2s then shows result
    setTimeout(() => {
      setAiDone(true);
      setAiTime(2.8);
    }, 2800);
  }, [humanSteps.length]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (stepRef.current) clearInterval(stepRef.current);
    setState("idle");
    setHumanStep(0);
    setHumanTime(0);
    setAiDone(false);
    setAiTime(0);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stepRef.current) clearInterval(stepRef.current);
    };
  }, []);

  return (
    <div style={{ margin: "36px 0" }}>
      <h3 style={{ marginBottom: 4 }}>Carrera: Sin IA vs Con IA</h3>
      <p style={{ color: C.t3, fontSize: ".82rem", marginBottom: 20 }}>
        Compara cuánto tarda un analista humano vs. la IA en analizar un contrato de arrendamiento de 50 páginas.
      </p>

      <div style={{
        background: C.dark2, border: `1px solid ${C.dark4}`, borderRadius: 16, overflow: "hidden",
      }}>
        {/* Header with start button */}
        <div style={{
          padding: "16px 24px", background: C.dark3, display: "flex", justifyContent: "space-between",
          alignItems: "center", borderBottom: `1px solid ${C.dark4}`,
        }}>
          <span style={{ fontSize: ".82rem", fontWeight: 700, color: C.t1 }}>Analisis de contrato de arrendamiento (50 páginas)</span>
          <button onClick={state === "idle" ? startRace : reset} style={{
            padding: "10px 28px", background: state === "idle" ? C.azure : C.dark4,
            border: "none", borderRadius: 10, color: state === "idle" ? C.dark : C.t2,
            fontWeight: 800, fontSize: ".85rem", cursor: "pointer", transition: ".3s",
            fontFamily: "'Inter',sans-serif", letterSpacing: 1,
            boxShadow: state === "idle" ? `0 0 20px ${C.azure}40` : "none",
          }}>
            {state === "idle" ? "START" : state === "running" ? "REINICIAR" : "REINICIAR"}
          </button>
        </div>

        {/* Race tracks */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 380 }}>
          {/* Human side */}
          <div style={{
            padding: 24, borderRight: `1px solid ${C.dark4}`,
            background: state === "done" ? "rgba(248,113,113,.03)" : "transparent",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: 2 }}>
                Sin IA (manual)
              </div>
              <div style={{
                fontSize: "1.6rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
                color: state === "running" ? C.red : C.t3,
              }}>
                {humanTime.toFixed(1)}s
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 6, background: C.dark4, borderRadius: 3, marginBottom: 16, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 3, background: C.red, transition: "width .5s",
                width: `${(humanStep / (humanSteps.length - 1)) * 100}%`,
              }} />
            </div>
            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {humanSteps.slice(0, humanStep + 1).map((step, i) => (
                <div key={i} style={{
                  padding: "8px 12px", background: i === humanStep && state === "running" ? "rgba(248,113,113,.08)" : C.dark3,
                  borderRadius: 8, fontSize: ".75rem", color: i === humanStep && state === "running" ? C.red : C.t3,
                  fontFamily: "'JetBrains Mono',monospace", transition: ".3s",
                  borderLeft: i === humanStep && state === "running" ? `3px solid ${C.red}` : "3px solid transparent",
                  opacity: state === "idle" ? 0.3 : 1,
                }}>
                  {i === humanStep && state === "running" && <span style={{ animation: "pl 1s infinite", marginRight: 6 }}>...</span>}
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* AI side */}
          <div style={{
            padding: 24,
            background: aiDone ? "rgba(52,211,153,.03)" : "transparent",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: 2 }}>
                Con IA
              </div>
              <div style={{
                fontSize: "1.6rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
                color: aiDone ? C.green : C.t3,
              }}>
                {aiDone ? `${aiTime.toFixed(1)}s` : state === "running" ? "Procesando..." : "0.0s"}
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 6, background: C.dark4, borderRadius: 3, marginBottom: 16, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 3, transition: "width .4s",
                background: `linear-gradient(90deg,${C.green},${C.azure})`,
                width: aiDone ? "100%" : state === "running" ? "15%" : "0%",
              }} />
            </div>
            {/* Results */}
            {state === "running" && !aiDone && (
              <div style={{
                padding: 20, textAlign: "center", color: C.t3, fontSize: ".82rem",
              }}>
                <div style={{ fontSize: "2rem", marginBottom: 8, animation: "pl 1.5s infinite" }}>...</div>
                Tokenizando y analizando documento...
              </div>
            )}
            {aiDone && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {aiResults.map((result, i) => (
                  <div key={i} style={{
                    padding: "10px 14px", background: "rgba(52,211,153,.06)",
                    border: "1px solid rgba(52,211,153,.15)", borderRadius: 8,
                    fontSize: ".78rem", color: C.green, fontFamily: "'JetBrains Mono',monospace",
                    animation: `fadeSlide .3s ease ${i * 0.08}s both`,
                  }}>
                    {result}
                  </div>
                ))}
                <div style={{
                  marginTop: 8, padding: 12, background: "rgba(52,211,153,.1)",
                  borderRadius: 8, textAlign: "center",
                  fontSize: ".72rem", fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: 1,
                }}>
                  Análisis completo
                </div>
              </div>
            )}
            {state === "idle" && (
              <div style={{ padding: 20, textAlign: "center", color: C.t3, fontSize: ".82rem" }}>
                Presiona START para comenzar la carrera
              </div>
            )}
          </div>
        </div>

        {/* Footer comparison */}
        {state === "done" && (
          <div style={{
            padding: "20px 24px", background: `linear-gradient(135deg,rgba(52,211,153,.06),rgba(0,169,224,.06))`,
            borderTop: `1px solid ${C.dark4}`, display: "flex", justifyContent: "center",
            alignItems: "center", gap: 20,
          }}>
            <span style={{ fontSize: "1.3rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: C.red }}>
              {humanTime.toFixed(1)}s
            </span>
            <span style={{ fontSize: ".82rem", color: C.t3, fontWeight: 700 }}>vs</span>
            <span style={{ fontSize: "1.3rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: C.green }}>
              {aiTime.toFixed(1)}s
            </span>
            <span style={{ fontSize: ".72rem", color: C.t3 }}>&mdash;</span>
            <span style={{
              fontSize: "1.1rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
              background: `linear-gradient(135deg,${C.azure},${C.green})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {Math.round(humanTime / aiTime)}x mas rapido
            </span>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeSlide{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}

/* ───────── DOCUMENT ANALYZER DEMO ───────── */
function DocumentAnalyzerDemo() {
  const defaultText = `CONTRATO DE ARRENDAMIENTO COMERCIAL celebrado entre PACTIA S.A.S., identificada con NIT 900.123.456-7, representada por María Fernanda López Gutiérrez, en calidad de ARRENDADOR, y GRUPO RETAIL COLOMBIA S.A., identificada con NIT 800.987.654-3, representada por Carlos Andrés Martínez Ruiz, en calidad de ARRENDATARIO, sobre el local comercial No. 245 ubicado en el Centro Comercial Viva Envigado, con un área de 187.5 m2, por un canon mensual de $42,350,000 COP (cuarenta y dos millones trescientos cincuenta mil pesos), con incremento anual del IPC + 2 puntos porcentuales, por un período de vigencia comprendido entre el 1 de marzo de 2025 y el 28 de febrero de 2030. El depósito de garantía corresponde a 3 meses de canon equivalente a $127,050,000 COP. En caso de terminación anticipada, el arrendatario deberá pagar una penalidad equivalente al 30% del canon restante del contrato.`;

  const [text, setText] = useState(defaultText);
  const [analysisState, setAnalysisState] = useState<"idle" | "analyzing" | "done">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  const analysisSteps = [
    { label: "Tokenizando texto...", duration: 500 },
    { label: "Identificando entidades...", duration: 800 },
    { label: "Extrayendo información clave...", duration: 600 },
    { label: "Generando resumen ejecutivo...", duration: 1000 },
  ];

  const extractEntities = useCallback((input: string) => {
    const dates: string[] = [];
    const amounts: string[] = [];
    const names: string[] = [];
    const percentages: string[] = [];

    // Dates
    const datePatterns = input.match(/\d{1,2}\s+de\s+\w+\s+de\s+\d{4}/gi);
    if (datePatterns) dates.push(...datePatterns);

    // Amounts with $
    const amountPatterns = input.match(/\$[\d.,]+(?:\s*(?:COP|USD|pesos))?/gi);
    if (amountPatterns) amounts.push(...amountPatterns);

    // Percentages
    const pctPatterns = input.match(/\d+(?:[.,]\d+)?%/g);
    if (pctPatterns) percentages.push(...pctPatterns);
    const pctWord = input.match(/IPC\s*\+\s*\d+\s*puntos/gi);
    if (pctWord) percentages.push(...pctWord);

    // Names (sequences of 2+ capitalized words, excluding common Spanish words)
    const namePatterns = input.match(/[A-Z][a-zéáíóúñ]+(?:\s+[A-Z][a-zéáíóúñ]+){1,4}/g);
    if (namePatterns) {
      const excluded = ["En", "El", "La", "Los", "Las", "De", "Del", "Por", "Con", "Sin", "Sobre"];
      namePatterns.forEach(n => {
        if (!excluded.some(e => n.startsWith(e + " ")) && n.length > 6) {
          names.push(n);
        }
      });
    }

    // Also get NIT numbers
    const nits = input.match(/NIT\s+[\d.-]+/gi);

    return { dates, amounts, names: [...new Set(names)], percentages, nits: nits || [] };
  }, []);

  const startAnalysis = useCallback(() => {
    setAnalysisState("analyzing");
    setCurrentStep(0);
    setStepProgress(0);

    let step = 0;
    const runStep = () => {
      if (step >= analysisSteps.length) {
        setAnalysisState("done");
        return;
      }
      setCurrentStep(step);
      setStepProgress(0);
      const dur = analysisSteps[step].duration;
      let prog = 0;
      const interval = setInterval(() => {
        prog += 5;
        setStepProgress(Math.min(prog, 100));
        if (prog >= 100) {
          clearInterval(interval);
          step++;
          setTimeout(runStep, 100);
        }
      }, dur / 20);
    };
    runStep();
  }, [analysisSteps]);

  const entities = useMemo(() => extractEntities(text), [text, extractEntities]);

  return (
    <div style={{ margin: "36px 0" }}>
      <h3 style={{ marginBottom: 4 }}>Analizador de Documentos con IA</h3>
      <p style={{ color: C.t3, fontSize: ".82rem", marginBottom: 20 }}>
        Simula como un LLM analiza un contrato de arrendamiento: extrae entidades, cifras, riesgos y genera un resumen.
      </p>

      <div style={{
        background: C.dark2, border: `1px solid ${C.dark4}`, borderRadius: 16, overflow: "hidden",
      }}>
        {/* Input area */}
        <div style={{ padding: 24 }}>
          <div style={{
            fontSize: ".72rem", fontWeight: 700, color: C.t3, textTransform: "uppercase",
            letterSpacing: 2, marginBottom: 10,
          }}>
            Documento de entrada
          </div>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setAnalysisState("idle"); }}
            style={{
              width: "100%", minHeight: 140, padding: "16px 18px", background: C.dark3,
              border: `1px solid ${C.dark4}`, borderRadius: 10, color: C.t1,
              fontFamily: "'Inter',sans-serif", fontSize: ".84rem", lineHeight: 1.7,
              outline: "none", resize: "vertical",
            }}
          />
          <button onClick={startAnalysis} disabled={analysisState === "analyzing"} style={{
            marginTop: 14, padding: "14px 36px",
            background: analysisState === "analyzing" ? C.dark4 : `linear-gradient(135deg,${C.azure},${C.purple})`,
            border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: ".9rem",
            cursor: analysisState === "analyzing" ? "not-allowed" : "pointer",
            fontFamily: "'Inter',sans-serif", transition: ".3s", letterSpacing: 1,
            boxShadow: analysisState !== "analyzing" ? `0 4px 20px ${C.azure}30` : "none",
          }}>
            {analysisState === "analyzing" ? "Analizando..." : "Analizar con IA"}
          </button>
        </div>

        {/* Analysis steps */}
        {analysisState === "analyzing" && (
          <div style={{ padding: "0 24px 24px" }}>
            {analysisSteps.map((step, i) => (
              <div key={i} style={{
                padding: "10px 0", opacity: i <= currentStep ? 1 : 0.3, transition: ".3s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{
                    fontSize: ".78rem", fontWeight: 600, color: i < currentStep ? C.green : i === currentStep ? C.azure : C.t3,
                    fontFamily: "'JetBrains Mono',monospace",
                  }}>
                    {i < currentStep ? "\u2713 " : ""}{step.label}
                  </span>
                  {i === currentStep && (
                    <span style={{ fontSize: ".72rem", color: C.azure, fontFamily: "'JetBrains Mono',monospace" }}>
                      {stepProgress}%
                    </span>
                  )}
                </div>
                {i === currentStep && (
                  <div style={{ height: 4, background: C.dark4, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 2, transition: "width .1s",
                      background: `linear-gradient(90deg,${C.azure},${C.purple})`,
                      width: `${stepProgress}%`,
                    }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Results dashboard */}
        {analysisState === "done" && (
          <div style={{ padding: "0 24px 24px" }}>
            <div style={{
              fontSize: ".72rem", fontWeight: 700, color: C.green, textTransform: "uppercase",
              letterSpacing: 2, marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 8, height: 8, background: C.green, borderRadius: "50%" }} />
              Análisis completo
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Entities */}
              <div style={{
                padding: 20, background: "rgba(0,169,224,.04)", border: "1px solid rgba(0,169,224,.15)",
                borderRadius: 12,
              }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.azure, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                  Entidades detectadas
                </div>
                {entities.names.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: ".68rem", color: C.t3, marginBottom: 4 }}>Personas / Empresas:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {entities.names.slice(0, 6).map((n, i) => (
                        <span key={i} style={{
                          padding: "4px 10px", background: "rgba(0,169,224,.1)", border: "1px solid rgba(0,169,224,.25)",
                          borderRadius: 6, fontSize: ".72rem", color: C.azure, fontWeight: 600,
                        }}>{n}</span>
                      ))}
                    </div>
                  </div>
                )}
                {entities.dates.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: ".68rem", color: C.t3, marginBottom: 4 }}>Fechas:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {entities.dates.map((d, i) => (
                        <span key={i} style={{
                          padding: "4px 10px", background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.25)",
                          borderRadius: 6, fontSize: ".72rem", color: C.purple, fontWeight: 600,
                          fontFamily: "'JetBrains Mono',monospace",
                        }}>{d}</span>
                      ))}
                    </div>
                  </div>
                )}
                {entities.nits.length > 0 && (
                  <div>
                    <div style={{ fontSize: ".68rem", color: C.t3, marginBottom: 4 }}>Identificaciones:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {entities.nits.map((n, i) => (
                        <span key={i} style={{
                          padding: "4px 10px", background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.25)",
                          borderRadius: 6, fontSize: ".72rem", color: C.yellow, fontWeight: 600,
                          fontFamily: "'JetBrains Mono',monospace",
                        }}>{n}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Key figures */}
              <div style={{
                padding: 20, background: "rgba(52,211,153,.04)", border: "1px solid rgba(52,211,153,.15)",
                borderRadius: 12,
              }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                  Cifras clave
                </div>
                {entities.amounts.map((a, i) => (
                  <div key={i} style={{
                    padding: "8px 12px", background: "rgba(52,211,153,.06)", borderRadius: 8,
                    marginBottom: 6, fontSize: ".82rem", fontWeight: 700, color: C.green,
                    fontFamily: "'JetBrains Mono',monospace",
                  }}>
                    {a}
                  </div>
                ))}
                {entities.percentages.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: ".68rem", color: C.t3, marginBottom: 4 }}>Porcentajes / Incrementos:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {entities.percentages.map((p, i) => (
                        <span key={i} style={{
                          padding: "4px 10px", background: "rgba(251,146,60,.1)", border: "1px solid rgba(251,146,60,.25)",
                          borderRadius: 6, fontSize: ".72rem", color: C.orange, fontWeight: 600,
                          fontFamily: "'JetBrains Mono',monospace",
                        }}>{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Executive summary */}
              <div style={{
                padding: 20, background: "rgba(167,139,250,.04)", border: "1px solid rgba(167,139,250,.15)",
                borderRadius: 12,
              }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                  Resumen ejecutivo
                </div>
                <p style={{ fontSize: ".82rem", color: C.t2, lineHeight: 1.7 }}>
                  Contrato de arrendamiento comercial a 5 años con canon mensual significativo e incremento IPC+2pp.
                  Incluye depósito de garantía de 3 meses y cláusula de penalidad por terminación anticipada del 30%
                  del canon restante, lo cual representa un riesgo financiero relevante para el arrendatario.
                </p>
              </div>

              {/* Risks */}
              <div style={{
                padding: 20, background: "rgba(248,113,113,.04)", border: "1px solid rgba(248,113,113,.15)",
                borderRadius: 12,
              }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                  Riesgos identificados
                </div>
                <ul style={{ color: C.t2, fontSize: ".8rem", lineHeight: 1.8, paddingLeft: 16 }}>
                  <li><strong style={{ color: C.red }}>Penalidad elevada:</strong> 30% del canon restante puede ser significativo en caso de terminación anticipada</li>
                  <li><strong style={{ color: C.orange }}>Incremento IPC+2:</strong> En escenarios de alta inflación, el canon podría crecer por encima del mercado</li>
                  <li><strong style={{ color: C.yellow }}>Plazo largo:</strong> 5 años sin cláusula de revisión de condiciones de mercado</li>
                </ul>
              </div>
            </div>

            {/* Classification tags */}
            <div style={{
              marginTop: 16, padding: "14px 20px", background: C.dark3, borderRadius: 10,
              display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
            }}>
              <span style={{ fontSize: ".72rem", color: C.t3, fontWeight: 600, marginRight: 8 }}>Clasificación:</span>
              {[
                { label: "Contrato de arrendamiento", color: C.azure },
                { label: "Comercial", color: C.purple },
                { label: "Vigente", color: C.green },
                { label: "Riesgo: Medio", color: C.orange },
                { label: "5 años", color: C.t2 },
              ].map((tag, i) => (
                <span key={i} style={{
                  padding: "5px 12px", background: `${tag.color}15`, border: `1px solid ${tag.color}30`,
                  borderRadius: 20, fontSize: ".7rem", fontWeight: 700, color: tag.color,
                }}>{tag.label}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────── AUDIENCE POLL SIMULATOR ───────── */
function AudiencePollSimulator() {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [animatedPcts, setAnimatedPcts] = useState([0, 0, 0, 0, 0]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [showInsight, setShowInsight] = useState(false);

  const options = [
    { label: "0 - 10%", votes: 12, color: C.t3 },
    { label: "10 - 25%", votes: 31, color: C.azure },
    { label: "25 - 50%", votes: 68, color: C.green },
    { label: "50 - 75%", votes: 42, color: C.purple },
    { label: "75 - 100%", votes: 18, color: C.orange },
  ];

  const handleVote = useCallback((idx: number) => {
    if (voted) return;
    setSelectedOption(idx);
    setVoted(true);

    // Add user vote to the selected option
    const updatedVotes = options.map((o, i) => o.votes + (i === idx ? 1 : 0));
    const total = updatedVotes.reduce((a, b) => a + b, 0);

    // Simulate votes arriving with a delay
    setTimeout(() => {
      setShowResults(true);
      // Animate total votes counter
      let count = 0;
      const countInterval = setInterval(() => {
        count += Math.ceil(total / 30);
        if (count >= total) {
          count = total;
          clearInterval(countInterval);
        }
        setTotalVotes(count);
      }, 50);

      // Animate bars growing
      const finalPcts = updatedVotes.map(v => Math.round((v / total) * 100));
      let progress = 0;
      const barInterval = setInterval(() => {
        progress += 4;
        if (progress >= 100) {
          progress = 100;
          clearInterval(barInterval);
          // Show insight after bars finish
          setTimeout(() => setShowInsight(true), 600);
        }
        setAnimatedPcts(finalPcts.map(p => Math.round(p * (progress / 100))));
      }, 40);
    }, 800);
  }, [voted, options]);

  const reset = useCallback(() => {
    setVoted(false);
    setSelectedOption(null);
    setShowResults(false);
    setAnimatedPcts([0, 0, 0, 0, 0]);
    setTotalVotes(0);
    setShowInsight(false);
  }, []);

  return (
    <div style={{
      margin: "36px 0", background: C.dark2, border: `1px solid ${C.dark4}`, borderRadius: 16,
      overflow: "hidden", position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg,${C.azure},${C.purple},${C.green})`,
      }} />

      <div style={{ padding: 28 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20,
        }}>
          <div>
            <div style={{
              fontSize: ".65rem", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase",
              color: C.azure, marginBottom: 6, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 8, height: 8, background: C.green, borderRadius: "50%", animation: "pl 2s infinite" }} />
              Encuesta en vivo
            </div>
            <h3 style={{ marginBottom: 4, fontSize: "1.15rem" }}>
              ¿Qué porcentaje de su trabajo diario cree que podría optimizarse con IA?
            </h3>
            <p style={{ color: C.t3, fontSize: ".78rem" }}>
              Seleccione una opción para ver los resultados de la audiencia
            </p>
          </div>
          {voted && (
            <button onClick={reset} style={{
              padding: "8px 16px", background: C.dark4, border: "none", borderRadius: 8,
              color: C.t3, fontSize: ".72rem", fontWeight: 600, cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
            }}>
              Reiniciar
            </button>
          )}
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => handleVote(i)}
              style={{
                position: "relative", padding: "16px 20px", borderRadius: 12, cursor: voted ? "default" : "pointer",
                border: `2px solid ${selectedOption === i ? opt.color : C.dark4}`,
                background: showResults ? "transparent" : (selectedOption === i ? `${opt.color}10` : C.dark3),
                transition: ".4s", overflow: "hidden",
              }}
            >
              {/* Animated bar background */}
              {showResults && (
                <div style={{
                  position: "absolute", top: 0, left: 0, bottom: 0,
                  width: `${animatedPcts[i]}%`, background: `${opt.color}15`,
                  transition: "width .6s cubic-bezier(.25,.46,.45,.94)",
                  borderRadius: 10,
                }} />
              )}
              <div style={{
                position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: selectedOption === i ? opt.color : C.dark4,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: ".3s",
                  }}>
                    {selectedOption === i && (
                      <span style={{ color: C.dark, fontWeight: 900, fontSize: ".72rem" }}>{"\u2713"}</span>
                    )}
                  </div>
                  <span style={{
                    fontSize: ".9rem", fontWeight: 700, color: selectedOption === i ? opt.color : C.t1,
                  }}>
                    {opt.label}
                  </span>
                </div>
                {showResults && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      fontSize: "1rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
                      color: opt.color,
                    }}>
                      {animatedPcts[i]}%
                    </span>
                    <span style={{
                      fontSize: ".72rem", color: C.t3, fontFamily: "'JetBrains Mono',monospace",
                    }}>
                      ({options[i].votes + (i === selectedOption ? 1 : 0)} votos)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total votes counter */}
        {showResults && (
          <div style={{
            marginTop: 16, textAlign: "center", fontSize: ".82rem", color: C.t3,
          }}>
            <span style={{
              fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: C.azure,
              fontSize: "1.1rem",
            }}>
              {totalVotes}
            </span>{" "}
            respuestas totales de la audiencia
          </div>
        )}

        {/* Insight */}
        {showInsight && (
          <div style={{
            marginTop: 20, padding: 20,
            background: `linear-gradient(135deg,rgba(0,169,224,.06),rgba(52,211,153,.06))`,
            border: `1px solid rgba(0,169,224,.2)`, borderRadius: 12,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `linear-gradient(135deg,${C.azure}20,${C.green}20)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.2rem", flexShrink: 0,
              }}>
                {"💡"}
              </div>
              <div>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.azure, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  Dato de la industria
                </div>
                <p style={{ fontSize: ".84rem", color: C.t2, lineHeight: 1.7 }}>
                  El consenso global sugiere que entre <strong style={{ color: C.green }}>30-40% de tareas en real estate
                  son automatizables</strong> con IA actual. Las areas con mayor potencial: analisis de contratos (60% de
                  reduccion de tiempo), gestion energetica (10-40% ahorro) y due diligence (50% mas rapido).
                </p>
                <div style={{
                  marginTop: 8, fontSize: ".68rem", color: C.t3, fontStyle: "italic",
                }}>
                  Fuente: McKinsey Global Institute (Q1 2026), JLL Research 2026
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────── LLM COST SIMULATOR (abril 2026) ───────── */
function LLMCostSimulator() {
  const [contratos, setContratos] = useState(50);
  const [paginas, setPaginas] = useState(15);

  // Precios públicos USD/1M tokens · abril 2026
  const models = useMemo(() => [
    { id: "opus", name: "Claude Opus 4.7", tier: "Frontier · 1M ctx", inp: 15.0, out: 75.0, color: C.azure, quality: 98, speed: 55, badge: "Máxima calidad" },
    { id: "gpt5", name: "GPT-5", tier: "Frontier · 400K ctx", inp: 2.5, out: 10.0, color: C.green, quality: 96, speed: 70, badge: "Balance top" },
    { id: "sonnet", name: "Claude Sonnet 4.6", tier: "Pro · 1M ctx", inp: 3.0, out: 15.0, color: C.azureLight, quality: 94, speed: 80, badge: "Recomendado" },
    { id: "gemini", name: "Gemini 3 Pro", tier: "Frontier · 2M ctx", inp: 1.25, out: 5.0, color: C.yellow, quality: 93, speed: 72, badge: "Mejor ctx" },
    { id: "haiku", name: "Claude Haiku 4.5", tier: "Fast · 500K ctx", inp: 1.0, out: 5.0, color: C.purple, quality: 86, speed: 96, badge: "Más rápido" },
    { id: "gpt5mini", name: "GPT-5 mini", tier: "Fast · 400K ctx", inp: 0.4, out: 1.6, color: C.orange, quality: 84, speed: 98, badge: "Más barato" },
  ], []);

  // 1 página ≈ 500 tokens input (contrato) + 200 tokens output (análisis estructurado)
  const tokensInput = contratos * paginas * 500;
  const tokensOutput = contratos * paginas * 200;

  const costs = useMemo(() => models.map(m => {
    const costUSD = (tokensInput / 1_000_000) * m.inp + (tokensOutput / 1_000_000) * m.out;
    return { ...m, cost: costUSD };
  }), [models, tokensInput, tokensOutput]);

  const maxCost = Math.max(...costs.map(c => c.cost));
  const minCost = Math.min(...costs.map(c => c.cost));

  // Manual: 8h × USD 50/h × contratos
  const manualCost = contratos * 8 * 50;
  const bestCost = minCost;
  const savings = manualCost - bestCost;
  const savingsPct = Math.round((savings / manualCost) * 100);

  const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : n >= 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(3)}`;

  return (
    <div style={{
      margin: "36px 0", background: C.dark2, border: `1px solid ${C.dark4}`,
      borderRadius: 16, padding: 32, overflow: "hidden", position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg,${C.azure},${C.purple},${C.green},${C.yellow})`,
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
        <div>
          <h3 style={{ marginBottom: 4 }}>Simulador de costo LLM · abril 2026</h3>
          <p style={{ color: C.t3, fontSize: ".82rem" }}>
            Compara qué cuesta analizar un lote de contratos con los 6 modelos más usados en producción este mes. Precios públicos USD por millón de tokens.
          </p>
        </div>
        <div style={{
          padding: "6px 14px", background: C.azureGlow, border: `1px solid ${C.azure}30`,
          borderRadius: 20, fontSize: ".7rem", color: C.azure, fontWeight: 700, letterSpacing: 1, whiteSpace: "nowrap",
        }}>
          LIVE · Q2 2026
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 22 }}>
        {/* Sliders */}
        <div style={{
          padding: 18, background: C.dark3, borderRadius: 12, border: `1px solid ${C.dark4}`,
        }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: ".78rem", fontWeight: 600, color: C.t1 }}>Contratos a analizar</label>
              <span style={{ fontSize: ".82rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: C.azure }}>{contratos}</span>
            </div>
            <input
              type="range" min={1} max={500} value={contratos}
              onChange={(e) => setContratos(Number(e.target.value))}
              style={{ width: "100%", accentColor: C.azure, cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".62rem", color: C.t3 }}>
              <span>1</span><span>500</span>
            </div>
          </div>
          <div style={{ marginBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: ".78rem", fontWeight: 600, color: C.t1 }}>Páginas por contrato (promedio)</label>
              <span style={{ fontSize: ".82rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: C.green }}>{paginas} pp</span>
            </div>
            <input
              type="range" min={3} max={80} value={paginas}
              onChange={(e) => setPaginas(Number(e.target.value))}
              style={{ width: "100%", accentColor: C.green, cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".62rem", color: C.t3 }}>
              <span>3</span><span>80</span>
            </div>
          </div>

          <div style={{
            marginTop: 16, padding: "10px 14px", background: C.dark2, borderRadius: 10,
            border: `1px solid ${C.dark4}`, fontSize: ".72rem", color: C.t3,
            fontFamily: "'JetBrains Mono',monospace", display: "flex", justifyContent: "space-between",
          }}>
            <span>Input: <span style={{ color: C.azure }}>{(tokensInput / 1000).toFixed(0)}K tok</span></span>
            <span>Output: <span style={{ color: C.green }}>{(tokensOutput / 1000).toFixed(0)}K tok</span></span>
          </div>
        </div>

        {/* Manual vs best AI */}
        <div style={{
          padding: 18, background: `linear-gradient(135deg,rgba(0,169,224,.06),rgba(52,211,153,.06))`,
          border: `1px solid ${C.azure}30`, borderRadius: 12,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: C.azure, marginBottom: 8 }}>
              Impacto del lote
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: ".62rem", color: C.red, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Manual (8h/contrato)</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: C.red, marginTop: 2 }}>
                  {fmt(manualCost)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: ".62rem", color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Mejor modelo IA</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: C.green, marginTop: 2 }}>
                  {fmt(bestCost)}
                </div>
              </div>
            </div>
          </div>
          <div style={{
            padding: "10px 12px", background: C.dark2, borderRadius: 10, textAlign: "center",
            border: `1px solid ${C.green}30`,
          }}>
            <div style={{ fontSize: ".65rem", fontWeight: 700, color: C.yellow, textTransform: "uppercase", letterSpacing: 1 }}>Ahorro potencial</div>
            <div style={{
              fontSize: "1.4rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
              background: `linear-gradient(135deg,${C.green},${C.azureLight})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {fmt(savings)} <span style={{ fontSize: ".82rem" }}>({savingsPct}% menos)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bar comparison */}
      <div style={{ marginTop: 24 }}>
        <div style={{
          fontSize: ".7rem", fontWeight: 700, color: C.t3, textTransform: "uppercase",
          letterSpacing: 2, marginBottom: 12,
        }}>
          Costo por lote · orden del más barato al más premium
        </div>
        {[...costs].sort((a, b) => a.cost - b.cost).map((m) => {
          const pct = maxCost === 0 ? 0 : (m.cost / maxCost) * 100;
          const isBest = m.cost === bestCost;
          return (
            <div key={m.id} style={{
              display: "grid", gridTemplateColumns: "190px 1fr 100px", alignItems: "center",
              gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.dark4}`,
            }}>
              <div>
                <div style={{
                  fontSize: ".78rem", fontWeight: 700, color: isBest ? C.green : C.t1,
                  fontFamily: "'JetBrains Mono',monospace", display: "flex", alignItems: "center", gap: 6,
                }}>
                  {isBest && <span style={{ color: C.green }}>●</span>}
                  {m.name}
                </div>
                <div style={{ fontSize: ".62rem", color: C.t3, marginTop: 2 }}>{m.tier} · {m.badge}</div>
              </div>
              <div style={{ height: 22, background: C.dark3, borderRadius: 6, overflow: "hidden", position: "relative" }}>
                <div style={{
                  height: "100%", width: `${pct}%`,
                  background: `linear-gradient(90deg,${m.color}50,${m.color})`,
                  borderRadius: 6, transition: "width .6s cubic-bezier(.25,.46,.45,.94)",
                  boxShadow: isBest ? `0 0 12px ${m.color}80` : "none",
                }} />
                <div style={{
                  position: "absolute", left: 10, top: 0, bottom: 0, display: "flex", alignItems: "center",
                  fontSize: ".65rem", color: C.t3, fontFamily: "'JetBrains Mono',monospace",
                }}>
                  ${m.inp.toFixed(2)} in · ${m.out.toFixed(2)} out /1M
                </div>
              </div>
              <div style={{
                fontSize: ".95rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
                color: m.color, textAlign: "right",
              }}>
                {fmt(m.cost)}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 18, padding: 14, background: "rgba(167,139,250,.04)", borderRadius: 10,
        borderLeft: `3px solid ${C.purple}`, fontSize: ".78rem", color: C.t2, lineHeight: 1.6,
      }}>
        <strong style={{ color: C.t1 }}>Tips abril 2026:</strong> con <strong style={{ color: C.purple }}>prompt caching</strong> (Anthropic / OpenAI)
        los contratos repetidos bajan 90% el costo de input. Con <strong style={{ color: C.purple }}>batch API</strong> el output cuesta 50% menos
        para análisis no urgentes. Combinando ambos, un lote mensual de 200 contratos puede costar <strong style={{ color: C.green }}>menos de USD $20</strong>.
      </div>
    </div>
  );
}

/* ───────── EJERCICIOS LAB · 7 ejercicios interactivos (abril 2026) ───────── */

function CopyablePrompt({ prompt, color }: { prompt: string; color: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{
      background: C.dark3, border: `1px solid ${C.dark4}`, borderRadius: 12,
      padding: "16px 18px 18px", position: "relative",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10,
      }}>
        <div style={{
          fontSize: ".62rem", fontWeight: 700, letterSpacing: 2, color, textTransform: "uppercase",
        }}>
          Prompt listo para pegar
        </div>
        <button
          onClick={() => { navigator.clipboard?.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
          style={{
            padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
            background: copied ? C.green : `linear-gradient(135deg,${color},${C.purple})`,
            color: "#fff", fontWeight: 700, fontSize: ".68rem", letterSpacing: 1,
            fontFamily: "'Inter',sans-serif", transition: ".25s",
          }}
        >
          {copied ? "✓ COPIADO" : "COPIAR"}
        </button>
      </div>
      <pre style={{
        whiteSpace: "pre-wrap", margin: 0, fontFamily: "'JetBrains Mono',monospace",
        fontSize: ".76rem", color: C.t1, lineHeight: 1.65, maxHeight: 360, overflow: "auto",
      }}>{prompt}</pre>
    </div>
  );
}

type Chips = { label: string; value: string[]; options: string[]; onChange: (v: string[]) => void; color: string };
function ChipsPicker({ label, value, options, onChange, color }: Chips) {
  return (
    <div>
      <div style={{ fontSize: ".7rem", fontWeight: 700, color: C.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map(o => {
          const on = value.includes(o);
          return (
            <button key={o} onClick={() => onChange(on ? value.filter(x => x !== o) : [...value, o])} style={{
              padding: "7px 13px", borderRadius: 20, fontSize: ".74rem", fontWeight: 600,
              border: `1px solid ${on ? color : C.dark4}`,
              background: on ? `${color}18` : C.dark3, color: on ? color : C.t2,
              cursor: "pointer", transition: ".2s", fontFamily: "'Inter',sans-serif",
            }}>{on ? "✓ " : ""}{o}</button>
          );
        })}
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange, color }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; color: string;
}) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: ".7rem", fontWeight: 700, color: C.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", padding: "10px 14px", background: C.dark3,
        border: `1px solid ${C.dark4}`, borderRadius: 10, color: C.t1,
        fontFamily: "'Inter',sans-serif", fontSize: ".85rem", outline: "none", cursor: "pointer",
        borderLeft: `3px solid ${color}`,
      }}>
        {options.map(o => <option key={o} value={o} style={{ background: C.dark3 }}>{o}</option>)}
      </select>
    </label>
  );
}

function TextField({ label, value, onChange, placeholder, color }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; color: string;
}) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: ".7rem", fontWeight: 700, color: C.t3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
        width: "100%", padding: "10px 14px", background: C.dark3,
        border: `1px solid ${C.dark4}`, borderRadius: 10, color: C.t1,
        fontFamily: "'Inter',sans-serif", fontSize: ".85rem", outline: "none",
        borderLeft: `3px solid ${color}`,
      }} />
    </label>
  );
}

function SliderField({ label, value, min, max, step, suffix, onChange, color }: {
  label: string; value: number; min: number; max: number; step: number; suffix: string;
  onChange: (v: number) => void; color: string;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <div style={{ fontSize: ".7rem", fontWeight: 700, color: C.t3, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: ".85rem", fontWeight: 800, color, fontFamily: "'JetBrains Mono',monospace" }}>{value}{suffix}</div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{
        width: "100%", accentColor: color,
      }} />
    </div>
  );
}

function ExerciseLab() {
  const [active, setActive] = useState(0);

  /* ── Estado por ejercicio ── */
  // E1: Claude - Contrato
  const [e1tipo, setE1tipo] = useState("Retail");
  const [e1plazo, setE1plazo] = useState("3-5 años");
  const [e1foco, setE1foco] = useState<string[]>(["Riesgos ocultos", "Fechas clave", "Cifras y canon"]);

  // E2: ChatGPT - Brief junta
  const [e2activo, setE2activo] = useState("Centro Comercial Viva");
  const [e2periodo, setE2periodo] = useState("Q1 2026");
  const [e2formato, setE2formato] = useState("Bullets + tabla");
  const [e2audiencia, setE2audiencia] = useState("Comité de Inversión");

  // E3: Perplexity - Research
  const [e3ciudad, setE3ciudad] = useState("Medellín");
  const [e3segmento, setE3segmento] = useState("Oficinas AAA");
  const [e3objetivo, setE3objetivo] = useState("Benchmark cap rate");

  // E4: Gemini / Midjourney - Imagen
  const [e4tipo, setE4tipo] = useState("Bodega logística");
  const [e4ambiente, setE4ambiente] = useState("Atardecer dorado");
  const [e4estilo, setE4estilo] = useState<string[]>(["Fotorealista", "Lente gran angular"]);
  const [e4uso, setE4uso] = useState("Brochure comercial");

  // E5: Lovable - Mini app
  const [e5app, setE5app] = useState("Dashboard de ocupación por activo");
  const [e5rol, setE5rol] = useState("Analista de portafolio");
  const [e5features, setE5features] = useState<string[]>(["Filtros por ciudad", "Gráfico de tendencia", "Export a Excel"]);

  // E6: Fathom + Claude - Reunión
  const [e6tipo, setE6tipo] = useState("Comité de Activos");
  const [e6duracion, setE6duracion] = useState(60);
  const [e6foco, setE6foco] = useState<string[]>(["Decisiones tomadas", "Compromisos con responsable", "Riesgos señalados"]);

  // E7: Zapier + Claude API - Automatización
  const [e7trigger, setE7trigger] = useState("Nuevo contrato firmado en DocuSign");
  const [e7accion, setE7accion] = useState("Resumen ejecutivo + extracción de datos clave");
  const [e7destino, setE7destino] = useState("Slack #contratos-pactia");

  /* ── Prompts dinámicos ── */
  const p1 = `Eres un analista senior de real estate en Pactia. Voy a compartirte un contrato de arrendamiento de un activo de ${e1tipo} con plazo ${e1plazo}.

PRIORIZA en tu análisis:
${e1foco.map(f => `- ${f}`).join("\n")}

Entregable (mantén estos encabezados exactos):

1. RESUMEN EJECUTIVO — 3 bullets en lenguaje de comité
2. TABLA DE DATOS CLAVE — partes, NIT, canon, incrementos, fechas, garantías
3. RIESGOS (ordenados severidad alta → baja, con cita textual del contrato)
4. CLÁUSULAS DE SALIDA / PENALIDADES — condiciones exactas
5. 3-5 RECOMENDACIONES DE NEGOCIACIÓN accionables para llevar al comité

Reglas: sé preciso con cifras, no inventes datos. Si hay ambigüedad márcala con "⚠ revisar".`;

  const p2 = `Eres el jefe de análisis de Pactia preparando el brief de ${e2activo} para el ${e2audiencia} con corte ${e2periodo}.

Estructura el output en formato: ${e2formato}

Contenido obligatorio:
- 1 titular en 1 frase (headline para abrir la sesión)
- KPIs clave: ocupación, canon promedio m², WAULT, rotación, NOI vs presupuesto
- 3 hallazgos (uno positivo, uno a vigilar, uno de oportunidad)
- Tabla de variaciones vs periodo anterior y vs presupuesto
- Recomendación con horizonte 90 días

Tono: ejecutivo, sin tecnicismos, cifras con variación porcentual. Máximo 1 página equivalente.`;

  const p3 = `Investiga para Pactia, fondo inmobiliario colombiano, lo siguiente:

OBJETIVO: ${e3objetivo}
CIUDAD: ${e3ciudad}
SEGMENTO: ${e3segmento}
VENTANA: últimos 12 meses, con corte abril 2026

Entrégame:
1. Estado del mercado (oferta, vacancy, canon m², cap rate si aplica) con fuente y fecha por cada dato
2. Top 5 jugadores / activos comparables con ticket y estrategia
3. 3 tendencias con evidencia de 2025-2026 (incluye fuentes en español cuando existan: DANE, Fitch Ratings, Colliers, CBRE, JLL, Galería Inmobiliaria)
4. 2 riesgos macro específicos a Colombia (tasas, FX, regulación)

Formato: bullets breves + tabla comparativa. Cita cada dato con URL. Si no hay evidencia sólida, dilo explícitamente.`;

  const p4 = `Genera una imagen profesional para ${e4uso} de Pactia.

SUJETO: ${e4tipo} perteneciente al portafolio Pactia en Colombia.
AMBIENTE: ${e4ambiente}.
ESTILO: ${e4estilo.join(", ") || "fotografía profesional"}.
COMPOSICIÓN: encuadre amplio que muestre escala del activo + contexto urbano/logístico colombiano.
DETALLES: señalética corporativa sutil tipo logo blanco, vehículos modernos (camiones o autos según tipo), personas como escala (lejanas, no protagónicas).
TEXTURAS: concreto pulido, metal, vidrio reflectivo.
POST: HDR suave, sin saturación exagerada, listo para imprimir en brochure o mostrar en junta.

Relación de aspecto: 16:9. Evita: texto legible, logos reales de terceros, personas reconocibles.`;

  const p5 = `Construye una app web en Lovable para Pactia.

APP: ${e5app}
USUARIO OBJETIVO: ${e5rol}
FEATURES OBLIGATORIAS:
${e5features.map(f => `- ${f}`).join("\n")}

Stack: Next.js + Tailwind + Supabase (usa plantilla auth + tabla "activos" con columnas id, ciudad, segmento, area_m2, canon_actual, ocupacion_pct, fecha_ultima_revision).

Paleta: dark mode, acento azul Pactia (#00A9E0) y zafiro (#000066). Tipografía Inter. Sidebar con navegación y dashboard como home.

Genera datos seed realistas (10 activos en Colombia: Medellín, Bogotá, Cali, Barranquilla). Incluye estados vacío y de carga. Prepara el deploy para Vercel desde el primer mensaje.`;

  const p6 = `Te paso la transcripción del "${e6tipo}" de Pactia de ${e6duracion} minutos. Genera un acta ejecutiva con estas secciones EXACTAS:

${e6foco.map((f, i) => `${i + 1}. ${f.toUpperCase()}`).join("\n")}
${e6foco.length + 1}. PRÓXIMA REUNIÓN (fecha + agenda sugerida)

Reglas:
- Cada compromiso en formato [Responsable] — [Acción] — [Fecha]
- Cifras y nombres de activos textuales, no parafraseo
- Si alguien habló de un riesgo sin conclusión, marca "SIN CIERRE ⚠"
- Tono neutro, sin editorializar

Formato final: markdown, máximo 1 página. Al final incluye 3 emails cortos listos para enviar a los responsables con su compromiso específico.`;

  const p7 = `Flujo a construir en Zapier (o Make / n8n):

TRIGGER: ${e7trigger}
PASO IA (Claude API, modelo claude-sonnet-4-6):
  System prompt:
    "Eres un analista de real estate en Pactia. Cuando recibas un contrato extrae JSON estricto con:
    { arrendador, arrendatario, nit, activo, ciudad, area_m2, canon_mensual_cop,
      incremento_anual, fecha_inicio, fecha_fin, garantia_cop, penalidad_salida,
      riesgo_nivel: 'bajo'|'medio'|'alto', resumen_3_bullets: string[] }"
  User: {{contenido_del_pdf}}
  Max tokens: 1500. Habilita prompt caching sobre el system prompt.

ACCIÓN: ${e7accion}
DESTINO: ${e7destino}

Mensaje final a enviar:
🆕 *Nuevo contrato: {{activo}}* ({{ciudad}}) — {{area_m2}} m²
Canon: ${'$'}{{canon_mensual_cop}} · Vence: {{fecha_fin}} · Riesgo: {{riesgo_nivel}}
Resumen:
• {{resumen_3_bullets[0]}}
• {{resumen_3_bullets[1]}}
• {{resumen_3_bullets[2]}}

Incluye fallback: si Claude devuelve nivel "alto", duplica la notificación al canal de Comité de Riesgos.`;

  /* ── Metadatos de cada ejercicio ── */
  const tabs = [
    {
      num: "01", color: C.azure, tool: "Claude Opus 4.7",
      toolSub: "Anthropic · 1M ctx",
      category: "Análisis documental",
      title: "Diseccionar un contrato de arrendamiento",
      objective: "Extraer riesgos, fechas, cifras y cláusulas ocultas de un contrato en < 1 minuto.",
      useCase: "Un analista tarda 2-3 horas leyendo un contrato. Claude con 1M de contexto lo procesa en segundos, cita textualmente y señala ambigüedades.",
      difficulty: "Básico", time: "5 min",
      prompt: p1,
      expected: "Informe en 5 secciones (resumen, tabla de datos, riesgos con cita, cláusulas de salida, recomendaciones) listo para copiar al comité.",
      tips: [
        "Sube el PDF como attachment, no copies texto plano — Claude preserva estructura y tablas.",
        "Con 1M de contexto puedes mandarle 5-10 contratos a la vez para comparar portafolio.",
        "Activa Artifacts si quieres que genere una tabla Excel descargable.",
      ],
      fields: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SelectField label="Tipo de activo" value={e1tipo} onChange={setE1tipo} color={C.azure}
            options={["Retail", "Oficinas", "Logística / Bodega", "Uso Mixto", "Self-storage"]} />
          <SelectField label="Plazo del contrato" value={e1plazo} onChange={setE1plazo} color={C.azure}
            options={["1-3 años", "3-5 años", "5-10 años", "+10 años"]} />
          <div style={{ gridColumn: "1 / -1" }}>
            <ChipsPicker label="Qué debe priorizar Claude" value={e1foco} onChange={setE1foco} color={C.azure}
              options={["Fechas clave", "Riesgos ocultos", "Cifras y canon", "Cláusulas de salida", "IPC e incrementos", "Obligaciones ESG"]} />
          </div>
        </div>
      ),
    },
    {
      num: "02", color: C.green, tool: "ChatGPT · GPT-5",
      toolSub: "OpenAI · 400K ctx",
      category: "Síntesis ejecutiva",
      title: "Brief de activo para el Comité",
      objective: "Pasar de 30 páginas de data-room a un brief de 1 página en el formato del comité.",
      useCase: "Todas las semanas hay comité. En lugar de que un analista arme el brief manualmente, GPT-5 con Custom GPT entrenado en la plantilla Pactia lo hace en 30 segundos.",
      difficulty: "Básico", time: "6 min",
      prompt: p2,
      expected: "Brief de 1 página: headline, KPIs, 3 hallazgos, tabla de variaciones y recomendación a 90 días — en el tono y formato del comité.",
      tips: [
        "Crea un Custom GPT con la plantilla del comité cargada como knowledge. Una vez, se reutiliza siempre.",
        "Adjunta PDFs del último board pack para que tome el tono. GPT-5 ajusta automáticamente.",
        "Pídele al final 'regenera el headline en 3 variantes' y quédate con la mejor.",
      ],
      fields: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <TextField label="Activo o portafolio" value={e2activo} onChange={setE2activo} color={C.green}
            placeholder="Ej. Centro Comercial Viva" />
          <SelectField label="Periodo" value={e2periodo} onChange={setE2periodo} color={C.green}
            options={["Q1 2026", "Q4 2025", "Último año", "YTD 2026", "Cierre 2025"]} />
          <SelectField label="Formato de salida" value={e2formato} onChange={setE2formato} color={C.green}
            options={["Bullets + tabla", "Párrafo narrativo", "Dashboard ejecutivo", "One-pager PDF-ready"]} />
          <SelectField label="Audiencia" value={e2audiencia} onChange={setE2audiencia} color={C.green}
            options={["Comité de Inversión", "Junta Directiva", "LPs / Inversionistas", "Equipo comercial"]} />
        </div>
      ),
    },
    {
      num: "03", color: C.purple, tool: "Perplexity Pro",
      toolSub: "Deep Research · abr 2026",
      category: "Research de mercado",
      title: "Investigar un segmento en 5 minutos",
      objective: "Obtener estado de mercado, jugadores, tendencias y riesgos con fuentes citadas por cada dato.",
      useCase: "Cuando llega un pitch de un activo en una ciudad donde Pactia no está, el research pasivo toma días. Perplexity con Deep Research lo sintetiza con citas.",
      difficulty: "Básico", time: "5 min",
      prompt: p3,
      expected: "Reporte con 4 bloques (mercado, comparables, tendencias, riesgos), cada dato con URL y fecha de publicación.",
      tips: [
        "Activa modo 'Deep Research' — toma 2-3 minutos pero entrega 10x más profundidad que Pro.",
        "Pide al final 'exporta a markdown' y lo pegas directo en Notion o Confluence.",
        "Combínalo con NotebookLM cargando los PDFs que Perplexity encontró para profundizar.",
      ],
      fields: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SelectField label="Ciudad" value={e3ciudad} onChange={setE3ciudad} color={C.purple}
            options={["Medellín", "Bogotá", "Cali", "Barranquilla", "Cartagena", "Panamá"]} />
          <SelectField label="Segmento" value={e3segmento} onChange={setE3segmento} color={C.purple}
            options={["Oficinas AAA", "Oficinas A/B", "Retail centros comerciales", "Logística last-mile", "Bodegas industriales", "Self-storage", "Data centers"]} />
          <div style={{ gridColumn: "1 / -1" }}>
            <SelectField label="Objetivo del research" value={e3objetivo} onChange={setE3objetivo} color={C.purple}
              options={["Benchmark cap rate", "Mapeo de competidores", "Due diligence de entrada", "Tendencias 12 meses", "Análisis de oferta nueva"]} />
          </div>
        </div>
      ),
    },
    {
      num: "04", color: C.yellow, tool: "Gemini 3 Pro · Imagen",
      toolSub: "o Midjourney v7 / DALL-E 4",
      category: "Generación visual",
      title: "Imágenes de marketing para activos",
      objective: "Crear renders y fotografía comercial sin contratar productora ni renderista externo.",
      useCase: "Cuando lanzas un activo al mercado o comercial necesita material para un pitch, en vez de esperar 2 semanas a la productora generas imágenes listas para brochure en 1 hora.",
      difficulty: "Básico", time: "8 min",
      prompt: p4,
      expected: "4 variaciones en 16:9 listas para brochure / LinkedIn / pitch deck. Sin watermarks, licencia comercial.",
      tips: [
        "Gemini 3 Pro es el más rápido y barato. Midjourney v7 para calidad cinematográfica. DALL-E 4 para texto legible.",
        "Empieza siempre con el tipo de activo + ubicación realista colombiana ('bodega en El Dorado, Bogotá').",
        "Evita generar personas reconocibles o logos de terceros — pide 'diversos, anónimos, lejanos'.",
      ],
      fields: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SelectField label="Tipo de activo" value={e4tipo} onChange={setE4tipo} color={C.yellow}
            options={["Bodega logística", "Torre de oficinas AAA", "Centro comercial", "Local retail en esquina", "Edificio de uso mixto", "Self-storage urbano"]} />
          <SelectField label="Ambiente" value={e4ambiente} onChange={setE4ambiente} color={C.yellow}
            options={["Atardecer dorado", "Medio día soleado", "Noche iluminada", "Mañana lluviosa andina", "Cielo despejado tropical"]} />
          <SelectField label="Uso final" value={e4uso} onChange={setE4uso} color={C.yellow}
            options={["Brochure comercial", "Post LinkedIn", "Pitch deck inversionistas", "Render para junta", "Website Pactia"]} />
          <div style={{ gridColumn: "1 / -1" }}>
            <ChipsPicker label="Estilo visual" value={e4estilo} onChange={setE4estilo} color={C.yellow}
              options={["Fotorealista", "Render arquitectónico", "Editorial de revista", "Lente gran angular", "Foto con dron", "Blanco y negro premium"]} />
          </div>
        </div>
      ),
    },
    {
      num: "05", color: C.orange, tool: "Lovable",
      toolSub: "App builder · v3 abr 2026",
      category: "Construir una app",
      title: "Mini-app funcional en 10 minutos",
      objective: "Construir un dashboard o calculadora real (no mockup) con base de datos y deploy en un solo prompt.",
      useCase: "Cuando necesitas una herramienta interna (calculadora IRR, CRM liviano, dashboard de ocupación) y esperar al equipo de TI toma meses, Lovable te entrega una app desplegada en Vercel.",
      difficulty: "Básico", time: "12 min",
      prompt: p5,
      expected: "Repo funcionando + URL pública de Vercel + Supabase con datos seed. Editable con prompts incrementales.",
      tips: [
        "Primer prompt: pide TODO de una vez — mejor 1 prompt grande que 10 pequeños.",
        "Después itera: 'ahora agrega autenticación', 'cambia la paleta', 'añade exportar a Excel'.",
        "Cuando el prototipo funcione, conéctalo a GitHub y sigue en Cursor para features avanzadas.",
      ],
      fields: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SelectField label="¿Qué construimos?" value={e5app} onChange={setE5app} color={C.orange}
            options={["Dashboard de ocupación por activo", "Calculadora de IRR / cap rate", "CRM liviano de arrendatarios", "Mapa interactivo del portafolio", "Simulador de renovación de contratos", "Tracker de mantenimientos pendientes"]} />
          <SelectField label="Usuario final" value={e5rol} onChange={setE5rol} color={C.orange}
            options={["Analista de portafolio", "Comité de Inversión", "Gerente de activo", "Equipo comercial", "Dirección financiera"]} />
          <div style={{ gridColumn: "1 / -1" }}>
            <ChipsPicker label="Features must-have" value={e5features} onChange={setE5features} color={C.orange}
              options={["Filtros por ciudad", "Gráfico de tendencia", "Export a Excel", "Modo oscuro", "Autenticación Google", "Alertas por email", "API pública", "Mobile-first"]} />
          </div>
        </div>
      ),
    },
    {
      num: "06", color: C.azureLight, tool: "Fathom · Granola · Meet",
      toolSub: "Copilots de reunión + Claude",
      category: "Reuniones productivas",
      title: "Convertir reuniones en accionables",
      objective: "Transformar cada comité o tour comercial en un acta ejecutiva con compromisos asignados.",
      useCase: "Hoy nadie toma acta del comité o del tour con arrendatario potencial. Con Fathom grabando + Claude procesando, tienes acta en markdown y 3 emails de seguimiento listos para enviar.",
      difficulty: "Básico", time: "4 min",
      prompt: p6,
      expected: "Acta de 1 página con 4 secciones + 3 emails personalizados a responsables, cada uno con su compromiso específico.",
      tips: [
        "Fathom / Granola graban y transcriben solos. Solo tienes que activarlos antes de la reunión.",
        "Gemini está integrado nativo en Meet y Google Workspace — si ya usas Google, actívalo.",
        "Pasa la transcripción a Claude y usa este prompt como paso final. Tiempo total: 2 min.",
      ],
      fields: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SelectField label="Tipo de reunión" value={e6tipo} onChange={setE6tipo} color={C.azureLight}
            options={["Comité de Activos", "Comité de Inversión", "Junta Directiva", "Tour con arrendatario", "1:1 con gerente", "Kick-off con contratista", "Reunión con inversionista (LP)"]} />
          <div>
            <SliderField label="Duración (min)" value={e6duracion} min={15} max={180} step={5} suffix=" min"
              onChange={setE6duracion} color={C.azureLight} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <ChipsPicker label="Qué debe extraer" value={e6foco} onChange={setE6foco} color={C.azureLight}
              options={["Decisiones tomadas", "Compromisos con responsable", "Riesgos señalados", "Cifras y KPIs mencionados", "Activos del portafolio mencionados", "Próximos pasos"]} />
          </div>
        </div>
      ),
    },
    {
      num: "07", color: C.red, tool: "Zapier + Claude API",
      toolSub: "o Make · n8n",
      category: "Automatización end-to-end",
      title: "Automatizar ciclo contrato → resumen → Slack",
      objective: "Cada vez que se firma un contrato, que la IA lo resuma y notifique al equipo sin intervención humana.",
      useCase: "Hoy un contrato firmado queda en DocuSign y nadie lo lee hasta que hay un problema. Con este flow el equipo recibe resumen + nivel de riesgo en 30 segundos de firmado.",
      difficulty: "Básico+", time: "15 min",
      prompt: p7,
      expected: "Flow activo en Zapier corriendo 24/7. Cada contrato firmado dispara resumen estructurado, notificación a Slack y fallback a Comité de Riesgos si riesgo = alto.",
      tips: [
        "Activa prompt caching sobre el system prompt: pagarás 90% menos porque el prompt es el mismo en cada ejecución.",
        "Empieza con Make o n8n si quieres visualizar el flow. Zapier es más rápido de armar pero menos flexible.",
        "Agrega un paso de 'human-in-the-loop' en Slack: un botón '✅ confirmar' antes de que la IA actúe en casos de riesgo alto.",
      ],
      fields: (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SelectField label="Trigger" value={e7trigger} onChange={setE7trigger} color={C.red}
            options={["Nuevo contrato firmado en DocuSign", "Email nuevo en bandeja contratos@", "PDF subido a Google Drive", "Entrada nueva en formulario Pactia", "Contrato actualizado en SharePoint"]} />
          <SelectField label="Qué hace la IA" value={e7accion} onChange={setE7accion} color={C.red}
            options={["Resumen ejecutivo + extracción de datos clave", "Clasificar nivel de riesgo (bajo/medio/alto)", "Verificar vs política interna y señalar desviaciones", "Comparar con contrato anterior y listar cambios"]} />
          <div style={{ gridColumn: "1 / -1" }}>
            <SelectField label="Destino / siguiente paso" value={e7destino} onChange={setE7destino} color={C.red}
              options={["Slack #contratos-pactia", "Email al Comité de Activos", "Nueva fila en Google Sheets", "Tarjeta en Trello / Asana", "Registro en Notion + Slack"]} />
          </div>
        </div>
      ),
    },
  ];

  const a = tabs[active];

  return (
    <div style={{ margin: "36px 0 0" }}>
      {/* Selector horizontal de ejercicios */}
      <div style={{
        display: "flex", gap: 10, overflowX: "auto", padding: "4px 2px 18px",
        scrollbarWidth: "thin",
      }}>
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <button key={i} onClick={() => setActive(i)} style={{
              minWidth: 230, flex: "0 0 auto", textAlign: "left", cursor: "pointer",
              padding: "14px 16px", borderRadius: 14, transition: ".25s",
              background: on ? `linear-gradient(135deg,${t.color}15,${C.dark2})` : C.dark2,
              border: `1px solid ${on ? t.color : C.dark4}`,
              boxShadow: on ? `0 8px 32px ${t.color}25` : "none",
              transform: on ? "translateY(-2px)" : "none",
              fontFamily: "'Inter',sans-serif",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{
                  fontFamily: "'JetBrains Mono',monospace", fontSize: ".85rem", fontWeight: 900, color: t.color,
                }}>{t.num}</div>
                <div style={{
                  fontSize: ".58rem", fontWeight: 700, color: on ? t.color : C.t3, letterSpacing: 1,
                  padding: "2px 8px", borderRadius: 10,
                  background: on ? `${t.color}15` : C.dark3, textTransform: "uppercase",
                }}>{t.difficulty}</div>
              </div>
              <div style={{ fontSize: ".82rem", fontWeight: 700, color: on ? C.t1 : C.t2, lineHeight: 1.35, marginBottom: 4 }}>
                {t.title}
              </div>
              <div style={{ fontSize: ".66rem", color: C.t3, fontFamily: "'JetBrains Mono',monospace" }}>
                {t.tool.toUpperCase()} · {t.time}
              </div>
            </button>
          );
        })}
      </div>

      {/* Panel del ejercicio activo */}
      <div style={{
        background: C.dark2, border: `1px solid ${a.color}30`,
        borderRadius: 18, overflow: "hidden", position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg,${a.color},${C.purple},${a.color})`,
          backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite",
        }} />

        {/* Cabecera */}
        <div style={{
          padding: "26px 30px 22px", borderBottom: `1px solid ${C.dark4}`,
          background: `radial-gradient(ellipse at top left,${a.color}08,transparent 70%)`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{
                  padding: "4px 12px", borderRadius: 10, background: a.color, color: C.dark,
                  fontSize: ".64rem", fontWeight: 800, letterSpacing: 1,
                }}>EJERCICIO {a.num}</span>
                <span style={{
                  padding: "4px 12px", borderRadius: 10, background: C.dark3, color: a.color,
                  fontSize: ".64rem", fontWeight: 700, letterSpacing: 1, border: `1px solid ${a.color}40`,
                }}>{a.category.toUpperCase()}</span>
                <span style={{ fontSize: ".7rem", color: C.t3, fontFamily: "'JetBrains Mono',monospace" }}>
                  ⏱ {a.time} · {a.difficulty}
                </span>
              </div>
              <h3 style={{
                fontSize: "1.5rem", fontWeight: 900, lineHeight: 1.2, marginBottom: 8,
                background: `linear-gradient(135deg,#fff,${a.color})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {a.title}
              </h3>
              <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.6, marginBottom: 6 }}>
                <strong style={{ color: C.t1 }}>Objetivo:</strong> {a.objective}
              </p>
              <p style={{ color: C.t3, fontSize: ".8rem", lineHeight: 1.6 }}>
                <strong style={{ color: a.color }}>Por qué importa para Pactia:</strong> {a.useCase}
              </p>
            </div>
            <div style={{
              padding: "14px 18px", borderRadius: 12, minWidth: 200,
              background: C.dark3, border: `1px solid ${a.color}30`,
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              <div style={{ fontSize: ".6rem", color: C.t3, letterSpacing: 2, fontWeight: 700 }}>HERRAMIENTA</div>
              <div style={{
                fontSize: "1rem", fontWeight: 800, color: a.color, marginTop: 2,
                fontFamily: "'JetBrains Mono',monospace",
              }}>{a.tool}</div>
              <div style={{ fontSize: ".68rem", color: C.t3, marginTop: 3 }}>{a.toolSub}</div>
            </div>
          </div>
        </div>

        {/* Cuerpo: inputs + prompt */}
        <div style={{
          padding: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
        }}>
          <div>
            <div style={{ fontSize: ".68rem", fontWeight: 700, color: a.color, letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>
              ▸ Configura tu caso
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {a.fields}
            </div>

            <div style={{
              marginTop: 22, padding: 16, borderRadius: 12,
              background: `${a.color}08`, border: `1px solid ${a.color}25`,
            }}>
              <div style={{ fontSize: ".68rem", fontWeight: 700, color: a.color, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>
                Output esperado
              </div>
              <p style={{ color: C.t2, fontSize: ".82rem", lineHeight: 1.6 }}>{a.expected}</p>
            </div>
          </div>

          <div>
            <div style={{ fontSize: ".68rem", fontWeight: 700, color: a.color, letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>
              ▸ Prompt generado en vivo
            </div>
            <CopyablePrompt prompt={a.prompt} color={a.color} />

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: ".68rem", fontWeight: 700, color: C.t3, letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" }}>
                Tips de experto
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {a.tips.map((t, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 10, padding: "10px 12px", borderRadius: 10,
                    background: C.dark3, border: `1px solid ${C.dark4}`,
                  }}>
                    <span style={{ color: a.color, fontWeight: 900, flexShrink: 0 }}>◆</span>
                    <span style={{ color: C.t2, fontSize: ".78rem", lineHeight: 1.55 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer: acción */}
        <div style={{
          padding: "18px 30px", borderTop: `1px solid ${C.dark4}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: C.dark3, flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ fontSize: ".78rem", color: C.t2, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: a.color, fontWeight: 800 }}>→</span>
            Ajusta los campos y el prompt se reescribe solo. Cópialo y pégalo en {a.tool.split("·")[0].trim()}.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setActive((active + 6) % 7)} style={{
              padding: "8px 14px", borderRadius: 9, border: `1px solid ${C.dark4}`,
              background: C.dark2, color: C.t2, cursor: "pointer", fontSize: ".74rem", fontWeight: 700,
            }}>← Anterior</button>
            <button onClick={() => setActive((active + 1) % 7)} style={{
              padding: "8px 16px", borderRadius: 9, border: "none",
              background: `linear-gradient(135deg,${a.color},${C.purple})`, color: "#fff",
              cursor: "pointer", fontSize: ".74rem", fontWeight: 800, letterSpacing: 1,
            }}>Siguiente ejercicio →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
export default function Home() {
  const [scrollTop, setScrollTop] = useState(false);
  const [canvasActive, setCanvasActive] = useState<number | null>(null);

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
          background: "radial-gradient(ellipse at 70% 50%,rgba(0,169,224,.08) 0%,transparent 60%),radial-gradient(ellipse at 20% 80%,rgba(0,0,102,.12) 0%,transparent 50%),radial-gradient(ellipse at 50% 100%,rgba(167,139,250,.05) 0%,transparent 60%)",
        }} />
        {/* Neural network */}
        <NeuralNetworkBG />
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
          {/* Logo NODO + Universidad EAFIT */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <img src="/logo-nodo.svg" alt="NODO" style={{ height: 48, filter: "brightness(0) invert(1)" }} />
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,.2)" }} />
            <div>
              <div style={{ fontSize: ".95rem", fontWeight: 800, color: C.t1, letterSpacing: 1 }}>Universidad EAFIT</div>
              <div style={{ fontSize: ".65rem", color: C.t3, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Escuela de Ciencias Aplicadas e Ingeniería</div>
            </div>
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px",
            background: C.azureGlow, border: "1px solid rgba(0,169,224,.2)", borderRadius: 24,
            fontSize: ".75rem", color: C.azure, fontWeight: 600, marginBottom: 28, letterSpacing: 1,
          }}>
            <span style={{ width: 6, height: 6, background: C.green, borderRadius: "50%", animation: "pl 2s infinite" }} />
            PACTIA x NODO EAFIT &mdash; Programa SinergIA · Abril 2026
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

          <TypingEffect />

          <div style={{
            display: "flex", alignItems: "center", gap: 16, marginTop: 44, padding: "16px 24px",
            background: "rgba(0,169,224,.06)", border: "1px solid rgba(0,169,224,.12)", borderRadius: 12,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${C.azure},${C.zafre})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>👨‍🏫</div>
            <div>
              <div style={{ fontSize: ".95rem", fontWeight: 700, color: C.t1 }}>Profesor Santiago Jiménez Londoño</div>
              <div style={{ fontSize: ".75rem", color: C.azure, fontWeight: 600, letterSpacing: 1 }}>Área de Computación y Analítica</div>
            </div>
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
            <h3>¿Por qué IA para Pactia?</h3>
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
          La IA no es una sola tecnología: es un <strong style={{ color: C.t1 }}>ecosistema de capacidades</strong> que permite
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

        {/* ── CARRERA BEFORE vs AFTER ── */}
        <BeforeVsAfterRace />

        <MythBuster />

        <Quiz
          question="¿Cuál de estas afirmaciones sobre la IA es correcta?"
          options={[
            "La IA reemplazará todos los empleos humanos en los próximos 5 años",
            "La IA es una herramienta que potencia la toma de decisiones humanas",
            "Solo las empresas de tecnología pueden beneficiarse de la IA",
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
          La calidad, volumen y estructura de los datos determinan el 80% del éxito de cualquier proyecto de IA.
          Antes de hablar de algoritmos, hablemos de lo que realmente importa: <strong style={{ color: C.azure }}>los datos</strong>.
        </p>

        {/* Expectativa vs Realidad — INTERACTIVO */}
        <ExpectativaVsRealidad />

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
              number: "~2.5 quintillones de bytes de datos se crean cada día en el mundo"
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
              what: "La confiabilidad y precisión de los datos",
              pactia: "Un sensor de temperatura descalibrado, un contrato mal digitalizado, un dato de mercado desactualizado — un solo dato erróneo puede llevar a decisiones de inversión equivocadas. La veracidad es crítica en un fondo de inversión inmobiliaria de esta escala.",
              number: "IBM estima que datos de mala calidad cuestan USD $3.1 trillion (millones de millones) anuales solo en EE.UU."
            },
            {
              v: "Valor", icon: "💎", color: C.yellow,
              what: "La capacidad de extraer insights accionables",
              pactia: "El valor no está en tener datos, sino en convertirlos en decisiones: ¿Cuál activo tiene mayor riesgo de vacancia? ¿Dónde invertir en eficiencia energética? ¿Qué arrendatario necesita atención? Sin análisis, los datos son solo ruido.",
              number: "El 68% de los datos empresariales no se aprovecha (Seagate/IDC)"
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
              La mayoría de la información valiosa está aquí. Antes de la IA generativa, era muy difícil analizarlos. Ahora es posible.
            </p>
            <div style={{ borderTop: `1px solid ${C.dark4}`, paddingTop: 12 }}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.t3, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Ejemplos en Pactia:</div>
              <ul style={{ color: C.t2, fontSize: ".78rem", lineHeight: 1.8, paddingLeft: 16 }}>
                <li>Contratos de arrendamiento (PDFs)</li>
                <li>Fotografías de estado de activos</li>
                <li>Grabaciones de reuniones con clientes</li>
                <li>Notas de inspección de propiedades</li>
                <li>Planos arquitectónicos y renders</li>
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
              { t: "Define el costo", d: "Los LLMs cobran por token. Un contrato de 50 páginas puede costar centavos o dólares según el modelo y el tier (cache, batch, thinking).", icon: "💰", color: C.green },
              { t: "Limita el contexto", d: "Cada modelo tiene una ventana de contexto distinta. Abril 2026: GPT-5 400K, Claude Opus 4.7 1M, Gemini 3 Pro 2M. Más contexto = más comprensión.", icon: "📏", color: C.azure },
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
                <strong style={{ color: C.t1 }}>¿Por qué importa?</strong> Cuando le envías un contrato de arrendamiento a un LLM,
                este lo divide en miles de tokens. Un contrato típico de Pactia (~10 páginas) genera entre
                <strong style={{ color: C.azure }}> 3,000 y 5,000 tokens</strong>. Con Claude Opus 4.7 (1M tokens de contexto, abril 2026),
                podrías analizar simultáneamente <strong style={{ color: C.azure }}>~200 contratos completos</strong> en una sola conversación — 5× más que hace un año.
              </p>
            </div>
          </div>

          {/* Interactive tokenizer */}
          <TokenDemo />

          {/* Token comparison table */}
          <div style={{
            background: C.dark2, border: `1px solid ${C.dark4}`, borderRadius: 14, padding: 24, margin: "24px 0",
          }}>
            <h3>Ventana de contexto: ¿cuánto &ldquo;cabe&rdquo; en cada modelo?</h3>
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
                  { model: "GPT-5", tokens: "400K tokens", equiv: "~300,000 palabras / ~1,000 páginas", use: "Razonamiento de frontera, análisis multi-documento", color: C.green },
                  { model: "Claude Opus 4.7 (1M)", tokens: "1,000K tokens", equiv: "~750,000 palabras / ~2,500 páginas", use: "Portafolios completos, códigos legales, due diligence", color: C.azure },
                  { model: "Gemini 3 Pro", tokens: "2,000K tokens", equiv: "~1.5M palabras / ~5,000 páginas", use: "Ingesta masiva de archivos y repos", color: C.yellow },
                  { model: "Claude Haiku 4.5", tokens: "500K tokens", equiv: "~375,000 palabras / ~1,250 páginas", use: "Tareas rápidas, alto volumen, bajo costo", color: C.t3 },
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
            Antes de aplicar cualquier modelo de IA, necesitamos saber <strong style={{ color: C.t1 }}>qué datos tenemos,
            dónde están, en qué formato y qué tan confiables son</strong>. Este proceso de levantamiento es lo que
            separa los proyectos de IA exitosos de los que fracasan.
          </p>

          {/* Pipeline visual */}
          <Tabs tabs={[
            {
              label: "1. Identificar fuentes",
              content: (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div>
                    <h3 style={{ color: C.azure }}>¿Dónde están los datos de Pactia?</h3>
                    <p style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.7, marginBottom: 16 }}>
                      El primer paso es hacer un inventario completo de todas las fuentes de datos.
                      Muchas organizaciones descubren que tienen datos valiosos que nunca han utilizado.
                    </p>
                    <Accordion items={[
                      { title: "Sistemas internos (ERP, CRM)", content: "SAP, Oracle, o sistemas propios de gestión de activos. Aquí viven los datos financieros, contratos, inventarios. Son la columna vertebral pero a menudo están aislados en silos." },
                      { title: "Sensores IoT y Building Management", content: "Los sistemas BMS de los activos generan datos continuos: temperatura, humedad, consumo eléctrico, HVAC, ascensores. Cada sensor es una fuente de datos que la IA puede aprovechar." },
                      { title: "Documentos físicos y digitales", content: "Contratos PDF, planos CAD, fotografías de inspecciones, actas de reunión. El 80% de la información valiosa está en formatos no estructurados que ahora la GenAI puede procesar." },
                      { title: "Datos externos y de mercado", content: "DANE, Camacol, Galería Inmobiliaria, datos catastrales, índices de construcción. Complementan los datos internos para decisiones de inversión más informadas." },
                      { title: "Datos de terceros y arrendatarios", content: "Historiales crediticios, patrones de pago, feedback de encuestas de satisfacción. Permiten predecir rotación y personalizar la experiencia." },
                    ]} />
                  </div>
                  <Card>
                    <h3 style={{ color: C.orange }}>Errores comunes en el levantamiento</h3>
                    <div style={{ marginTop: 12 }}>
                      {[
                        { err: "Asumir que todos los datos están digitalizados", fix: "Auditar datos en papel, notas manuscritas, correos personales" },
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
                    <Counter value="80%" label="Tiempo en limpiar datos" sub="En un proyecto típico de IA" color={C.red} />
                    <Counter value="$3.1T" label="Costo mala calidad datos" sub="USD trillion anual EE.UU. (IBM)" color={C.orange} />
                    <Counter value="1 de 3" label="Registros con errores" sub="Promedio empresarial" color={C.yellow} />
                    <Counter value="68%" label="Datos no aprovechados" sub="Promedio empresarial (Seagate/IDC)" color={C.purple} />
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
                        "¿Quién es el dueño/responsable de estos datos?",
                        "¿Cada cuánto se actualizan?",
                        "¿Qué porcentaje de campos está completo?",
                        "¿Hay un proceso de validación al ingresar datos?",
                        "¿Se pueden exportar o tienen API disponible?",
                        "¿Hay restricciones legales o de privacidad?",
                        "¿Cuántos años de historia hay disponibles?",
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
                        exportación de Excel. Para Pactia: extraer datos del BMS de cada activo, digitalizar contratos,
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
                        Para IA generativa, se necesita además crear embeddings (representaciones vectoriales)
                        de los documentos para poder buscar semánticamente.
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
                      { t: "Catálogo de datos centralizado", d: "Un inventario vivo de todos los datos: qué hay, dónde está, quién lo posee, qué tan actualizado está." },
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
                    <h3 style={{ color: C.green }}>Madurez de datos: ¿dónde está Pactia?</h3>
                    <p style={{ color: C.t3, fontSize: ".78rem", marginBottom: 16 }}>Modelo de madurez típico en gestión de datos organizacional</p>
                    {[
                      { level: 1, name: "Inicial", desc: "Datos en silos, Excel dispersos, sin estándares", color: C.red, w: "20%" },
                      { level: 2, name: "Gestionado", desc: "Algunos procesos definidos, bases de datos centrales", color: C.orange, w: "40%" },
                      { level: 3, name: "Definido", desc: "Catálogo de datos, propietarios asignados, políticas claras", color: C.yellow, w: "60%" },
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
                      y diseñar un plan para avanzar al menos un nivel durante los 6 módulos.
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
            "El PDF se convierte en texto y luego se tokeniza en fragmentos numéricos",
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
          Tres conceptos que están transformando todas las industrias, incluyendo el real estate.
        </p>

        <Tabs tabs={[
          {
            label: "IA Generativa",
            content: (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
                <div>
                  <h3>¿Qué es la IA Generativa?</h3>
                  <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7 }}>
                    Es la rama de la IA que <strong style={{ color: C.t1 }}>crea contenido nuevo</strong>: texto, imágenes,
                    código, análisis, reportes. A diferencia de la IA clásica que clasifica o predice, la GenAI genera.
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
                    de Pactia en los últimos 12 meses. Identifica tendencias, activos con mayor riesgo de vacancia
                    y genera recomendaciones para optimizar la estrategia de pricing.<span style={{ color: C.azure }}>&rdquo;</span>
                  </div>
                  <p style={{ color: C.t3, fontSize: ".75rem", marginTop: 12 }}>
                    Un LLM puede procesar y sintetizar información que a un analista le tomaría días compilar.
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
                      <li><strong style={{ color: C.t1 }}>Generación:</strong> Producen texto coherente y útil</li>
                      <li><strong style={{ color: C.t1 }}>Razonamiento:</strong> Analizan datos y sacan conclusiones</li>
                      <li><strong style={{ color: C.t1 }}>Traducción:</strong> Convierten entre idiomas y formatos</li>
                      <li><strong style={{ color: C.t1 }}>Código:</strong> Escriben y explican programación</li>
                    </ul>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 28 }}>
                  {[
                    { name: "GPT-5", org: "OpenAI · 2025", color: C.green },
                    { name: "Claude Opus 4.7", org: "Anthropic · 2026", color: C.azure },
                    { name: "Gemini 3 Pro", org: "Google DeepMind · 2026", color: C.yellow },
                    { name: "Llama 4", org: "Meta · Open Source", color: C.purple },
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
            label: "Big Data y Analítica",
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
                      Pactia genera y puede aprovechar datos de múltiples fuentes:
                    </p>
                    <Accordion items={[
                      { title: "Datos operacionales", content: "Consumo energético de los activos del portafolio, estado de equipos HVAC, ascensores, sistemas de seguridad. Oportunidad: mantenimiento predictivo que reduce costos hasta 40%." },
                      { title: "Datos comerciales", content: "Contratos de arrendamiento, tasas de ocupación, pricing por m2, perfil de arrendatarios, rotación. Oportunidad: optimización de pricing dinámico." },
                      { title: "Datos de mercado", content: "Tendencias del sector inmobiliario, tasas de interés, índices de construcción, oferta nueva. Oportunidad: decisión de inversión basada en datos." },
                      { title: "Datos de sostenibilidad", content: "Huella de carbono, consumo de agua, generación solar de los paneles instalados, residuos. Oportunidad: reportes ESG automatizados y optimización energética." },
                    ]} />
                  </div>
                </div>
              </div>
            ),
          },
        ]} />

        {/* ── DOCUMENT ANALYZER DEMO ── */}
        <DocumentAnalyzerDemo />

        {/* ── LLM COST SIMULATOR (abril 2026) ── */}
        <LLMCostSimulator />
      </Section>

      {/* ═══════ IA EN REAL ESTATE ═══════ */}
      <Section id="real-estate">
        <SN>IA en la Industria</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          La IA está transformando el Real Estate
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          El sector inmobiliario vive una revolución silenciosa. Los líderes globales ya están usando IA para
          tomar mejores decisiones y operar con mayor eficiencia.
        </p>

        {/* Market stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, margin: "36px 0" }}>
          <Counter value="$408B" label="Mercado IA en Real Estate 2026" sub="Business Research Co. · Abr 2026" />
          <Counter value="$1.3T" label="Proyección 2030" sub="CAGR 34% 2026–2030" color={C.green} />
          <Counter value="94%" label="Firmas líder con IA como prioridad" sub="Deloitte Real Estate Outlook 2026" color={C.purple} />
          <Counter value="81%" label="Propietarios invierten en IA en 2026" sub="JLL Technology Survey Q1 2026" color={C.orange} />
        </div>

        <h3 style={{ marginTop: 36, marginBottom: 16 }}>Adopción de IA por área de aplicación</h3>
        <Bar label="Valuación automatizada (AVMs)" pct={85} color={C.azure} delay={0} />
        <Bar label="Eficiencia energética / Smart Buildings" pct={78} color={C.green} delay={200} />
        <Bar label="Mantenimiento predictivo" pct={60} color={C.purple} delay={400} />
        <Bar label="Analítica de inquilinos" pct={55} color={C.orange} delay={600} />
        <Bar label="Decisión de inversión con IA" pct={45} color={C.yellow} delay={800} />

        <CalculadoraImpactoIA />

        <div style={{
          marginTop: 36, padding: 28, background: `linear-gradient(135deg,${C.dark2},${C.dark3})`,
          border: `1px solid ${C.dark4}`, borderRadius: 14,
        }}>
          <h3 style={{ color: C.green }}>Dato clave: Colombia es líder en construcción verde</h3>
          <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7 }}>
            Colombia ocupa el <strong style={{ color: C.t1 }}>2do lugar mundial en m2 certificados EDGE</strong> (22.2 millones de m2).
            Con 490+ proyectos LEED registrados y una contribucion significativa a la reduccion de emisiones de CO2 en el sector construccion.
            La Resolución 0194 de 2025 establece parámetros más ambiciosos &mdash; la IA será clave para cumplirlos eficientemente.
          </p>
        </div>
      </Section>

      {/* ═══════ CASOS REALES ═══════ */}
      <Section id="casos">
        <SN>Casos de Éxito</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Quiénes ya lo están haciendo
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          Los líderes globales del real estate ya integran IA en sus operaciones con resultados medibles.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 28 }}>
          <CaseCard
            company="JLL"
            title="Carbon Pathfinder + IA Generativa"
            desc="JLL analiza 25+ trillones de puntos de datos con IA. Su plataforma Hank logra 10-40% de reducción energética en edificios. Su asistente de IA con GPT acelera el análisis de contratos de arrendamiento."
            metrics={[
              { value: "10-40%", label: "Reducción energética", color: C.green },
              { value: "25T+", label: "Puntos de datos", color: C.azure },
              { value: "708%", label: "ROI (caso Hank)", color: C.orange },
            ]}
            source="Fuente: JLL Research 2026"
          />
          <CaseCard
            company="Prologis"
            title="Logística inteligente con IA + IoT"
            desc="El mayor REIT de logística del mundo reporta hasta 20% de reducción energética con IA+IoT en sus instalaciones. 30% de espacios logísticos ahora automatizados. Plan de $8B para 20+ data centers."
            metrics={[
              { value: "20%", label: "Menos energía", color: C.green },
              { value: "30%", label: "Espacios automatizados", color: C.purple },
              { value: "$8B", label: "Inversión data centers", color: C.yellow },
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
              { value: "~20%", label: "Reducción costos mant.", color: C.orange },
            ]}
            source="Fuente: CBRE / Facilities Dive 2026"
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
            desc="Los agentes de IA para sistemas HVAC reducen costos energéticos en 10-20%. Más del 80% de tomadores de decisión en edificios comerciales planean aumentar el uso de IA."
            metrics={[
              { value: "10-20%", label: "Ahorro energético HVAC", color: C.green },
              { value: "80%+", label: "Planean más IA", color: C.purple },
              { value: "14%", label: "Ahorro promedio smart building", color: C.azure },
            ]}
            source="Fuente: Honeywell / Panorad AI 2026"
          />
          <CaseCard
            company="McKinsey & Harvard"
            title="Impacto de IA en productividad"
            desc="McKinsey estima $110-180B de valor potencial de IA en real estate. Harvard Business School: consultores usando IA producen trabajo de 40% mayor calidad."
            metrics={[
              { value: "$180B", label: "Valor potencial", color: C.yellow },
              { value: "40%", label: "Más calidad con IA", color: C.green },
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
                  { t: "Selección de sitios", d: "IA reduce tiempo de evaluación de sitios en 80-90%. Análisis de datos sociodemográficos, tránsito y competencia.", icon: "📍", impact: "Alto" },
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
                  { t: "Predicción de rotación", d: "Modelos que analizan patrones de pago, solicitudes de mantenimiento y comunicación para identificar arrendatarios en riesgo antes del vencimiento.", icon: "🔮" },
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
                  <Counter value="+30%" label="Vida útil de equipos" sub="HVAC, ascensores" color={C.purple} />
                  <Counter value="67%" label="Edificios aún reactivos" sub="Oportunidad enorme" color={C.orange} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  {[
                    { t: "HVAC predictivo", d: "Los activos de almacenamiento y oficinas del portafolio tienen sistemas HVAC significativos. Sensores IoT + IA predicen fallas antes de que ocurran." },
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
                    Estudios de CBRE y JLL indican que edificios con certificación verde pueden obtener <strong style={{ color: C.t1 }}>primas de 7-25% en arriendos</strong> en los principales mercados.
                    Los green leases pueden reducir consumo de oficinas entre <strong style={{ color: C.t1 }}>10-20%</strong> segun datos de la industria.
                    La sostenibilidad ya no es compliance &mdash; es un <strong style={{ color: C.green }}>driver de valoración</strong>.
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  {[
                    { t: "Optimización HVAC con IA", d: "Hasta 20% de reducción en costos energéticos. Complementa los paneles solares del portafolio optimizando cuándo usar solar vs. red.", icon: "⚡" },
                    { t: "Digital Twins", d: "Gemelos digitales del portafolio para simular escenarios de descarbonización antes de invertir capital. Probar retrofits virtuales.", icon: "🔄" },
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
            "Construir un algoritmo de trading bursátil",
            "Eliminar la necesidad de datos históricos",
          ]}
          correct={1}
          feedback="Exacto. Los quick wins de IA para Pactia están en: 1) Análisis de contratos (60% más rápido, detectar cláusulas perdidas), 2) Mantenimiento predictivo (40% menos costos), y 3) Optimización energética (10-20% ahorro en HVAC). Estos tres generan ROI medible en 6-12 meses."
        />
      </Section>

      {/* ═══════ EJERCICIOS INTERACTIVOS ═══════ */}
      <Section id="ejercicios">
        <SN>Manos a la obra · abril 2026</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          7 ejercicios iniciales con IA
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 780 }}>
          Ejercicios cortos y reales, pensados para el día a día de Pactia. Cada uno usa una herramienta distinta
          (Claude, ChatGPT, Perplexity, Gemini, Lovable, Fathom, Zapier) y genera en vivo el prompt o flujo listo
          para copiar. <strong style={{ color: C.t1 }}>No necesitas saber programar.</strong>
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginTop: 28 }}>
          <Counter value="7" label="Ejercicios iniciales" sub="Básicos · < 15 min c/u" />
          <Counter value="7" label="Herramientas distintas" sub="Ecosistema IA abril 2026" color={C.green} />
          <Counter value="100%" label="Contexto Pactia" sub="Prompts con casos reales" color={C.purple} />
          <Counter value="0" label="Requisitos de código" sub="Solo navegador y cuenta gratis" color={C.orange} />
        </div>

        <ExerciseLab />

        <div style={{
          marginTop: 32, padding: 20, borderRadius: 14,
          background: `linear-gradient(135deg,${C.dark2},${C.dark3})`,
          border: `1px solid ${C.azure}30`,
          display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "center",
        }}>
          <div style={{ fontSize: "2rem" }}>🎯</div>
          <div>
            <h3 style={{ marginBottom: 4 }}>Retoma estos ejercicios en el módulo 3 · Hacer (6h)</h3>
            <p style={{ color: C.t2, fontSize: ".85rem", lineHeight: 1.6 }}>
              Hoy armas los prompts; en el <strong style={{ color: C.azure }}>módulo 3</strong> los
              ejecutas con datos reales de tu rol en Pactia y salimos con 1 automatización funcionando por participante.
              En el <strong style={{ color: C.purple }}>módulo 5 · Construir</strong> los integramos en un proyecto de equipo.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══════ ETICA Y GOBERNANZA ═══════ */}
      <Section id="etica">
        <SN>Principios</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Ética y gobernanza de la IA
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          La IA poderosa exige uso responsable. No basta con adoptar la tecnología &mdash; debemos definir
          <strong style={{ color: C.t1 }}> cómo y con qué límites</strong> la usamos.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 36 }}>
          {[
            { t: "Transparencia", d: "Los modelos de IA deben poder explicar sus recomendaciones. En decisiones de inversión, Pactia necesita entender el 'por qué' detrás de cada sugerencia.", icon: "🔍", color: C.azure },
            { t: "Privacidad de datos", d: "Los datos de arrendatarios, contratos y operaciones son sensibles. Definir qué datos se comparten con modelos de IA y cuáles se mantienen internos.", icon: "🔒", color: C.green },
            { t: "Sesgo y equidad", d: "Los modelos pueden heredar sesgos. En pricing y selección de arrendatarios, hay que auditar que la IA no discrimine injustamente.", icon: "⚖️", color: C.purple },
            { t: "Supervisión humana", d: "La IA apoya, no reemplaza. Las decisiones críticas de inversión y estrategia siempre requieren validación humana. Human-in-the-loop.", icon: "👤", color: C.orange },
            { t: "Seguridad", d: "Proteger los modelos de IA contra manipulación. Un modelo comprometido podría generar valoraciones erróneas o exponer datos confidenciales.", icon: "🛡️", color: C.red },
            { t: "Responsabilidad", d: "Definir quién es responsable cuando la IA se equivoca. Políticas claras de gobernanza antes de escalar implementaciones.", icon: "📜", color: C.yellow },
          ].map((item, i) => (
            <Card key={i} accent={item.color}>
              <div style={{ fontSize: "1.5rem", marginBottom: 14 }}>{item.icon}</div>
              <h3 style={{ color: item.color }}>{item.t}</h3>
              <p style={{ color: C.t2, fontSize: ".84rem", lineHeight: 1.6 }}>{item.d}</p>
            </Card>
          ))}
        </div>

        {/* ── AUDIENCE POLL SIMULATOR ── */}
        <AudiencePollSimulator />

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
                <li>Tomar decisiones estratégicas sin supervisión</li>
                <li>Reemplazar relaciones con inversionistas y arrendatarios</li>
                <li>Manejar negociaciones complejas con empatía</li>
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
                <li>Procesar grandes volúmenes de datos rápidamente</li>
                <li>Identificar patrones invisibles al ojo humano</li>
                <li>Automatizar tareas repetitivas y análisis rutinarios</li>
                <li>Generar reportes y borradores instantáneos</li>
                <li>Monitorear operaciones 24/7 sin fatiga</li>
              </ul>
            </div>
          </div>

          {/* Human vs AI Balance Visual */}
          <div style={{
            marginTop: 28, padding: 24, background: C.dark2, borderRadius: 14, border: `1px solid ${C.dark4}`,
          }}>
            <h3 style={{ textAlign: "center", marginBottom: 20 }}>Balance Humano + IA: fortalezas complementarias</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              {/* Human side */}
              <div style={{ flex: 1, textAlign: "right" }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
                  Fortaleza humana
                </div>
                {[
                  { label: "Empatía y relaciones", w: 95 },
                  { label: "Juicio estratégico", w: 90 },
                  { label: "Creatividad contextual", w: 85 },
                  { label: "Negociación compleja", w: 88 },
                  { label: "Visión de largo plazo", w: 80 },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: ".75rem", color: C.t2, fontWeight: 600 }}>{item.label}</span>
                    <div style={{ width: 120, height: 8, background: C.dark4, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${item.w}%`, background: C.orange, borderRadius: 4, float: "right" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Scale icon */}
              <div style={{
                width: 60, height: 60, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: `linear-gradient(135deg,${C.orange}20,${C.azure}20)`, border: `2px solid ${C.dark4}`,
                fontSize: "1.5rem", flexShrink: 0,
              }}>
                ⚖️
              </div>

              {/* AI side */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: C.azure, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
                  Fortaleza IA
                </div>
                {[
                  { label: "Procesamiento de volumen", w: 98 },
                  { label: "Detección de patrones", w: 95 },
                  { label: "Velocidad de análisis", w: 97 },
                  { label: "Disponibilidad 24/7", w: 100 },
                  { label: "Consistencia sin fatiga", w: 96 },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0" }}>
                    <div style={{ width: 120, height: 8, background: C.dark4, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${item.w}%`, background: C.azure, borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: ".75rem", color: C.t2, fontWeight: 600 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ textAlign: "center", color: C.t3, fontSize: ".78rem", marginTop: 16, fontStyle: "italic" }}>
              El mayor valor se genera cuando las fortalezas humanas y de la IA se combinan, no cuando compiten.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══════ ESTRATEGIA Y GOBERNANZA DE DATOS ═══════ */}
      <Section id="estrategia">
        <SN>Estrategia de datos</SN>
        <h2 style={{ background: `linear-gradient(135deg,#fff,${C.azureLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Estrategia y Gobernanza de Datos
        </h2>
        <p style={{ fontSize: "1.05rem", color: C.t2, lineHeight: 1.7, maxWidth: 700 }}>
          La IA sin una estrategia de datos es como construir un edificio sin cimientos. Antes de implementar modelos, necesitamos
          definir <strong style={{ color: C.t1 }}>qué datos importan, cómo los gestionamos y quién es responsable</strong>.
        </p>

        {/* Data Strategy Framework - Pyramid */}
        <div style={{ marginTop: 36 }}>
          <h3>Framework de Estrategia de Datos</h3>
          <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7, marginBottom: 24 }}>
            Una estrategia de datos efectiva se construye de abajo hacia arriba, alineando infraestructura, datos y negocio.
          </p>

          <div style={{
            maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            {/* Top - Business Strategy */}
            <div style={{
              width: "50%", padding: "24px 20px", textAlign: "center",
              background: `linear-gradient(135deg,${C.azure}15,${C.azure}08)`,
              border: `2px solid ${C.azure}40`, borderRadius: "14px 14px 0 0",
              clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
            }}>
              <div style={{ fontSize: "1.3rem", marginBottom: 6 }}>🎯</div>
              <div style={{ fontSize: ".85rem", fontWeight: 800, color: C.azure, marginBottom: 4 }}>Estrategia de Negocio</div>
              <div style={{ fontSize: ".72rem", color: C.t2 }}>Objetivos de crecimiento, rentabilidad, sostenibilidad de Pactia</div>
            </div>

            {/* Middle - Data Strategy */}
            <div style={{
              width: "70%", padding: "24px 20px", textAlign: "center",
              background: `linear-gradient(135deg,${C.green}15,${C.green}08)`,
              border: `2px solid ${C.green}40`,
              clipPath: "polygon(7% 0%, 93% 0%, 100% 100%, 0% 100%)",
            }}>
              <div style={{ fontSize: "1.3rem", marginBottom: 6 }}>📊</div>
              <div style={{ fontSize: ".85rem", fontWeight: 800, color: C.green, marginBottom: 4 }}>Estrategia de Datos</div>
              <div style={{ fontSize: ".72rem", color: C.t2 }}>Qué datos necesitamos, cómo los adquirimos, procesamos y usamos para habilitar los objetivos</div>
            </div>

            {/* Bottom - Infrastructure & Governance */}
            <div style={{
              width: "90%", padding: "24px 20px", textAlign: "center",
              background: `linear-gradient(135deg,${C.purple}15,${C.purple}08)`,
              border: `2px solid ${C.purple}40`, borderRadius: "0 0 14px 14px",
              clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
            }}>
              <div style={{ fontSize: "1.3rem", marginBottom: 6 }}>🏗️</div>
              <div style={{ fontSize: ".85rem", fontWeight: 800, color: C.purple, marginBottom: 4 }}>Infraestructura y Gobernanza</div>
              <div style={{ fontSize: ".72rem", color: C.t2 }}>Plataformas, estándares, políticas de calidad, seguridad, roles y responsabilidades</div>
            </div>
          </div>

          <div style={{
            marginTop: 20, padding: 16, background: "rgba(0,169,224,.04)", borderRadius: 10,
            borderLeft: `3px solid ${C.azure}`, maxWidth: 700, margin: "20px auto 0",
          }}>
            <p style={{ color: C.t2, fontSize: ".82rem", lineHeight: 1.6 }}>
              <strong style={{ color: C.t1 }}>Clave:</strong> La estrategia de datos no es un proyecto de TI &mdash; es un
              habilitador de la estrategia de negocio. Cada decisión sobre datos debe responder la pregunta:
              <strong style={{ color: C.azure }}> ¿Cómo esto nos ayuda a cumplir nuestros objetivos de negocio?</strong>
            </p>
          </div>
        </div>

        {/* DAMA-DMBOK2 Wheel */}
        <div style={{ marginTop: 48 }}>
          <h3>DAMA-DMBOK2: las 11 áreas del conocimiento en gestión de datos</h3>
          <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7, marginBottom: 24 }}>
            El estándar internacional para gestión de datos define 11 áreas de conocimiento. La <strong style={{ color: C.t1 }}>Gobernanza de Datos</strong> está
            en el centro y conecta todas las demás.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {/* Center card - Governance */}
            <div style={{
              gridColumn: "2 / 4", padding: 24, textAlign: "center",
              background: `linear-gradient(135deg,${C.azure}12,${C.zafre}15)`,
              border: `2px solid ${C.azure}50`, borderRadius: 14,
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>👑</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: C.azure, marginBottom: 4 }}>1. Gobernanza de Datos</div>
              <div style={{ fontSize: ".78rem", color: C.t2 }}>El área central que coordina y dirige todas las demás. Define políticas, roles, estándares y métricas.</div>
            </div>

            {/* Remaining 10 areas */}
            {[
              { n: "2", name: "Arquitectura de datos", icon: "🏛️", color: C.purple, desc: "Estructura y modelos que definen cómo fluyen los datos" },
              { n: "3", name: "Modelado y diseño", icon: "📐", color: C.green, desc: "Esquemas, relaciones y diseño lógico/físico de datos" },
              { n: "4", name: "Almacenamiento y operaciones", icon: "💾", color: C.orange, desc: "Bases de datos, backups, rendimiento y disponibilidad" },
              { n: "5", name: "Seguridad de datos", icon: "🔐", color: C.red, desc: "Autenticación, encriptación, privacidad y cumplimiento" },
              { n: "6", name: "Integración e interoperabilidad", icon: "🔗", color: C.azure, desc: "ETL, APIs, consolidación entre sistemas" },
              { n: "7", name: "Gestión de documentos y contenido", icon: "📁", color: C.yellow, desc: "Documentos, PDFs, contratos, multimedia" },
              { n: "8", name: "Datos maestros y de referencia", icon: "🗂️", color: C.purple, desc: "Golden records, catálogos únicos, MDM" },
              { n: "9", name: "Data Warehousing y BI", icon: "📊", color: C.green, desc: "Reportería, dashboards, OLAP, análisis" },
              { n: "10", name: "Metadatos", icon: "🏷️", color: C.orange, desc: "Datos sobre datos: linaje, catálogos, diccionarios" },
              { n: "11", name: "Calidad de datos", icon: "✅", color: C.azure, desc: "Perfilado, limpieza, monitoreo, métricas de calidad" },
            ].map((item, i) => (
              <Card key={i} accent={item.color} style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  <span style={{
                    fontSize: ".65rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace",
                    color: item.color, opacity: 0.6,
                  }}>{item.n}</span>
                </div>
                <div style={{ fontSize: ".82rem", fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: ".7rem", color: C.t3, lineHeight: 1.4 }}>{item.desc}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Strategy Canvas */}
        <div style={{ marginTop: 48 }}>
          <h3>Data Strategy Canvas</h3>
          <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7, marginBottom: 24 }}>
            Un canvas interactivo para definir la estrategia de datos de Pactia. Haz clic en cada sección para explorar.
          </p>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto auto",
            gap: 12, maxWidth: 900, margin: "0 auto",
          }}>
            {[
              {
                title: "Objetivos de negocio", color: C.azure, icon: "🎯",
                items: ["Maximizar ocupación del portafolio", "Reducir costos operativos 15%", "Aumentar valoración de activos", "Liderar en sostenibilidad (EDGE/LEED)", "Mejorar experiencia del arrendatario"],
              },
              {
                title: "Preguntas clave", color: C.green, icon: "❓",
                items: ["¿Qué activos tienen mayor riesgo de vacancia?", "¿Dónde invertir en eficiencia energética?", "¿Cómo predecir rotación de arrendatarios?", "¿Cuál es el pricing óptimo por m2?", "¿Qué cláusulas contractuales no se están ejecutando?"],
              },
              {
                title: "Fuentes de datos", color: C.purple, icon: "🗄️",
                items: ["ERP/CRM (datos financieros y comerciales)", "BMS/IoT (sensores de edificios)", "Contratos PDF (no estructurados)", "Mercado (DANE, Camacol, Galería Inmobiliaria)", "Arrendatarios (feedback, pagos, solicitudes)"],
              },
              {
                title: "Brechas y oportunidades", color: C.orange, icon: "🔍",
                items: ["Silos de datos entre áreas", "Datos no estructurados sin procesar (80%)", "Falta de catálogo de datos centralizado", "Potencial de mantenimiento predictivo sin explotar", "Reportes ESG manuales que podrían automatizarse"],
              },
              {
                title: "Plan de acción", color: C.yellow, icon: "🚀", gridSpan: true,
                items: ["Q1: Inventario de datos y evaluación de madurez", "Q2: Catálogo de datos + políticas de gobernanza", "Q3: Pilotos de IA (contratos + energía + mantenimiento)", "Q4: Escalar pilotos exitosos + medir ROI", "Continuo: Capacitación del equipo (SinergIA)"],
              },
            ].map((section, i) => (
              <div
                key={i}
                onClick={() => setCanvasActive(canvasActive === i ? null : i)}
                style={{
                  padding: 20, cursor: "pointer", transition: ".3s",
                  background: canvasActive === i ? `${section.color}10` : C.dark2,
                  border: `2px solid ${canvasActive === i ? `${section.color}50` : C.dark4}`,
                  borderRadius: 14,
                  gridColumn: section.gridSpan ? "1 / 4" : undefined,
                  transform: canvasActive === i ? "scale(1.02)" : "scale(1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: "1.2rem" }}>{section.icon}</span>
                  <span style={{ fontSize: ".85rem", fontWeight: 800, color: section.color }}>{section.title}</span>
                </div>
                <div style={{
                  maxHeight: canvasActive === i ? 300 : 0, overflow: "hidden",
                  transition: "max-height .4s ease-in-out",
                }}>
                  <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {section.items.map((item, j) => (
                      <li key={j} style={{
                        fontSize: ".78rem", color: C.t2, lineHeight: 1.8,
                        listStyle: "none", paddingLeft: 12,
                        borderLeft: `2px solid ${section.color}30`,
                        marginBottom: 4,
                      }}>{item}</li>
                    ))}
                  </ul>
                </div>
                {canvasActive !== i && (
                  <div style={{ fontSize: ".7rem", color: C.t3, marginTop: 4 }}>Clic para expandir</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ROI of Data Governance */}
        <div style={{ marginTop: 48 }}>
          <h3>ROI de la Gobernanza de Datos</h3>
          <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7, marginBottom: 24 }}>
            Invertir en gobernanza de datos no es un gasto &mdash; es una de las inversiones con mayor retorno demostrable.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            <Card accent={C.green} style={{ textAlign: "center", padding: 24 }}>
              <div style={{
                fontSize: "2.4rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
                background: `linear-gradient(135deg,${C.green},${C.azureLight})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>80%</div>
              <div style={{ fontSize: ".78rem", color: C.t1, fontWeight: 700, marginTop: 8, marginBottom: 6 }}>Gobernanza falla sin urgencia</div>
              <div style={{ fontSize: ".72rem", color: C.t3, lineHeight: 1.5 }}>
                Gartner predice que el 80% de las iniciativas de gobernanza de datos fallarán para 2027 sin un sentido claro de urgencia
              </div>
              <div style={{ fontSize: ".65rem", color: C.t3, marginTop: 8, fontStyle: "italic" }}>Gartner 2024</div>
            </Card>
            <Card accent={C.azure} style={{ textAlign: "center", padding: 24 }}>
              <div style={{
                fontSize: "2.4rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
                background: `linear-gradient(135deg,${C.azure},${C.azureLight})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>3.5:1</div>
              <div style={{ fontSize: ".78rem", color: C.t1, fontWeight: 700, marginTop: 8, marginBottom: 6 }}>Retorno por cada $1 invertido</div>
              <div style={{ fontSize: ".72rem", color: C.t3, lineHeight: 1.5 }}>
                Las empresas que invierten en datos e IA ven ~$3.50 de retorno por cada $1 invertido
              </div>
              <div style={{ fontSize: ".65rem", color: C.t3, marginTop: 8, fontStyle: "italic" }}>Microsoft / Industry Avg.</div>
            </Card>
            <Card accent={C.purple} style={{ textAlign: "center", padding: 24 }}>
              <div style={{
                fontSize: "2.4rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
                background: `linear-gradient(135deg,${C.purple},${C.azureLight})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>23x</div>
              <div style={{ fontSize: ".78rem", color: C.t1, fontWeight: 700, marginTop: 8, marginBottom: 6 }}>Más probabilidad de adquirir clientes</div>
              <div style={{ fontSize: ".72rem", color: C.t3, lineHeight: 1.5 }}>
                Las organizaciones data-driven son 23 veces más propensas a adquirir clientes
              </div>
              <div style={{ fontSize: ".65rem", color: C.t3, marginTop: 8, fontStyle: "italic" }}>McKinsey</div>
            </Card>
            <Card accent={C.orange} style={{ textAlign: "center", padding: 24 }}>
              <div style={{
                fontSize: "2.4rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
                background: `linear-gradient(135deg,${C.orange},${C.yellow})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>68%</div>
              <div style={{ fontSize: ".78rem", color: C.t1, fontWeight: 700, marginTop: 8, marginBottom: 6 }}>Datos sin aprovechar</div>
              <div style={{ fontSize: ".72rem", color: C.t3, lineHeight: 1.5 }}>
                El 68% de los datos dentro de las empresas nunca se analizan ni se aprovechan
              </div>
              <div style={{ fontSize: ".65rem", color: C.t3, marginTop: 8, fontStyle: "italic" }}>Seagate / IDC</div>
            </Card>
          </div>
        </div>

        {/* Quiz Strategy */}
        <Quiz
          question="¿Cuál es la relación correcta entre estrategia de negocio y estrategia de datos?"
          options={[
            "Son independientes: TI se encarga de los datos, el negocio de la estrategia",
            "La estrategia de datos debe habilitarse y alinearse con la estrategia de negocio",
            "Primero se define la tecnología y después se ajusta el negocio",
            "Solo las empresas de tecnología necesitan una estrategia de datos",
          ]}
          correct={1}
          feedback="Correcto. La estrategia de datos existe para habilitar la estrategia de negocio. Cada decisión sobre datos debe responder: ¿Cómo esto nos ayuda a cumplir nuestros objetivos? Para Pactia, esto significa que los datos de ocupación, energía, contratos y mercado deben gestionarse pensando en maximizar la rentabilidad del portafolio y el valor para los inversionistas."
        />
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

        {/* Timeline visual */}
        <div style={{
          position: "relative", margin: "36px 0 12px", padding: "0 20px",
        }}>
          {/* Connecting line */}
          <div style={{
            position: "absolute", top: "50%", left: 40, right: 40, height: 3,
            background: `linear-gradient(90deg,${C.azure},${C.purple},${C.green},${C.orange},${C.yellow},${C.red})`,
            borderRadius: 2, transform: "translateY(-50%)",
          }} />
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
            {[
              { n: "01", name: "Entender", color: C.azure, active: true },
              { n: "02", name: "Explorar", color: C.purple, active: false },
              { n: "03", name: "Hacer", color: C.green, active: false },
              { n: "04", name: "Transformar", color: C.orange, active: false },
              { n: "05", name: "Construir", color: C.yellow, active: false },
              { n: "06", name: "Apropiar", color: C.red, active: false },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", margin: "0 auto 8px",
                  background: m.active ? m.color : C.dark3,
                  border: `3px solid ${m.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: ".75rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
                  color: m.active ? C.dark : m.color, opacity: m.active ? 1 : 0.6,
                  boxShadow: m.active ? `0 0 16px ${m.color}40` : "none",
                }}>{m.n}</div>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: m.active ? m.color : C.t3 }}>{m.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 36 }}>
          {[
            { n: "01", name: "Entender", hours: "3h", desc: "Fundamentos de IA y Big Data para no técnicos. Conceptos clave y su relación con el negocio de Pactia.", status: "En curso", color: C.azure, active: true },
            { n: "02", name: "Explorar", hours: "3h", desc: "IA aplicada al Real Estate y a la estrategia. Gestión de portafolios, evaluación de activos, inteligencia de mercados.", status: "Próximo", color: C.purple, active: false },
            { n: "03", name: "Hacer", hours: "6h", desc: "Análisis de datos y automatización con IA. Ejercicios prácticos con datos y escenarios reales de Pactia.", status: "Próximamente", color: C.green, active: false },
            { n: "04", name: "Transformar", hours: "8h", desc: "IA generativa y Data Storytelling. Narrar con datos para líderes, creación de contenidos estratégicos.", status: "Próximamente", color: C.orange, active: false },
            { n: "05", name: "Construir", hours: "8h", desc: "Proyectos aplicados por equipos. Definición de retos reales, desarrollo de prototipos y automatizaciones.", status: "Próximamente", color: C.yellow, active: false },
            { n: "06", name: "Apropiar", hours: "8h", desc: "Cierre y transferencia al negocio. Presentación de proyectos, validación en contexto real, lecciones aprendidas.", status: "Próximamente", color: C.red, active: false },
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
          marginTop: 36, padding: 3, borderRadius: 18,
          background: `linear-gradient(135deg,${C.azure},${C.purple},${C.zafre})`,
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite",
        }}>
          <div style={{
            padding: 28, borderRadius: 15,
            background: `linear-gradient(135deg,${C.dark2},${C.dark3})`,
            display: "flex", alignItems: "center", gap: 20,
          }}>
            <div style={{
              fontSize: "2.5rem", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace",
              background: `linear-gradient(135deg,${C.azure},${C.purple})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>36h</div>
            <div>
              <h3>De Entender a Apropiar</h3>
              <p style={{ color: C.t2, fontSize: ".88rem", lineHeight: 1.7 }}>
                El programa completo combina contenidos conceptuales con <strong style={{ color: C.t1 }}>ejercicios prácticos
                aplicados al contexto de Pactia</strong>. Los módulos 1 y 2 (6h) son para todo el grupo completo.
                Los módulos 3 a 6 (30h) se trabajan en grupos de máximo 25, con mentoría directa y desarrollo de proyectos reales.
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
            Pactia tiene la escala, los datos y la visión. SinergIA es el camino para convertir esa ventaja en acción.
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

      {/* CTA - Diagnostico IA */}
      <div style={{
        padding: "60px 56px", display: "flex", justifyContent: "center",
      }}>
        <div style={{
          maxWidth: 700, width: "100%", padding: 3,
          borderRadius: 20,
          background: `linear-gradient(135deg,${C.azure},${C.purple},${C.green},${C.azure})`,
          backgroundSize: "300% 300%",
          animation: "gradientShift 6s ease infinite",
        }}>
          <style>{`@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}`}</style>
          <div style={{
            background: C.dark2, borderRadius: 18, padding: "40px 36px", textAlign: "center",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: 14 }}>🤖</div>
            <h3 style={{
              fontSize: "1.3rem", fontWeight: 800, lineHeight: 1.3, marginBottom: 12,
              background: `linear-gradient(135deg,#fff,${C.azureLight})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              ¿Quieres descubrir que herramienta de IA necesitas?
            </h3>
            <p style={{ color: C.t2, fontSize: ".9rem", lineHeight: 1.6, marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>
              Realiza nuestro <strong style={{ color: C.azure }}>diagnostico interactivo gratuito</strong> y
              recibe una recomendacion personalizada de herramientas de IA segun tu perfil, rol y necesidades.
            </p>
            <a
              href="https://que-ia-necesito.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 32px",
                background: `linear-gradient(135deg,${C.azure},${C.zafre})`,
                color: "#fff", textDecoration: "none",
                borderRadius: 14, fontSize: ".9rem", fontWeight: 700,
                letterSpacing: ".5px", transition: ".3s",
                boxShadow: `0 4px 24px rgba(0,169,224,.3)`,
              }}
            >
              Iniciar diagnostico
              <span style={{ fontSize: "1.1rem" }}>→</span>
            </a>
            <p style={{ color: C.t3, fontSize: ".72rem", marginTop: 14 }}>
              Toma menos de 3 minutos &bull; 100% gratuito &bull; Resultados inmediatos
            </p>
          </div>
        </div>
      </div>

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
          <div style={{ fontSize: ".72rem", color: C.t3, marginTop: 4 }}>IA y Analítica &mdash; Pactia x NODO EAFIT</div>
        </div>
        <div style={{ fontSize: ".7rem", color: C.t3, textAlign: "right" }}>
          Sesión 1 de 6 &bull; Módulo: Entender &bull; Abril 2026<br />
          <span style={{ color: C.t3, opacity: 0.7 }}>v2 · Actualizado con modelos Claude Opus 4.7, GPT-5, Gemini 3</span>
        </div>
      </footer>
    </>
  );
}
