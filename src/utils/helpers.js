const SUBJECT_PALETTES_LIGHT = [
  { bg:"#E6F4F4", text:"#155C5C", dot:"#1B7070", border:"#B2DEDE" },
  { bg:"#FDF0E8", text:"#A8501F", dot:"#C8622A", border:"#F5C5A0" },
  { bg:"#FBF6E3", text:"#8B6E0A", dot:"#B8960C", border:"#EDD98A" },
  { bg:"#F2ECF8", text:"#5A2E8A", dot:"#7B50C0", border:"#D0B8EC" },
  { bg:"#E8F5EE", text:"#1A5E36", dot:"#2E7A4F", border:"#A8DCBC" },
  { bg:"#FDEEF2", text:"#9A2050", dot:"#C84070", border:"#F5B0C8" },
  { bg:"#EAF0FC", text:"#1E3A9A", dot:"#3050C0", border:"#ACC0EE" },
  { bg:"#F5EDE6", text:"#6B3A1A", dot:"#8B5020", border:"#DDB890" },
];

const SUBJECT_PALETTES_DARK = [
  { bg:"#0A2020", text:"#6ECECE", dot:"#4DB8B8", border:"#1E4040" },
  { bg:"#22140A", text:"#E0905A", dot:"#E07840", border:"#402010" },
  { bg:"#1C1606", text:"#D4B840", dot:"#D4AE2A", border:"#383010" },
  { bg:"#180A28", text:"#B890E0", dot:"#A070D0", border:"#301850" },
  { bg:"#081A10", text:"#60D090", dot:"#4CAF7A", border:"#103020" },
  { bg:"#200A14", text:"#E880A8", dot:"#D06090", border:"#3C1028" },
  { bg:"#080E20", text:"#8090D8", dot:"#6080E0", border:"#101C40" },
  { bg:"#180C06", text:"#C08060", dot:"#B07050", border:"#301810" },
];

const PRIORITY_CFG = {
  high:   { label:"High",   weight:3, color:"#C8622A", bg:"#FDF0E8", darkBg:"#2A1A0E", darkColor:"#E07840" },
  medium: { label:"Medium", weight:2, color:"#8B6E0A", bg:"#FDF8E4", darkBg:"#1E1606", darkColor:"#D4AE2A" },
  low:    { label:"Low",    weight:1, color:"#2E7A4F", bg:"#E8F5EE", darkBg:"#0E2018", darkColor:"#4CAF7A" },
};

const DAYS_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const todayMidnight = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const addDays = (d,n) => { const r=new Date(d); r.setDate(r.getDate()+n); return r; };
const diffDays = (a,b) => Math.round((new Date(b)-new Date(a))/86400000);
const fmtLong = d => `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
const fmtShort = d => `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
const isToday = d => { const t=todayMidnight(),dd=new Date(d); dd.setHours(0,0,0,0); return dd.getTime()===t.getTime(); };
const isPast = d => { const dd=new Date(d); dd.setHours(0,0,0,0); return dd < todayMidnight(); };

const lsGet = (k,def) => { try { const v=localStorage.getItem(k); return v!==null?JSON.parse(v):def; } catch { return def; } };
const lsSet = (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} };

export {
  SUBJECT_PALETTES_LIGHT,
  SUBJECT_PALETTES_DARK,
  PRIORITY_CFG,
  DAYS_SHORT,
  MONTHS_SHORT,
  todayMidnight,
  addDays,
  diffDays,
  fmtLong,
  fmtShort,
  isToday,
  isPast,
  lsGet,
  lsSet,
};
