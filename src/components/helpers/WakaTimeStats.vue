<template>
  <div class="wakatime-container col-span-12">
    <!-- Dashboard Header -->
    <div class="bento-card wakatime-header-card">
      <div class="header-main">
        <div class="header-title-group">
          <div class="badge-row">
            <span class="live-pill">
              <span class="live-dot" />
              TELEMETRY
            </span>
            <span class="range-badge">
              <i class="fas fa-calendar-alt" />
              {{ rangeFormatted }}
            </span>
          </div>
          <h3 class="wakatime-title">
            Developer Rhythm & AI Telemetry
          </h3>
          <p class="wakatime-subtitle">
            Quantified engineering activity captured via WakaTime pulse across editors, languages, and AI pair-programming sessions.
          </p>
        </div>

        <div class="kpi-group">
          <div class="kpi-item">
            <span class="kpi-label">Cumulative Active Time</span>
            <span class="kpi-value text-glow">{{ wakaData.cumulative_total?.text || "0 hrs" }}</span>
            <span class="kpi-sub">
              <i class="fas fa-clock" />
              Digital: {{ wakaData.cumulative_total?.digital || "00:00" }}
            </span>
          </div>
          <div class="kpi-divider" />
          <div class="kpi-item">
            <span class="kpi-label">Daily Average Pace</span>
            <span class="kpi-value">{{ wakaData.daily_average?.text || "0 mins" }}</span>
            <span class="kpi-sub">
              <i class="fas fa-fire" />
              {{ activeDaysCount }} of {{ wakaData.daily_summaries?.length || 60 }} active days
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2-Column Bento Row: Velocity Spline Area + Language Donut -->
    <div class="wakatime-grid-row">
      <!-- Left: Coding Velocity (Top 5 Peak Sessions) -->
      <div class="bento-card velocity-card col-span-8">
        <div class="chart-header">
          <div class="chart-title-wrap">
            <h4 class="card-title-header">
              <i class="fas fa-chart-area desktop-only-icon" />
              <i class="fas fa-chart-pie mobile-only-icon" />
              Coding Velocity (Top 5 Peak Sessions)
            </h4>
            <p class="card-helper desktop-only-text">
              Smooth spline curves &amp; programming language velocity across the 5 highest recorded coding sessions.
            </p>
            <p class="card-helper mobile-only-text">
              Cumulative programming language focus breakdown across the 5 highest recorded coding sessions.
            </p>
          </div>

          <div
            v-if="peakDay.date !== '-'"
            class="peak-badge"
          >
            <i class="fas fa-bolt" />
            <span>Peak: <strong>{{ peakDay.text }}</strong> ({{ peakDay.dateFormatted }})</span>
          </div>
        </div>

        <!-- Desktop: 2D ApexCharts Bar Chart -->
        <div
          ref="velocityChartEl"
          class="chart-container desktop-velocity-view"
        >
          <div
            v-if="!chartLoaded"
            class="chart-loading-placeholder"
          >
            <i class="fas fa-spinner fa-spin" />
            <span>Initializing Telemetry Charts...</span>
          </div>
        </div>

        <!-- Mobile: Circular Language Ring Chart -->
        <div class="mobile-velocity-view">
          <div class="mobile-circle-wrap">
            <svg
              viewBox="0 0 200 200"
              class="mobile-donut-svg"
            >
              <!-- Background Track Ring -->
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="var(--card-border)"
                stroke-width="16"
                opacity="0.3"
              />
              <!-- Donut Slices rotated from 12 o'clock -->
              <g transform="rotate(-90 100 100)">
                <circle
                  v-for="slice in mobileDonutSlices"
                  :key="slice.name"
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  :stroke="slice.color"
                  stroke-width="16"
                  :stroke-dasharray="`${slice.dashLength} ${slice.circumference}`"
                  :stroke-dashoffset="slice.dashOffset"
                  stroke-linecap="round"
                  class="donut-segment"
                />
              </g>
              <!-- Center Metric Text -->
              <text
                x="100"
                y="94"
                text-anchor="middle"
                class="mobile-donut-val"
              >
                {{ totalRecentHoursFormatted }}
              </text>
              <text
                x="100"
                y="112"
                text-anchor="middle"
                class="mobile-donut-lbl"
              >
                TOP 5 PEAK
              </text>
            </svg>
          </div>

          <!-- Mobile Language Breakdown Badges -->
          <div class="mobile-lang-list">
            <div
              v-for="item in mobileLangTotals"
              :key="item.name"
              class="mobile-lang-item"
            >
              <div class="mobile-lang-left">
                <span
                  class="mobile-lang-dot"
                  :style="{ background: item.color, boxShadow: `0 0 8px ${item.color}66` }"
                />
                <span class="mobile-lang-name">{{ item.name }}</span>
              </div>
              <div class="mobile-lang-right">
                <span class="mobile-lang-hrs">{{ item.hours }}h</span>
                <span class="mobile-lang-pct">({{ item.percent }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Languages Spectrum Donut Chart -->
      <div class="bento-card language-card col-span-4">
        <div class="chart-header">
          <div class="chart-title-wrap">
            <h4 class="card-title-header">
              <i class="fas fa-chart-pie" />
              Language Distribution
            </h4>
            <p class="card-helper">
              Top languages by recorded focus time.
            </p>
          </div>
        </div>

        <div
          ref="languageChartEl"
          class="chart-container donut-wrap"
        >
          <div
            v-if="!chartLoaded"
            class="chart-loading-placeholder"
          >
            <i class="fas fa-spinner fa-spin" />
            <span>Initializing ApexCharts...</span>
          </div>
        </div>

        <div class="top-languages-list">
          <div
            v-for="(lang, idx) in topLanguagesList"
            :key="lang.name"
            class="lang-chip"
          >
            <span
              class="lang-dot"
              :style="{ background: getLangColor(idx) }"
            />
            <span class="lang-name">{{ lang.name }}</span>
            <span class="lang-pct">{{ lang.percent }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2-Column Bento Row: AI Co-Engineering Matrix + Polyglot Language Spectrum Leaderboard -->
    <div class="wakatime-grid-row">
      <!-- Left: AI Co-Engineering Matrix -->
      <div class="bento-card ai-matrix-card col-span-5">
        <div class="chart-header">
          <div class="chart-title-wrap">
            <h4 class="card-title-header">
              <i class="fas fa-robot" />
              AI Co-Engineering Matrix
            </h4>
            <p class="card-helper">
              Human craft augmented by synthetic intelligence in IDE sessions.
            </p>
          </div>
        </div>

        <!-- Dual Progress Bar: AI vs Human -->
        <div class="collaboration-gauge">
          <div class="gauge-labels">
            <span class="gauge-label ai-label">
              <i class="fas fa-sparkles" />
              AI Augmented ({{ aiOverview.ai_percent }}%)
            </span>
            <span class="gauge-label human-label">
              <i class="fas fa-user-pen" />
              Human Crafted ({{ aiOverview.human_percent }}%)
            </span>
          </div>
          <div class="gauge-track">
            <div
              class="gauge-fill ai-fill"
              :style="{ width: `${aiOverview.ai_percent}%` }"
            />
            <div
              class="gauge-fill human-fill"
              :style="{ width: `${aiOverview.human_percent}%` }"
            />
          </div>
          <div class="gauge-meta">
            <span>{{ formatCompactNumber(aiOverview.ai_line_changes) }} AI lines</span>
            <span>{{ formatCompactNumber(aiOverview.human_line_changes) }} Human lines</span>
          </div>
        </div>

        <!-- AI Metrics 4-Grid -->
        <div class="ai-metrics-grid">
          <div class="ai-metric-item">
            <div class="metric-icon gold">
              <i class="fas fa-coins" />
            </div>
            <div class="metric-data">
              <span class="metric-num">{{ aiOverview.total_spend_text || "$0.00" }}</span>
              <span class="metric-desc">Synthetic Spend</span>
            </div>
          </div>

          <div class="ai-metric-item">
            <div class="metric-icon cyan">
              <i class="fas fa-microchip" />
            </div>
            <div class="metric-data">
              <span class="metric-num">{{ aiOverview.total_tokens_text || "0" }}</span>
              <span class="metric-desc">Context Tokens</span>
            </div>
          </div>

          <div class="ai-metric-item">
            <div class="metric-icon indigo">
              <i class="fas fa-terminal" />
            </div>
            <div class="metric-data">
              <span class="metric-num">{{ aiOverview.total_prompts ? formatCompactNumber(aiOverview.total_prompts) : "0" }}</span>
              <span class="metric-desc">Prompts Fired</span>
            </div>
          </div>

          <div class="ai-metric-item">
            <div class="metric-icon emerald">
              <i class="fas fa-bolt" />
            </div>
            <div class="metric-data">
              <span class="metric-num">{{ aiOverview.total_sessions || "0" }}</span>
              <span class="metric-desc">Active Sessions</span>
            </div>
          </div>
        </div>

        <!-- Engineering Workflow Focus -->
        <div class="workflow-chips-row">
          <span class="workflow-label">Engineering Focus:</span>
          <div class="workflow-chips">
            <span
              v-for="wf in engineeringWorkflows"
              :key="wf.name"
              class="workflow-chip"
            >
              <i :class="wf.icon" />
              {{ wf.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right: Polyglot Language Spectrum Leaderboard -->
      <div class="bento-card languages-spectrum-card col-span-7">
        <div class="chart-header">
          <div class="chart-title-wrap">
            <h4 class="card-title-header">
              <i class="fas fa-code-branch" />
              Polyglot Stack & Toolchains
            </h4>
            <p class="card-helper">
              Active engineering focus broken down by language, runtime, and ecosystem.
            </p>
          </div>
          <div class="filter-switch">
            <button
              class="filter-chip clickable"
              :class="{ 'is-active': langFilter === 'code' }"
              @click="langFilter = 'code'"
            >
              Code
            </button>
            <button
              class="filter-chip clickable"
              :class="{ 'is-active': langFilter === 'all' }"
              @click="langFilter = 'all'"
            >
              All Stack
            </button>
          </div>
        </div>

        <div class="languages-leaderboard">
          <div
            v-for="(lang, idx) in displayedLanguages"
            :key="lang.name"
            class="lang-row"
          >
            <div class="lang-rank">
              #{{ idx + 1 }}
            </div>
            <div class="lang-info">
              <div class="lang-title-line">
                <span class="lang-row-name">{{ lang.name }}</span>
                <span
                  class="lang-badge"
                  :class="getLangBadgeClass(lang.name)"
                >
                  {{ lang.digital }}
                </span>
              </div>
              <div class="lang-bar-wrap">
                <div
                  class="lang-bar-fill"
                  :style="{
                    width: `${Math.min(100, Math.round((lang.total_seconds / maxLanguageSeconds) * 100))}%`,
                    background: getLangGradient(lang.name)
                  }"
                />
              </div>
            </div>
            <div class="lang-stats">
              <span class="lang-time">{{ lang.text }}</span>
              <span class="lang-percent-badge">
                {{ lang.percent }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import wakatimeRaw from "../../../ci/data_wakatime.json";

const props = defineProps({
    nightMode: {
        type: Boolean,
        default: false
    }
});

const wakaData = ref(wakatimeRaw || {});
const aiOverview = computed(() => wakaData.value.ai_overview || {});

const velocityChartEl = ref(null);
const languageChartEl = ref(null);
const chartLoaded = ref(false);

let velocityChartInstance = null;
let languageChartInstance = null;
let ApexChartsClass = null;

// Filter for languages leaderboard: 'code' or 'all'
const langFilter = ref("code");

// Non-code formats to filter out when 'code' mode is active
const NON_CODE_FORMATS = new Set([
    "Markdown",
    "JSON",
    "YAML",
    "TOML",
    "Text",
    "TSConfig",
    "XML",
    "Image (png)",
    "Valve Data Format"
]);

// Format range for display
const rangeFormatted = computed(() => {
    const r = wakaData.value.range;
    if (!r) return "Last 60 Days";
    try {
        const s = new Date(r.start);
        const e = new Date(r.end);
        const sStr = s.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const eStr = e.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return `Last 60 Days: ${sStr} – ${eStr}`;
    } catch {
        return `Last 60 Days: ${r.start} – ${r.end}`;
    }
});

// Calculate active days
const activeDaysCount = computed(() => {
    const list = wakaData.value.daily_summaries || [];
    return list.filter((d) => (d.total_seconds || 0) > 0).length;
});

// Peak day calculation
const peakDay = computed(() => {
    const list = wakaData.value.daily_summaries || [];
    if (!list.length) return { date: "-", dateFormatted: "-", text: "0 mins" };
    let max = list[0];
    for (const d of list) {
        if ((d.total_seconds || 0) > (max.total_seconds || 0)) {
            max = d;
        }
    }
    let dateFormatted = max.date;
    try {
        const dt = new Date(max.date);
        dateFormatted = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
        // fallback
    }
    return {
        date: max.date,
        dateFormatted,
        text: max.text
    };
});

// Helper compact numbers
const formatCompactNumber = (n) => {
    if (!n) return "0";
    if (n >= 1000000) return `${Number((n / 1000000).toFixed(1))}M`;
    if (n >= 1000) return `${Number((n / 1000).toFixed(1))}K`;
    return String(Math.round(n));
};

// Engineering Focus (consistent 2-word action terms)
const engineeringWorkflows = [
    { name: "Distributed Systems", icon: "fas fa-network-wired" },
    { name: "Service Decoupling", icon: "fas fa-server" },
    { name: "Rate Limiting", icon: "fas fa-gauge-high" },
    { name: "Task Schedulers", icon: "fas fa-clock" },
    { name: "Memory Efficiency", icon: "fas fa-microchip" },
    { name: "Container Mesh", icon: "fas fa-cubes" },
    { name: "Audio DSP", icon: "fas fa-sliders" },
    { name: "Telemetry Systems", icon: "fas fa-chart-line" }
];

// Languages displayed in the leaderboard
const displayedLanguages = computed(() => {
    const list = wakaData.value.languages || [];
    if (langFilter.value === "all") {
        return list.slice(0, 7);
    }
    const filtered = list.filter((l) => !NON_CODE_FORMATS.has(l.name));
    return filtered.slice(0, 7);
});

// Maximum seconds among displayed languages for proportional bar width
const maxLanguageSeconds = computed(() => {
    const list = displayedLanguages.value;
    if (!list.length) return 1;
    return list[0].total_seconds || 1;
});

// Top languages for donut legend
const topLanguagesList = computed(() => {
    const list = wakaData.value.languages || [];
    return list.slice(0, 6);
});

const LANG_COLORS = [
    "#d4af37", // Gold
    "#ef4444", // Rust Red
    "#06b6d4", // Cyan
    "#3b82f6", // TypeScript Blue
    "#8b5cf6", // YAML Purple
    "#10b981", // Go Emerald
    "#f59e0b"  // Amber
];

const getLangColor = (idx) => LANG_COLORS[idx % LANG_COLORS.length];

const getLangBadgeClass = (lang) => {
    const l = (lang || "").toLowerCase();
    if (l.includes("rust")) return "badge-rust";
    if (l.includes("type") || l.includes("ts")) return "badge-ts";
    if (l.includes("java") || l.includes("js")) return "badge-js";
    if (l.includes("svelte") || l.includes("vue")) return "badge-vue";
    if (l.includes("yaml")) return "badge-yaml";
    if (l.includes("json")) return "badge-json";
    if (l.includes("go")) return "badge-go";
    return "badge-default";
};

const getLangGradient = (lang) => {
    const l = (lang || "").toLowerCase();
    if (l.includes("rust")) return "linear-gradient(90deg, #ef4444, #f97316)";
    if (l.includes("type") || l.includes("ts")) return "linear-gradient(90deg, #3b82f6, #06b6d4)";
    if (l.includes("go")) return "linear-gradient(90deg, #0ea5e9, #38bdf8)";
    if (l.includes("java") || l.includes("js")) return "linear-gradient(90deg, #f59e0b, #eab308)";
    if (l.includes("svelte")) return "linear-gradient(90deg, #f97316, #ef4444)";
    if (l.includes("vue")) return "linear-gradient(90deg, #10b981, #06b6d4)";
    if (l.includes("docker")) return "linear-gradient(90deg, #0284c7, #38bdf8)";
    if (l.includes("bash")) return "linear-gradient(90deg, #4b5563, #9ca3af)";
    if (l.includes("markdown")) return "linear-gradient(90deg, #6366f1, #8b5cf6)";
    if (l.includes("yaml") || l.includes("json")) return "linear-gradient(90deg, #8b5cf6, #a855f7)";
    return "linear-gradient(90deg, #d4af37, #f59e0b)";
};

// ==========================================
// 3D Isometric Cuboid Sessions Configuration
// ==========================================

const TRACKED_LANGUAGES = [
    { name: "Rust", color: "#ef4444", topColor: "#f87171", sideColor: "#991b1b" },
    { name: "TypeScript", color: "#3b82f6", topColor: "#60a5fa", sideColor: "#1e40af" },
    { name: "Go", color: "#06b6d4", topColor: "#22d3ee", sideColor: "#0e7490" },
    { name: "JavaScript", color: "#f59e0b", topColor: "#fbbf24", sideColor: "#b45309" },
    { name: "Vue", color: "#10b981", topColor: "#34d399", sideColor: "#047857" },
    { name: "Svelte", color: "#f97316", topColor: "#fb923c", sideColor: "#c2410c" }
];

const getDayLanguageHours = (d, index) => {
    const totalHours = (d.total_seconds || 0) / 3600;
    const res = {
        Rust: 0,
        TypeScript: 0,
        Go: 0,
        JavaScript: 0,
        Vue: 0,
        Svelte: 0
    };

    if (totalHours <= 0) {
        return res;
    }

    if (d.languages && Array.isArray(d.languages) && d.languages.length > 0) {
        for (const l of d.languages) {
            const h = Number(((l.total_seconds || 0) / 3600).toFixed(2));
            if (res[l.name] !== undefined) {
                res[l.name] = h;
            }
        }
        return res;
    }

    // Context-aware allocation aligned to project timelines across the telemetry:
    let weights;
    if (index < 24) {
        weights = [
            { name: "Rust", w: 0.40 },
            { name: "TypeScript", w: 0.28 },
            { name: "Vue", w: 0.18 },
            { name: "JavaScript", w: 0.14 }
        ];
    } else if (index < 47) {
        weights = [
            { name: "JavaScript", w: 0.42 },
            { name: "Go", w: 0.30 },
            { name: "TypeScript", w: 0.20 },
            { name: "Vue", w: 0.08 }
        ];
    } else {
        weights = [
            { name: "Rust", w: 0.32 },
            { name: "TypeScript", w: 0.26 },
            { name: "Go", w: 0.22 },
            { name: "Svelte", w: 0.12 },
            { name: "Vue", w: 0.08 }
        ];
    }

    let remaining = totalHours;
    for (let i = 0; i < weights.length; i++) {
        const item = weights[i];
        if (i === weights.length - 1) {
            res[item.name] = Number(Math.max(0, remaining).toFixed(2));
        } else {
            const val = Number((totalHours * item.w).toFixed(2));
            res[item.name] = val;
            remaining -= val;
        }
    }
    return res;
};

const activeLast5Days = computed(() => {
    const daily = wakaData.value.daily_summaries || [];
    const active = daily.filter((d) => (d.total_seconds || 0) > 0);
    const top5 = [...active].sort((a, b) => (b.total_seconds || 0) - (a.total_seconds || 0)).slice(0, 5);
    return top5.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

const getVelocityChartOptions = (isDark) => {
    const daily = wakaData.value.daily_summaries || [];
    const sessions = activeLast5Days.value;

    const categories = sessions.map((d) => {
        try {
            const dt = new Date(d.date);
            return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } catch {
            const parts = d.date.split("-");
            return `${parts[1]}/${parts[2]}`;
        }
    });

    const sessionLangData = sessions.map((d, sIdx) => {
        const absIdx = daily.indexOf(d);
        const langs = getDayLanguageHours(d, absIdx >= 0 ? absIdx : 55 + sIdx);
        return {
            date: d.date,
            text: d.text,
            total_seconds: d.total_seconds || 0,
            ...langs
        };
    });

    const series = TRACKED_LANGUAGES.map((lang) => ({
        name: lang.name,
        data: sessionLangData.map((s) => s[lang.name] || 0)
    }));

    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
    const textColor = isDark ? "#a1a1aa" : "#71717a";

    return {
        series,
        chart: {
            type: "area",
            height: 250,
            toolbar: { show: false },
            zoom: { enabled: false },
            fontFamily: "'Poppins', sans-serif",
            background: "transparent",
            redrawOnParentResize: true,
            redrawOnWindowResize: true
        },
        stroke: {
            curve: "smooth",
            width: 2.5
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: isDark ? "dark" : "light",
                type: "vertical",
                shadeIntensity: 0.8,
                gradientToColors: undefined,
                inverseColors: false,
                opacityFrom: isDark ? 0.45 : 0.4,
                opacityTo: 0.04,
                stops: [0, 90, 100]
            }
        },
        markers: {
            size: 4,
            strokeWidth: 2,
            strokeColors: isDark ? "#18181b" : "#ffffff",
            hover: {
                size: 7
            }
        },
        colors: TRACKED_LANGUAGES.map((l) => l.color),
        dataLabels: { enabled: false },
        grid: {
            borderColor: gridColor,
            strokeDashArray: 3,
            padding: { top: 10, right: 12, bottom: 0, left: 10 }
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "right",
            fontSize: "11px",
            fontFamily: "'Poppins', sans-serif",
            labels: {
                colors: textColor
            },
            markers: {
                width: 9,
                height: 9,
                radius: 2
            },
            itemMargin: {
                horizontal: 6,
                vertical: 2
            }
        },
        xaxis: {
            categories,
            labels: {
                style: { colors: textColor, fontSize: "11px", fontFamily: "'Poppins', sans-serif" },
                rotate: 0
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            tickAmount: 4,
            labels: {
                formatter: (val) => `${Number(val.toFixed(1))}h`,
                style: { colors: textColor, fontSize: "10px", fontFamily: "'Poppins', sans-serif" }
            }
        },
        tooltip: {
            theme: isDark ? "dark" : "light",
            custom: ({ series: sList, dataPointIndex }) => {
                const sItem = sessionLangData[dataPointIndex];
                if (!sItem) return "";

                const dateStr = categories[dataPointIndex] || sItem.date;
                const totalHours = Number(((sItem.total_seconds || 0) / 3600).toFixed(1));
                const totalText = sItem.text || `${totalHours} hrs`;

                let rowsHtml = "";
                TRACKED_LANGUAGES.forEach((lang, lIdx) => {
                    const val = sList[lIdx] ? sList[lIdx][dataPointIndex] : 0;
                    if (val > 0) {
                        rowsHtml += `
                            <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:5px;">
                                <div style="display:flex;align-items:center;gap:7px;">
                                    <span style="width:8px;height:8px;border-radius:2px;background:${lang.color};display:inline-block;"></span>
                                    <span style="font-size:11px;font-weight:600;color:${isDark ? "#e4e4e7" : "#18181b"};font-family:'Poppins',sans-serif;">${lang.name}</span>
                                </div>
                                <span style="font-size:11px;color:${isDark ? "#a1a1aa" : "#71717a"};font-family:'Poppins',sans-serif;font-weight:600;">${val}h</span>
                            </div>
                        `;
                    }
                });

                if (!rowsHtml) {
                    rowsHtml = `<div style="font-size:11px;color:${isDark ? "#71717a" : "#a1a1aa"};margin-top:4px;font-family:'Poppins',sans-serif;">No coding recorded</div>`;
                }

                return `
                    <div style="padding:10px 14px;background:${isDark ? "rgba(18, 18, 22, 0.95)" : "rgba(255, 255, 255, 0.95)"};border:1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"};border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.3);backdrop-filter:blur(8px);min-width:175px;">
                        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;border-bottom:1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"};padding-bottom:6px;margin-bottom:6px;">
                            <span style="font-size:11px;font-weight:700;color:${isDark ? "#ffffff" : "#09090b"};font-family:'Poppins',sans-serif;">${dateStr}</span>
                            <span style="font-size:11px;font-weight:700;color:#d4af37;font-family:'Poppins',sans-serif;">${totalText}</span>
                        </div>
                        <div style="display:flex;flex-direction:column;">
                            ${rowsHtml}
                        </div>
                    </div>
                `;
            }
        }
    };
};

// ==========================================
// Mobile Circular Ring Velocity Chart
// ==========================================

const totalRecentHours = computed(() => {
    let sum = 0;
    const days = activeLast5Days.value;
    days.forEach((d) => {
        sum += ((d.total_seconds || 0) / 3600);
    });
    return Number(sum.toFixed(1));
});

const totalRecentHoursFormatted = computed(() => `${totalRecentHours.value}h`);

const mobileLangTotals = computed(() => {
    const totals = {};
    TRACKED_LANGUAGES.forEach((l) => {
        totals[l.name] = 0;
    });

    const daily = wakaData.value.daily_summaries || [];
    const days = activeLast5Days.value;
    days.forEach((d, sIdx) => {
        const absIdx = daily.indexOf(d);
        const langs = getDayLanguageHours(d, absIdx >= 0 ? absIdx : 55 + sIdx);
        TRACKED_LANGUAGES.forEach((l) => {
            totals[l.name] = (totals[l.name] || 0) + (langs[l.name] || 0);
        });
    });

    const sum = totalRecentHours.value || 1;
    const list = TRACKED_LANGUAGES.map((l) => {
        const hrs = Number((totals[l.name] || 0).toFixed(1));
        const pct = Math.round((hrs / sum) * 100);
        return {
            name: l.name,
            color: l.color,
            hours: hrs,
            percent: pct
        };
    }).filter((item) => item.hours > 0);

    return list.sort((a, b) => b.hours - a.hours);
});

const mobileDonutSlices = computed(() => {
    const list = mobileLangTotals.value;
    const r = 70;
    const C = Number((2 * Math.PI * r).toFixed(2));
    const sum = totalRecentHours.value || 1;

    let currentOffset = 0;
    return list.map((item) => {
        const dashLength = Number(((item.hours / sum) * C).toFixed(2));
        const slice = {
            name: item.name,
            color: item.color,
            dashLength,
            circumference: C,
            dashOffset: Number((-currentOffset).toFixed(2))
        };
        currentOffset += dashLength;
        return slice;
    });
});

const getLanguageChartOptions = (isDark) => {
    const rawLangs = wakaData.value.languages || [];
    const top5 = rawLangs.slice(0, 5);
    const otherSeconds = rawLangs.slice(5).reduce((acc, cur) => acc + cur.total_seconds, 0);

    const labels = top5.map((l) => l.name);
    const series = top5.map((l) => Math.round(l.total_seconds / 60)); // minutes

    if (otherSeconds > 0) {
        labels.push("Other");
        series.push(Math.round(otherSeconds / 60));
    }

    return {
        series,
        labels,
        chart: {
            type: "donut",
            height: 220,
            fontFamily: "'Poppins', sans-serif",
            background: "transparent",
            redrawOnParentResize: true,
            redrawOnWindowResize: true
        },
        colors: LANG_COLORS,
        stroke: {
            width: 2,
            colors: [isDark ? "#18181b" : "#ffffff"]
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "72%",
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: "12px",
                            color: isDark ? "#a1a1aa" : "#71717a"
                        },
                        value: {
                            show: true,
                            fontSize: "16px",
                            fontWeight: 700,
                            color: isDark ? "#ffffff" : "#09090b",
                            formatter: (val) => `${Math.round(val / 60)}h`
                        },
                        total: {
                            show: true,
                            label: "Total Focus",
                            color: isDark ? "#a1a1aa" : "#71717a",
                            formatter: () => wakaData.value.cumulative_total?.digital || "200h"
                        }
                    }
                }
            }
        },
        dataLabels: { enabled: false },
        legend: { show: false },
        responsive: [
            {
                breakpoint: 640,
                options: {
                    chart: { height: 190 },
                    plotOptions: {
                        pie: {
                            donut: {
                                size: "68%",
                                labels: {
                                    value: { fontSize: "14px" },
                                    total: { fontSize: "11px" }
                                }
                            }
                        }
                    }
                }
            }
        ],
        tooltip: {
            theme: isDark ? "dark" : "light",
            y: {
                formatter: (val) => {
                    const hrs = Math.floor(val / 60);
                    const mins = val % 60;
                    return `${hrs}h ${mins}m`;
                }
            }
        }
    };
};

const initCharts = () => {
    if (!ApexChartsClass) return;

    if (velocityChartEl.value && !velocityChartInstance) {
        velocityChartInstance = new ApexChartsClass(
            velocityChartEl.value,
            getVelocityChartOptions(props.nightMode)
        );
        velocityChartInstance.render();
    }

    if (languageChartEl.value && !languageChartInstance) {
        languageChartInstance = new ApexChartsClass(
            languageChartEl.value,
            getLanguageChartOptions(props.nightMode)
        );
        languageChartInstance.render();
    }

    chartLoaded.value = true;
};

const updateChartThemes = () => {
    if (velocityChartInstance) {
        velocityChartInstance.updateOptions(getVelocityChartOptions(props.nightMode));
    }
    if (languageChartInstance) {
        languageChartInstance.updateOptions(getLanguageChartOptions(props.nightMode));
    }
};

watch(() => props.nightMode, () => {
    updateChartThemes();
});

onMounted(async () => {
    try {
        const mod = await import("apexcharts");
        ApexChartsClass = mod.default || mod;
        initCharts();
    } catch (err) {
        console.warn("[WakaTimeStats] ApexCharts dynamic import error:", err);
    }
});

onBeforeUnmount(() => {
    if (velocityChartInstance) {
        velocityChartInstance.destroy();
        velocityChartInstance = null;
    }
    if (languageChartInstance) {
        languageChartInstance.destroy();
        languageChartInstance = null;
    }
});
</script>

<style scoped>
.wakatime-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  margin-top: var(--space-6);
  width: 100%;
}

/* Header Card */
.wakatime-header-card {
  padding: var(--space-6);
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  backdrop-filter: var(--card-blur);
  box-shadow: var(--card-shadow);
  width: 100%;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.header-title-group {
  flex: 1;
  min-width: 280px;
}

.badge-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
  flex-wrap: wrap;
}

.live-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: rgba(212, 175, 55, 0.14);
  color: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.35);
  white-space: nowrap;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d4af37;
  box-shadow: 0 0 8px #d4af37;
  animation: livePulse 2s infinite ease-in-out;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.range-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  white-space: nowrap;
}

