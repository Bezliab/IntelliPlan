import { motion } from "framer-motion";
import {
  SUBJECT_PALETTES_LIGHT,
  SUBJECT_PALETTES_DARK,
  fmtShort,
} from "../utils/helpers";
import { ProgressBar, RingProgress, EmptySlate } from "../components/UIBits";

function ProgressTab({ schedule, onSetup, isDark }) {
  if (!schedule.length)
    return (
      <EmptySlate
        icon="📊"
        title="No data yet"
        desc="Complete some tasks to see your progress and statistics."
        cta="Go to Setup →"
        onCta={onSetup}
      />
    );

  const all = schedule.flatMap((d) => d.tasks);
  const done = all.filter((t) => t.done);
  const pct = all.length ? Math.round((done.length / all.length) * 100) : 0;
  const totalMins = all.reduce((a, t) => a + t.duration, 0);
  const doneMins = done.reduce((a, t) => a + t.duration, 0);
  const completedDays = schedule.filter((d) =>
    d.tasks.every((t) => t.done),
  ).length;
  const streak = (() => {
    let s = 0;
    const sorted = [...schedule].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].tasks.every((t) => t.done)) s++;
      else break;
    }
    return s;
  })();

  const subStats = {};
  all.forEach((t) => {
    if (!subStats[t.subjectName])
      subStats[t.subjectName] = {
        done: 0,
        total: 0,
        mins: 0,
        doneMins: 0,
        colorIdx: t.colorIdx,
      };
    subStats[t.subjectName].total++;
    subStats[t.subjectName].mins += t.duration;
    if (t.done) {
      subStats[t.subjectName].done++;
      subStats[t.subjectName].doneMins += t.duration;
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: 760, margin: "0 auto", padding: "36px 0" }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.4rem,4vw,1.9rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          marginBottom: 28,
        }}
      >
        Your Progress
      </h1>

      {/* Overview card */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08 }}
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 26,
          marginBottom: 18,
          display: "flex",
          gap: 24,
          alignItems: "center",
          flexWrap: "wrap",
          boxShadow: "var(--shadow)",
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <RingProgress pct={pct} size={118} stroke={9} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 700,
              }}
            >
              {pct}%
            </span>
            <span style={{ fontSize: "0.6rem", color: "var(--text3)" }}>
              Overall
            </span>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))",
            gap: 14,
          }}
        >
          {[
            { l: "Tasks Done", v: `${done.length}/${all.length}`, i: "✅" },
            {
              l: "Hours Studied",
              v: `${Math.floor(doneMins / 60)}h ${doneMins % 60}m`,
              i: "⏱",
            },
            {
              l: "Days Done",
              v: `${completedDays}/${schedule.length}`,
              i: "📅",
            },
            { l: "Streak", v: `${streak} days`, i: "🔥" },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.16 + i * 0.06 }}
            >
              <div
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {s.i} {s.l}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  marginTop: 3,
                }}
              >
                {s.v}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Subject breakdown */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.14 }}
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 24,
          marginBottom: 18,
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.05rem",
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Subject Breakdown
        </div>
        {Object.entries(subStats).map(([name, st], i) => {
          const p2 = (isDark ? SUBJECT_PALETTES_DARK : SUBJECT_PALETTES_LIGHT)[
            st.colorIdx % 8
          ];
          const pct2 = st.total ? Math.round((st.done / st.total) * 100) : 0;
          return (
            <motion.div
              key={name}
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              style={{ marginBottom: 18 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 7,
                  flexWrap: "wrap",
                }}
              >
                <SubjectPill name={name} colorIdx={st.colorIdx} dark={isDark} />
                <div style={{ flex: 1 }} />
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "var(--text2)",
                  }}
                >
                  {pct2}%
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--text3)" }}>
                  {st.done}/{st.total} tasks ·{" "}
                  {Math.round((st.doneMins / 60) * 10) / 10}h studied
                </span>
              </div>
              <ProgressBar
                pct={pct2}
                color={p2.dot}
                height={8}
                delay={0.25 + i * 0.07}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Heatmap */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.22 }}
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 24,
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.05rem",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Activity Heatmap
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {schedule.map((day, i) => {
            const d = new Date(day.date);
            const p2 = day.tasks.length
              ? Math.round(
                  (day.tasks.filter((t) => t.done).length / day.tasks.length) *
                    100,
                )
              : 0;
            const op = p2 === 0 ? 0.1 : p2 < 50 ? 0.35 : p2 < 100 ? 0.65 : 1;
            const rgb = isDark ? "77,184,184" : "27,107,107";
            return (
              <motion.div
                key={day.date}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: Math.min(i * 0.018, 0.6) }}
                title={`${fmtShort(d)}: ${p2}%`}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  background: `rgba(${rgb},${op})`,
                  border: isToday(day.date)
                    ? "2px solid var(--accent2)"
                    : "none",
                  cursor: "default",
                  flexShrink: 0,
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 10,
            fontSize: "0.65rem",
            color: "var(--text3)",
          }}
        >
          <span>Less</span>
          {[0.1, 0.35, 0.65, 1].map((o) => (
            <div
              key={o}
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: `rgba(${isDark ? "77,184,184" : "27,107,107"},${o})`,
              }}
            />
          ))}
          <span>More</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================

export default ProgressTab;
