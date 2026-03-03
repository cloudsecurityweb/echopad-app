import React, { useState, useMemo } from 'react';
import { useClientMetrics } from '../../hooks/useClientMetrics';
/* ------------------------------------------------------------------ */
/*  SVG Icons                                                         */
/* ------------------------------------------------------------------ */
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const DocIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const WordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const RefreshIcon = ({ spinning }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${spinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
const TrendUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Sparkline SVG (smooth line chart)                                 */
/* ------------------------------------------------------------------ */
function Sparkline({ data, color = '#06b6d4', height = 40, width = 120 }) {
  if (!data || data.length < 2) return null;

  const values = data.map(d => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(' L')}`;
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#grad-${color.replace('#', '')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      <circle cx={width} cy={parseFloat(points[points.length - 1].split(',')[1])} r="3" fill={color} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Card                                                         */
/* ------------------------------------------------------------------ */
function StatCard({ icon, label, value, subtitle, chartData, accentColor, gradientFrom, gradientTo, iconBg }) {
  return (
    <div className="group relative p-5 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 overflow-hidden">
      {/* Subtle top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-70 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconBg} shadow-sm`}>
          {icon}
        </div>
        {chartData && chartData.length >= 2 && (
          <div className="opacity-60 group-hover:opacity-100 transition-opacity">
            <Sparkline data={chartData} color={accentColor} height={32} width={80} />
          </div>
        )}
      </div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</p>
      {subtitle && (
        <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
          <TrendUpIcon />
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Daily Activity Bar Chart (Enhanced)                               */
/* ------------------------------------------------------------------ */
function DailyActivityChart({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) return null;

  const maxCount = Math.max(...data.map(x => x.count || 0), 1);

  // Day of week labels
  const formatDay = (dateStr) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    } catch { return ''; }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch { return dateStr; }
  };

  return (
    <div className="mt-6 relative">
      <div className="flex items-center gap-2 mb-4">
        <ChartIcon />
        <h4 className="text-sm font-semibold text-gray-700">Daily Activity</h4>
        <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          Last {data.length} days
        </span>
      </div>

      {/* Y-axis labels + Chart */}
      <div className="flex gap-3">
        {/* Y-axis */}
        <div className="flex flex-col justify-between text-[10px] text-gray-400 font-medium py-1 w-6 text-right shrink-0" style={{ height: '120px' }}>
          <span>{maxCount}</span>
          <span>{Math.round(maxCount / 2)}</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div className="flex-1 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" style={{ height: '120px' }}>
            <div className="border-b border-dashed border-gray-100 w-full" />
            <div className="border-b border-dashed border-gray-100 w-full" />
            <div className="border-b border-gray-200 w-full" />
          </div>

          {/* Bar container */}
          <div className="flex items-end gap-[3px] relative" style={{ height: '120px' }}>
            {data.map((d, i) => {
              const pct = Math.max(((d.count || 0) / maxCount) * 100, 2);
              const isHovered = hoveredIndex === i;
              const isToday = i === data.length - 1;

              return (
                <div
                  key={i}
                  className="flex-1 relative group/bar cursor-default"
                  style={{ height: '100%', display: 'flex', alignItems: 'flex-end' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 bg-gray-900 text-white text-[11px] rounded-lg px-3 py-2 shadow-xl whitespace-nowrap pointer-events-none">
                      <p className="font-semibold">{formatDate(d.day)}</p>
                      <p className="text-gray-300">{d.count} transcriptions · {Math.round((d.minutes || 0) * 10) / 10} min</p>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${isHovered
                      ? 'bg-gradient-to-t from-blue-600 to-cyan-400 shadow-md shadow-blue-200'
                      : isToday
                        ? 'bg-gradient-to-t from-blue-500 to-cyan-400'
                        : 'bg-gradient-to-t from-blue-400/80 to-cyan-300/80'
                      }`}
                    style={{
                      height: `${pct}%`,
                      minHeight: '3px',
                      transform: isHovered ? 'scaleX(1.15)' : 'scaleX(1)',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2">
            {data.length <= 10 ? (
              data.map((d, i) => (
                <span
                  key={i}
                  className={`text-[10px] flex-1 text-center ${hoveredIndex === i ? 'text-gray-700 font-semibold' : 'text-gray-400'
                    }`}
                >
                  {formatDay(d.day)}
                </span>
              ))
            ) : (
              <>
                <span className="text-[10px] text-gray-400">{formatDate(data[0]?.day)}</span>
                <span className="text-[10px] text-gray-400">{formatDate(data[Math.floor(data.length / 2)]?.day)}</span>
                <span className="text-[10px] text-gray-700 font-medium">Today</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Summary footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-blue-500 to-cyan-400" />
            <span className="text-[11px] text-gray-500">Transcriptions per day</span>
          </div>
        </div>
        <span className="text-[11px] text-gray-400">
          Avg: {data.length > 0 ? Math.round(data.reduce((s, d) => s + (d.count || 0), 0) / data.length * 10) / 10 : 0} / day
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Time Period Tabs                                                  */
/* ------------------------------------------------------------------ */
const TIME_PERIODS = [
  { key: 'today', label: 'Today', days: 1 },
  { key: '7d', label: '7 Days', days: 7 },
  { key: '30d', label: '30 Days', days: 30 },
  { key: 'all', label: 'All Time', days: null },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
function formatNumber(n) {
  if (n == null) return '0';
  return n.toLocaleString('en-US');
}

function formatMinutes(m) {
  if (m == null || m === 0) return '0 min';
  if (m < 1) return `${Math.round(m * 60)}s`;
  if (m < 60) return `${Math.round(m * 10) / 10} min`;
  const hrs = Math.floor(m / 60);
  const mins = Math.round(m % 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

function formatSeconds(s) {
  if (s == null || s === 0) return '0s';
  if (s < 60) return `${Math.round(s * 10) / 10}s`;
  return `${Math.round(s / 6) / 10} min`;
}

function getDateRange(days) {
  if (!days) return {};
  const to = new Date().toISOString();
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  return { from, to };
}

/* ------------------------------------------------------------------ */
/*  User Usage Table                                                  */
/* ------------------------------------------------------------------ */
function UserUsageTable({ breakdownData, users = [] }) {
  if (!breakdownData || breakdownData.length === 0) return null;

  return (
    <div className="mt-8">
      <h4 className="text-sm font-semibold text-gray-700 mb-4">User Breakdown</h4>
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-left bg-white">
          <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium text-right">Transcriptions</th>
              <th className="px-5 py-3 font-medium text-right">Minutes</th>
              <th className="px-5 py-3 font-medium text-right">Words</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {breakdownData
              .sort((a, b) => b.totalTranscriptions - a.totalTranscriptions)
              .map((row, i) => {
                const user = users.find(u => u.id === row.userId || u.uid === row.userId || u.objectId === row.userId) || {};
                const name = user.displayName || user.name || 'Unknown User';
                const email = user.email || row.userId;

                return (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{name}</div>
                      <div className="text-xs text-gray-500">{email !== name ? email : ''}</div>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-700 font-medium">
                      {formatNumber(row.totalTranscriptions)}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-700">
                      {formatMinutes(row.totalMinutes)}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-700">
                      {formatNumber(row.totalWords)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */
const ClientMetricsCard = ({ activeProduct, users = [] }) => {
  const [activePeriod, setActivePeriod] = useState('all');
  const dateRange = useMemo(() => {
    const period = TIME_PERIODS.find(p => p.key === activePeriod);
    return getDateRange(period?.days);
  }, [activePeriod]);

  const { data, loading, error, refresh } = useClientMetrics({ dateRange });

  const summary = data?.summary || {};
  const trends = data?.trends || {};

  // Build chart data from daily trends
  const chartData7d = useMemo(() => {
    return (trends.last7Days || []).map(d => ({
      label: d.day,
      value: d.count || 0,
    }));
  }, [trends.last7Days]);

  const chartDataMinutes7d = useMemo(() => {
    return (trends.last7Days || []).map(d => ({
      label: d.day,
      value: Math.round((d.minutes || 0) * 100) / 100,
    }));
  }, [trends.last7Days]);

  if (!activeProduct) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Product Usage Metrics</h3>
        <p className="text-gray-500 text-sm">Select a product to view its usage metrics.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Transcription Metrics</h3>
            <p className="text-sm text-gray-400 mt-0.5">Usage overview for {activeProduct.name}</p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 disabled:opacity-40 cursor-pointer"
            title="Refresh metrics"
          >
            <RefreshIcon spinning={loading} />
          </button>
        </div>

        {/* Time Period Tabs */}
        <div className="flex gap-1 bg-gray-100/80 p-1 rounded-xl w-fit">
          {TIME_PERIODS.map(period => (
            <button
              key={period.key}
              onClick={() => setActivePeriod(period.key)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${activePeriod === period.key
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Content */}
      <div className="p-6">
        {/* Error State */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 animate-pulse">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-xl" />
                  <div className="h-8 w-20 bg-gray-200 rounded" />
                </div>
                <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-7 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        {(!loading || data) && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              <StatCard
                icon={<ClockIcon />}
                label="Minutes"
                value={formatMinutes(summary.totalMinutesTranscribed)}
                subtitle={`${formatNumber(summary.totalTranscriptions || 0)} sessions total`}
                chartData={chartDataMinutes7d}
                accentColor="#06b6d4"
                gradientFrom="from-cyan-400"
                gradientTo="to-teal-500"
                iconBg="bg-gradient-to-br from-cyan-100 to-teal-50 text-cyan-600"
              />
              <StatCard
                icon={<DocIcon />}
                label="Transcriptions"
                value={formatNumber(summary.totalTranscriptions)}
                subtitle={activePeriod === 'all' ? 'All time' : TIME_PERIODS.find(p => p.key === activePeriod)?.label}
                chartData={chartData7d}
                accentColor="#3b82f6"
                gradientFrom="from-blue-400"
                gradientTo="to-indigo-500"
                iconBg="bg-gradient-to-br from-blue-100 to-indigo-50 text-blue-600"
              />
              <StatCard
                icon={<WordIcon />}
                label="Words"
                value={formatNumber(summary.totalWordsTranscribed)}
                subtitle={`~${formatNumber(summary.averageWordsPerTranscription || 0)} per session`}
                accentColor="#8b5cf6"
                gradientFrom="from-violet-400"
                gradientTo="to-purple-500"
                iconBg="bg-gradient-to-br from-violet-100 to-purple-50 text-violet-600"
              />

            </div>

            {/* Daily Activity Chart */}
            {trends.last30Days && trends.last30Days.length > 0 && (
              <DailyActivityChart data={trends.last30Days} />
            )}

            {/* User Breakdown Table */}
            <UserUsageTable breakdownData={data?.breakdown?.byUser} users={users} />

            {/* Empty State */}
            {!loading && summary.totalTranscriptions === 0 && (
              <div className="mt-8 text-center py-10">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl mb-4 shadow-sm">
                  <DocIcon />
                </div>
                <p className="text-gray-600 text-sm font-medium">No transcription data yet</p>
                <p className="text-gray-400 text-xs mt-1">Start using AI Scribe to see your metrics here.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClientMetricsCard;