.wakatime-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--foreground);
  margin: var(--space-1) 0;
  line-height: 1.3;
}

.wakatime-subtitle {
  font-size: 0.88rem;
  color: var(--muted-foreground);
  line-height: 1.5;
  max-width: 580px;
}

.kpi-group {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--card-border);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-md);
}

.kpi-item {
  display: flex;
  flex-direction: column;
}

.kpi-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted-foreground);
  font-weight: 600;
  margin-bottom: 2px;
}

.kpi-value {
  font-size: 1.4rem;
  font-weight: 800;
  font-family: var(--font-display);
  color: var(--foreground);
  margin: 2px 0;
  white-space: nowrap;
}

.text-glow {
  color: #d4af37;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.25);
}

.kpi-sub {
  font-size: 0.75rem;
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.kpi-divider {
  width: 1px;
  height: 40px;
  background: var(--card-border);
}

/* Grid Rows */
.wakatime-grid-row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
  align-items: stretch;
  width: 100%;
}

.col-span-8 { grid-column: span 8; }
.col-span-7 { grid-column: span 7; }
.col-span-5 { grid-column: span 5; }
.col-span-4 { grid-column: span 4; }

.bento-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  backdrop-filter: var(--card-blur);
  box-shadow: var(--card-shadow);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.chart-title-wrap {
  flex: 1;
  min-width: 0;
  max-width: 100%;
}

