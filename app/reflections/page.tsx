"use client";

import { useEffect } from "react";
import styles from "./reflections.module.css";
import Image from "next/image";

const FLOW_NODES = [
  { id: "energy",        label: "Energy Input",      sub: "Thermodynamic gradient" },
  { id: "matter",        label: "Matter",             sub: "Atomic structure" },
  { id: "self-org",      label: "Self-Organization",  sub: "Bounded chemistry" },
  { id: "replication",   label: "Replication",        sub: "Information transfer" },
  { id: "adaptation",    label: "Adaptation",         sub: "Differential selection" },
  { id: "consciousness", label: "Consciousness",      sub: "Internal modeling" },
];

function LifeFlowDiagram() {
  return (
    <div className={styles["flow-diagram"]}>
      {FLOW_NODES.map((node, i) => (
        <div key={node.id} className={styles["flow-node-wrap"]}>
          <div className={styles["flow-node"]}>
            <div className={styles["flow-node-circle"]}>
              <span className={styles["flow-node-index"]}>{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className={styles["flow-node-text"]}>
              <span className={styles["flow-node-label"]}>{node.label}</span>
              <span className={styles["flow-node-sub"]}>{node.sub}</span>
            </div>
          </div>
          {i < FLOW_NODES.length - 1 && (
            <div className={styles["flow-connector"]}>
              <div className={styles["flow-connector-line"]} />
              <svg width="8" height="5" viewBox="0 0 8 5" className={styles["flow-connector-arrow"]}>
                <path d="M0 0 L4 5 L8 0" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const EVO_NODES = [
  { label: "Biology",               year: "~3.8B BCE", desc: "Brains built by natural selection" },
  { label: "Language",              year: "~70,000 BCE", desc: "Knowledge shared across generations" },
  { label: "Civilization",          year: "~5,000 BCE", desc: "Written memory and shared institutions" },
  { label: "Industrial Systems",    year: "1760 CE",    desc: "Machines extend physical capacity" },
  { label: "Digital Networks",      year: "1990 CE",    desc: "Global information access" },
  { label: "Artificial Intelligence", year: "Present",  desc: "Intelligence outside biology" },
];

const EVOx = [36, 76, 116, 156, 196, 236];
const EVOy = [28, 92, 156, 220, 284, 348];
const SVG_W = 340;
const SVG_H = 380;

function EvoBranchDiagram() {
  return (
    <div className={styles["evo-diagram-wrap"]}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        className={styles["evo-svg"]}
        role="img"
        aria-label="Evolution of intelligence branching diagram"
      >
        {EVO_NODES.slice(0, -1).map((_, i) => (
          <line
            key={i}
            x1={EVOx[i]}     y1={EVOy[i]}
            x2={EVOx[i + 1]} y2={EVOy[i + 1]}
            stroke="#9CA3AF"
            strokeWidth="1"
          />
        ))}

        {EVO_NODES.map((node, i) => (
          <g key={node.label} className={styles["evo-node-g"]} aria-label={`${node.label}: ${node.year} — ${node.desc}`}>
            <rect
              x={EVOx[i] - 10} y={EVOy[i] - 10}
              width={SVG_W - EVOx[i]}
              height={20}
              fill="transparent"
            />
            <circle
              cx={EVOx[i]} cy={EVOy[i]}
              r={5}
              fill="#F4F5F7"
              stroke="#6B7280"
              strokeWidth="1"
              className={styles["evo-circle"]}
            />
            <text
              x={EVOx[i] + 16} y={EVOy[i] - 1}
              fontSize="12"
              fill="#1C1F24"
              fontFamily="Georgia, serif"
              className={styles["evo-label"]}
            >
              {node.label}
            </text>
            <text
              x={EVOx[i] + 16} y={EVOy[i] + 12}
              fontSize="9"
              fill="#6B7280"
              fontFamily="sans-serif"
              letterSpacing="0.08em"
              textDecoration="uppercase"
            >
              {node.year}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const PRED_LAYERS = [
  { label: "Sensory Input",       note: "~11M bits/sec received" },
  { label: "Neural Filtering",    note: "~40 bits/sec conscious" },
  { label: "Predictive Modeling", note: "Prior expectations applied" },
  { label: "Contextual Framing",  note: "Memory + emotion weighting" },
  { label: "Perceived World",     note: "Constructed representation" },
];

function PredictiveStack() {
  return (
    <div className={styles["pred-stack"]}>
      <span className={styles["pred-stack-label"]}>How perception is built</span>
      {PRED_LAYERS.map((layer, i) => (
        <div key={layer.label} className={styles["pred-layer-wrap"]}>
          <div className={styles["pred-layer"]}>
            <span className={styles["pred-layer-name"]}>{layer.label}</span>
            <span className={styles["pred-layer-note"]}>{layer.note}</span>
          </div>
          {i < PRED_LAYERS.length - 1 && (
            <div className={styles["pred-arrow"]}>
              <svg width="1" height="18" viewBox="0 0 1 18">
                <line x1="0.5" y1="0" x2="0.5" y2="12" stroke="#9CA3AF" strokeWidth="1" />
                <path d="M-2.5 10 L0.5 14 L3.5 10" fill="none" stroke="#9CA3AF" strokeWidth="1" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const LOOP_NODES = [
  { label: "Environment", angle: -90 },
  { label: "Brain",       angle: 0   },
  { label: "Model",       angle: 90  },
  { label: "Self",        angle: 180 },
];
const R = 72;
const CX = 120;
const CY = 120;
const NR = 7;

function nodePos(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
  };
}

function arcPath(fromAngle: number, toAngle: number): string {
  const startRad = (fromAngle * Math.PI) / 180;
  const endRad   = (toAngle   * Math.PI) / 180;
  const offset   = (NR + 3) / R;
  const aStart   = startRad + offset;
  const aEnd     = endRad   - offset;
  const sx = CX + R * Math.cos(aStart);
  const sy = CY + R * Math.sin(aStart);
  const ex = CX + R * Math.cos(aEnd);
  const ey = CY + R * Math.sin(aEnd);
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${R} ${R} 0 0 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

function ConsciousnessLoop() {
  const angles = LOOP_NODES.map((n) => n.angle);

  return (
    <div className={styles["c-loop-wrap"]}>
      <svg
        viewBox="0 0 240 240"
        width="240"
        height="240"
        className={styles["c-loop-svg"]}
        role="img"
        aria-label="Consciousness loop: Environment, Brain, Model, Self"
      >
        <defs>
          <marker
            id="loop-arrow"
            markerWidth="5"
            markerHeight="5"
            refX="4"
            refY="2.5"
            orient="auto"
          >
            <path d="M0,0.5 L4,2.5 L0,4.5" fill="none" stroke="#9CA3AF" strokeWidth="1" />
          </marker>
        </defs>

        <circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke="#D1D5DB"
          strokeWidth="1"
          strokeDasharray="3 5"
          className={styles["c-loop-track"]}
        />

        {angles.map((fromAngle, i) => {
          const toAngle = angles[(i + 1) % angles.length] + (i === angles.length - 1 ? 360 : 0);
          return (
            <path
              key={i}
              d={arcPath(fromAngle, toAngle)}
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="1"
              markerEnd="url(#loop-arrow)"
            />
          );
        })}

        {LOOP_NODES.map((node) => {
          const { x, y } = nodePos(node.angle);
          const lx = CX + (R + 22) * Math.cos((node.angle * Math.PI) / 180);
          const ly = CY + (R + 22) * Math.sin((node.angle * Math.PI) / 180);
          const anchor =
            node.angle === 0   ? "start"
            : node.angle === 180 ? "end"
            : "middle";
          return (
            <g key={node.label}>
              <circle
                cx={x} cy={y} r={NR}
                fill="#ECEFF2"
                stroke="#6B7280"
                strokeWidth="1"
              />
              <text
                x={lx} y={ly}
                fontSize="10"
                fontFamily="sans-serif"
                fill="#4B5563"
                textAnchor={anchor}
                dominantBaseline="middle"
                letterSpacing="0.04em"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function ReflectionsPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const revealEls = document.querySelectorAll(`.${styles.reveal}`);
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    const cLabel    = document.getElementById("c-label");
    const cLines    = document.querySelectorAll(`.${styles["c-line"]}`);
    const cFootnote = document.getElementById("c-footnote");
    const cSection  = document.getElementById("consciousness");

    if (cSection) {
      const cObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (cLabel) cLabel.classList.add(styles.visible);
              cLines.forEach((line, i) => {
                setTimeout(() => line.classList.add(styles.visible), i * 300);
              });
              setTimeout(
                () => { if (cFootnote) cFootnote.classList.add(styles.visible); },
                cLines.length * 300 + 300
              );
              cObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      cObserver.observe(cSection);
    }

    const expandCards = document.querySelectorAll(`.${styles["expand-card"]}`);
    const handleCardClick = (e: Event) => {
      const card = e.currentTarget as HTMLElement;
      const wasOpen = card.classList.contains(styles.open);
      expandCards.forEach((c) => c.classList.remove(styles.open));
      if (!wasOpen) card.classList.add(styles.open);
    };
    expandCards.forEach((card) => card.addEventListener("click", handleCardClick));

    const heroRight = document.querySelector("[data-hero-right]") as HTMLElement | null;
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const handleParallax = () => {
      if (!heroRight || isMobile) return;
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroRight.style.transform = `translateY(${scrollY * 0.04}px)`;
      }
    };
    window.addEventListener("scroll", handleParallax, { passive: true });

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", handleParallax);
      expandCards.forEach((card) => card.removeEventListener("click", handleCardClick));
    };
  }, []);

  return (
    <div className={styles.root}>

      {/* ══════════════════ HERO ══════════════════ */}
      <section id="hero" className={styles.hero}>
        <div className={styles["hero-left"]}>
          <p className={styles["hero-eyebrow"]}>A Personal Reflection</p>
          <h1 className={styles["hero-title"]}>
            Human<br />Reflections
          </h1>
          <p className={styles["hero-subtitle"]}>
            Thinking beyond my professional work.
          </p>
          <div className={styles["hero-divider"]} />
          <div className={styles["hero-body"]}>
            <p>
              My work is in engineered systems — where precision and structure
              matter. I find myself applying that same approach to much larger
              questions.
            </p>
            <p>
              <span className={styles.highlight}>
                How did life begin from chemistry? How does the brain produce
                what we call reality? Why do we experience anything at all?
              </span>
            </p>
            <p>
              This is not a journal. It is a record of how I think about
              questions that cross many fields — and still don't have clean
              answers.
            </p>
          </div>

          <div className={styles["hero-meta"]}>
            <div className={styles["hero-meta-item"]}>
              <span className={styles["hero-meta-label"]}>Location</span>
              <span className={styles["hero-meta-value"]}>Earth</span>
            </div>
            <div className={styles["hero-meta-dot"]} />
            <div className={styles["hero-meta-item"]}>
              <span className={styles["hero-meta-label"]}>Time</span>
              <span className={styles["hero-meta-value"]}>~13.8B years post-origin</span>
            </div>
            <div className={styles["hero-meta-dot"]} />
            <div className={styles["hero-meta-item"]}>
              <span className={styles["hero-meta-label"]}>Mode</span>
              <span className={styles["hero-meta-value"]}>Observing</span>
            </div>
          </div>
        </div>

        <div className={styles["hero-right"]} data-hero-right>
          <div className={styles["portrait-frame"]}>
            <div className={styles["portrait-img"]}>
              <div className={styles["portrait-placeholder"]}>
              <Image
                src="/images/naveen-portrait.png"
                alt="Naveen portrait"
                fill
                priority
               sizes="(max-width: 900px) 60vw, 380px"
               style={{
                 objectFit: "cover",
                 filter: "grayscale(100%)",
               }}
               />
              </div>
            </div>
            <p className={styles["portrait-caption"]}>— The Observer</p>
          </div>
        </div>

        <div className={styles["scroll-indicator"]}>
          <div className={styles["scroll-line"]} />
          <span className={styles["scroll-text"]}>Scroll</span>
        </div>
      </section>

      {/* ══════════════════ SECTION 01 — WHAT IS LIFE ══════════════════ */}
      <section id="life" className={styles.life}>
        <span className={styles["section-index"]}>01</span>
        <div className={styles.container}>
          <div className={`${styles["life-header"]} ${styles.reveal}`}>
            <span className={styles["section-label"]}>Section 01</span>
            <h2 className={styles["section-title"]}>What Is Life?</h2>
            <p className={styles["section-subtitle"]}>From Physics to Biology</p>
            <span className={styles["gold-line"]} />
            <div className={styles["framework-line"]}>
              <span className={styles["framework-term"]}>Physics</span>
              <span className={styles["framework-sep"]}>→</span>
              <span className={styles["framework-term"]}>Chemistry</span>
              <span className={styles["framework-sep"]}>→</span>
              <span className={styles["framework-term"]}>Biology</span>
              <span className={styles["framework-sep"]}>→</span>
              <span className={styles["framework-term"]}>Evolution</span>
              <span className={styles["framework-sep"]}>→</span>
              <span className={styles["framework-term"]}>Consciousness</span>
            </div>
          </div>

          <div className={styles["life-grid"]}>
            <div className={styles["life-blocks"]}>
              <div className={`${styles["life-block"]} ${styles.reveal} ${styles["reveal-delay-1"]}`}>
                <div className={styles["life-block-number"]}>01 / Cosmic Origins</div>
                <h3 className={styles["life-block-title"]}>Cosmic Origins</h3>
                <p className={styles["life-block-text"]}>
                  The atoms inside every living thing — carbon, nitrogen, oxygen,
                  phosphorus — were made inside stars. When I think about that, life
                  stops feeling like a separate category. It is physics, just further
                  along.
                </p>
              </div>
              <div className={`${styles["life-block"]} ${styles.reveal} ${styles["reveal-delay-2"]}`}>
                <div className={styles["life-block-number"]}>02 / Chemical Emergence</div>
                <h3 className={styles["life-block-title"]}>Chemical Emergence</h3>
                <p className={styles["life-block-text"]}>
                  At some point, molecules started copying themselves and using
                  energy to stay organized. That was the crossing point — from
                  chemistry to biology. No new laws were needed. Only the right
                  conditions and enough time.
                </p>
              </div>
              <div className={`${styles["life-block"]} ${styles.reveal} ${styles["reveal-delay-3"]}`}>
                <div className={styles["life-block-number"]}>03 / Cellular Life</div>
                <h3 className={styles["life-block-title"]}>Cellular Life</h3>
                <p className={styles["life-block-text"]}>
                  A single cell does everything we associate with being alive: it
                  stores information, replicates, uses energy, and responds to its
                  environment. A bacterium runs thousands of reactions at once just
                  to hold itself together.
                </p>
              </div>
              <div className={`${styles["life-block"]} ${styles.reveal} ${styles["reveal-delay-4"]}`}>
                <div className={styles["life-block-number"]}>04 / Evolutionary Complexity</div>
                <h3 className={styles["life-block-title"]}>Evolutionary Complexity</h3>
                <p className={styles["life-block-text"]}>
                  Natural selection has no goal. It keeps what works and discards
                  what doesn't — generation after generation. Over billions of years,
                  this produced immune systems, eyes, and eventually brains that can
                  model the world around them.
                </p>
              </div>
              <div className={`${styles["life-block"]} ${styles.reveal} ${styles["reveal-delay-5"]}`}>
                <div className={styles["life-block-number"]}>05 / Conscious Awareness</div>
                <h3 className={styles["life-block-title"]}>Conscious Awareness</h3>
                <p className={styles["life-block-text"]}>
                  At some point, brains became complex enough to model themselves.
                  Whether that inner experience is a product of information
                  processing — or something else — is still the deepest open
                  question in science.
                </p>
              </div>
            </div>

            <div className={`${styles["life-visual"]} ${styles.reveal} ${styles["reveal-delay-2"]}`}>
              <LifeFlowDiagram />
              <span className={styles["life-visual-label"]}>
                Matter · Energy · Information
              </span>
            </div>
          </div>

          <div className={`${styles["obs-block"]} ${styles.reveal} ${styles["reveal-delay-3"]}`}>
            <span className={styles["obs-label"]}>Observation</span>
            <p className={styles["obs-text"]}>
              Life is matter that holds itself together by consuming energy. It
              copies itself. It adapts. The move from chemistry to biology did
              not need a miracle — just the right starting point and time to
              run.
            </p>
            <p className={styles["cross-connect"]}>
              The same processes that produced cells eventually produced brains.
              And brains produced everything that follows in this page.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════ SECTION 02 — EVOLUTION OF INTELLIGENCE ══════════════════ */}
      <section id="evolution" className={styles.evolution}>
        <span className={styles["section-index"]}>02</span>
        <div className={styles.container}>
          <div className={`${styles["evolution-header"]} ${styles.reveal}`}>
            <span className={styles["section-label"]}>Section 02</span>
            <h2 className={styles["section-title"]}>Evolution of Intelligence</h2>
            <p className={styles["section-subtitle"]}>From Instinct to Artificial Cognition</p>
            <span className={styles["gold-line"]} />
            <div className={`${styles["framework-line"]} ${styles["framework-line-center"]}`}>
              <span className={styles["framework-term"]}>Biology</span>
              <span className={styles["framework-sep"]}>→</span>
              <span className={styles["framework-term"]}>Language</span>
              <span className={styles["framework-sep"]}>→</span>
              <span className={styles["framework-term"]}>Civilization</span>
              <span className={styles["framework-sep"]}>→</span>
              <span className={styles["framework-term"]}>Technology</span>
              <span className={styles["framework-sep"]}>→</span>
              <span className={styles["framework-term"]}>AI</span>
            </div>
          </div>

          <div className={`${styles.reveal} ${styles["reveal-delay-1"]}`}>
            <EvoBranchDiagram />
          </div>
        </div>

        <div className={`${styles["timeline-wrapper"]} ${styles.reveal} ${styles["reveal-delay-2"]}`}>
          <div className={styles.timeline}>

            <div className={styles["timeline-node"]}>
              <div className={styles["node-card"]}>
                <div className={styles["node-card-title"]}>Biological Evolution</div>
                <p className={styles["node-card-text"]}>
                  Over 3.8 billion years, selection built increasingly capable
                  nervous systems — from simple reflexes to brains that plan,
                  imagine, and reason about themselves.
                </p>
              </div>
              <div className={styles["node-dot-wrapper"]}>
                <div className={styles["node-dot"]} />
                <div className={styles["node-year"]}>~3.8B BCE</div>
                <div className={styles["node-title"]}>Biological Evolution</div>
              </div>
            </div>

            <div className={styles["timeline-node"]}>
              <div className={styles["node-card"]}>
                <div className={styles["node-card-title"]}>Language</div>
                <p className={styles["node-card-text"]}>
                  Language meant ideas could leave one mind and enter another.
                  Knowledge became cumulative — the first system of inheritance
                  that didn't require DNA.
                </p>
              </div>
              <div className={styles["node-dot-wrapper"]}>
                <div className={styles["node-dot"]} />
                <div className={styles["node-year"]}>~70,000 BCE</div>
                <div className={styles["node-title"]}>Language</div>
              </div>
            </div>

            <div className={styles["timeline-node"]}>
              <div className={styles["node-card"]}>
                <div className={styles["node-card-title"]}>Civilization</div>
                <p className={styles["node-card-text"]}>
                  Writing gave knowledge a permanent form. Cities and agriculture
                  built systems large enough to hold what no single person could
                  carry or remember.
                </p>
              </div>
              <div className={styles["node-dot-wrapper"]}>
                <div className={styles["node-dot"]} />
                <div className={styles["node-year"]}>~5,000 BCE</div>
                <div className={styles["node-title"]}>Civilization</div>
              </div>
            </div>

            <div className={styles["timeline-node"]}>
              <div className={styles["node-card"]}>
                <div className={styles["node-card-title"]}>Industrial Age</div>
                <p className={styles["node-card-text"]}>
                  Machines extended physical capacity. The printing press made
                  ideas cheap to copy and fast to move — compressing the time
                  it took for knowledge to spread.
                </p>
              </div>
              <div className={styles["node-dot-wrapper"]}>
                <div className={styles["node-dot"]} />
                <div className={styles["node-year"]}>1760 CE</div>
                <div className={styles["node-title"]}>Industrial Age</div>
              </div>
            </div>

            <div className={styles["timeline-node"]}>
              <div className={styles["node-card"]}>
                <div className={styles["node-card-title"]}>Digital Era</div>
                <p className={styles["node-card-text"]}>
                  The internet made most of recorded human knowledge available
                  to anyone, instantly, from anywhere. The cost of accessing
                  information dropped to nearly zero.
                </p>
              </div>
              <div className={styles["node-dot-wrapper"]}>
                <div className={styles["node-dot"]} />
                <div className={styles["node-year"]}>1990 CE</div>
                <div className={styles["node-title"]}>Digital Era</div>
              </div>
            </div>

            <div className={styles["timeline-node"]}>
              <div className={styles["node-card"]}>
                <div className={styles["node-card-title"]}>Artificial Intelligence</div>
                <p className={styles["node-card-text"]}>
                  Systems now read, reason, and generate language without a
                  biological brain behind them. What counts as intelligence is
                  becoming harder to define.
                </p>
              </div>
              <div className={styles["node-dot-wrapper"]}>
                <div className={styles["node-dot"]} />
                <div className={styles["node-year"]}>Present</div>
                <div className={styles["node-title"]}>Artificial Intelligence</div>
              </div>
            </div>

          </div>
        </div>

        <div className={styles.container}>
          <div className={`${styles["timeline-mobile"]} ${styles.reveal} ${styles["reveal-delay-1"]}`}>
            <div className={styles["mobile-node"]}>
              <div className={styles["mobile-node-year"]}>~3.8B BCE</div>
              <div className={styles["mobile-node-title"]}>Biological Evolution</div>
              <p className={styles["mobile-node-text"]}>
                Selection shaped nervous systems over billions of years —
                producing brains capable of planning and abstract thought.
              </p>
            </div>
            <div className={styles["mobile-node"]}>
              <div className={styles["mobile-node-year"]}>~70,000 BCE</div>
              <div className={styles["mobile-node-title"]}>Language</div>
              <p className={styles["mobile-node-text"]}>
                Language let knowledge grow beyond one person's lifetime.
                It made thinking a shared, cumulative process.
              </p>
            </div>
            <div className={styles["mobile-node"]}>
              <div className={styles["mobile-node-year"]}>~5,000 BCE</div>
              <div className={styles["mobile-node-title"]}>Civilization</div>
              <p className={styles["mobile-node-text"]}>
                Writing and cities created memory systems that outlasted
                any individual life.
              </p>
            </div>
            <div className={styles["mobile-node"]}>
              <div className={styles["mobile-node-year"]}>1760 CE</div>
              <div className={styles["mobile-node-title"]}>Industrial Age</div>
              <p className={styles["mobile-node-text"]}>
                Machines took over physical work. Print made ideas cheap
                to copy and fast to spread.
              </p>
            </div>
            <div className={styles["mobile-node"]}>
              <div className={styles["mobile-node-year"]}>1990 CE</div>
              <div className={styles["mobile-node-title"]}>Digital Era</div>
              <p className={styles["mobile-node-text"]}>
                Global networks gave almost anyone access to almost all
                recorded human knowledge, in real time.
              </p>
            </div>
            <div className={styles["mobile-node"]}>
              <div className={styles["mobile-node-year"]}>Present</div>
              <div className={styles["mobile-node-title"]}>Artificial Intelligence</div>
              <p className={styles["mobile-node-text"]}>
                Intelligence now operates outside biology. Whether this
                continues the same pattern — or breaks from it — is still
                an open question.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={`${styles["obs-block"]} ${styles.reveal} ${styles["reveal-delay-2"]}`}>
            <span className={styles["obs-label"]}>Observation</span>
            <p className={styles["obs-text"]}>
              What I find striking is that intelligence has never been fixed.
              Each step in this sequence extends the previous one — it doesn't
              replace it. The brain didn't stop being relevant when writing
              appeared. Tools extend what minds can do.
            </p>
            <p className={styles["cross-connect"]}>
              AI fits that same pattern. It is one more layer built on top of
              everything that came before.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════ SECTION 03 — REALITY & PERCEPTION ══════════════════ */}
      <section id="reality" className={styles.reality}>
        <span className={styles["section-index"]}>03</span>
        <div className={styles.container}>
          <div className={styles["reality-grid"]}>

            <div className={`${styles["reality-left"]} ${styles.reveal}`}>
              <span className={styles["section-label"]}>Section 03</span>
              <blockquote className={styles["reality-quote"]}>
                Perception is not a window.<br />It is a model.
              </blockquote>
              <p className={styles["reality-quote-attr"]}>
                On how the brain constructs experience
              </p>
              <div className={styles["framework-line"]} style={{ marginTop: "28px" }}>
                <span className={styles["framework-term"]}>Input</span>
                <span className={styles["framework-sep"]}>→</span>
                <span className={styles["framework-term"]}>Filtering</span>
                <span className={styles["framework-sep"]}>→</span>
                <span className={styles["framework-term"]}>Prediction</span>
                <span className={styles["framework-sep"]}>→</span>
                <span className={styles["framework-term"]}>Memory</span>
                <span className={styles["framework-sep"]}>→</span>
                <span className={styles["framework-term"]}>Percept</span>
              </div>

              <PredictiveStack />
            </div>

            <div className={`${styles["reality-right"]} ${styles.reveal} ${styles["reveal-delay-2"]}`}>
              <span className={styles["cards-micro-label"]}>Cognitive Architecture</span>
              <div className={styles["cards-grid"]}>

                <div className={styles["expand-card"]}>
                  <div className={styles["card-header"]}>
                    <h3 className={styles["card-title"]}>Perception</h3>
                    <div className={styles["card-icon"]} />
                  </div>
                  <div className={styles["card-body"]}>
                    <div className={styles["card-body-inner"]}>
                      The brain takes in around 11 million bits of sensory
                      information per second. It consciously processes about 40.
                      Rather than recording the world, it predicts it — and only
                      updates when something doesn't match what it expected.
                    </div>
                  </div>
                </div>

                <div className={styles["expand-card"]}>
                  <div className={styles["card-header"]}>
                    <h3 className={styles["card-title"]}>Memory</h3>
                    <div className={styles["card-icon"]} />
                  </div>
                  <div className={styles["card-body"]}>
                    <div className={styles["card-body-inner"]}>
                      Memory is not a recording. Each time you recall something,
                      you rebuild it — shaped by how you feel now, what has
                      happened since, and the context you're in. What you
                      remember is a present-day reconstruction of a past event.
                    </div>
                  </div>
                </div>

                <div className={styles["expand-card"]}>
                  <div className={styles["card-header"]}>
                    <h3 className={styles["card-title"]}>Emotion</h3>
                    <div className={styles["card-icon"]} />
                  </div>
                  <div className={styles["card-body"]}>
                    <div className={styles["card-body-inner"]}>
                      Emotions are not reactions that happen to you. The brain
                      constructs them from body signals, past experience, and
                      available concepts. The same physical state — elevated
                      heart rate, heightened alertness — becomes fear, excitement,
                      or focus depending on context.
                    </div>
                  </div>
                </div>

                <div className={styles["expand-card"]}>
                  <div className={styles["card-header"]}>
                    <h3 className={styles["card-title"]}>Culture</h3>
                    <div className={styles["card-icon"]} />
                  </div>
                  <div className={styles["card-body"]}>
                    <div className={styles["card-body-inner"]}>
                      Culture is not just background. It shapes which things
                      the brain notices, how it categorizes them, and what it
                      treats as significant. Language, stories, and norms are
                      part of how perception itself is built — not separate
                      from it.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className={`${styles["obs-block"]} ${styles.reveal} ${styles["reveal-delay-3"]}`}>
            <span className={styles["obs-label"]}>Observation</span>
            <p className={styles["obs-text"]}>
              No two brains carry the same prior experience. That means no two
              people are ever looking at exactly the same thing — even when they
              are in the same room, facing the same scene.
            </p>
            <p className={styles["cross-connect"]}>
              What shapes what we see also shapes what we feel and remember.
              Culture, mood, and past experience are not separate from the mind
              — they are part of how it works.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════ SECTION 04 — RELIGION & MEANING ══════════════════ */}
      <section id="religion" className={styles.religion}>
        <span className={styles["section-index"]}>04</span>
        <div className={styles.container}>
          <div className={`${styles["religion-header"]} ${styles.reveal}`}>
            <span className={styles["section-label"]}>Section 04</span>
            <h2 className={styles["section-title"]}>Religion &amp; Meaning</h2>
            <p className={styles["section-subtitle"]}>How humans make sense of things</p>
            <span className={styles["gold-line"]} />
            <div className={`${styles["framework-line"]} ${styles["framework-line-center"]}`}>
              <span className={styles["framework-term"]}>Myth</span>
              <span className={styles["framework-sep"]}>→</span>
              <span className={styles["framework-term"]}>Structure</span>
              <span className={styles["framework-sep"]}>→</span>
              <span className={styles["framework-term"]}>Morality</span>
              <span className={styles["framework-sep"]}>→</span>
              <span className={styles["framework-term"]}>Identity</span>
              <span className={styles["framework-sep"]}>→</span>
              <span className={styles["framework-term"]}>Transcendence</span>
            </div>
          </div>

          <div className={styles["religion-grid"]}>
            <div className={`${styles["religion-col"]} ${styles.reveal}`}>
              <div className={styles["religion-col-number"]}>01</div>
              <h3 className={styles["religion-col-title"]}>Origins</h3>
              <div className={styles["religion-col-divider"]} />
              <p className={styles["religion-col-text"]}>
                Every documented culture has had religion. That kind of
                consistency points to something in how minds naturally work —
                a tendency to find patterns, assign causes, form groups, and
                manage the awareness that we die. Religion likely emerged
                because it was useful, not simply because it was true.
              </p>
            </div>
            <div className={`${styles["religion-col"]} ${styles.reveal} ${styles["reveal-delay-2"]}`}>
              <div className={styles["religion-col-number"]}>02</div>
              <h3 className={styles["religion-col-title"]}>Structure</h3>
              <div className={styles["religion-col-divider"]} />
              <p className={styles["religion-col-text"]}>
                Traditions that developed with no contact between them often
                arrived at the same shape: a story of creation, rules for
                living, markers of belonging, and a way to face death. That
                convergence is better explained by shared human psychology
                than by shared history.
              </p>
            </div>
            <div className={`${styles["religion-col"]} ${styles.reveal} ${styles["reveal-delay-4"]}`}>
              <div className={styles["religion-col-number"]}>03</div>
              <h3 className={styles["religion-col-title"]}>Modern Evolution</h3>
              <div className={styles["religion-col-divider"]} />
              <p className={styles["religion-col-text"]}>
                As science has answered many questions religion once addressed,
                the underlying needs have not gone away. Community, shared
                identity, meaning, and comfort with mortality now appear in
                political movements, wellness culture, and tech-centered
                worldviews — doing the same work, in different clothes.
              </p>
            </div>
          </div>

          <div className={`${styles["obs-block"]} ${styles.reveal} ${styles["reveal-delay-3"]}`}>
            <span className={styles["obs-label"]}>Observation</span>
            <p className={styles["obs-text"]}>
              Religion persists not because its explanations are accurate, but
              because it solves real problems — how to live together, build
              trust, create meaning, and face mortality. Those problems don't
              disappear with secularism.
            </p>
            <p className={styles["cross-connect"]}>
              Secular ideologies use the same cognitive tools to serve the same
              functions. The beliefs change. The architecture underneath them
              does not.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════ SECTION 05 — CONSCIOUSNESS ══════════════════ */}
      <section id="consciousness" className={styles.consciousness}>
        <span className={styles["section-index"]}>05</span>
        <div className={styles["consciousness-inner"]}>
          <div className={styles["consciousness-label"]} id="c-label">
            Section 05 — Consciousness
          </div>
          <div className={styles["consciousness-lines"]} id="c-lines">
            <div className={styles["c-line"]}>
              Matter <span>self-organized.</span>
            </div>
            <div className={styles["c-line"]}>
              Systems began to <span>model their environment.</span>
            </div>
            <div className={styles["c-line"]}>
              Models became <span>self-referential.</span>
            </div>
            <div className={styles["c-line"]}>
              The system <span>became aware of itself.</span>
            </div>
          </div>
          <div className={styles["consciousness-footnote"]} id="c-footnote">
            Why any of this produces inner experience — nobody knows.
          </div>

          <ConsciousnessLoop />

          <div
            className={`${styles["framework-line"]} ${styles["framework-line-center"]}`}
            style={{ marginTop: "40px", justifyContent: "center" }}
          >
            <span className={styles["framework-term"]}>Matter</span>
            <span className={styles["framework-sep"]}>→</span>
            <span className={styles["framework-term"]}>Information</span>
            <span className={styles["framework-sep"]}>→</span>
            <span className={styles["framework-term"]}>Awareness</span>
            <span className={styles["framework-sep"]}>→</span>
            <span className={styles["framework-term"]}>Self-Reflection</span>
          </div>

          <div
            className={`${styles["obs-block"]} ${styles["obs-block-center"]} ${styles.reveal} ${styles["reveal-delay-3"]}`}
            style={{ marginTop: "48px" }}
          >
            <span className={styles["obs-label"]}>Observation</span>
            <p className={styles["obs-text"]}>
              We can see which parts of the brain are active during conscious
              experience. What we cannot explain is why physical processes
              produce something that feels like anything at all. That gap is
              not small. It may require rethinking the framework, not just
              filling in details.
            </p>
            <p className={styles["cross-connect"]} style={{ textAlign: "center", marginTop: "16px" }}>
              The mind trying to understand consciousness is the same system
              it is trying to understand.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════ SECTION 06 — SYSTEM VIEW ══════════════════ */}
      <section id="sysview" className={styles.sysview}>
        <span className={styles["section-index"]}>06</span>
        <div className={styles.container}>
          <div className={`${styles["sysview-header"]} ${styles.reveal}`}>
            <span className={styles["section-label"]}>Section 06</span>
            <h2 className={styles["section-title"]}>System View</h2>
            <p className={styles["section-subtitle"]}>How each layer builds on the last</p>
            <span className={styles["gold-line"]} />
          </div>

          <div className={styles["sysview-inner"]}>
            <div className={`${styles["sysview-chain"]} ${styles.reveal} ${styles["reveal-delay-1"]}`}>
              <div className={styles["sysview-row"]}>
                <div>
                  <div className={styles["sysview-term"]}>Matter</div>
                  <div className={styles["sysview-sub"]}>Particles · Forces · Energy gradients</div>
                </div>
              </div>
              <div className={`${styles["sysview-row"]} ${styles["sysview-row-indent"]}`}>
                <span className={styles["sysview-arrow"]}>→</span>
                <div>
                  <div className={styles["sysview-term"]}>Self-Organizing Systems</div>
                  <div className={styles["sysview-sub"]}>Chemistry · Replication · Sustained order through energy</div>
                </div>
              </div>
              <div className={`${styles["sysview-row"]} ${styles["sysview-row-indent"]}`}>
                <span className={styles["sysview-arrow"]}>→</span>
                <div>
                  <div className={styles["sysview-term"]}>Biological Complexity</div>
                  <div className={styles["sysview-sub"]}>Cells · Evolution · Adaptive brains</div>
                </div>
              </div>
              <div className={`${styles["sysview-row"]} ${styles["sysview-row-indent"]}`}>
                <span className={styles["sysview-arrow"]}>→</span>
                <div>
                  <div className={styles["sysview-term"]}>Neural Modeling</div>
                  <div className={styles["sysview-sub"]}>Prediction · Perception · Memory · Language</div>
                </div>
              </div>
              <div className={`${styles["sysview-row"]} ${styles["sysview-row-indent"]}`}>
                <span className={styles["sysview-arrow"]}>→</span>
                <div>
                  <div className={styles["sysview-term"]}>Reflective Awareness</div>
                  <div className={styles["sysview-sub"]}>Self-models · Consciousness · Reason · Culture</div>
                </div>
              </div>
              <div className={`${styles["sysview-row"]} ${styles["sysview-row-indent"]}`}>
                <span className={styles["sysview-arrow"]}>→</span>
                <div>
                  <div className={styles["sysview-term"]}>Externalized Cognition</div>
                  <div className={styles["sysview-sub"]}>Writing · Institutions · Networks · AI</div>
                </div>
              </div>
            </div>

            <div className={`${styles["sysview-right"]} ${styles.reveal} ${styles["reveal-delay-2"]}`}>
              <p className={styles["sysview-conclusion"]}>
                A system that has begun<br />modeling itself.
              </p>
              <p className={styles["sysview-detail"]}>
                Each layer here is built on the one before it — not a
                replacement, but an extension. Biology runs on chemistry.
                Thought runs on biology. Every level operates within the
                limits set by the level beneath it.
              </p>
              <p className={styles["sysview-detail"]}>
                What strikes me about the present moment is that the system
                has started building external versions of itself — tools that
                model, reason, and extend what the mind can do. The observer
                and the thing being observed are part of the same process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ SECTION 07 — OPEN QUESTIONS ══════════════════ */}
      <section id="questions" className={styles.questions}>
        <span className={styles["section-index"]}>07</span>
        <div className={styles.container}>
          <div className={styles["questions-inner"]}>
            <div className={styles.reveal}>
              <span className={styles["section-label"]}>Section 07</span>
              <h2 className={styles["section-title"]}>Open Questions</h2>
              <p className={styles["section-subtitle"]}>Things I keep coming back to</p>
              <span className={styles["gold-line"]} />
              <div
                className={`${styles["framework-line"]} ${styles["framework-line-center"]}`}
                style={{ marginBottom: "48px" }}
              >
                <span className={styles["framework-term"]}>Unresolved</span>
                <span className={styles["framework-sep"]}>·</span>
                <span className={styles["framework-term"]}>Open</span>
                <span className={styles["framework-sep"]}>·</span>
                <span className={styles["framework-term"]}>Worth asking</span>
              </div>
            </div>

            <ul className={styles["questions-list"]}>
              <li className={`${styles["q-item"]} ${styles.reveal} ${styles["reveal-delay-1"]}`}>
                <span className={styles["q-text"]}>Why is there something rather than nothing?</span>
              </li>
              <li className={`${styles["q-item"]} ${styles.reveal} ${styles["reveal-delay-2"]}`}>
                <span className={styles["q-text"]}>Was the Big Bang a beginning — or a transition from something we can't yet see?</span>
              </li>
              <li className={`${styles["q-item"]} ${styles.reveal} ${styles["reveal-delay-3"]}`}>
                <span className={styles["q-text"]}>Is the universe self-contained, or does something outside it exist?</span>
              </li>
              <li className={`${styles["q-item"]} ${styles.reveal} ${styles["reveal-delay-4"]}`}>
                <span className={styles["q-text"]}>Are there deeper layers of physical structure we haven't found yet?</span>
              </li>
              <li className={`${styles["q-item"]} ${styles.reveal} ${styles["reveal-delay-1"]}`}>
                <span className={styles["q-text"]}>Are we alone in the universe?</span>
              </li>
              <li className={`${styles["q-item"]} ${styles.reveal} ${styles["reveal-delay-2"]}`}>
                <span className={styles["q-text"]}>Is consciousness a basic feature of matter?</span>
              </li>
              <li className={`${styles["q-item"]} ${styles.reveal} ${styles["reveal-delay-3"]}`}>
                <span className={styles["q-text"]}>Is physical reality a kind of computation?</span>
              </li>
              <li className={`${styles["q-item"]} ${styles.reveal} ${styles["reveal-delay-4"]}`}>
                <span className={styles["q-text"]}>Does experience end when the brain stops?</span>
              </li>
            </ul>

            <p className={`${styles["closing-line"]} ${styles.reveal} ${styles["reveal-delay-5"]}`}>
              Still observing.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════ PAGE EPIGRAM ══════════════════ */}
      <div className={`${styles["page-epigram"]} ${styles.reveal}`}>
        <div className={styles["page-epigram-rule"]} />
        <p className={styles["page-epigram-text"]}>
          All models are incomplete. The questions stay open.
        </p>
        <div className={styles["page-epigram-rule"]} />
      </div>

    </div>
  );
}