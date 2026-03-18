import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isToday, fmtLong } from "../utils/helpers";
import { CheckCircle, ProgressBar, EmptySlate } from "../components/UIBits";

function TodayTab({ schedule, onToggle, onSetup, isDark }) {
  const todayEntry = schedule.find((d) => isToday(d.date));
  const [focusMode, setFocusMode] = useState(false);
  const tasks = todayEntry?.tasks ?? [];
  const done = tasks.filter((t) => t.done);
  const pct = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;
  const totalMins = tasks.reduce((a, t) => a + t.duration, 0);

  const hr = new Date().getHours();
  const greeting =
    hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
  const allDone = tasks.length > 0 && done.length === tasks.length;

  if (!schedule.length)
    return (
      <EmptySlate
        icon="📖"
        title="No schedule yet"
        desc="Create a study plan in Setup and your daily tasks will appear here."
        cta="Go to Setup →"
        onCta={onSetup}
      />
    );

  return (
    <AnimatePresence mode="wait">
      {focusMode ? (
        <motion.div
          key="focus"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          className="focus-hero-bg"
          style={{ maxWidth: 580, margin: "0 auto", padding: "44px 0" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 36,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: 4,
                }}
              >
                ⚡ Focus Mode
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.7rem",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                }}
              >
                Today&apos;s Tasks
              </div>
            </div>
            <button
              onClick={() => setFocusMode(false)}
              style={{
                padding: "9px 18px",
                borderRadius: 10,
                border: "1.5px solid var(--border-strong)",
                background: "transparent",
                color: "var(--text2)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              ← Exit
            </button>
          </div>
          {/* Ring */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 36,
            }}
          >
            <div style={{ position: "relative" }}>
              <RingProgress pct={pct} size={150} stroke={11} />
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
                    fontSize: "2.2rem",
                    fontWeight: 700,
                  }}
                >
                  {pct}
                  <span style={{ fontSize: "1rem" }}>%</span>
                </span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text3)",
                    marginTop: 2,
                  }}
                >
                  {done.length}/{tasks.length} done
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tasks.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => onToggle(todayEntry.date, t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 22px",
                  background: "var(--surface)",
                  borderRadius: "var(--radius)",
                  border: `1.5px solid ${t.done ? "var(--green)" : "var(--border)"}`,
                  cursor: "pointer",
                  boxShadow: "var(--shadow)",
                  opacity: t.done ? 0.55 : 1,
                  transition: "opacity 0.2s,border-color 0.2s",
                }}
              >
                <CheckCircle
                  done={t.done}
                  onToggle={() => onToggle(todayEntry.date, t.id)}
                  size={28}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SubjectPill
                    name={t.subjectName}
                    colorIdx={t.colorIdx}
                    dark={isDark}
                  />
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      marginTop: 5,
                      textDecoration: t.done ? "line-through" : "none",
                    }}
                  >
                    {t.topic}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}
                  >
                    {t.duration}m
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "var(--text3)" }}>
                    {Math.ceil(t.duration / 25)}🍅
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: "center",
                marginTop: 32,
                padding: 24,
                background: "var(--green-light)",
                borderRadius: "var(--radius)",
                border: "1.5px solid var(--green)",
              }}
            >
              <div style={{ fontSize: 36 }}>🎉</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--green)",
                  marginTop: 8,
                }}
              >
                All done for today!
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--green)",
                  opacity: 0.8,
                  marginTop: 4,
                }}
              >
                Incredible work. Rest and come back fresh tomorrow.
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ maxWidth: 780, margin: "0 auto", padding: "36px 0" }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 28,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text3)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {greeting} · {fmtLong(new Date())}
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem,4vw,2rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  marginTop: 4,
                }}
              >
                Today&apos;s Study Plan
              </h1>
            </div>
            {tasks.length > 0 && (
              <button
                onClick={() => setFocusMode(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 20px",
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  boxShadow:
                    "0 3px 14px color-mix(in srgb,var(--accent) 30%,transparent)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px color-mix(in srgb,var(--accent) 35%,transparent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow =
                    "0 3px 14px color-mix(in srgb,var(--accent) 30%,transparent)";
                }}
              >
                ⚡ Focus Mode
              </button>
            )}
          </div>
          {tasks.length > 0 && (
            <>
              {/* Stats */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.08 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))",
                  gap: 12,
                  marginBottom: 22,
                }}
              >
                {[
                  { l: "Tasks", v: tasks.length, i: "📋" },
                  { l: "Minutes", v: totalMins, i: "⏱" },
                  { l: "Done", v: done.length, i: "✅" },
                  { l: "Progress", v: `${pct}%`, i: "🎯" },
                ].map((s, idx) => (
                  <motion.div
                    key={s.l}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    style={{
                      background: "var(--surface)",
                      border: "1.5px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "14px 16px",
                      boxShadow: "var(--shadow-sm)",
                    }}
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
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "var(--accent)",
                        marginTop: 3,
                      }}
                    >
                      {s.v}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              {/* Progress bar */}
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.7rem",
                    color: "var(--text3)",
                    marginBottom: 6,
                  }}
                >
                  <span>Daily progress</span>
                  <span>
                    {pct}% · {done.reduce((a, t) => a + t.duration, 0)}/
                    {totalMins} min
                  </span>
                </div>
                <ProgressBar
                  pct={pct}
                  color={allDone ? "var(--green)" : "var(--accent)"}
                  height={8}
                />
              </div>
              {/* Tasks */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {tasks.map((task, i) => {
                  const p = (
                    isDark ? SUBJECT_PALETTES_DARK : SUBJECT_PALETTES_LIGHT
                  )[task.colorIdx % 8];
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ y: -2, boxShadow: "var(--shadow-lg)" }}
                      onClick={() => onToggle(todayEntry.date, task.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "16px 20px",
                        background: "var(--surface)",
                        borderRadius: "var(--radius)",
                        border: `1.5px solid ${task.done ? "var(--green)" : "var(--border)"}`,
                        cursor: "pointer",
                        boxShadow: "var(--shadow)",
                        opacity: task.done ? 0.62 : 1,
                        transition: "border-color 0.2s,opacity 0.2s",
                      }}
                    >
                      <div
                        style={{
                          width: 4,
                          height: 44,
                          borderRadius: 4,
                          background: p.dot,
                          flexShrink: 0,
                        }}
                      />
                      <CheckCircle
                        done={task.done}
                        onToggle={() => onToggle(todayEntry.date, task.id)}
                        size={22}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              textDecoration: task.done
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {task.topic}
                          </span>
                          <SubjectPill
                            name={task.subjectName}
                            colorIdx={task.colorIdx}
                            dark={isDark}
                            xs
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--text3)",
                            marginTop: 3,
                          }}
                        >
                          {task.duration} min · {Math.ceil(task.duration / 25)}{" "}
                          Pomodoro
                          {Math.ceil(task.duration / 25) !== 1 ? "s" : ""}
                        </div>
                      </div>
                      {task.done && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "var(--green)",
                            background: "var(--green-light)",
                            padding: "4px 10px",
                            borderRadius: 20,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Done ✓
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              {allDone && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    textAlign: "center",
                    marginTop: 24,
                    padding: 22,
                    background: "var(--green-light)",
                    borderRadius: "var(--radius)",
                    border: "1.5px solid var(--green)",
                  }}
                >
                  <span style={{ fontSize: 28 }}>🎉</span>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "var(--green)",
                      marginTop: 6,
                    }}
                  >
                    Brilliant! All done for today.
                  </div>
                </motion.div>
              )}
            </>
          )}
          {!tasks.length && !todayEntry && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
                color: "var(--text2)",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                Rest day — nothing scheduled today.
              </div>
              <div
                style={{
                  fontSize: "0.825rem",
                  color: "var(--text3)",
                  marginTop: 6,
                }}
              >
                Check the Schedule tab to see your upcoming study days.
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================

export default TodayTab;