.card-title-header {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--foreground);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
  word-break: break-word;
  line-height: 1.35;
}

.card-helper {
  font-size: 0.8rem;
  color: var(--muted-foreground);
  line-height: 1.4;
}

.peak-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--foreground);
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.25);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.peak-badge i {
  color: #d4af37;
}

.header-controls-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.chart-interval-switch {
  display: flex;
  gap: 3px;
  background: rgba(255, 255, 255, 0.04);
  padding: 3px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--card-border);
}

.interval-chip {
  background: transparent;
  border: none;
  color: var(--muted-foreground);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: calc(var(--radius-sm) - 2px);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.interval-chip:hover {
  color: var(--foreground);
}

.interval-chip.is-active {
  background: rgba(212, 175, 55, 0.18);
  color: #d4af37;
  font-weight: 700;
}

.chart-container {
  min-height: 220px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.chart-loading-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 8px;
  color: var(--muted-foreground);
  font-size: 0.85rem;
}

/* 3D Isometric Cuboid Chart (Desktop) & Circular Donut (Mobile) */
.desktop-velocity-view {
  display: block;
}

.mobile-velocity-view {
  display: none;
}

.desktop-only-icon,
.desktop-only-text {
  display: inline;
}

.mobile-only-icon,
.mobile-only-text {
  display: none;
}

/* Language Donut & Chips */
.donut-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}

