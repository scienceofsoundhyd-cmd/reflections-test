"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./reflections.module.css";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import GlobalBackground from "./GlobalBackground";

// ─────────────────────────────────────────────────────────────────────────────
// WORD-SPLIT — wraps each word for individual GSAP animation
// ─────────────────────────────────────────────────────────────────────────────
function WordSplit({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className={styles.word} style={{ display:"inline-block", marginRight:"0.28em" }}>
          {word}
        </span>
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHRASE — inline highlighted words, still individually animated by GSAP.
// section: "life"|"evolution"|"reality"|"religion"|"consciousness"|"sysview"|"questions"
// ─────────────────────────────────────────────────────────────────────────────
function Phrase({ text, section }: { text: string; section: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i}
          className={`${styles.word} ${styles[`hl-${section}`]}`}
          style={{ display:"inline-block", marginRight:"0.28em" }}>
          {word}
        </span>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CURIOSITY OPENER — one-line per section, rendered as prop
// ─────────────────────────────────────────────────────────────────────────────
function CuriosityLine({ text }: { text: string }) {
  return (
    <div className={styles["curiosity-line"]}>
      <span className={styles["curiosity-mark"]}>?</span>
      <span className={styles["curiosity-text"]}>{text}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV DOTS
// ─────────────────────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id:"hero",          label:"Observer"      },
  { id:"life",          label:"Life"          },
  { id:"evolution",     label:"Evolution"     },
  { id:"reality",       label:"Reality"       },
  { id:"religion",      label:"Meaning"       },
  { id:"consciousness", label:"Consciousness" },
  { id:"sysview",       label:"System"        },
  { id:"questions",     label:"Questions"     },
];

function NavDots({ active }: { active: number }) {
  return (
    <nav className={styles["nav-dots"]} aria-label="Section navigation">
      {NAV_SECTIONS.map((s, i) => (
        <a key={s.id} href={`#${s.id}`}
          className={`${styles["nav-dot-wrap"]} ${i === active ? styles["nav-dot-active"] : ""}`}
          aria-label={s.label}
          onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior:"smooth" }); }}>
          <span className={styles["nav-dot"]} />
          <span className={styles["nav-dot-label"]}>{s.label}</span>
        </a>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// S01 — Life flow
const FLOW_NODES = [
  { label:"Energy Input",      sub:"Thermodynamic gradient" },
  { label:"Matter",            sub:"Atomic structure"       },
  { label:"Self-Organization", sub:"Bounded chemistry"      },
  { label:"Replication",       sub:"Information transfer"   },
  { label:"Adaptation",        sub:"Differential selection" },
  { label:"Consciousness",     sub:"Internal modeling"      },
];
function LifeFlowDiagram() {
  return (
    <div className={styles["diagram-float"]}>
      <div className={styles["flow-diagram"]}>
        {FLOW_NODES.map((node, i) => (
          <div key={node.label} className={styles["flow-node-wrap"]}>
            <div className={styles["flow-node"]}>
              <div className={styles["flow-node-circle"]}>
                <span className={styles["flow-node-index"]}>{String(i+1).padStart(2,"0")}</span>
              </div>
              <div className={styles["flow-node-text"]}>
                <span className={styles["flow-node-label"]}>{node.label}</span>
                <span className={styles["flow-node-sub"]}>{node.sub}</span>
              </div>
            </div>
            {i < FLOW_NODES.length - 1 && (
              <div className={styles["flow-connector"]}>
                <svg width="20" height="28" viewBox="0 0 20 28" style={{display:"block",margin:"0 auto"}}>
                  <line x1="10" y1="0" x2="10" y2="20" stroke="#4A7AAA" strokeWidth="1" strokeOpacity="0.5"/>
                  <path d="M6 16 L10 22 L14 16" fill="none" stroke="#4A7AAA" strokeWidth="1" strokeOpacity="0.5"/>
                  <circle r="3" fill="#7BAAD4" opacity="0.9">
                    <animateMotion dur="1.8s" begin={`${i * 0.30}s`} repeatCount="indefinite"
                      path="M10,2 L10,20"/>
                  </circle>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// S02 — Evolution branch
const EVO_NODES = [
  { label:"Biology",     year:"~3.8B BCE",  desc:"Brains built by natural selection"    },
  { label:"Language",    year:"~70,000 BCE", desc:"Knowledge across generations"         },
  { label:"Civilization",year:"~5,000 BCE",  desc:"Written memory, shared institutions"  },
  { label:"Industry",    year:"1760 CE",     desc:"Machines extend physical capacity"    },
  { label:"Digital",     year:"1990 CE",     desc:"Global information access"            },
  { label:"AI",          year:"Present",     desc:"Intelligence outside biology"         },
];
const EVO_POS = [{x:16,y:10},{x:30,y:26},{x:46,y:42},{x:60,y:58},{x:74,y:74},{x:88,y:90}];
function EvoBranchDiagram() {
  const tx = (n:number) => (n/100)*360;
  const ty = (n:number) => (n/100)*360;
  return (
    <div className={styles["diagram-float"]}>
      <svg viewBox="0 0 360 360" width="100%" style={{maxWidth:320,display:"block",margin:"0 auto"}}>
        {EVO_POS.slice(0,-1).map((_,i)=>(
          <line key={i} x1={tx(EVO_POS[i].x)} y1={ty(EVO_POS[i].y)}
            x2={tx(EVO_POS[i+1].x)} y2={ty(EVO_POS[i+1].y)}
            stroke="#4B6A9A" strokeWidth="1.2" strokeOpacity="0.5"/>
        ))}
        {EVO_NODES.map((n,i)=>{
          const px=tx(EVO_POS[i].x), py=ty(EVO_POS[i].y);
          return (
            <g key={n.label}>
              <circle cx={px} cy={py} r={10} fill="none" stroke="#6A9ACA" strokeWidth="0.8" strokeOpacity="0.25"/>
              <circle cx={px} cy={py} r={5} fill="#1a2c4a" stroke="#7BAAD4" strokeWidth="1.2"/>
              <text x={px+14} y={py-2} fontSize="12" fill="#D0E4F7" fontFamily="Georgia,serif">{n.label}</text>
              <text x={px+14} y={py+12} fontSize="9" fill="#7BAAD4" fontFamily="sans-serif" letterSpacing="0.05em">{n.year}</text>
              <text x={px+14} y={py+24} fontSize="8" fill="#5a7898" fontFamily="sans-serif" fontStyle="italic">{n.desc}</text>
            </g>
          );
        })}
        {/* Traveling dot along the branch spine */}
        {(() => {
          const pathD = EVO_POS.map((p,i) => `${i===0?"M":"L"}${tx(p.x).toFixed(1)},${ty(p.y).toFixed(1)}`).join(" ");
          return (
            <>
              <path id="evo-spine" d={pathD} fill="none" stroke="none"/>
              <circle r="4" fill="#7BAAD4" opacity="0.85">
                <animateMotion dur="4.2s" repeatCount="indefinite">
                  <mpath href="#evo-spine"/>
                </animateMotion>
              </circle>
              <circle r="2.5" fill="#A8D4F0" opacity="0.6">
                <animateMotion dur="4.2s" begin="0.6s" repeatCount="indefinite">
                  <mpath href="#evo-spine"/>
                </animateMotion>
              </circle>
            </>
          );
        })()}
      </svg>
    </div>
  );
}

// S03 — Predictive stack
const PRED_LAYERS = [
  { label:"Sensory Input",       note:"~11M bits/sec received"      },
  { label:"Neural Filtering",    note:"~40 bits/sec reach awareness" },
  { label:"Predictive Modeling", note:"Priors override raw data"    },
  { label:"Contextual Framing",  note:"Memory + emotion applied"    },
  { label:"Perceived World",     note:"A construction, not a copy"  },
];
function PredictiveStack() {
  return (
    <div className={styles["diagram-float"]}>
      <div className={styles["pred-stack"]}>
        <span className={styles["pred-stack-label"]}>How the brain builds reality</span>
        {PRED_LAYERS.map((layer, i) => (
          <div key={layer.label} className={styles["pred-layer-wrap"]}>
            <div className={styles["pred-layer"]}>
              <span className={styles["pred-layer-name"]}>{layer.label}</span>
              <span className={styles["pred-layer-note"]}>{layer.note}</span>
            </div>
            {i < PRED_LAYERS.length - 1 && (
              <div className={styles["pred-arrow"]}>
                <svg width="20" height="24" viewBox="0 0 20 24" style={{display:"block",margin:"0 auto"}}>
                  <line x1="10" y1="0" x2="10" y2="16" stroke="#4A7AAA" strokeWidth="1" strokeOpacity="0.5"/>
                  <path d="M6 12 L10 18 L14 12" fill="none" stroke="#4A7AAA" strokeWidth="1" strokeOpacity="0.5"/>
                  <circle r="2.8" fill="#b08ee0" opacity="0.85">
                    <animateMotion dur="2.2s" begin={`${i * 0.44}s`} repeatCount="indefinite"
                      path="M10,1 L10,15"/>
                  </circle>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// S04 — Belief map
const BELIEF_ROWS = [
  { q:"Why does anything exist?",  answers:["Divine creation","Eternal cycle","Brute fact","Unknown"]       },
  { q:"What happens when we die?", answers:["Soul persists","Rebirth","Return to matter","Uncertain"]       },
  { q:"How should we live?",       answers:["Divine law","Dharma / duty","Reason & virtue","Self-chosen"]   },
  { q:"What is the self?",         answers:["Unique soul","Illusion","Social construct","Open question"]    },
];
const TRADITION_LABELS = ["Abrahamic","Dharmic","Secular","Philosophy"];
function BeliefMap() {
  return (
    <div className={styles["diagram-float"]}>
      <p className={styles["belief-map-title"]}>Same questions. Different answers.</p>
      <div className={styles["belief-table"]}>
        <div className={styles["belief-table-head"]}>
          <div className={styles["belief-q-cell"]} />
          {TRADITION_LABELS.map(t=><div key={t} className={styles["belief-t-cell"]}>{t}</div>)}
        </div>
        {BELIEF_ROWS.map((row,i)=>(
          <div key={i} className={styles["belief-table-row"]}>
            <div className={styles["belief-q-cell"]}>{row.q}</div>
            {row.answers.map((a,j)=><div key={j} className={styles["belief-a-cell"]}>{a}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

// S05 — Consciousness loop
const LOOP_NODES = [
  { label:"Environment", angle:-90 },
  { label:"Brain",       angle:  0 },
  { label:"Model",       angle: 90 },
  { label:"Self",        angle:180 },
];
const LR=100, LCX=160, LCY=160, LNR=9;
function lnPos(deg:number){const r=(deg*Math.PI)/180;return{x:LCX+LR*Math.cos(r),y:LCY+LR*Math.sin(r)};}
function lnArc(f:number,t:number){
  const sr=(f*Math.PI)/180, er=(t*Math.PI)/180, off=(LNR+5)/LR;
  const sx=LCX+LR*Math.cos(sr+off), sy=LCY+LR*Math.sin(sr+off);
  const ex=LCX+LR*Math.cos(er-off), ey=LCY+LR*Math.sin(er-off);
  return `M${sx.toFixed(1)} ${sy.toFixed(1)} A${LR} ${LR} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
}
function ConsciousnessLoop() {
  const angles = LOOP_NODES.map(n=>n.angle);
  return (
    <div className={styles["diagram-float"]}>
      <svg viewBox="0 0 320 320" width="100%" style={{maxWidth:300,display:"block",margin:"0 auto"}}>
        <defs>
          <marker id="loop-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0.5 L5,3 L0,5.5" fill="none" stroke="#7BAAD4" strokeWidth="1.2"/>
          </marker>
        </defs>
        <circle cx={LCX} cy={LCY} r={LR} fill="none" stroke="#1a3050" strokeWidth="1" strokeDasharray="4 6"/>
        {angles.map((fromA,i)=>{
          const toA=angles[(i+1)%angles.length]+(i===angles.length-1?360:0);
          return <path key={i} d={lnArc(fromA,toA)} fill="none" stroke="#4A7AAA" strokeWidth="1.5" markerEnd="url(#loop-arrow)"/>;
        })}
        {angles.map((fromA,i)=>{
          const toA=angles[(i+1)%angles.length]+(i===angles.length-1?360:0);
          return (
            <g key={`d${i}`}>
              <path id={`la${i}`} d={lnArc(fromA,toA)} fill="none" stroke="none"/>
              <circle r="3.5" fill="#7BAAD4" opacity="0.9">
                <animateMotion dur="2.8s" begin={`${i*0.7}s`} repeatCount="indefinite">
                  <mpath href={`#la${i}`}/>
                </animateMotion>
              </circle>
            </g>
          );
        })}
        {LOOP_NODES.map(node=>{
          const{x,y}=lnPos(node.angle);
          const lx=LCX+(LR+32)*Math.cos((node.angle*Math.PI)/180);
          const ly=LCY+(LR+32)*Math.sin((node.angle*Math.PI)/180);
          const anchor=node.angle===0?"start":node.angle===180?"end":"middle";
          return (
            <g key={node.label}>
              <circle cx={x} cy={y} r={LNR+5} fill="none" stroke="#4A7AAA" strokeWidth="0.8" opacity="0.3"/>
              <circle cx={x} cy={y} r={LNR} fill="#0e2040" stroke="#7BAAD4" strokeWidth="1.5"/>
              <text x={lx} y={ly} fontSize="11" fontFamily="sans-serif" fill="#A0C4E8"
                textAnchor={anchor} dominantBaseline="middle" letterSpacing="0.04em">{node.label}</text>
            </g>
          );
        })}
        <text x={LCX} y={LCY-5} fontSize="8" fill="#3A6080" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.1em">PERCEPTION</text>
        <text x={LCX} y={LCY+7} fontSize="8" fill="#3A6080" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.1em">LOOP</text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ReflectionsPage() {
  const containerRef = useRef<HTMLDivElement|null>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const obs = NAV_SECTIONS.map((s,i) => {
      const el = document.getElementById(s.id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(i); },
        { threshold: 0.3 }
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach(o=>o?.disconnect());
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(`.${styles["expand-card"]}`);
    const onClick = (e:Event) => {
      const card = e.currentTarget as HTMLElement;
      const wasOpen = card.classList.contains(styles.open);
      cards.forEach(c=>c.classList.remove(styles.open));
      if (!wasOpen) card.classList.add(styles.open);
    };
    cards.forEach(c=>c.addEventListener("click",onClick));
    return () => cards.forEach(c=>c.removeEventListener("click",onClick));
  }, []);

  return (
    <div className={styles.root} ref={containerRef}>
      <GlobalBackground />
      <NavDots active={activeSection} />

      {/* ══════════════════════════════════════════════
          HERO — The Observer
      ══════════════════════════════════════════════ */}
      <section id="hero" className={`${styles["cin-section"]} ${styles.hero}`}>
        <div className={styles["cin-hero-inner"]}>

          <div className={styles["hero-portrait-wrap"]} data-hero-portrait>
            <div className={styles["hero-portrait-frame"]}>
              <Image src="/images/naveen-portrait.png" alt="Naveen" fill priority
                sizes="(max-width:900px) 40vw, 200px"
                style={{ objectFit:"cover", filter:"grayscale(100%) brightness(0.72)" }}/>
              <div className={styles["hero-portrait-vignette"]} />
            </div>
          </div>

          <div className={styles["cin-hero-text"]}>
            <span className={styles["section-label"]}>A Personal Reflection</span>
            <h1 className={styles["hero-title"]}>Human<br />Reflections</h1>
            <div className={styles["gold-line"]} style={{marginBottom:"22px"}} />

            <div className={`${styles["word-block"]} ${styles["hero-body"]}`}>
              <p>
                <WordSplit text="hi this is naveen, I often find myself thinking about questions that don't have simple answers.Questions about life, consciousness, evolution, and the universe we exist in.This page is simply a place to explore those reflections.This page exists because some questions don't fit neatly into work or daily life — but they don't go away either. Questions about where life comes from, what the brain is actually doing, why we build meaning, and what we are inside all of it." />
              </p>
              <p>
                <WordSplit text="I'm not offering final answers. I'm simply exploring what it means to observe and think — to sit with questions that remain open and find that worthwhile in itself." />
              </p>
              <p>
                <WordSplit text="My work is in engineered systems, where precision and structure matter. I find myself applying that same approach to much larger questions — not to solve them, but to see them more clearly." className={styles.highlight} />
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
        </div>

        <div className={styles["scroll-indicator"]}>
          <div className={styles["scroll-line"]} />
          <span className={styles["scroll-text"]}>Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 01 — What Is Life?
      ══════════════════════════════════════════════ */}
      <section id="life" className={styles["cin-section"]}>
        <span className={styles["section-index"]}>01</span>
        <div className={styles["cin-layout"]}>
          <div className={styles["cin-text-col"]}>
            <CuriosityLine text="Why does life appear from matter?" />
            <div className={styles["cin-header"]}>
              <span className={styles["section-label"]}>Section 01</span>
              <h2 className={styles["section-title"]}>What Is Life?</h2>
              <p className={styles["section-subtitle"]}>From physics to biology</p>
              <span className={styles["gold-line"]} />
            </div>
            <div className={`${styles["word-block"]} ${styles["cin-body"]}`}>
              <p><WordSplit text="Life is matter that refuses to decay — not by magic, but by constantly consuming energy to hold itself together. " /><Phrase text="Erwin Schrödinger called it negative entropy." section="life" /><WordSplit text=" The atoms in every living thing were forged inside stars. When I think about that, life stops feeling like a separate category. It is physics, just further along." /></p>
              <p><WordSplit text="At some point, molecules started copying themselves. " /><Phrase text="That was the crossing point — from chemistry to biology." section="life" /><WordSplit text=" No new laws were needed. Only the right conditions and enough time." /></p>
              <p><WordSplit text="Natural selection has no goal. It keeps what works and discards what doesn't — generation after generation. Over billions of years, this produced immune systems, eyes, and eventually brains complex enough to ask what they are." /></p>
            </div>
            <div className={styles["cin-stats"]}>
              <div className={styles["cin-stat"]}>
                <span className={styles["stat-number"]} data-value="3800">3.8B</span>
                <span className={styles["stat-label"]}>years of evolution</span>
              </div>
              <div className={styles["cin-stat"]}>
                <span className={styles["stat-number"]} data-value="8700000">~8.7M</span>
                <span className={styles["stat-label"]}>estimated species</span>
              </div>
              <div className={styles["cin-stat"]}>
                <span className={styles["stat-number"]} data-value="37">37T</span>
                <span className={styles["stat-label"]}>cells in your body</span>
              </div>
            </div>
          </div>
          <LifeFlowDiagram />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 02 — Evolution of Intelligence
      ══════════════════════════════════════════════ */}
      <section id="evolution" className={styles["cin-section"]}>
        <span className={styles["section-index"]}>02</span>
        <div className={styles["cin-layout"]}>
          <div className={styles["cin-text-col"]}>
            <CuriosityLine text="How did instinct become intelligence — and what comes next?" />
            <div className={styles["cin-header"]}>
              <span className={styles["section-label"]}>Section 02</span>
              <h2 className={styles["section-title"]}>Evolution of Intelligence</h2>
              <p className={styles["section-subtitle"]}>From instinct to artificial cognition</p>
              <span className={styles["gold-line"]} />
            </div>
            <div className={`${styles["word-block"]} ${styles["cin-body"]}`}>
              <p><WordSplit text="Intelligence has never been fixed. Each step extends the previous one — it doesn't replace it. The brain didn't stop mattering when writing appeared. Language didn't become irrelevant when machines arrived. What I find striking is the acceleration: biology took billions of years, language spread over tens of thousands, digital networks reshaped everything in decades." /></p>
              <p><WordSplit text="Humans built complex civilizations, systems of knowledge, and global networks. Yet at the same time, " /><Phrase text="access to information has not automatically created understanding." section="evolution" /><WordSplit text=" The internet made most of recorded human knowledge available to nearly everyone. Confusion and disagreement still exist — because knowing and understanding are not the same thing." /></p>
              <p><WordSplit text="AI fits the same pattern — one more layer built on top of everything before it. But it is the first layer not produced by evolution. It is designed. That distinction may turn out to matter enormously, or not at all. We don't yet know." /></p>
              <p><WordSplit text="If there is a layer 7, I suspect it won't be a new technology. " /><Phrase text="It will be a new relationship between the system and its own models —" section="evolution" /><WordSplit text=" a kind of collective metacognition we don't have a name for yet." /></p>
            </div>
          </div>
          <EvoBranchDiagram />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 03 — Reality & Perception
      ══════════════════════════════════════════════ */}
      <section id="reality" className={styles["cin-section"]}>
        <span className={styles["section-index"]}>03</span>
        <div className={styles["cin-layout"]}>
          <div className={styles["cin-text-col"]}>
            <CuriosityLine text="Are we seeing the world, or a model of it?" />
            <div className={styles["cin-header"]}>
              <span className={styles["section-label"]}>Section 03</span>
              <h2 className={styles["section-title"]}>Reality &amp; Perception</h2>
              <p className={styles["section-subtitle"]}>The brain predicts the world — it doesn't record it</p>
              <span className={styles["gold-line"]} />
            </div>
            <div className={`${styles["word-block"]} ${styles["cin-body"]}`}>
              <p><Phrase text="The brain receives around eleven million bits of sensory data every second. It consciously processes about forty." section="reality" /><WordSplit text=" It does not record reality — it generates a prediction and updates only when something breaks the expectation." /></p>
              <p><WordSplit text="Consider the hollow mask illusion: a concave face painted on the back of a mask appears to bulge outward. The brain has seen millions of faces — it knows they are convex — and overrides the actual geometry of the light reaching your eyes. Your prior is stronger than the data." /></p>
              <p><WordSplit text="No two brains carry the same prior experience. That means no two people are ever looking at exactly the same thing — even in the same room, facing the same scene. " /><Phrase text="Memory, emotion, and culture are not separate from perception. They are part of how it works." section="reality" /></p>
            </div>
            <blockquote className={styles["cin-quote"]}>
              <WordSplit text="Perception is not a window. It is a model." />
            </blockquote>
          </div>
          <PredictiveStack />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 04 — Religion & Meaning
      ══════════════════════════════════════════════ */}
      <section id="religion" className={styles["cin-section"]}>
        <span className={styles["section-index"]}>04</span>
        <div className={styles["cin-layout"]}>
          <div className={styles["cin-text-col"]}>
            <CuriosityLine text="Why does every culture ask the same questions?" />
            <div className={styles["cin-header"]}>
              <span className={styles["section-label"]}>Section 04</span>
              <h2 className={styles["section-title"]}>Religion &amp; Meaning</h2>
              <p className={styles["section-subtitle"]}>How humans make sense of things</p>
              <span className={styles["gold-line"]} />
            </div>
            <div className={`${styles["word-block"]} ${styles["cin-body"]}`}>
              <p><WordSplit text="Every documented culture has had religion. Traditions with no historical contact often arrived at the same shape: a story of creation, rules for living, markers of belonging, and a way to face death. That convergence is better explained by shared human psychology than by shared history." /></p>
              <p><WordSplit text="My own view is that the explanations religion offers are mostly wrong, but " /><Phrase text="the needs it addresses are real and permanent." section="religion" /><WordSplit text=" The need for meaning doesn't disappear when you stop believing in a particular story. It just goes looking for another container." /></p>
              <p><WordSplit text="Secular ideologies use the same cognitive architecture — in-group identity, moral codes, sacred texts, origin stories. " /><Phrase text="The content changes. The structure underneath does not." section="religion" /></p>
            </div>

            {/* Questions About God — calm, philosophical */}
            <div className={styles["religion-god-block"]}>
              <span className={styles["god-block-label"]}>A calm question</span>
              <div className={`${styles["word-block"]}`}>
                <p><WordSplit text="If a creator exists, certain things seem worth asking. Should it treat all humans equally — or favor specific groups, languages, and centuries? Would it need attention, worship, or validation from the things it created? Would it remain neutral, or intervene selectively?" /></p>
                <p><WordSplit text="These are not attacks on the idea of a creator. They are honest questions. If the answer is that we cannot know, that itself is a meaningful position — and one I have more respect for than certainty in either direction." /></p>
              </div>
            </div>
          </div>
          <BeliefMap />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 05 — Consciousness
      ══════════════════════════════════════════════ */}
      <section id="consciousness" className={styles["cin-section"]}>
        <span className={styles["section-index"]}>05</span>
        <div className={styles["cin-layout-top"]}>
          <div className={styles["cin-text-col"]}>
            <CuriosityLine text="Why does thinking feel like something?" />
            <div className={styles["cin-header"]}>
              <span className={styles["section-label"]}>Section 05</span>
              <h2 className={styles["section-title"]}>Consciousness</h2>
              <p className={styles["section-subtitle"]}>The hardest problem in science</p>
              <span className={styles["gold-line"]} />
            </div>

            <div className={styles["c-lines-compact"]}>
              {[
                <>Matter <span className={styles["c-line-em"]}>self-organized.</span></>,
                <>Systems began to <span className={styles["c-line-em"]}>model their environment.</span></>,
                <>Models became <span className={styles["c-line-em"]}>self-referential.</span></>,
                <>The system <span className={styles["c-line-em"]}>became aware of itself.</span></>,
              ].map((line, i) => (
                <div key={i} className={styles["c-line"]}>{line}</div>
              ))}
              <p className={styles["consciousness-footnote"]}>
                Why any of this produces inner experience — nobody knows.
              </p>
            </div>

            <div className={`${styles["word-block"]} ${styles["cin-body"]}`}>
              <p><WordSplit text="We can describe consciousness from the outside — measure brain activity, map neural correlates, identify which regions activate during experience. " /><Phrase text="What we cannot explain is why any of this produces something that feels like anything at all." section="consciousness" /></p>
              <p><WordSplit text="Consider Mary — a scientist who knows every physical fact about colour, every wavelength, every neural firing pattern — but has lived her entire life in a black-and-white room. When she steps outside and sees red for the first time, does she learn something new?" /></p>
              <p><WordSplit text="If yes — if there is something it is like to see red that no amount of physical description captures — then consciousness is not fully explained by the brain's mechanics. That gap is the hard problem. It is not small." /></p>
              <p><WordSplit text="There are three positions worth taking seriously. The first: consciousness is an illusion — the feeling of experience is itself a kind of model the brain builds. The second: it is a feature of sufficiently complex information processing — present wherever computation reaches a threshold. The third: it is fundamental to reality, as basic as mass or charge, not produced by matter but woven into it." /></p>
              <p><Phrase text="The mind trying to understand consciousness is the same system it is trying to understand." section="consciousness" /><WordSplit text=" That recursion may be the deepest obstacle — or the most important clue." /></p>
            </div>
          </div>
          <ConsciousnessLoop />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 06 — System View
      ══════════════════════════════════════════════ */}
      <section id="sysview" className={styles["cin-section"]}>
        <span className={styles["section-index"]}>06</span>
        <div className={styles["cin-layout"]}>
          <div className={styles["cin-text-col"]}>
            <CuriosityLine text="What does it look like when you zoom all the way out?" />
            <div className={styles["cin-header"]}>
              <span className={styles["section-label"]}>Section 06</span>
              <h2 className={styles["section-title"]}>System View</h2>
              <p className={styles["section-subtitle"]}>How each layer builds on the last</p>
              <span className={styles["gold-line"]} />
            </div>
            <div className={`${styles["word-block"]} ${styles["cin-body"]}`}>
              <p><WordSplit text="Each layer is built on the one before — not a replacement, but an extension. " /><Phrase text="Biology runs on chemistry. Thought runs on biology." section="sysview" /><WordSplit text=" Every level operates within the limits set by the level beneath it." /></p>
              <p><WordSplit text="What is striking is that the system has started building external versions of itself — tools that model, reason, and extend what the mind can do. The observer and the thing being observed are part of the same process." /></p>
              <p><WordSplit text="If layer 7 exists, it may be the moment the system becomes coherent enough to steer itself — not blindly, as evolution does, but " /><Phrase text="with something closer to intention." section="sysview" /><WordSplit text=" Whether that is possible, and who does the steering, are the most consequential open questions of this century." /></p>
            </div>
          </div>

          <div className={styles["diagram-float"]}>
            <div className={styles["sysview-chain"]}>
              {[
                { term:"Matter",                  sub:"Particles · Forces · Energy",         indent:false },
                { term:"Self-Organizing Systems", sub:"Chemistry · Replication",             indent:true  },
                { term:"Biological Complexity",   sub:"Cells · Evolution · Brains",          indent:true  },
                { term:"Neural Modeling",         sub:"Prediction · Memory · Language",      indent:true  },
                { term:"Reflective Awareness",    sub:"Consciousness · Reason · Culture",    indent:true  },
                { term:"Externalized Cognition",  sub:"Writing · Networks · AI",             indent:true  },
                { term:"Layer 7 — ?",             sub:"Unknown. In progress.",               indent:true, dim:true },
              ].map((row,i)=>(
                <div key={i} className={`${styles["sysview-row"]}${row.indent?` ${styles["sysview-row-indent"]}`:""}`}
                  style={row.dim?{opacity:0.38}:{}}>
                  {row.indent && <span className={styles["sysview-arrow"]}>→</span>}
                  <div>
                    <div className={styles["sysview-term"]}>{row.term}</div>
                    <div className={styles["sysview-sub"]}>{row.sub}</div>
                  </div>
                  {i < 6 && (
                    <svg className={styles["sysview-pulse"]} width="16" height="16" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="2.5" fill="#45d291" opacity="0">
                        <animate attributeName="opacity" values="0;0.8;0" dur="2.4s"
                          begin={`${i * 0.34}s`} repeatCount="indefinite"/>
                        <animate attributeName="r" values="2.5;4;2.5" dur="2.4s"
                          begin={`${i * 0.34}s`} repeatCount="indefinite"/>
                      </circle>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 07 — Open Questions
      ══════════════════════════════════════════════ */}
      <section id="questions" className={styles["cin-section"]}>
        <span className={styles["section-index"]}>07</span>
        <div className={styles["cin-questions-inner"]}>
          <CuriosityLine text="What stays open no matter how long you look?" />
          <div className={styles["cin-header"]} style={{textAlign:"center",alignItems:"center"}}>
            <span className={styles["section-label"]}>Section 07</span>
            <h2 className={styles["section-title"]}>Open Questions</h2>
            <p className={styles["section-subtitle"]}>Things I keep coming back to</p>
            <span className={styles["gold-line"]} style={{margin:"0 auto 32px"}} />
          </div>

          {/* Universe questions */}
          <p className={styles["q-group-label"]}>Questions about the universe</p>
          <ul className={styles["questions-list"]}>
            {[
              "Why is there something rather than nothing?",
              "What existed before the Big Bang — or is 'before' the wrong word?",
              "How did matter first appear in space?",
              "Is the universe random, or does it follow a deeper structure we haven't found?",
              "Why does the universe follow mathematical laws at all?",
              "Are we alone?",
            ].map((q,i) => (
              <li key={i} className={styles["q-item"]}>
                <span className={styles["q-number"]}>{String(i+1).padStart(2,"0")}</span>
                <span className={styles["q-text"]}>{q}</span>
              </li>
            ))}
          </ul>

          {/* God questions */}
          <p className={styles["q-group-label"]} style={{marginTop:"36px"}}>Questions about a creator</p>
          <ul className={styles["questions-list"]}>
            {[
              "If a creator exists, why would it remain hidden?",
              "Would a true creator favor specific groups, languages, or centuries?",
              "Would it require worship, attention, or validation from what it made?",
              "Is the universe self-contained — or does something outside it exist?",
            ].map((q,i) => (
              <li key={i} className={styles["q-item"]}>
                <span className={styles["q-number"]}>{String(i+1).padStart(2,"0")}</span>
                <span className={styles["q-text"]}>{q}</span>
              </li>
            ))}
          </ul>

          {/* Consciousness questions */}
          <p className={styles["q-group-label"]} style={{marginTop:"36px"}}>Questions about mind</p>
          <ul className={styles["questions-list"]}>
            {[
              "Is consciousness a basic feature of matter — present wherever information is processed?",
              "Is physical reality a kind of computation?",
              "Does experience end when the brain stops?",
            ].map((q,i) => (
              <li key={i} className={styles["q-item"]}>
                <span className={styles["q-number"]}>{String(i+1).padStart(2,"0")}</span>
                <span className={styles["q-text"]}>{q}</span>
              </li>
            ))}
          </ul>

          <div className={`${styles["word-block"]} ${styles["cin-closing"]}`}>
            <p><WordSplit text="The one that haunts me most is the last one. Everything else is a question about the universe outside — structure, origin, scale. But " /><Phrase text="whether experience ends is a question about what I am." section="questions" /><WordSplit text=" It is the most personal and the most unanswerable. Every tradition has tried to resolve it. None have." /></p>
            <p className={styles["closing-line"]}><WordSplit text="Still observing." /></p>
          </div>
        </div>
      </section>

      {/* EPIGRAM + SIGNATURE */}
      <div className={styles["page-epigram"]}>
        <div className={styles["page-epigram-rule"]} />
        <p className={styles["page-epigram-text"]}>
          All models are incomplete. The questions stay open.
        </p>
        <div className={styles["page-epigram-rule"]} />
        <p className={styles["page-signature"]}>— Naveen</p>
        <p className={styles["page-signature-sub"]}>Observing life, systems, and the universe.</p>
      </div>

    </div>
  );
}