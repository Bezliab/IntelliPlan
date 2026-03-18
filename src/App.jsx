import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { lsGet, lsSet, isToday } from "./utils/helpers";
import { generateSchedule } from "./utils/schedule";
import SetupTab from "./tabs/SetupTab";
import TodayTab from "./tabs/TodayTab";
import ScheduleTab from "./tabs/ScheduleTab";
import ProgressTab from "./tabs/ProgressTab";

function App() {
  const [theme, setTheme] = useState(() => lsGet("ssp_theme", "light"));
  const [tab, setTab] = useState("today");
  const [rotating, setRot] = useState(false);
  const [schedule, setSched] = useState(() => lsGet("ssp_schedule", []));
  const isDark = theme === "dark";

  // App tabs (id must match the render checks below)
  const TABS = [
    { id: "today", label: "Today", icon: "📅" },
    { id: "schedule", label: "Schedule", icon: "🗓️" },
    { id: "progress", label: "Progress", icon: "📈" },
    { id: "setup", label: "Setup", icon: "⚙️" },
  ];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    lsSet("ssp_theme", theme);
  }, [theme]);
  useEffect(() => {
    lsSet("ssp_schedule", schedule);
  }, [schedule]);

  const toggleTheme = () => {
    setRot(true);
    setTimeout(() => setRot(false), 500);
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  const handleGenerate = useCallback((subs, exam, hrs) => {
    setSched(generateSchedule(subs, exam, hrs));
    setTab("today");
  }, []);
  const handleToggle = useCallback((date, id) => {
    setSched((s) =>
      s.map((d) =>
        d.date !== date
          ? d
          : {
              ...d,
              tasks: d.tasks.map((t) =>
                t.id !== id ? t : { ...t, done: !t.done },
              ),
            },
      ),
    );
  }, []);

  const todayTasks = useMemo(
    () => schedule.find((d) => isToday(d.date))?.tasks ?? [],
    [schedule],
  );
  const todayDone = todayTasks.filter((t) => t.done).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      {/* TOPBAR */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          background: "color-mix(in srgb,var(--surface) 90%,transparent)",
          backdropFilter: "blur(18px) saturate(1.5)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 22px",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              flexShrink: 0,
            }}
            onClick={() => setTab("today")}
          >
            <div
              style={{
                width: 33,
                height: 33,
                borderRadius: 9,
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.9rem",
              }}
            >
              📚
            </div>
            <div className="hide-sm">
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                }}
              >
                StudyFlow
              </div>
              <div
                style={{
                  fontSize: "0.58rem",
                  color: "var(--text3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Smart Planner
              </div>
            </div>
          </div>
          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 3 }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  position: "relative",
                  padding: "7px 13px",
                  border: "none",
                  borderRadius: 10,
                  background:
                    tab === t.id ? "var(--accent-light)" : "transparent",
                  color: tab === t.id ? "var(--accent)" : "var(--text2)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.14s",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (tab !== t.id)
                    e.currentTarget.style.background = "var(--surface2)";
                }}
                onMouseLeave={(e) => {
                  if (tab !== t.id)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <span className="hide-sm">{t.icon}</span>
                <span>{t.label}</span>
                {t.id === "today" && todayTasks.length > 0 && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background:
                        todayDone === todayTasks.length
                          ? "var(--green)"
                          : "var(--accent2)",
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            ))}
          </nav>
          {/* Today mini */}
          {todayTasks.length > 0 && (
            <div
              className="hide-sm"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "var(--text3)",
                  fontWeight: 600,
                }}
              >
                {todayDone}/{todayTasks.length}
              </span>
              <div
                style={{
                  width: 56,
                  height: 5,
                  background: "var(--surface2)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <motion.div
                  animate={{
                    width: `${todayTasks.length ? (todayDone / todayTasks.length) * 100 : 0}%`,
                  }}
                  transition={{ duration: 0.4 }}
                  style={{
                    height: "100%",
                    background:
                      todayDone === todayTasks.length
                        ? "var(--green)"
                        : "var(--accent)",
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          flex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
          padding: "0 22px",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "today" && (
              <TodayTab
                schedule={schedule}
                onToggle={handleToggle}
                onSetup={() => setTab("setup")}
                isDark={isDark}
              />
            )}
            {tab === "schedule" && (
              <ScheduleTab
                schedule={schedule}
                onToggle={handleToggle}
                onSetup={() => setTab("setup")}
                isDark={isDark}
              />
            )}
            {tab === "progress" && (
              <ProgressTab
                schedule={schedule}
                onSetup={() => setTab("setup")}
                isDark={isDark}
              />
            )}
            {tab === "setup" && (
              <SetupTab
                onGenerate={handleGenerate}
                hasSchedule={schedule.length > 0}
                isDark={isDark}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "14px 22px",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "0.68rem", color: "var(--text3)" }}>
          StudyFlow · {schedule.length} study days · all data saved locally in
          your browser
        </span>
      </footer>

      {/* THEME TOGGLE — fixed bottom-right, rotates on click */}
      <motion.button
        onClick={toggleTheme}
        animate={{ rotate: rotating ? 360 : 0 }}
        transition={{ duration: 0.46, ease: "easeInOut" }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 999,
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "var(--surface)",
          border: "1.5px solid var(--border-strong)",
          boxShadow: "var(--shadow-lg)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
        }}
      >
        {isDark ? "☀️" : "🌙"}
      </motion.button>
    </div>
  );
}

export default App;