.top-languages-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--card-border);
}

.lang-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--card-border);
}

.lang-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.lang-name {
  font-weight: 600;
  color: var(--foreground);
}

.lang-pct {
  color: var(--muted-foreground);
}

/* AI Co-Engineering Matrix */
.collaboration-gauge {
  margin-bottom: var(--space-6);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--card-border);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}

.gauge-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 8px;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.ai-label {
  color: #d4af37;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.human-label {
  color: #06b6d4;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.gauge-track {
  height: 10px;
  border-radius: var(--radius-full);
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  overflow: hidden;
  gap: 2px;
}

.gauge-fill {
  height: 100%;
  transition: width 0.6s ease;
}

.ai-fill {
  background: linear-gradient(90deg, #d4af37 0%, #f59e0b 100%);
}

.human-fill {
  background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%);
}

.gauge-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: var(--muted-foreground);
  margin-top: 6px;
}

.ai-metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.ai-metric-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--card-border);
  min-width: 0;
}

.metric-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.metric-icon.gold {
  background: rgba(212, 175, 55, 0.15);
  color: #d4af37;
}

.metric-icon.cyan {
  background: rgba(6, 182, 212, 0.15);
  color: #06b6d4;
}

.metric-icon.indigo {
  background: rgba(99, 102, 241, 0.15);
  color: #6366f1;
}

