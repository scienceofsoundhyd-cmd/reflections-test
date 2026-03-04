"use client";
import { useEffect, useRef } from "react";

const SHAPE_N = 1200;
const ORBIT_N = 150;
const TOTAL_N = SHAPE_N + ORBIT_N;
const BUCKETS  = 5;

interface V3  { x:number; y:number; z:number; }
interface Tri { a:number; b:number; c:number; }
interface Scene {
  pts:  V3[];
  tris: Tri[];
  segs: [number,number][];
  rgb:  [number,number,number];
  tilt: number;
}

// ── utils ────────────────────────────────────────────────────────────────────
const lerp  = (a:number,b:number,t:number) => a+(b-a)*t;
const clamp = (v:number,lo:number,hi:number) => Math.max(lo,Math.min(hi,v));
function lcg(s0:number){ let s=s0|0; return ()=>{ s=(Math.imul(s,1664525)+1013904223)|0; return (s>>>0)/4294967296; }; }
function rS(b:number,n:number):[number,number][]{ const s:[number,number][]=[];for(let i=0;i<n;i++)s.push([b+i,b+(i+1)%n]);return s; }
function cS(f:number,t:number):[number,number][]{ const s:[number,number][]=[];for(let i=f;i<t;i++)s.push([i,i+1]);return s; }
function triStrip(a:number,b:number,n:number):Tri[]{ const t:Tri[]=[];for(let i=0;i<n;i++){const j=(i+1)%n;t.push({a:a+i,b:b+i,c:a+j},{a:b+i,b:b+j,c:a+j});}return t; }
function pad(pts:V3[],seed:number):V3[]{
  const r=lcg(seed+9999); const out=[...pts];
  while(out.length<SHAPE_N) out.push({x:(r()-0.5)*1.8,y:(r()-0.5)*1.2,z:(r()-0.5)*0.8});
  return out.slice(0,SHAPE_N);
}
// Fibonacci sphere — evenly distributed points on sphere surface
function fibSphere(n:number,radius:number,rng:()=>number):V3[]{
  const pts:V3[]=[];
  const golden=Math.PI*(3-Math.sqrt(5));
  for(let i=0;i<n;i++){
    const y=1-(i/(n-1))*2;
    const r2=Math.sqrt(1-y*y);
    const th=golden*i;
    pts.push({x:radius*r2*Math.cos(th)+(rng()-0.5)*0.012,y:radius*y+(rng()-0.5)*0.012,z:radius*r2*Math.sin(th)+(rng()-0.5)*0.012});
  }
  return pts;
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 0 — GALAXY  (Hero) — 4 wide spiral arms + bulge + halo
// ════════════════════════════════════════════════════════════════════════════
function buildGalaxy():Scene{
  const r=lcg(7);
  const pts:V3[]=[],tris:Tri[]=[],segs:[number,number][]=[];

  // Dense central bulge: 180 pts ellipsoid
  for(let i=0;i<180;i++){
    const phi=Math.acos(1-2*r()),th=r()*Math.PI*2;
    const rr=Math.pow(r(),0.35)*0.30;
    pts.push({x:rr*Math.sin(phi)*Math.cos(th),y:rr*Math.sin(phi)*Math.sin(th)*0.42,z:rr*Math.cos(phi)});
  }
  for(let i=0;i<178;i++) tris.push({a:i,b:i+1,c:(i+13)%180});
  segs.push(...rS(0,32));

  // 4 spiral arms: 200 pts each, wide spread to r=1.75
  for(let arm=0;arm<4;arm++){
    const base=pts.length;
    const offset=(arm/4)*Math.PI*2;
    for(let i=0;i<200;i++){
      const t=(i/199)*Math.PI*2.7;
      const rr=0.30+t*0.280;
      const spread=0.015+t*0.024;
      pts.push({x:rr*Math.cos(t+offset)+(r()-0.5)*spread,y:(r()-0.5)*0.11,z:rr*Math.sin(t+offset)+(r()-0.5)*spread});
    }
    segs.push(...cS(base,base+199));
    for(let i=0;i<197;i++) tris.push({a:base+i,b:base+i+1,c:base+i+(i%5===0?3:1)});
    for(let k=0;k<7;k++) segs.push([base+k*28,k*25]);
  }
  // 180 + 4×200 = 980 pts

  // Halo field stars: scattered at large radii — 220 pts
  for(let i=0;i<220;i++){
    const ang=r()*Math.PI*2;
    const rr=0.90+r()*0.88;
    pts.push({x:rr*Math.cos(ang)+(r()-0.5)*0.09,y:(r()-0.5)*0.20,z:rr*Math.sin(ang)+(r()-0.5)*0.09});
  }
  // Total: 1200 pts exactly

  return{pts:pad(pts,7),tris,segs,rgb:[120,165,255],tilt:0.18};
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 1 — HEARTBEAT ECG  (Life)
// ════════════════════════════════════════════════════════════════════════════
function ecgY(phase:number):number{
  // phase: 0→1 per PQRST cycle
  if(phase<0.08) return 0;
  // P wave
  if(phase<0.10) return (phase-0.08)/0.02*0.09;
  if(phase<0.14) return 0.09;
  if(phase<0.20) return (0.20-phase)/0.06*0.09;
  if(phase<0.27) return 0;
  // Q dip
  if(phase<0.29) return -(phase-0.27)/0.02*0.11;
  // R spike
  if(phase<0.32) return -0.11+(phase-0.29)/0.03*1.06;
  // S dip
  if(phase<0.345) return 0.95-(phase-0.32)/0.025*1.14;
  if(phase<0.38) return -0.19+(phase-0.345)/0.035*0.22;
  // ST
  if(phase<0.46) return 0.03;
  // T wave
  if(phase<0.52) return 0.03+(phase-0.46)/0.06*0.19;
  if(phase<0.60) return 0.22;
  if(phase<0.70) return 0.22-(phase-0.60)/0.10*0.22;
  return 0;
}

function buildECG():Scene{
  const r=lcg(13);
  const pts:V3[]=[],tris:Tri[]=[],segs:[number,number][]=[];

  // 3 ECG cycles, strand A: 180 pts from x=-1.15 to x=1.15
  const SN=180, CYCLES=3;
  const aBase=0;
  for(let i=0;i<SN;i++){
    const xn=i/(SN-1); // 0→1 over all cycles
    const phase=(xn*CYCLES)%1.0;
    const x=-1.15+xn*2.30;
    const y=ecgY(phase)*0.78;
    pts.push({x,y,z:(r()-0.5)*0.018});
  }
  segs.push(...cS(aBase,aBase+SN-1));

  // Strand B: 180 pts offset in z for ribbon effect
  const bBase=pts.length;
  for(let i=0;i<SN;i++){
    const p=pts[i];
    pts.push({x:p.x+(r()-0.5)*0.008,y:p.y+(r()-0.5)*0.008,z:p.z+0.06});
  }
  segs.push(...cS(bBase,bBase+SN-1));
  for(let i=0;i<SN-1;i++){
    tris.push({a:aBase+i,b:bBase+i,c:aBase+i+1},{a:bBase+i,b:bBase+i+1,c:aBase+i+1});
    if(i%6===0) segs.push([aBase+i,bBase+i]);
  }
  // 360 pts so far

  // Cellular background: hex-ish scatter of 840 pts simulating biological cells
  const cellBase=pts.length;
  for(let i=0;i<840;i++){
    const cx=(r()-0.5)*2.2, cy=(r()-0.5)*1.3, cz=(r()-0.5)*0.55;
    pts.push({x:cx,y:cy,z:cz});
  }
  // Connect nearby cell pts to form membranes
  const cp=pts.slice(cellBase);
  for(let i=0;i<cp.length&&i<840;i++){
    for(let j=i+1;j<cp.length&&j<i+30;j++){
      const dx=cp[i].x-cp[j].x,dy=cp[i].y-cp[j].y;
      if(dx*dx+dy*dy<0.022){
        segs.push([cellBase+i,cellBase+j]);
        if(j+1<cp.length) tris.push({a:cellBase+i,b:cellBase+j,c:cellBase+j+1});
      }
    }
  }
  // Total: 1200 pts

  return{pts:pad(pts,13),tris,segs,rgb:[55,210,110],tilt:0.10};
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 2 — BRAIN (Evolution) — cortex shell + sulci + dense neural interior
// ════════════════════════════════════════════════════════════════════════════
function buildBrain():Scene{
  const r=lcg(42);
  const pts:V3[]=[],tris:Tri[]=[],segs:[number,number][]=[];

  // Lateral brain profile — 18 pts
  const BP:[number,number][]=[
    [-0.46,-0.64],[-0.66,-0.28],[-0.70, 0.08],[-0.60, 0.38],
    [-0.30, 0.62],[-0.04, 0.70],[ 0.22, 0.64],[ 0.50, 0.40],
    [ 0.64, 0.06],[ 0.62,-0.26],[ 0.44,-0.58],[ 0.16,-0.74],
    [-0.10,-0.76],[-0.28,-0.70],[-0.36,-0.68],[-0.40,-0.66],
    [-0.44,-0.66],[-0.46,-0.65],
  ];
  const BPN=BP.length;

  // 9 depth layers — tapers at ±0.62
  const layers=[
    {z:-0.62,s:0.46,tw: 0.09},
    {z:-0.44,s:0.66,tw: 0.06},
    {z:-0.22,s:0.88,tw: 0.03},
    {z:-0.08,s:0.96,tw: 0.01},
    {z: 0.00,s:1.00,tw: 0.00},
    {z: 0.08,s:0.96,tw:-0.01},
    {z: 0.22,s:0.88,tw:-0.03},
    {z: 0.44,s:0.66,tw:-0.06},
    {z: 0.62,s:0.46,tw:-0.09},
  ];
  const lStarts:number[]=[];
  layers.forEach(({z,s,tw})=>{
    lStarts.push(pts.length);
    BP.forEach(([px,py])=>{
      const c=Math.cos(tw),si2=Math.sin(tw);
      pts.push({x:(px*c-py*si2)*s+(r()-0.5)*0.016,y:(px*si2+py*c)*s+(r()-0.5)*0.016,z:z+(r()-0.5)*0.014});
    });
  });
  for(let li=0;li<8;li++){
    tris.push(...triStrip(lStarts[li],lStarts[li+1],BPN));
    segs.push(...rS(lStarts[li],BPN));
    for(let i=0;i<BPN;i++) segs.push([lStarts[li]+i,lStarts[li+1]+i]);
  }
  segs.push(...rS(lStarts[8],BPN));
  // Shell: 18×9 = 162 pts

  // Cerebellum — 3 layers × 10 pts
  const cbP:[number,number][]=[
    [0.24,0.70],[0.36,0.78],[0.50,0.86],[0.58,0.94],[0.52,1.02],
    [0.38,1.00],[0.24,0.92],[0.12,0.84],[0.04,0.76],[0.14,0.72],
  ];
  const cbN=10;
  const cbLayers=[{z:-0.28,s:0.60},{z:0,s:1.0},{z:0.28,s:0.60}];
  const cbStarts:number[]=[];
  cbLayers.forEach(({z,s})=>{
    cbStarts.push(pts.length);
    cbP.forEach(([px,py])=>pts.push({x:px*s+(r()-0.5)*0.012,y:py*s+(r()-0.5)*0.012,z:z+(r()-0.5)*0.012}));
  });
  tris.push(...triStrip(cbStarts[0],cbStarts[1],cbN),...triStrip(cbStarts[1],cbStarts[2],cbN));
  segs.push(...rS(cbStarts[0],cbN),...rS(cbStarts[1],cbN),...rS(cbStarts[2],cbN));
  // 162+30 = 192

  // Brainstem: 5 rings × 8 pts
  for(let seg=0;seg<5;seg++){
    const y=0.72+seg*0.10, bsR=0.055-seg*0.007, bsOff=pts.length;
    for(let i=0;i<8;i++){const t=(i/8)*Math.PI*2;pts.push({x:bsR*Math.cos(t)-0.04,y,z:bsR*Math.sin(t)});}
    if(seg>0) tris.push(...triStrip(bsOff-8,bsOff,8));
    segs.push(...rS(bsOff,8));
  }
  // 192+40 = 232

  // Sulci — cortex fold lines: 10 grooves × 14 pts = 140 pts
  const sulciOffsets:[number,number,number][]=[
    [-0.55, 0.08, 0.0],[-0.40, 0.42, 0.05],[0.0, 0.64, 0.1],
    [0.28, 0.52, 0.1],[0.54, 0.22, 0.08],[0.56,-0.10, 0.05],
    [0.38,-0.42, 0.0],[0.0,-0.70,-0.05],[-0.30,-0.60,-0.08],[-0.58,-0.20,-0.05],
  ];
  sulciOffsets.forEach(([cx,cy,cz])=>{
    const sb=pts.length;
    for(let i=0;i<14;i++){
      const t=(i/13)*Math.PI;
      pts.push({x:cx+Math.cos(t)*0.09+(r()-0.5)*0.02,y:cy+Math.sin(t)*0.07+(r()-0.5)*0.02,z:cz+(r()-0.5)*0.14});
    }
    segs.push(...cS(sb,sb+13));
    for(let i=0;i<12;i++) tris.push({a:sb+i,b:sb+i+1,c:sb+i+(i%3===0?2:1)});
  });
  // 232+140 = 372

  // Dense interior neural mesh: 600 pts
  const intBase=pts.length;
  for(let i=0;i<600;i++){
    const ang=r()*Math.PI*2,rr=Math.pow(r(),0.6)*0.82;
    pts.push({x:(rr*Math.cos(ang)*0.54-0.04)+(r()-0.5)*0.03,y:rr*Math.sin(ang)*0.56+(r()-0.5)*0.03,z:(r()-0.5)*0.48});
  }
  // Simple grid-based connectivity — avoid O(n²) on 600 pts
  for(let i=0;i<600;i+=3){
    for(let j=i+1;j<Math.min(i+12,600);j++){
      const p=pts[intBase+i],q=pts[intBase+j];
      const d2=(p.x-q.x)**2+(p.y-q.y)**2+(p.z-q.z)**2;
      if(d2<0.040){ segs.push([intBase+i,intBase+j]); if(j+1<600) tris.push({a:intBase+i,b:intBase+j,c:intBase+j+1}); }
    }
    // Anchor to nearest shell
    let bestD2=1e9,bestJ=0;
    const pi=pts[intBase+i];
    for(let j=0;j<BPN*9;j++){const d2=(pi.x-pts[j].x)**2+(pi.y-pts[j].y)**2+(pi.z-pts[j].z)**2;if(d2<bestD2){bestD2=d2;bestJ=j;}}
    if(bestD2<0.22) segs.push([intBase+i,bestJ]);
  }
  // 372+600 = 972. PCB traces: 24 pts → 996. pad to 1200.

  const traces=[[88,28],[88,42],[87,56],[12,28],[12,42],[13,56]];
  traces.forEach(([sx,sy])=>{
    const tBase=pts.length,dir=sx>50?1:-1;
    for(let k=0;k<4;k++) pts.push({x:(sx+dir*k*5-50)/50,y:(sy-50)/50,z:0.02});
    segs.push([tBase,tBase+1],[tBase+1,tBase+2],[tBase+2,tBase+3]);
  });

  return{pts:pad(pts,42),tris,segs,rgb:[80,180,255],tilt:0.22};
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 3 — FULL HUMAN BODY + NEURAL SIGNALS  (Reality)
// ════════════════════════════════════════════════════════════════════════════
function buildBody():Scene{
  const r=lcg(55);
  const pts:V3[]=[],tris:Tri[]=[],segs:[number,number][]=[];
  const add=(x:number,y:number,z:number)=>{pts.push({x,y,z});return pts.length-1;};

  // Head: 36-node circle
  const hN=36,hBase=0;
  for(let i=0;i<hN;i++){const t=(i/hN)*Math.PI*2;pts.push({x:0.15*Math.cos(t),y:-0.74+0.15*Math.sin(t)*0.94,z:(r()-0.5)*0.04});}
  segs.push(...rS(hBase,hN));
  for(let i=1;i<hN-1;i++) tris.push({a:hBase,b:hBase+i,c:hBase+i+1});
  // Eyes: 6 pts each
  for(let eye=0;eye<2;eye++){
    const ex=eye===0?-0.06:0.06, ey=-0.72;
    const eb=pts.length;
    for(let i=0;i<6;i++){const t=(i/6)*Math.PI*2;pts.push({x:ex+0.032*Math.cos(t),y:ey+0.022*Math.sin(t),z:0.04});}
    segs.push(...rS(eb,6));
  }
  // 36+12 = 48

  // Neck: 8 pts
  const neck=[add(-0.055,-0.58,0),add(0.055,-0.58,0)];
  segs.push([hBase+27,neck[0]],[hBase+9,neck[1]],[neck[0],neck[1]]);

  // Spine: 28 vertebrae from neck to pelvis
  const spine:number[]=[];
  for(let i=0;i<28;i++){
    const idx=add((r()-0.5)*0.011,-0.55+i*0.072,(r()-0.5)*0.025);
    spine.push(idx);
    if(i>0) segs.push([spine[i-1],spine[i]]);
  }
  segs.push([neck[0],spine[0]],[neck[1],spine[0]]);
  // 48+2+28 = 78

  // Ribcage: 10 ribs (5 each side), 8 pts each
  for(let rib=0;rib<10;rib++){
    const side=rib<5?-1:1, ri=rib%5;
    const y=-0.55+ri*0.068;
    const rb=pts.length;
    for(let i=0;i<8;i++){
      const t=(i/7)*(Math.PI*0.72);
      pts.push({x:side*(0.05+Math.sin(t)*0.28),y:y+Math.cos(t)*0.06,z:Math.sin(t*0.5)*0.12+(r()-0.5)*0.02});
    }
    segs.push(...cS(rb,rb+7));
    segs.push([spine[ri+1],rb]);
    for(let i=0;i<6;i++) tris.push({a:rb+i,b:rb+i+1,c:spine[ri+1]});
  }
  // 78+80 = 158

  // Shoulders + arms + hands
  const sL=add(-0.44,-0.52,0),sR=add(0.44,-0.52,0);
  segs.push([spine[0],sL],[spine[0],sR],[sL,sR]);
  tris.push({a:spine[0],b:sL,c:sR});
  for(let side=0;side<2;side++){
    const dir=side===0?-1:1, sh=side===0?sL:sR;
    let prev=sh;
    // Upper arm: 6, elbow, forearm: 6, wrist, hand: 5 fingers × 3
    for(let i=1;i<=6;i++){const j=add(dir*(0.44+i*0.038),-0.52+i*0.076+(r()-0.5)*0.02,(r()-0.5)*0.04);segs.push([prev,j]);prev=j;}
    const wrist=prev;
    for(let f=0;f<5;f++){
      let fp=wrist;
      for(let k=1;k<=3;k++){const j=add(dir*(0.66+f*0.020+(r()-0.5)*0.01),0.02+f*0.012+k*0.032,(r()-0.5)*0.03);segs.push([fp,j]);fp=j;}
    }
  }
  // 158+2+60 = 220 approx

  // Pelvis + legs + feet
  const hipL=add(-0.24,0.46,0),hipR=add(0.24,0.46,0);
  segs.push([spine[27],hipL],[spine[27],hipR],[hipL,hipR]);
  tris.push({a:spine[27],b:hipL,c:hipR});
  for(let side=0;side<2;side++){
    const dir=side===0?-1:1, hip=side===0?hipL:hipR;
    let prev=hip;
    // Thigh: 8, knee, shin: 8, ankle, foot: 5
    for(let i=1;i<=8;i++){const j=add(dir*(0.24+i*0.005),0.46+i*0.076+(r()-0.5)*0.02,(r()-0.5)*0.04);segs.push([prev,j]);prev=j;}
    const knee=prev;
    for(let i=1;i<=8;i++){const j=add(dir*(0.24+8*0.005+i*0.004),0.46+8*0.076+i*0.074+(r()-0.5)*0.02,(r()-0.5)*0.04);segs.push([knee,j]);if(i>1)segs.push([j-1,j]);prev=j;}
    const ankle=prev;
    for(let t2=0;t2<5;t2++){const j=add(dir*(0.20-t2*0.018),ankle+0.01*(pts[ankle]?.y||0.0),0.04+t2*0.018);segs.push([ankle,j]);}
  }
  // ~350 pts structural. Rest: dense neural signal web

  // Neural signal web — dense bursts from every spine node and joint
  const sigBase=pts.length;
  spine.forEach((si,i)=>{
    const count=i%3===0?16:8;
    for(let k=0;k<count;k++){
      const side=k<count/2?-1:1,kk=k%(count/2);
      const nx=add(side*(0.28+kk*0.10+r()*0.06),pts[si].y+(r()-0.5)*0.08,(r()-0.5)*0.16);
      segs.push([si,nx]);
      if(k>0) tris.push({a:si,b:nx,c:nx-1});
    }
  });
  // Fill to 1200 with more signal pts
  while(pts.length<1200){
    const spineIdx=spine[Math.floor(r()*spine.length)];
    const sp=pts[spineIdx];
    add(sp.x+(r()-0.5)*0.80,sp.y+(r()-0.5)*0.24,(r()-0.5)*0.24);
  }

  return{pts:pad(pts,55),tris,segs,rgb:[160,92,255],tilt:0.06};
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 4 — RELIGIOUS SYMBOLS  (Religion)
// Cross + Star of David + Crescent + Lotus — layered at different z depths
// ════════════════════════════════════════════════════════════════════════════
function buildReligion():Scene{
  const r=lcg(77);
  const pts:V3[]=[],tris:Tri[]=[],segs:[number,number][]=[];

  // ── CROSS (Christian) — centered, large, z=0
  // Vertical bar: y from -0.86 to 0.86, width 0.10
  const crossVN=40;
  const cvL=pts.length;
  for(let i=0;i<crossVN;i++) pts.push({x:-0.08+(r()-0.5)*0.012,y:-0.84+i*(1.68/(crossVN-1)),z:(r()-0.5)*0.04});
  const cvR=pts.length;
  for(let i=0;i<crossVN;i++) pts.push({x: 0.08+(r()-0.5)*0.012,y:-0.84+i*(1.68/(crossVN-1)),z:(r()-0.5)*0.04});
  segs.push(...cS(cvL,cvL+crossVN-1),...cS(cvR,cvR+crossVN-1));
  tris.push(...triStrip(cvL,cvR,crossVN));
  // Horizontal bar: x from -0.50 to 0.50 at y≈0.28
  const chN=30;
  const chT=pts.length;
  for(let i=0;i<chN;i++) pts.push({x:-0.50+i*(1.0/(chN-1)),y: 0.24+(r()-0.5)*0.012,z:(r()-0.5)*0.04});
  const chB=pts.length;
  for(let i=0;i<chN;i++) pts.push({x:-0.50+i*(1.0/(chN-1)),y: 0.32+(r()-0.5)*0.012,z:(r()-0.5)*0.04});
  segs.push(...cS(chT,chT+chN-1),...cS(chB,chB+chN-1));
  tris.push(...triStrip(chT,chB,chN));
  // Connect cross bars
  segs.push([cvL+20,chT+0],[cvR+20,chB+0],[cvL+21,chT+29],[cvR+21,chB+29]);
  // Cross fill pts: 60
  for(let i=0;i<60;i++){
    let x,y;
    if(r()<0.5){x=(r()-0.5)*0.16;y=-0.84+r()*1.68;} // vertical
    else{x=-0.50+r()*1.0;y=0.24+r()*0.08;} // horizontal
    pts.push({x,y,z:(r()-0.5)*0.04});
  }
  // Cross total: 40+40+30+30+60 = 200 pts

  // ── STAR OF DAVID (Jewish) — offset top-right, z=0.14
  const starR=0.34, starCX=0.55, starCY=-0.45, starZ=0.14;
  for(let tri=0;tri<2;tri++){
    const sb=pts.length;
    const triOff=tri*Math.PI/3;
    // Each triangle: 36 pts (12 per side)
    for(let side=0;side<3;side++){
      const a1=triOff+(side/3)*Math.PI*2;
      const a2=triOff+((side+1)/3)*Math.PI*2;
      for(let i=0;i<12;i++){
        const t=i/11;
        pts.push({
          x:starCX+(lerp(Math.cos(a1),Math.cos(a2),t)*starR)+(r()-0.5)*0.012,
          y:starCY+(lerp(Math.sin(a1),Math.sin(a2),t)*starR)+(r()-0.5)*0.012,
          z:starZ+(r()-0.5)*0.02
        });
      }
    }
    segs.push(...cS(sb,sb+35));
    tris.push({a:sb,b:sb+12,c:sb+24},{a:sb+6,b:sb+18,c:sb+30});
  }
  // Inner hexagon
  const hexB=pts.length;
  for(let i=0;i<12;i++){const t=(i/12)*Math.PI*2;pts.push({x:starCX+Math.cos(t)*starR*0.44,y:starCY+Math.sin(t)*starR*0.44,z:starZ});}
  segs.push(...rS(hexB,12));
  // Star pts: 72+12 = 84

  // ── CRESCENT MOON (Islamic) — offset top-left, z=0.10
  const moonCX=-0.58, moonCY=-0.44, moonZ=0.10;
  const moonR=0.28,moonR2=0.22,moonOffX=0.10;
  const moonN=50;
  const moonB=pts.length;
  for(let i=0;i<moonN;i++){
    const t=(i/(moonN-1))*Math.PI*2;
    const ox=moonR*Math.cos(t), oy=moonR*Math.sin(t);
    // Subtract inner circle offset to create crescent
    const ix=(ox-moonOffX)/moonR*moonR2, iy=oy/moonR*moonR2;
    const inside=((ox-moonOffX)**2+oy**2)<moonR2*moonR2;
    if(!inside){
      pts.push({x:moonCX+ox+(r()-0.5)*0.012,y:moonCY+oy+(r()-0.5)*0.012,z:moonZ+(r()-0.5)*0.02});
    } else {
      pts.push({x:moonCX+moonOffX+ix+(r()-0.5)*0.010,y:moonCY+iy+(r()-0.5)*0.010,z:moonZ+(r()-0.5)*0.02});
    }
  }
  segs.push(...rS(moonB,moonN));
  // Star near crescent
  for(let i=0;i<5;i++){
    const t=(i/5)*Math.PI*2;
    pts.push({x:moonCX+0.22+Math.cos(t)*0.06,y:moonCY+0.08+Math.sin(t)*0.06,z:moonZ});
  }
  segs.push(...rS(pts.length-5,5));
  // Crescent: 55 pts

  // ── LOTUS FLOWER (Buddhism/Hinduism) — bottom center, z=0.08
  const lotCX=0.0, lotCY=0.55, lotZ=0.08;
  // 8 petals × 18 pts each
  for(let petal=0;petal<8;petal++){
    const ang=(petal/8)*Math.PI*2;
    const pb=pts.length;
    for(let i=0;i<18;i++){
      const t=(i/17)*Math.PI;
      const lx=Math.sin(t)*0.22, ly=Math.cos(t)*0.38+0.12;
      const c=Math.cos(ang),s=Math.sin(ang);
      pts.push({x:lotCX+lx*c-ly*s+(r()-0.5)*0.012,y:lotCY+lx*s+ly*c+(r()-0.5)*0.012,z:lotZ+petal*0.004});
    }
    segs.push(...cS(pb,pb+17));
    for(let i=0;i<16;i++) tris.push({a:pb+i,b:pb+i+1,c:pts.length-1});
  }
  // Lotus center
  const lotCenter=pts.length;
  for(let i=0;i<14;i++){const t=(i/14)*Math.PI*2;pts.push({x:lotCX+Math.cos(t)*0.07,y:lotCY+Math.sin(t)*0.07,z:lotZ+0.06});}
  segs.push(...rS(lotCenter,14));
  // Lotus: 144+14 = 158 pts

  // Background spiritual scatter: fill remaining to 1200
  // Cross 200 + Star 84 + Crescent 55 + Lotus 158 = 497
  // Need 703 more
  while(pts.length<1200){
    const ang=r()*Math.PI*2,rad=r()*1.0;
    pts.push({x:rad*Math.cos(ang)+(r()-0.5)*0.08,y:rad*Math.sin(ang)+(r()-0.5)*0.08,z:(r()-0.5)*0.40});
  }

  return{pts:pad(pts,77),tris,segs,rgb:[255,185,55],tilt:0.22};
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 5 — CONNECTOME / MIND MAP  (Consciousness)
// Nodes on 3D sphere, KNN-connected — pure neural network topology
// ════════════════════════════════════════════════════════════════════════════
function buildConnectome():Scene{
  const r=lcg(99);
  const pts:V3[]=[],tris:Tri[]=[],segs:[number,number][]=[];

  // 3 concentric shells of nodes
  // Inner shell (r=0.28): 60 pts
  const s1=fibSphere(60,0.28,r);
  const b1=0;
  pts.push(...s1);
  segs.push(...rS(b1,60));

  // Middle shell (r=0.55): 160 pts
  const b2=pts.length;
  pts.push(...fibSphere(160,0.55,r));
  segs.push(...rS(b2,160));

  // Outer shell (r=0.88): 280 pts
  const b3=pts.length;
  pts.push(...fibSphere(280,0.88,r));
  segs.push(...rS(b3,280));
  // 500 pts so far

  // Connect inner→middle: each inner node to 3 nearest middle nodes
  s1.forEach((pi,i)=>{
    const midPts=pts.slice(b2,b2+160);
    const dists=midPts.map((p,j)=>({j,d2:(pi.x-p.x)**2+(pi.y-p.y)**2+(pi.z-p.z)**2}))
      .sort((a,b)=>a.d2-b.d2).slice(0,3);
    dists.forEach(({j},k)=>{
      segs.push([b1+i,b2+j]);
      if(k<2) tris.push({a:b1+i,b:b2+j,c:b2+dists[(k+1)%3].j});
    });
  });

  // Connect middle→outer: each middle node to 2 nearest outer nodes
  for(let i=0;i<160;i++){
    const pi=pts[b2+i];
    const outerPts=pts.slice(b3,b3+280);
    const dists=outerPts.map((p,j)=>({j,d2:(pi.x-p.x)**2+(pi.y-p.y)**2+(pi.z-p.z)**2}))
      .sort((a,b)=>a.d2-b.d2).slice(0,2);
    dists.forEach(({j})=>segs.push([b2+i,b3+j]));
    if(dists.length===2) tris.push({a:b2+i,b:b3+dists[0].j,c:b3+dists[1].j});
  }

  // Dense interior fill: 700 scattered nodes inside sphere r<0.88
  for(let i=0;i<700;i++){
    const phi=Math.acos(1-2*r()),th=r()*Math.PI*2;
    const rr=Math.pow(r(),0.5)*0.85;
    pts.push({x:rr*Math.sin(phi)*Math.cos(th),y:rr*Math.sin(phi)*Math.sin(th),z:rr*Math.cos(phi)});
  }
  // 500+700 = 1200 ✓

  // Connect interior pts to nearest shell node in batches
  for(let i=0;i<700;i+=4){
    const pi=pts[500+i];
    let bestD2=1e9,bestJ=0;
    for(let j=0;j<500;j++){const d2=(pi.x-pts[j].x)**2+(pi.y-pts[j].y)**2+(pi.z-pts[j].z)**2;if(d2<bestD2){bestD2=d2;bestJ=j;}}
    if(bestD2<0.35) segs.push([500+i,bestJ]);
    if(i+1<700&&i+2<700) tris.push({a:500+i,b:500+i+1,c:bestJ});
  }

  return{pts:pad(pts,99),tris,segs,rgb:[48,205,245],tilt:0.20};
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 6 — NESTED SPHERES  (System View)
// 6 shells at growing radii, representing Matter→Cognition layers
// ════════════════════════════════════════════════════════════════════════════
function buildNested():Scene{
  const r=lcg(33);
  const pts:V3[]=[],tris:Tri[]=[],segs:[number,number][]=[];

  // 6 spherical shells: r = 0.16, 0.30, 0.46, 0.62, 0.78, 0.95
  const shells=[
    {rad:0.16, n: 24},
    {rad:0.30, n: 55},
    {rad:0.46, n: 96},
    {rad:0.62, n:155},
    {rad:0.78, n:234},
    {rad:0.95, n:348},
  ];
  // Total: 24+55+96+155+234+348 = 912 shell pts

  const sStarts:number[]=[];
  shells.forEach(({rad,n})=>{
    sStarts.push(pts.length);
    pts.push(...fibSphere(n,rad,r));
  });

  // Ring outlines at equator of each shell
  shells.forEach(({rad,n},si)=>{
    const base=sStarts[si];
    // Equatorial ring: pts near y≈0
    const eqPts=pts.slice(base,base+n)
      .map((p,i)=>({i,ay:Math.abs(p.y)}))
      .filter(x=>x.ay<rad*0.25)
      .sort((a,b)=>a.ay-b.ay)
      .slice(0,Math.min(16,n));
    segs.push(...rS(base+eqPts[0]?.i||0, eqPts.length));
    // Meridian ring
    const merPts=pts.slice(base,base+n)
      .map((p,i)=>({i,ax:Math.abs(p.x)}))
      .filter(x=>x.ax<rad*0.25)
      .sort((a,b)=>a.ax-b.ax)
      .slice(0,Math.min(16,n));
    if(merPts.length>2) segs.push(...rS(base+merPts[0].i,merPts.length));
  });

  // Connect adjacent shells: each node in shell i → nearest node in shell i+1
  for(let si=0;si<5;si++){
    const an=shells[si].n, bn=shells[si+1].n;
    const aO=sStarts[si], bO=sStarts[si+1];
    // Sample every 3rd pt in inner shell for performance
    for(let i=0;i<an;i+=3){
      const pi=pts[aO+i];
      let bestD2=1e9,bestJ=0;
      for(let j=0;j<bn;j++){const d2=(pi.x-pts[bO+j].x)**2+(pi.y-pts[bO+j].y)**2+(pi.z-pts[bO+j].z)**2;if(d2<bestD2){bestD2=d2;bestJ=j;}}
      segs.push([aO+i,bO+bestJ]);
      if(i+3<an) tris.push({a:aO+i,b:aO+i+3,c:bO+bestJ});
    }
  }

  // Fill remaining 288 pts between shells for density
  while(pts.length<1200){
    const si=Math.floor(r()*5);
    const ra=shells[si].rad, rb=shells[si+1].rad;
    const rr=ra+r()*(rb-ra);
    const phi=Math.acos(1-2*r()),th=r()*Math.PI*2;
    pts.push({x:rr*Math.sin(phi)*Math.cos(th),y:rr*Math.sin(phi)*Math.sin(th),z:rr*Math.cos(phi)});
  }

  return{pts:pad(pts,33),tris,segs,rgb:[65,200,148],tilt:0.14};
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 7 — DEEP STAR FIELD  (Questions)
// 1200 pts with wide z spread, Milky Way band, constellation edges
// ════════════════════════════════════════════════════════════════════════════
function buildStarField():Scene{
  const r=lcg(111);
  const pts:V3[]=[],tris:Tri[]=[],segs:[number,number][]=[];

  // Milky Way band: 400 pts concentrated near y=0, wide x/z spread
  for(let i=0;i<400;i++){
    const x=(r()-0.5)*3.6;
    const y=(r()-0.5)*0.28; // thin band
    const z=-1.80+r()*3.60;
    pts.push({x,y,z});
  }

  // Scattered background stars: 600 pts in wide sphere
  for(let i=0;i<600;i++){
    const phi=Math.acos(1-2*r()),th=r()*Math.PI*2;
    const rr=0.4+r()*1.55;
    pts.push({x:rr*Math.sin(phi)*Math.cos(th),y:rr*Math.sin(phi)*Math.sin(th)*0.7,z:rr*Math.cos(phi)});
  }

  // Nearby bright stars (large apparent size via projection): 80 pts close to viewer
  for(let i=0;i<80;i++){
    pts.push({x:(r()-0.5)*0.80,y:(r()-0.5)*0.60,z:-0.2+r()*0.40});
  }

  // Nebula cloud clusters: 120 pts in 4 clusters
  for(let c=0;c<4;c++){
    const cx=(r()-0.5)*2.0,cy=(r()-0.5)*1.0,cz=(r()-0.5)*1.8;
    for(let i=0;i<30;i++){
      pts.push({x:cx+(r()-0.5)*0.22,y:cy+(r()-0.5)*0.18,z:cz+(r()-0.5)*0.22});
    }
  }
  // Total: 400+600+80+120 = 1200 ✓

  // Constellation-like edges: connect 24 nearby bright pairs
  const near=pts.slice(0,400+600);
  for(let k=0;k<24;k++){
    const i=Math.floor(r()*200);
    let bestD2=1e9,bestJ=i;
    for(let j=i+1;j<Math.min(i+40,near.length);j++){
      const d2=(near[i].x-near[j].x)**2+(near[i].y-near[j].y)**2+(near[i].z-near[j].z)**2;
      if(d2<bestD2&&d2>0.02){bestD2=d2;bestJ=j;}
    }
    if(bestJ!==i){ segs.push([i,bestJ]); if(k<12) tris.push({a:i,b:bestJ,c:(i+bestJ)%1000}); }
  }

  return{pts:pad(pts,111),tris,segs,rgb:[210,88,162],tilt:0.16};
}

// ════════════════════════════════════════════════════════════════════════════
// BUILD ALL SCENES
// ════════════════════════════════════════════════════════════════════════════
const SCENES:Scene[]=[
  buildGalaxy(),    // 0 Hero
  buildECG(),       // 1 Life
  buildBrain(),     // 2 Evolution
  buildBody(),      // 3 Reality
  buildReligion(),  // 4 Religion
  buildConnectome(),// 5 Consciousness
  buildNested(),    // 6 System View
  buildStarField(), // 7 Questions
];
// Clamp all indices to safe range
SCENES.forEach(sc=>{
  sc.tris=sc.tris.filter(t=>t.a<SHAPE_N&&t.b<SHAPE_N&&t.c<SHAPE_N);
  sc.segs=sc.segs.filter(([a,b])=>a<SHAPE_N&&b<SHAPE_N);
});

// ════════════════════════════════════════════════════════════════════════════
// RENDERER
// ════════════════════════════════════════════════════════════════════════════
function drawMesh(
  ctx:CanvasRenderingContext2D,
  scA:Scene, scB:Scene,
  morphT:number,
  proj:Float32Array,
){
  const eased=morphT<0.5?4*morphT**3:1-(-2*morphT+2)**3/2;
  const aA=1-eased, aB=eased;
  const[rA,gA,bA]=scA.rgb,[rB,gB,bB]=scB.rgb;
  const R=(rA+(rB-rA)*eased+0.5)|0;
  const G=(gA+(gB-gA)*eased+0.5)|0;
  const B=(bA+(bB-bA)*eased+0.5)|0;

  const mkStyles=(alpha:number)=>Array.from({length:BUCKETS},(_,k)=>{
    const br=0.020+(k/(BUCKETS-1))*0.20;
    return `rgba(${R},${G},${B},${Math.min(br*alpha,0.28).toFixed(3)})`;
  });

  const drawTris=(tris:Tri[],alpha:number)=>{
    if(alpha<0.012) return;
    const styles=mkStyles(alpha);
    const paths=Array.from({length:BUCKETS},()=>new Path2D());
    for(let k=0;k<tris.length;k++){
      const{a,b,c}=tris[k];
      const ai=a*3,bi=b*3,ci=c*3;
      const ax=proj[ai],ay=proj[ai+1];
      const bx=proj[bi],by=proj[bi+1];
      const cx=proj[ci],cy=proj[ci+1];
      if(Math.abs((bx-ax)*(cy-ay)-(cx-ax)*(by-ay))<0.5) continue;
      const avgZ=(proj[ai+2]+proj[bi+2]+proj[ci+2])/3;
      const bucket=Math.min(BUCKETS-1,Math.max(0,((avgZ+1)*0.5*BUCKETS)|0));
      const p=paths[bucket];
      p.moveTo(ax,ay);p.lineTo(bx,by);p.lineTo(cx,cy);p.closePath();
    }
    for(let k=0;k<BUCKETS;k++){
      ctx.fillStyle=styles[k]; ctx.fill(paths[k]);
      ctx.strokeStyle=styles[k]; ctx.lineWidth=0.30; ctx.stroke(paths[k]);
    }
  };
  drawTris(scA.tris,aA);
  drawTris(scB.tris,aB);

  const drawSegs=(segs:[number,number][],alpha:number)=>{
    if(alpha<0.012) return;
    ctx.beginPath();
    ctx.strokeStyle=`rgba(${R},${G},${B},${(alpha*0.48).toFixed(3)})`;
    ctx.lineWidth=0.65;
    for(let k=0;k<segs.length;k++){
      const[a,b]=segs[k];
      ctx.moveTo(proj[a*3],proj[a*3+1]);
      ctx.lineTo(proj[b*3],proj[b*3+1]);
    }
    ctx.stroke();
  };
  drawSegs(scA.segs,aA);
  drawSegs(scB.segs,aB);

  // Nodes — 3 glow passes
  ctx.beginPath();ctx.fillStyle=`rgba(${R},${G},${B},0.042)`;
  for(let i=0;i<TOTAL_N;i++){const sx=proj[i*3],sy=proj[i*3+1],d=proj[i*3+2];const br=clamp(0.42+(d+1)*0.26,0,1);const rad=2.8+br*5.2;ctx.moveTo(sx+rad,sy);ctx.arc(sx,sy,rad,0,6.2832);}
  ctx.fill();

  ctx.beginPath();ctx.fillStyle=`rgba(${R},${G},${B},0.14)`;
  for(let i=0;i<TOTAL_N;i++){const sx=proj[i*3],sy=proj[i*3+1],d=proj[i*3+2];const br=clamp(0.42+(d+1)*0.26,0,1);const rad=0.9+br*1.8;ctx.moveTo(sx+rad,sy);ctx.arc(sx,sy,rad,0,6.2832);}
  ctx.fill();

  ctx.beginPath();ctx.fillStyle='rgba(218,238,255,0.90)';
  for(let i=0;i<TOTAL_N;i++){const sx=proj[i*3],sy=proj[i*3+1],d=proj[i*3+2];const br=clamp(0.32+(d+1)*0.30,0,1);const rad=0.42+br*0.78;ctx.moveTo(sx+rad,sy);ctx.arc(sx,sy,rad,0,6.2832);}
  ctx.fill();
}

// ════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function GlobalBackground(){
  const canvasRef=useRef<HTMLCanvasElement|null>(null);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext('2d',{alpha:false});
    if(!ctx) return;

    let w=0,h=0,dpr=1,raf=0;
    const T0=performance.now();
    let bgGrad:CanvasGradient|null=null;

    let scrollRaw=0,scrollSmooth=0;
    const buildBG=()=>{
      bgGrad=ctx.createRadialGradient(w*0.42,h*0.44,0,w*0.5,h*0.5,Math.max(w,h)*0.82);
      bgGrad.addColorStop(0,'#1a3d82');bgGrad.addColorStop(0.28,'#0e2558');
      bgGrad.addColorStop(0.60,'#061432');bgGrad.addColorStop(1.0,'#020810');
    };
    const resize=()=>{
      dpr=Math.min(window.devicePixelRatio||1,1.5);
      w=window.innerWidth;h=window.innerHeight;
      canvas.width=(w*dpr)|0;canvas.height=(h*dpr)|0;
      canvas.style.width=w+'px';canvas.style.height=h+'px';
      ctx.scale(dpr,dpr);buildBG();
    };
    resize();
    window.addEventListener('resize',resize,{passive:true});
    const onScroll=()=>{
      const maxY=document.documentElement.scrollHeight-window.innerHeight;
      scrollRaw=maxY>0?window.scrollY/maxY:0;
    };
    window.addEventListener('scroll',onScroll,{passive:true});

    const rng=lcg(88);
    const orbAngles=new Float32Array(ORBIT_N).map((_,i)=>(i/ORBIT_N)*Math.PI*2);
    const orbSpeeds=new Float32Array(ORBIT_N).map(()=>0.055+rng()*0.095);
    const orbRadii =new Float32Array(ORBIT_N).map(()=>0.95+rng()*0.42);
    const orbIncs  =new Float32Array(ORBIT_N).map(()=>(rng()-0.5)*1.0);
    for(let i=0;i<ORBIT_N;i++) orbAngles[i]=(i/ORBIT_N)*Math.PI*2;

    const proj=new Float32Array(TOTAL_N*3);
    const ROT_SPEED=0.12;
    const FOV=3.2;

    const frame=(now:number)=>{
      if(document.hidden){raf=requestAnimationFrame(frame);return;}
      const elapsed=(now-T0)*0.001;

      scrollSmooth+=(scrollRaw-scrollSmooth)*0.08;
      const sp=clamp(scrollSmooth,0,0.9999);
      const NS=SCENES.length;
      const raw=sp*(NS-1);
      const fi=raw|0;
      const ti=fi+1<NS?fi+1:NS-1;
      const t=raw-fi;
      const morphT=t<0.5?2*t*t:(4-2*t)*t-1;

      const scA=SCENES[fi],scB=SCENES[ti];
      const tilt=lerp(scA.tilt,scB.tilt,morphT);
      const rotY=elapsed*ROT_SPEED;

      const cY=Math.cos(rotY),sY=Math.sin(rotY);
      const cT=Math.cos(tilt),sT=Math.sin(tilt);
      const sq=(w<h?w:h)*0.84;
      const half=sq*0.5,cx2=w*0.5,cy2=h*0.5;

      const ptsA=scA.pts,ptsB=scB.pts;
      for(let i=0;i<SHAPE_N;i++){
        const pA=ptsA[i],pB=ptsB[i];
        const mx=pA.x+(pB.x-pA.x)*morphT;
        const my=pA.y+(pB.y-pA.y)*morphT;
        const mz=pA.z+(pB.z-pA.z)*morphT;
        const rx=mx*cY+mz*sY, rz=-mx*sY+mz*cY;
        const ry2=my*cT-rz*sT, rz2=my*sT+rz*cT;
        const d=FOV/(FOV+rz2);
        proj[i*3]=cx2+rx*half*d;
        proj[i*3+1]=cy2+ry2*half*d;
        proj[i*3+2]=rz2;
      }

      for(let i=0;i<ORBIT_N;i++) orbAngles[i]+=orbSpeeds[i]*0.010;
      for(let i=0;i<ORBIT_N;i++){
        const idx=SHAPE_N+i;
        const ang=orbAngles[i],rad=orbRadii[i],inc=orbIncs[i];
        const ox=Math.cos(ang)*rad*Math.cos(inc);
        const oy=Math.sin(inc)*rad*0.7;
        const oz=Math.sin(ang)*rad*Math.cos(inc);
        const rx=ox*cY+oz*sY,rz=-ox*sY+oz*cY;
        const ry2=oy*cT-rz*sT,rz2=oy*sT+rz*cT;
        const d=FOV/(FOV+rz2);
        proj[idx*3]=cx2+rx*half*d;
        proj[idx*3+1]=cy2+ry2*half*d;
        proj[idx*3+2]=rz2;
      }

      if(bgGrad){ctx.fillStyle=bgGrad;}else{ctx.fillStyle='#060e22';}
      ctx.fillRect(0,0,w,h);

      drawMesh(ctx,scA,scB,morphT,proj);

      const eased2=morphT<0.5?4*morphT**3:1-(-2*morphT+2)**3/2;
      const[rA,gA,bA]=scA.rgb,[rB,gB,bB]=scB.rgb;
      const fR=(rA+(rB-rA)*eased2+0.5)|0;
      const fG=(gA+(gB-gA)*eased2+0.5)|0;
      const fB=(bA+(bB-bA)*eased2+0.5)|0;
      ctx.beginPath();
      ctx.fillStyle=`rgba(${fR},${fG},${fB},0.16)`;
      for(let i=0;i<ORBIT_N;i+=3){
        const idx=(SHAPE_N+i)*3;
        const sx=proj[idx],sy=proj[idx+1];
        const ts=half*0.010+Math.sin(elapsed*0.80+i)*half*0.004;
        ctx.moveTo(sx,sy-ts);ctx.lineTo(sx+ts*0.86,sy+ts*0.5);ctx.lineTo(sx-ts*0.86,sy+ts*0.5);ctx.closePath();
      }
      ctx.fill();

      raf=requestAnimationFrame(frame);
    };

    raf=requestAnimationFrame(frame);
    return()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('resize',resize);
      window.removeEventListener('scroll',onScroll);
    };
  },[]);

  return(
    <canvas
      ref={canvasRef}
      style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}
      aria-hidden="true"
    />
  );
}