import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RANGES = [
  { id: '7d',  label: '7D' },
  { id: '30d', label: '30D' },
  { id: '1y',  label: '1Y' },
];

const METRICS = [
  { id: 'scheduled',  label: 'Posts Scheduled' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'followers',  label: 'Followers' },
];

// Mock data per metric per range
const MOCK = {
  scheduled: {
    '7d':  [3, 5, 2, 7, 4, 6, 3],
    '30d': Array.from({ length: 30 }, (_, i) => Math.floor(Math.sin(i / 3) * 3 + 4)),
    '1y':  [12, 18, 9, 22, 15, 20, 11, 25, 17, 14, 19, 23],
  },
  engagement: {
    '7d':  [1200, 1800, 950, 2400, 1600, 2100, 1400],
    '30d': Array.from({ length: 30 }, (_, i) => Math.floor(Math.sin(i / 4) * 500 + 1500)),
    '1y':  [8200, 9400, 7100, 11200, 9800, 10500, 8900, 12400, 10200, 9600, 11000, 12800],
  },
  followers: {
    '7d':  [12100, 12180, 12240, 12300, 12390, 12450, 12530],
    '30d': Array.from({ length: 30 }, (_, i) => 11000 + i * 50 + Math.floor(Math.random() * 30)),
    '1y':  [8000, 8800, 9200, 9700, 10100, 10600, 10900, 11200, 11500, 11800, 12100, 12530],
  },
};

const METRIC_COLORS = {
  scheduled:  { border: 'rgb(99, 102, 241)',  from: 'rgba(99, 102, 241, 0.25)',  to: 'rgba(99, 102, 241, 0)' },
  engagement: { border: 'rgb(16, 185, 129)',  from: 'rgba(16, 185, 129, 0.25)',  to: 'rgba(16, 185, 129, 0)' },
  followers:  { border: 'rgb(168, 85, 247)',  from: 'rgba(168, 85, 247, 0.25)',  to: 'rgba(168, 85, 247, 0)' },
};

const buildLabels = (range) => {
  const today = new Date();
  if (range === '7d') {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d.toLocaleDateString(undefined, { weekday: 'short' });
    });
  } else if (range === '30d') {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (29 - i));
      return i % 5 === 0 ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
    });
  } else {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
      return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
    });
  }
};

const buildScheduledCounts = (posts, range) => {
  const today = new Date();
  if (range === '7d') {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().slice(0, 10);
      return posts.filter((p) => p.scheduledAt?.slice(0, 10) === dateStr).length;
    });
  } else if (range === '30d') {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (29 - i));
      const dateStr = d.toISOString().slice(0, 10);
      return posts.filter((p) => p.scheduledAt?.slice(0, 10) === dateStr).length;
    });
  } else {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
      return posts.filter((p) => {
        if (!p.scheduledAt) return false;
        const pd = new Date(p.scheduledAt);
        return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
      }).length;
    });
  }
};

const PostsChart = ({ posts }) => {
  const [range, setRange]   = useState('7d');
  const [metric, setMetric] = useState('scheduled');

  const isDark = document.documentElement.classList.contains('dark');
  const colors = METRIC_COLORS[metric];

  const { labels, counts } = useMemo(() => {
    const l = buildLabels(range);
    // Only Posts Scheduled uses real Firestore data — others are mock until Insights API
    const c = metric === 'scheduled' && posts.length > 0
      ? buildScheduledCounts(posts, range)
      : MOCK[metric][range];
    return { labels: l, counts: c };
  }, [posts, range, metric]);

  const isMockData = metric !== 'scheduled' || posts.length === 0;

  const chartData = {
    labels,
    datasets: [
      {
        label: METRICS.find((m) => m.id === metric)?.label,
        data: counts,
        fill: true,
        tension: 0.4,
        borderColor: colors.border,
        borderWidth: 2.5,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
          gradient.addColorStop(0, colors.from);
          gradient.addColorStop(1, colors.to);
          return gradient;
        },
        pointBackgroundColor: colors.border,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed.y;
            if (metric === 'scheduled') return ` ${val} post${val !== 1 ? 's' : ''}`;
            if (metric === 'engagement') return ` ${val.toLocaleString()} interactions`;
            return ` ${val.toLocaleString()} followers`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 11 } },
      },
      y: {
        beginAtZero: metric === 'scheduled',
        ticks: {
          stepSize: metric === 'scheduled' ? 1 : undefined,
          color: isDark ? '#94a3b8' : '#64748b',
          font: { size: 11 },
          callback: (val) => metric === 'followers' || metric === 'engagement'
            ? val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val
            : val,
        },
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
      },
    },
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {/* Metric tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
          {METRICS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                metric === m.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Range tabs */}
        <div className="flex items-center gap-3">
          {isMockData && (
            <span className="text-xs text-slate-400 dark:text-slate-500">Sample data</span>
          )}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-0.5 dark:border-slate-700">
            {RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  range === r.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-52">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PostsChart;