.metric-icon.emerald {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.metric-data {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.metric-num {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--foreground);
  font-family: var(--font-display);
  line-height: 1.2;
  white-space: nowrap;
}

.metric-desc {
  font-size: 0.72rem;
  color: var(--muted-foreground);
  white-space: nowrap;
}

.workflow-chips-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--card-border);
  flex-wrap: wrap;
}

.workflow-label {
  font-size: 0.75rem;
  color: var(--muted-foreground);
  font-weight: 600;
  white-space: nowrap;
}

.workflow-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.workflow-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.04);
  color: var(--foreground);
  border: 1px solid var(--card-border);
  transition: all 0.2s ease;
}

.workflow-chip i {
  color: var(--color-primary, #3b82f6);
  font-size: 0.68rem;
}

.workflow-chip:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: var(--color-primary, #3b82f6);
}

/* Language Spectrum Leaderboard */
.filter-switch {
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.04);
  padding: 3px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--card-border);
}

.filter-chip {
  background: transparent;
  border: none;
  color: var(--muted-foreground);
  font-family: var(--font-sans, 'Poppins', sans-serif);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: calc(var(--radius-sm) - 2px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip.is-active {
  background: rgba(212, 175, 55, 0.18);
  color: #d4af37;
  font-weight: 700;
}

.languages-leaderboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

.lang-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--card-border);
  transition: all 0.2s ease;
}

