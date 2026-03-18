import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { lsGet, lsSet, PRIORITY_CFG } from "../utils/helpers";
import { SubjectPill } from "../components/UIBits";

function SetupTab({ onGenerate, hasSchedule, isDark }) {
  const [subjects, setSubjects] = useState(() =>
    lsGet("ssp_sub", [{ id: 1, name: "", topics: "", priority: "medium" }]),
  );
  const [examDate, setExamDate] = useState(() => lsGet("ssp_exam", ""));
  const [hours, setHours] = useState(() => lsGet("ssp_hrs", 3));
  const [studyDays, setStudyDays] = useState(() =>
    lsGet("ssp_wdays", [1, 2, 3, 4, 5]),
  );
  const [reminders, setReminders] = useState(() =>
    lsGet("ssp_rem", [
      { id: 1, emoji: "☀️", label: "Morning session", time: "08:00", on: true },
      {
        id: 2,
        emoji: "📚",
        label: "Afternoon focus",
        time: "14:30",
        on: false,
      },
      { id: 3, emoji: "🌙", label: "Evening review", time: "19:00", on: true },
    ]),
  );
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    lsSet("ssp_sub", subjects);
  }, [subjects]);
  useEffect(() => {
    lsSet("ssp_exam", examDate);
  }, [examDate]);
  useEffect(() => {
    lsSet("ssp_hrs", hours);
  }, [hours]);
  useEffect(() => {
    lsSet("ssp_wdays", studyDays);
  }, [studyDays]);
  useEffect(() => {
    lsSet("ssp_rem", reminders);
  }, [reminders]);

  const addSubject = () =>
    setSubjects((s) => [
      ...s,
      { id: Date.now(), name: "", topics: "", priority: "medium" },
    ]);
  const delSubject = (id) => setSubjects((s) => s.filter((x) => x.id !== id));
  const updSub = (id, f, v) =>
    setSubjects((s) => s.map((x) => (x.id === id ? { ...x, [f]: v } : x)));
  const cyclePriority = (id) => {
    const order = ["high", "medium", "low"];
    setSubjects((s) =>
      s.map((x) => {
        if (x.id !== id) return x;
        const idx = order.indexOf(x.priority);
        return { ...x, priority: order[(idx + 1) % 3] };
      }),
    );
  };
  const toggleDay = (d) =>
    setStudyDays((days) =>
      days.includes(d) ? days.filter((x) => x !== d) : [...days, d].sort(),
    );
  const toggleReminder = (id) =>
    setReminders((r) => r.map((x) => (x.id === id ? { ...x, on: !x.on } : x)));

  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();
  const daysLeft = examDate ? diffDays(new Date(), new Date(examDate)) : null;

  const handleGenerate = async () => {
    const valid = subjects.filter((s) => s.name.trim());
    if (!valid.length) {
      alert("Please add at least one subject.");
      return;
    }
    if (!examDate) {
      alert("Please set your exam/deadline date.");
      return;
    }
    setSpinning(true);
    await new Promise((r) => setTimeout(r, 700));
    onGenerate(valid, examDate, Number(hours));
    setSpinning(false);
  };

  const priCfg = (pri) => {
    const c = PRIORITY_CFG[pri];
    return {
      background: isDark ? c.darkBg : c.bg,
      color: isDark ? c.darkColor : c.color,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: 780, margin: "0 auto", padding: "36px 0" }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ marginBottom: 32 }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem,4vw,2.2rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          Build Your
          <br />
          <em style={{ color: "var(--accent)" }}>Study Plan</em>
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text2)",
            marginTop: 8,
            lineHeight: 1.6,
          }}
        >
          Add your subjects, set a deadline, and we&apos;ll craft a personalised
          schedule.
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Subjects */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08 }}
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: 24,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.15rem",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Subjects + Topics
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              color: "var(--text3)",
              marginBottom: 18,
              letterSpacing: "0.02em",
            }}
          >
            Click the priority badge to cycle · Comma-separate multiple topics
          </div>
          <AnimatePresence initial={false}>
            {subjects.map((sub) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.2fr auto auto",
                  gap: 10,
                  marginBottom: 12,
                  alignItems: "start",
                }}
              >
                <input
                  type="text"
                  placeholder="Subject name…"
                  value={sub.name}
                  onChange={(e) => updSub(sub.id, "name", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Topics (optional)…"
                  value={sub.topics}
                  onChange={(e) => updSub(sub.id, "topics", e.target.value)}
                />
                <button
                  onClick={() => cyclePriority(sub.id)}
                  style={{
                    padding: "9px 13px",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-body)",
                    ...priCfg(sub.priority),
                    transition: "all 0.15s",
                  }}
                >
                  {sub.priority}
                </button>
                <button
                  onClick={() => delSubject(sub.id)}
                  style={{
                    width: 38,
                    height: 38,
                    border: "1.5px solid var(--border-strong)",
                    borderRadius: "var(--radius-sm)",
                    background: "transparent",
                    color: "var(--text3)",
                    cursor: "pointer",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--red)";
                    e.currentTarget.style.color = "var(--red)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-strong)";
                    e.currentTarget.style.color = "var(--text3)";
                  }}
                >
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button
            onClick={addSubject}
            style={{
              width: "100%",
              padding: 11,
              border: "1.5px dashed var(--accent)",
              borderRadius: "var(--radius-sm)",
              background: "var(--accent-light)",
              color: "var(--accent)",
              fontSize: "0.825rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(0.96)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "";
            }}
          >
            + Add Subject
          </button>
        </motion.div>

        {/* Settings row */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.13 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
            gap: 16,
          }}
        >
          {/* Exam Date */}
          <div
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: 20,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10,
              }}
            >
              📅 Exam / Deadline
            </div>
            <input
              type="date"
              value={examDate}
              min={minDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
            <AnimatePresence>
              {daysLeft !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--accent)",
                    marginTop: 8,
                    fontWeight: 700,
                  }}
                >
                  {daysLeft > 0
                    ? `${daysLeft} days remaining`
                    : daysLeft === 0
                      ? "That is today!"
                      : "Date is in the past"}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Daily hours */}
          <div
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: 20,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10,
              }}
            >
              ⏱ Daily Study Hours
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <input
                type="range"
                min={1}
                max={12}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  minWidth: 40,
                  textAlign: "center",
                }}
              >
                {hours}h
              </span>
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text3)",
                marginTop: 6,
              }}
            >
              ≈ {hours * 60} mins · {Math.ceil((hours * 60) / 25)} 🍅 Pomodoros
            </div>
          </div>

          {/* Study days */}
          <div
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: 20,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10,
              }}
            >
              📆 Study Days
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {DAYS_SHORT.map((d, i) => (
                <button
                  key={i}
                  onClick={() => toggleDay(i)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: "1.5px solid",
                    borderColor: studyDays.includes(i)
                      ? "var(--accent)"
                      : "var(--border-strong)",
                    background: studyDays.includes(i)
                      ? "var(--accent-light)"
                      : "transparent",
                    color: studyDays.includes(i)
                      ? "var(--accent)"
                      : "var(--text3)",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Reminders */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.18 }}
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: 24,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                🔔 Reminders
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text3)",
                  marginTop: 2,
                }}
              >
                Visual study reminders — toggle on or off
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {reminders.map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  background: "var(--surface2)",
                  borderRadius: "var(--radius-sm)",
                  border: "1.5px solid var(--border)",
                }}
              >
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>
                  {r.emoji}
                </span>
                <div style={{ flex: 1, fontSize: "0.85rem", fontWeight: 500 }}>
                  {r.label}
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text3)",
                    fontWeight: 600,
                  }}
                >
                  {r.time}
                </div>
                <div
                  onClick={() => toggleReminder(r.id)}
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 11,
                    cursor: "pointer",
                    background: r.on ? "var(--accent)" : "var(--border-strong)",
                    position: "relative",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <motion.div
                    animate={{ left: r.on ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{
                      position: "absolute",
                      top: 2,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Generate */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.23 }}
        >
          <button
            onClick={handleGenerate}
            disabled={spinning}
            style={{
              width: "100%",
              padding: "17px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius)",
              fontSize: "1.05rem",
              fontWeight: 700,
              cursor: spinning ? "wait" : "pointer",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.01em",
              boxShadow:
                "0 6px 24px color-mix(in srgb,var(--accent) 35%,transparent)",
              transition: "all 0.2s",
              opacity: spinning ? 0.8 : 1,
            }}
            onMouseEnter={(e) => {
              if (!spinning) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 32px color-mix(in srgb,var(--accent) 40%,transparent)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow =
                "0 6px 24px color-mix(in srgb,var(--accent) 35%,transparent)";
            }}
          >
            {spinning ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ display: "inline-block" }}
                >
                  ⚙
                </motion.span>
                Building your schedule…
              </span>
            ) : hasSchedule ? (
              "✦ Regenerate Schedule"
            ) : (
              "✦ Generate My Study Plan"
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============================================================

export default SetupTab;
