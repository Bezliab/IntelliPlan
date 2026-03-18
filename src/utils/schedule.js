import { todayMidnight, addDays, diffDays, PRIORITY_CFG } from "./helpers";

function generateSchedule(subjects, examDate, dailyHours) {
  const start = todayMidnight();
  const end = new Date(examDate); end.setHours(0,0,0,0);
  const totalDays = Math.max(1, diffDays(start, end));
  const minsPerDay = Math.max(30, dailyHours * 60);

  const pool = [];
  subjects.forEach((sub, sIdx) => {
    const w = PRIORITY_CFG[sub.priority]?.weight ?? 2;
    const rawTopics = sub.topics?.trim() ? sub.topics.split(",").map(t=>t.trim()).filter(Boolean) : [];
    const topics = rawTopics.length ? rawTopics : [`${sub.name} – Overview`, `${sub.name} – Practice`, `${sub.name} – Revision`];
    topics.forEach(topic => {
      for (let i=0;i<w;i++) pool.push({ subjectId:sub.id, subjectName:sub.name, colorIdx:sIdx%8, topic, weight:w });
    });
  });

  // Shuffle
  for (let i=pool.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }

  const schedule = [];
  let pi = 0;
  for (let d=0; d<totalDays; d++) {
    const date = addDays(start, d);
    const tasks = [];
    let rem = minsPerDay;
    let guard = 0;
    while (rem >= 20 && guard++ < 60) {
      const item = pool[pi++ % pool.length];
      const dur = Math.min(rem, item.weight>=3?60:item.weight===2?45:30);
      if (dur<20) break;
      tasks.push({ id:`${d}_${tasks.length}_${Math.random().toString(36).slice(2,7)}`, subjectId:item.subjectId, subjectName:item.subjectName, colorIdx:item.colorIdx, topic:item.topic, duration:dur, done:false });
      rem -= dur;
    }
    if (tasks.length) schedule.push({ date: date.toISOString(), tasks });
  }
  return schedule;
}

export { generateSchedule };