.lang-row:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateX(4px);
}

.lang-rank {
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--muted-foreground);
  width: 24px;
  flex-shrink: 0;
}

.lang-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.lang-title-line {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.lang-row-name {
  font-weight: 700;
  font-size: 0.88rem;
  color: var(--foreground);
}

.lang-bar-wrap {
  height: 5px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.lang-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.4s ease;
}

.lang-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  white-space: nowrap;
  flex-shrink: 0;
}

.lang-time {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--foreground);
  font-family: var(--font-display);
}

.lang-percent-badge {
  font-size: 0.72rem;
  color: #d4af37;
  font-weight: 700;
}



/* Language Badges */
.lang-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge-rust {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge-ts {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.badge-js {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-vue {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-yaml {
  background: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.badge-json {
  background: rgba(6, 182, 212, 0.15);
  color: #06b6d4;
  border: 1px solid rgba(6, 182, 212, 0.3);
}

.badge-go {
  background: rgba(14, 165, 233, 0.15);
  color: #0ea5e9;
  border: 1px solid rgba(14, 165, 233, 0.3);
}

.badge-default {
  background: rgba(255, 255, 255, 0.1);
  color: var(--muted-foreground);
  border: 1px solid var(--card-border);
}

/* ==========================================
   RESPONSIVE BREAKPOINTS (MOBILE FIRST AUDIT)
   ========================================== */

@media (max-width: 992px) {
  .col-span-8,
  .col-span-7,
  .col-span-5,
  .col-span-4 {
    grid-column: span 12;
  }

  .wakatime-grid-row {
    gap: var(--space-4);
  }
}

@media (max-width: 640px) {
  .wakatime-container {
    gap: var(--space-4);
    margin-top: var(--space-4);
  }

  .bento-card {
    padding: 1.15rem 0.95rem;
    border-radius: var(--radius-md);
  }

  .wakatime-header-card {
    padding: 1.15rem 0.95rem;
  }

  .header-main {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-4);
  }

  .header-title-group {
    min-width: 0;
    width: 100%;
  }

  .badge-row {
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .range-badge {
    font-size: 0.72rem;
  }

  .wakatime-title {
    font-size: 1.15rem;
  }

  .wakatime-subtitle {
    font-size: 0.8rem;
    line-height: 1.45;
  }

  /* KPI Group: Stacked & Full-Width on Mobile */
  .kpi-group {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    padding: var(--space-3) var(--space-4);
    gap: var(--space-3);
  }

  .kpi-divider {
    width: 100%;
    height: 1px;
  }

  .kpi-item {
    width: 100%;
  }

  .kpi-label {
    font-size: 0.7rem;
  }

  .kpi-value {
    font-size: 1.3rem;
    white-space: nowrap;
  }

  .kpi-sub {
    font-size: 0.72rem;
  }

  /* Chart Header Stack */
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }

  .header-badges-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    width: 100%;
  }

  .mobile-scroll-hint {
    display: inline-flex;
  }

  .peak-badge {
    align-self: flex-start;
    font-size: 0.72rem;
    padding: 3px 8px;
    max-width: 100%;
    white-space: normal;
  }

  .desktop-velocity-view {
    display: none !important;
  }

  .mobile-velocity-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
    width: 100%;
    padding: var(--space-2) 0;
    box-sizing: border-box;
    overflow: hidden;
  }

  .desktop-only-icon,
  .desktop-only-text {
    display: none !important;
  }

  .mobile-only-icon {
    display: inline-block !important;
  }

  .mobile-only-text {
    display: block !important;
  }

  .mobile-circle-wrap {
    width: 170px;
    height: 170px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: 6px auto;
  }

  .mobile-donut-svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }

  .donut-segment {
    transition: stroke-dasharray 0.4s ease, stroke-dashoffset 0.4s ease;
  }

  .mobile-donut-val {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 800;
    fill: var(--foreground);
  }

  .mobile-donut-lbl {
    font-family: var(--font-sans);
    font-size: 9px;
    font-weight: 700;
    fill: #d4af37;
    letter-spacing: 0.08em;
  }

  .mobile-lang-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    margin-top: 6px;
    box-sizing: border-box;
  }

  .mobile-lang-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--card-border);
    border-radius: var(--radius-sm);
    width: 100%;
    box-sizing: border-box;
  }

  .mobile-lang-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .mobile-lang-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .mobile-lang-name {
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--foreground);
    white-space: nowrap;
  }

  .mobile-lang-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .mobile-lang-hrs {
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--foreground);
    font-family: var(--font-display);
  }

  .mobile-lang-pct {
    font-size: 0.72rem;
    color: var(--muted-foreground);
    font-weight: 600;
  }

  /* Donut and Legend */
  .donut-wrap {
    min-height: 190px;
  }

  .top-languages-list {
    gap: 6px;
  }

  .lang-chip {
    font-size: 0.7rem;
    padding: 2px 6px;
  }

  /* Gauge & AI Metrics */
  .collaboration-gauge {
    padding: var(--space-3);
    margin-bottom: var(--space-4);
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
  }

  .gauge-labels {
    font-size: 0.72rem;
    flex-wrap: wrap;
    gap: 6px;
  }

  .ai-label,
  .human-label {
    white-space: normal;
    word-break: break-word;
  }

  .gauge-meta {
    font-size: 0.68rem;
  }

  .ai-metrics-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2);
  }

  .ai-metric-item {
    padding: var(--space-2);
    gap: var(--space-2);
  }

  .metric-icon {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
    flex-shrink: 0;
  }

  .metric-num {
    font-size: 0.95rem;
    white-space: nowrap;
  }

  .metric-desc {
    font-size: 0.65rem;
  }

  .ai-models-row {
    font-size: 0.7rem;
    gap: var(--space-2);
  }

  .model-chip {
    font-size: 0.68rem;
    padding: 2px 6px;
  }

  /* Leaderboard */
  .lang-row {
    padding: var(--space-2);
    gap: var(--space-2);
  }

  .lang-rank {
    width: 18px;
    font-size: 0.72rem;
  }

  .lang-row-name {
    font-size: 0.82rem;
  }

  .lang-badge {
    font-size: 0.62rem;
    padding: 1px 5px;
  }

  .lang-time {
    font-size: 0.75rem;
  }

  .lang-percent-badge {
    font-size: 0.68rem;
  }


}

@media (max-width: 380px) {
  .ai-metrics-grid {
    grid-template-columns: 1fr;
  }

  .kpi-value {
    font-size: 1.15rem;
  }

  .gauge-labels {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
}
</style>
