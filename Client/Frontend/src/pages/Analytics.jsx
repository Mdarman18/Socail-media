import { useEffect, useState } from "react";
import {
  Activity,
  Award,
  BarChart3,
  Flame,
  Heart,
  MessageCircle,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { getMyAchievements, getMyAnalytics } from "../api/analytics.api";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const Stat = ({ label, value, icon: Icon, tone }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-brand-300 hover:shadow-md dark:border-surface-darkBorder dark:bg-surface-darkCard">
    <div className="flex items-center justify-between">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${tone}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
        Live
      </span>
    </div>
    <p className="mt-4 text-3xl font-extrabold tracking-tight text-ink dark:text-slate-100">
      {value ?? 0}
    </p>
    <p className="text-xs font-medium text-ink-faint mt-0.5">{label}</p>
  </div>
);

export default function Analytics() {
  const [data, setData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [analytics, badges] = await Promise.all([
        getMyAnalytics(),
        getMyAchievements(),
      ]);
      setData(analytics.data || {});
      setAchievements(badges.achievements || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load analytics.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading)
    return (
      <section className="mx-auto max-w-6xl space-y-5 px-4 py-8">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-surface-darkBorder" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl bg-slate-100 dark:bg-surface-darkBorder"
            />
          ))}
        </div>
      </section>
    );

  if (error)
    return (
      <section className="mx-auto flex min-h-[400px] max-w-xl flex-col items-center justify-center text-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/40">
          <Activity className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-ink dark:text-slate-100">
          Analytics unavailable
        </h1>
        <p className="mt-1 text-sm text-ink-faint">{error}</p>
        <button
          type="button"
          onClick={load}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Connection
        </button>
      </section>
    );

  const stats = [
    [
      "Posts created",
      data.posts,
      BarChart3,
      "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-300",
    ],
    [
      "Doubts solved",
      data.doubtsSolved,
      Award,
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300",
    ],
    [
      "Accepted answers",
      data.acceptedAnswers,
      MessageCircle,
      "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-300",
    ],
    [
      "Likes received",
      data.likesReceived,
      Heart,
      "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-300",
    ],
    [
      "Followers",
      data.followers,
      Users,
      "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-300",
    ],
    [
      "Reputation",
      data.reputation,
      Award,
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-300",
    ],
    [
      "Current streak",
      data.currentStreak,
      Flame,
      "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-300",
    ],
    [
      "Longest streak",
      data.longestStreak,
      Flame,
      "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-300",
    ],
  ];

  // Chart 1 Data: Area Chart for Activity Pulse
  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Last 7 Days", "Last 30 Days"],
    datasets: [
      {
        fill: true,
        label: "Publishing Velocity",
        data: [
          Math.floor((data.activity?.last30Days || 0) * 0.1),
          Math.floor((data.activity?.last30Days || 0) * 0.25),
          Math.floor((data.activity?.last30Days || 0) * 0.4),
          data.activity?.last7Days || 0,
          data.activity?.last30Days || 0,
        ],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.35)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");
          return gradient;
        },
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: { family: "Inter", size: 13 },
        bodyFont: { family: "Inter", size: 12, weight: "bold" },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: "Inter", size: 11 }, color: "#94a3b8" },
      },
      y: {
        grid: { color: "rgba(226, 232, 240, 0.5)" },
        ticks: { font: { family: "Inter", size: 11 }, color: "#94a3b8" },
        beginAtZero: true,
      },
    },
  };

  // Chart 2 Data: Doughnut Chart for Contribution Breakdown
  const doughnutData = {
    labels: ["Posts", "Doubts Solved", "Accepted Answers"],
    datasets: [
      {
        data: [
          data.posts || 0,
          data.doubtsSolved || 0,
          data.acceptedAnswers || 0,
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: { family: "Inter", size: 11, weight: "500" },
          color: "#64748b",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        padding: 12,
        cornerRadius: 8,
      },
    },
    cutout: "70%",
  };

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8 px-4 py-6">
      <header className="border-b border-slate-100 pb-6 dark:border-surface-darkBorder">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
          <Activity className="h-3.5 w-3.5" /> Your learning signal
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink dark:text-slate-100">
          Analytics Dashboard
        </h1>
        <p className="mt-1 text-sm text-ink-faint">
          A high-precision overview of the technical knowledge and community
          impact you are building.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value, Icon, tone]) => (
          <Stat
            key={label}
            label={label}
            value={value}
            icon={Icon}
            tone={tone}
          />
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Pulse Chart */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-surface-darkBorder dark:bg-surface-darkCard">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-ink dark:text-slate-100">
                Activity Pulse Trend
              </h2>
              <p className="text-xs text-ink-faint">
                Publishing velocity across performance windows.
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-300">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-6 h-64 w-full">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Contribution Distribution Chart */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-surface-darkBorder dark:bg-surface-darkCard">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-ink dark:text-slate-100">
                Output Share
              </h2>
              <p className="text-xs text-ink-faint">
                Proportional mix of your contributions.
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300">
              <Activity className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-6 h-64 w-full flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-surface-darkBorder dark:bg-surface-darkCard">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-ink dark:text-slate-100">
              Unlocked Achievements
            </h2>
            <p className="text-xs text-ink-faint">
              Badges earned through genuine platform engagement.
            </p>
          </div>
          <Award className="h-5 w-5 text-amber-500" />
        </div>

        {achievements.length ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3.5 rounded-2xl border border-amber-200/60 bg-amber-50/50 p-4 transition-all hover:bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/10"
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm dark:bg-amber-900/40 dark:text-amber-300 text-lg">
                  ★
                </span>
                <div className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink dark:text-slate-100">
                    {item.achievement?.name}
                  </span>
                  <span className="block truncate text-xs text-ink-faint">
                    {item.achievement?.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-ink-faint dark:border-surface-darkBorder">
            Keep contributing to unlock your first verified badge.
          </div>
        )}
      </div>
    </section>
  );
}