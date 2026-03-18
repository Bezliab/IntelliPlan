import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  fmtLong,
  fmtShort,
  isPast,
  SUBJECT_PALETTES_LIGHT,
  SUBJECT_PALETTES_DARK,
} from "../utils/helpers";
import { CheckCircle, EmptySlate } from "../components/UIBits";

function ScheduleTab({ schedule, onToggle, onSetup, isDark }) {
  const [filter, setFilter] = useState("all");
  const subjects = useMemo(() => {
    const m = {};
    schedule.forEach((d) =>
      d.tasks.forEach((t) => {
        m[t.subjectName] = t.colorIdx;
      }),
    );
    return Object.entries(m).map(([name, colorIdx]) => ({ name, colorIdx }));
  }, [schedule]);
  const filtered = useMemo(
    () =>
      filter === "all"
        ? schedule
        : schedule
            .map((d) => ({
              ...d,
              tasks: d.tasks.filter((t) => t.subjectName === filter),
            }))
            .filter((d) => d.tasks.length),
    [schedule, filter],
  );

  if (!schedule.length)
    return (
      <EmptySlate
        icon="📅"
        title="No schedule yet"
        desc="Generate your study plan in Setup to see all days here."
        cta="Go to Setup →"
        onCta={onSetup}
      />
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: "36px 0" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.4rem,4vw,1.9rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          Full Schedule
        </h1>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {["all", ...subjects.map((s) => s.name)].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 13px",
                borderRadius: 8,
                border: "1.5px solid",
                borderColor:
                  filter === f ? "var(--accent)" : "var(--border-strong)",
                background:
                  filter === f ? "var(--accent-light)" : "transparent",
                color: filter === f ? "var(--accent)" : "var(--text2)",
                fontSize: "0.72rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 0.15s",
                textTransform: "capitalize",
              }}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: 14,
        }}
      >
        {filtered.map((day, i) => {
          const d = new Date(day.date),
            tod = isToday(day.date),
            past = isPast(day.date);
          const doneCt = day.tasks.filter((t) => t.done).length;
          const pct = day.tasks.length
            ? Math.round((doneCt / day.tasks.length) * 100)
            : 0;
          return (
            <motion.div
              key={day.date}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: Math.min(i * 0.035, 0.45) }}
              whileHover={{ y: -3, boxShadow: "var(--shadow-lg)" }}
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius)",
                border: `1.5px solid ${tod ? "var(--accent)" : "var(--border)"}`,
                overflow: "hidden",
                boxShadow: "var(--shadow)",
                opacity: past && pct < 100 ? 0.72 : 1,
              }}
            >
              <div
                style={{
                  padding: "13px 16px",
                  background: tod ? "var(--accent)" : "var(--surface2)",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: tod ? "rgba(255,255,255,0.65)" : "var(--text3)",
                    }}
                  >
                    {tod
                      ? "Today"
                      : past
                        ? `${Math.abs(diffDays(todayMidnight(), d))}d ago`
                        : `in ${diffDays(todayMidnight(), d)}d`}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: tod ? "#fff" : "var(--text)",
                      marginTop: 1,
                    }}
                  >
                    {fmtLong(d)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: tod ? "#fff" : "var(--accent)",
                    }}
                  >
                    {pct}%
                  </div>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      color: tod ? "rgba(255,255,255,0.6)" : "var(--text3)",
                    }}
                  >
                    {doneCt}/{day.tasks.length}
                  </div>
                </div>
              </div>
              <div style={{ height: 3, background: "var(--surface2)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    delay: Math.min(i * 0.035, 0.45) + 0.25,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  style={{
                    height: "100%",
                    background: pct === 100 ? "var(--green)" : "var(--accent)",
                  }}
                />
              </div>
              <div style={{ padding: "12px 16px" }}>
                {day.tasks.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onToggle(day.date, t.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "5px 0",
                      borderBottom: "1px solid var(--border)",
                      cursor: "pointer",
                    }}
                  >
                    <CheckCircle
                      done={t.done}
                      onToggle={() => onToggle(day.date, t.id)}
                      size={16}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          textDecoration: t.done ? "line-through" : "none",
                          opacity: t.done ? 0.55 : 1,
                        }}
                      >
                        {t.topic}
                      </div>
                      <SubjectPill
                        name={t.subjectName}
                        colorIdx={t.colorIdx}
                        dark={isDark}
                        xs
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--text3)",
                        flexShrink: 0,
                      }}
                    >
                      {t.duration}m
                    </span>
                  </div>
                ))}
                {day.tasks.length > 4 && (
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text3)",
                      textAlign: "center",
                      paddingTop: 8,
                      fontWeight: 600,
                    }}
                  >
                    +{day.tasks.length - 4} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================================

export default ScheduleTab;
