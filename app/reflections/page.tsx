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

      {/* content-wrap: mask fades text at top/bottom. Canvas at z:0 sits outside, always clear. */}
      <div className={styles["content-wrap"]}>
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
            <span className={styles["section-label"]}>Thinking out loud</span>
            <h1 className={styles["hero-title"]}>Human<br />Reflections</h1>
            <div className={styles["gold-line"]} style={{marginBottom:"22px"}} />

            <div className={`${styles["word-block"]} ${styles["hero-body"]}`}>
              <p>
                <WordSplit text="Hey, I'm Naveen. Some questions just won't leave me alone. Where does life actually come from? What is my brain doing right now? Why do all of us — across every culture — keep reaching for the same big answers? I don't have the answers. But I can't stop thinking about them either." />
              </p>
              <p>
                <WordSplit text="This isn't a textbook. It's more like — what if we just sat with the hard questions for a while? What if not knowing was okay, and the asking was the point?" />
              </p>
              <p>
                <WordSplit text="I work in engineering, so I like thinking in systems. But some systems are so big and strange that you can't really solve them — you can only try to see them a little more clearly." className={styles.highlight} />
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
            <CuriosityLine text="How does something dead become something alive?" />
            <div className={styles["cin-header"]}>
              <span className={styles["section-label"]}>Section 01</span>
              <h2 className={styles["section-title"]}>What Even Is Life?</h2>
              <p className={styles["section-subtitle"]}>When did chemistry turn into something alive?</p>
              <span className={styles["gold-line"]} />
            </div>
            <div className={`${styles["word-block"]} ${styles["cin-body"]}`}>
              <p><WordSplit text="Think about this — the atoms in your hand were made inside a star that exploded billions of years ago. Those same atoms are now reading this sentence. At some point, they became 'alive.' What actually changed?" /></p>
              <p><WordSplit text="Life is basically matter that keeps itself together by constantly burning through energy. Not magic. Just chemistry that got very, very good at not falling apart. " /><Phrase text="At some point, molecules started copying themselves." section="life" /><WordSplit text=" That's the moment — that tiny crossing point from chemistry to biology. No special laws. Just the right conditions and enough time." /></p>
              <p><WordSplit text="And then selection takes over. No plan, no goal. Just — what works gets to stick around. What doesn't, disappears. Do that for 3.8 billion years and you get eyes, immune systems, and a brain strange enough to wonder about all of this." /></p>
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
            <CuriosityLine text="Why does each generation seem to know more than the last?" />
            <div className={styles["cin-header"]}>
              <span className={styles["section-label"]}>Section 02</span>
              <h2 className={styles["section-title"]}>Getting Smarter, Together</h2>
              <p className={styles["section-subtitle"]}>How we've been building on each other for thousands of years</p>
              <span className={styles["gold-line"]} />
            </div>
            <div className={`${styles["word-block"]} ${styles["cin-body"]}`}>
              <p><WordSplit text="Here's something that fascinates me. Every new thing we invent builds on the last one. Writing didn't replace memory — it extended it. Machines didn't replace muscle — they multiplied it. And notice the speed — biology took billions of years, language took thousands, the internet reshaped everything in a couple of decades." /></p>
              <p><WordSplit text="But here's the thing that keeps me up at night: " /><Phrase text="more information hasn't automatically made us wiser." section="evolution" /><WordSplit text=" We have access to nearly all of human knowledge on a device in our pocket. And yet — we're still confused. Still arguing. Knowing and understanding are not the same thing." /></p>
              <p><WordSplit text="AI is just the newest layer. But it's the first one we actually designed — it didn't grow out of evolution. Whether that makes it fundamentally different, or just another step, I honestly don't know yet." /></p>
              <p><Phrase text="Maybe what comes next isn't a new tool at all." section="evolution" /><WordSplit text=" Maybe it's a new way of thinking together — something we don't even have a word for yet." /></p>
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
            <CuriosityLine text="What if everything you see is just your brain's best guess?" />
            <div className={styles["cin-header"]}>
              <span className={styles["section-label"]}>Section 03</span>
              <h2 className={styles["section-title"]}>You're Not Seeing Reality</h2>
              <p className={styles["section-subtitle"]}>Your brain is making most of it up — and doing a great job</p>
              <span className={styles["gold-line"]} />
            </div>
            <div className={`${styles["word-block"]} ${styles["cin-body"]}`}>
              <p><Phrase text="Every second, your eyes, ears, and skin send about 11 million bits of information to your brain. Your brain consciously uses about 40 of them." section="reality" /><WordSplit text=" The rest gets filtered, predicted, filled in. You're not watching the world — you're watching your brain's best guess at it." /></p>
              <p><WordSplit text="There's this thing called the hollow mask illusion. If you paint a face on the inside of a mask — the concave side — and spin it, the face still looks like it's bulging outward. Your brain has seen so many real faces that it just overrides what your eyes are actually seeing. Your assumption wins over reality." /></p>
              <p><WordSplit text="So here's what gets me — no two people have ever had the exact same experiences. Which means no two people are ever really seeing the same thing, even when they're standing in the same room. " /><Phrase text="Your history, your feelings, your culture — they're not separate from how you see. They're built into it." section="reality" /></p>
            </div>
            <blockquote className={styles["cin-quote"]}>
              <WordSplit text="You don't see the world. You see your version of it." />
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
            <CuriosityLine text="Why do humans everywhere keep reaching for the same answers?" />
            <div className={styles["cin-header"]}>
              <span className={styles["section-label"]}>Section 04</span>
              <h2 className={styles["section-title"]}>The Search for Meaning</h2>
              <p className={styles["section-subtitle"]}>Why we can't stop asking 'why'</p>
              <span className={styles["gold-line"]} />
            </div>
            <div className={`${styles["word-block"]} ${styles["cin-body"]}`}>
              <p><WordSplit text="Every culture — and I mean every single one we've ever found — had some form of religion. Cultures that never met each other built the same basic shape: how we got here, how to live, what happens when we die, who belongs. That's not a coincidence. That's something about us." /></p>
              <p><WordSplit text="I'll be honest — I'm skeptical of the literal explanations. But " /><Phrase text="the needs underneath them? Those are real." section="religion" /><WordSplit text=" The need to belong. To feel like your life matters. To have something to say when someone you love dies. Those don't go away when you stop believing a specific story. They just go looking for a different container." /></p>
              <p><WordSplit text="Even people who reject religion end up building the same structure around something else — a political movement, a philosophy, a team. " /><Phrase text="The content changes. What's underneath stays the same." section="religion" /></p>
            </div>

            {/* Questions About God — calm, philosophical */}
            <div className={styles["religion-god-block"]}>
              <span className={styles["god-block-label"]}>Something I keep wondering about</span>
              <div className={`${styles["word-block"]}`}>
                <p><WordSplit text="If something created all of this — would it really favor one group of people over another? Would it need us to praise it? Would it care which language we used to pray, or which century we were born in?" /></p>
                <p><WordSplit text="I ask those not to be provocative. I ask because they feel genuinely important. And honestly — 'I don't know' is the answer I have the most respect for. More than confident yes, more than confident no." /></p>
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
            <CuriosityLine text="Why does it feel like something to be you?" />
            <div className={styles["cin-header"]}>
              <span className={styles["section-label"]}>Section 05</span>
              <h2 className={styles["section-title"]}>Consciousness</h2>
              <p className={styles["section-subtitle"]}>The one question science keeps running into a wall on</p>
              <span className={styles["gold-line"]} />
            </div>

            <div className={styles["c-lines-compact"]}>
              {[
                <>Matter <span className={styles["c-line-em"]}>organized itself.</span></>,
                <>Systems started <span className={styles["c-line-em"]}>building models of the world.</span></>,
                <>Those models became <span className={styles["c-line-em"]}>aware of themselves.</span></>,
                <>Now the model <span className={styles["c-line-em"]}>is asking what it is.</span></>,
              ].map((line, i) => (
                <div key={i} className={styles["c-line"]}>{line}</div>
              ))}
              <p className={styles["consciousness-footnote"]}>
                Why any of it feels like something — nobody really knows.
              </p>
            </div>

            <div className={`${styles["word-block"]} ${styles["cin-body"]}`}>
              <p><WordSplit text="We're pretty good at tracking what the brain does. We can watch it light up, measure the signals, map which part fires when. " /><Phrase text="What we can't explain is why any of it feels like something." section="consciousness" /><WordSplit text=" Why isn't it all just happening in the dark?" /></p>
              <p><WordSplit text="Here's a thought experiment I love: imagine a scientist named Mary who knows everything about color — every wavelength, every neural response — but she's lived her whole life in a black-and-white room. The day she walks outside and sees red for the first time — does she learn something new?" /></p>
              <p><WordSplit text="If yes, then no amount of brain science fully captures the experience of being you. That gap — between the mechanics and the feeling — is what philosophers call the hard problem. And honestly, it's hard." /></p>
              <p><WordSplit text="Some people say consciousness is an illusion your brain constructs. Others say anything complex enough eventually becomes conscious. Others say it's as basic as gravity — built into the fabric of things. All three positions are serious. None of them are settled." /></p>
              <p><Phrase text="The weird part is: the thing trying to understand consciousness is consciousness itself." section="consciousness" /><WordSplit text=" I'm not sure if that makes it impossible — or if it's the most important clue we have." /></p>
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
            <CuriosityLine text="What if you could see the whole thing from above?" />
            <div className={styles["cin-header"]}>
              <span className={styles["section-label"]}>Section 06</span>
              <h2 className={styles["section-title"]}>System View</h2>
              <p className={styles["section-subtitle"]}>Zooming all the way out on what we are</p>
              <span className={styles["gold-line"]} />
            </div>
            <div className={`${styles["word-block"]} ${styles["cin-body"]}`}>
              <p><WordSplit text="Zoom way out — like, all the way out. What do you see? Matter first. Then chemistry organizing itself. Then biology. Then a brain that can model things. Then a mind that knows it's a mind. " /><Phrase text="Each layer runs on the one below it." section="sysview" /><WordSplit text=" Chemistry doesn't stop existing when biology shows up. Biology doesn't disappear when thought appears. It all stacks." /></p>
              <p><WordSplit text="And here's the part that kind of blows my mind — the system has started building tools that do what brains do. We're externalizing thinking. The thing observing the world is now building other things to help it observe." /></p>
              <p><WordSplit text="Is there a layer 7? Maybe. If there is, I think it's the moment the system gets deliberate about itself — not just adapting blindly, " /><Phrase text="but actually choosing where it's going." section="sysview" /><WordSplit text=" Who gets to make that choice is probably the most important question of our lifetime." /></p>
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
          <CuriosityLine text="What questions never actually go away?" />
          <div className={styles["cin-header"]} style={{textAlign:"center",alignItems:"center"}}>
            <span className={styles["section-label"]}>Section 07</span>
            <h2 className={styles["section-title"]}>Open Questions</h2>
            <p className={styles["section-subtitle"]}>The ones I can't stop thinking about</p>
            <span className={styles["gold-line"]} style={{margin:"0 auto 32px"}} />
          </div>

          {/* Universe questions */}
          <p className={styles["q-group-label"]}>About the universe</p>
          <ul className={styles["questions-list"]}>
            {[
              "Why is there anything at all? Why not just... nothing?",
              "What was happening before the Big Bang — or does 'before' even make sense here?",
              "Where did matter actually come from in the first place?",
              "Is the universe random, or is there a pattern underneath we just haven't found?",
              "Why does math work so perfectly to describe physical reality?",
              "Is anyone else out there?",
            ].map((q,i) => (
              <li key={i} className={styles["q-item"]}>
                <span className={styles["q-number"]}>{String(i+1).padStart(2,"0")}</span>
                <span className={styles["q-text"]}>{q}</span>
              </li>
            ))}
          </ul>

          {/* God questions */}
          <p className={styles["q-group-label"]} style={{marginTop:"36px"}}>About a creator</p>
          <ul className={styles["questions-list"]}>
            {[
              "If something created all of this, why would it stay hidden?",
              "Would it really care which religion you were born into, or which century?",
              "Would a creator need praise from the things it made?",
              "Is the universe everything — or is there something outside it?",
            ].map((q,i) => (
              <li key={i} className={styles["q-item"]}>
                <span className={styles["q-number"]}>{String(i+1).padStart(2,"0")}</span>
                <span className={styles["q-text"]}>{q}</span>
              </li>
            ))}
          </ul>

          {/* Consciousness questions */}
          <p className={styles["q-group-label"]} style={{marginTop:"36px"}}>About the mind</p>
          <ul className={styles["questions-list"]}>
            {[
              "Could a rock have some tiny, basic form of experience — or is that absurd?",
              "Is the universe itself a kind of computation running on something we can't see?",
              "When the brain stops — does the experience stop too?",
            ].map((q,i) => (
              <li key={i} className={styles["q-item"]}>
                <span className={styles["q-number"]}>{String(i+1).padStart(2,"0")}</span>
                <span className={styles["q-text"]}>{q}</span>
              </li>
            ))}
          </ul>

          <div className={`${styles["word-block"]} ${styles["cin-closing"]}`}>
            <p><WordSplit text="That last one is the one I come back to most. All the other questions are about things out there — structure, scale, origin. But " /><Phrase text="whether experience ends is a question about what I actually am." section="questions" /><WordSplit text=" Every tradition in human history has tried to answer it. None have. I find that both terrifying and oddly comforting." /></p>
            <p className={styles["closing-line"]}><WordSplit text="Still thinking." /></p>
          </div>
        </div>
      </section>

      {/* EPIGRAM + SIGNATURE */}
      <div className={styles["page-epigram"]}>
        <div className={styles["page-epigram-rule"]} />
        <p className={styles["page-epigram-text"]}>
          No final answers. Just honest questions, kept open.
        </p>
        <div className={styles["page-epigram-rule"]} />
        <p className={styles["page-signature"]}>— Naveen</p>
        <p className={styles["page-signature-sub"]}>Observing life, systems, and the universe.</p>
      </div>

      </div>{/* end content-wrap */}
    </div>
  );
}