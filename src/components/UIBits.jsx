import { motion } from "framer-motion";
import { SUBJECT_PALETTES_LIGHT, SUBJECT_PALETTES_DARK, PRIORITY_CFG } from "../utils/helpers";

function SubjectPill({ name, colorIdx, dark, xs }) {
  const p = (dark ? SUBJECT_PALETTES_DARK : SUBJECT_PALETTES_LIGHT)[colorIdx % 8];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:p.bg, color:p.text, border:`1px solid ${p.border}`, padding: xs?"1px 7px":"3px 9px", borderRadius:20, fontSize:xs?"0.63rem":"0.7rem", fontWeight:700, letterSpacing:"0.04em", textTransform:"uppercase", whiteSpace:"nowrap", flexShrink:0 }}>
      <span style={{ width:5,height:5,borderRadius:"50%",background:p.dot,flexShrink:0 }}/>
      {name}
    </span>
  );
}

function CheckCircle({ done, onToggle, size=20 }) {
  return (
    <button onClick={e=>{e.stopPropagation();onToggle();}} className={done?"check-pop":""}
      style={{ width:size,height:size,borderRadius:"50%",flexShrink:0, border:`2px solid ${done?"transparent":"var(--border-strong)"}`, background:done?"var(--green)":"transparent", cursor:"pointer", display:"flex",alignItems:"center",justifyContent:"center", color:"#fff",fontSize:size*0.5, transition:"all 0.2s", boxShadow:done?"0 2px 8px color-mix(in srgb, var(--green) 35%, transparent)":"none", fontFamily:"var(--font-body)" }}>
      {done && "✓"}
    </button>
  );
}

function ProgressBar({ pct, color="var(--accent)", height=6, delay=0 }) {
  return (
    <div style={{ height, background:"var(--surface2)", borderRadius:height/2, overflow:"hidden" }}>
      <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{delay, duration:0.7, ease:"easeOut"}}
        style={{ height:"100%", background:color, borderRadius:height/2 }} />
    </div>
  );
}

function RingProgress({ pct, size=100, stroke=8, color="var(--accent)" }) {
  const r = (size-stroke)/2, c = 2*Math.PI*r;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)",flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-strong)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={c-(pct/100)*c} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 0.6s cubic-bezier(.4,0,.2,1)"}}/>
    </svg>
  );
}

function EmptySlate({ icon, title, desc, cta, onCta }) {
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
      style={{ textAlign:"center", padding:"72px 24px", display:"flex",flexDirection:"column",alignItems:"center",gap:14 }}>
      <div style={{ fontSize:56,opacity:0.25 }}>{icon}</div>
      <div style={{ fontFamily:"var(--font-display)",fontSize:"1.4rem",fontWeight:700,letterSpacing:"-0.02em" }}>{title}</div>
      <div style={{ fontSize:"0.875rem",color:"var(--text2)",lineHeight:1.65,maxWidth:320 }}>{desc}</div>
      {cta && <button onClick={onCta} style={{ marginTop:4,padding:"11px 28px",borderRadius:12,background:"var(--accent)",color:"#fff",border:"none",fontWeight:700,cursor:"pointer",fontFamily:"var(--font-body)",fontSize:"0.875rem",boxShadow:"0 4px 16px color-mix(in srgb,var(--accent) 30%,transparent)" }}>{cta}</button>}
    </motion.div>
  );
}

export { SubjectPill, CheckCircle, ProgressBar, RingProgress, EmptySlate };
