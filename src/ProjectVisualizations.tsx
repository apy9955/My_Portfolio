import { memo } from 'react'
import type { Repository } from './services/github'

/**
 * Unique Animated Data Visualizations for GitHub Repositories.
 * Built with accessible SVGs, CSS compositor animations, and zero fake results.
 */

// 1. Agentic AI Engineering Lab: Multi-Agent Workflow
export const AgenticPipelineVisualizer = memo(function AgenticPipelineVisualizer() {
  return (
    <div className="repo-visual-viewport" role="img" aria-label="Animated multi-agent AI orchestration workflow diagram">
      <div className="vis-badge">MULTI-AGENT PIPELINE</div>
      <svg className="vis-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="visAgentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#c0a2ff" />
          </linearGradient>
          <linearGradient id="visToolGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c0a2ff" />
            <stop offset="100%" stopColor="#f0b429" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1="20" y1="40" x2="320" y2="40" className="vis-grid-line" />
        <line x1="20" y1="80" x2="320" y2="80" className="vis-grid-line" />
        <line x1="20" y1="120" x2="320" y2="120" className="vis-grid-line" />

        {/* Connecting Paths */}
        {/* User Prompt -> Orchestrator */}
        <path d="M 45 80 C 75 80, 85 55, 110 55" className="vis-path-flow vis-cyan-flow" />
        {/* Orchestrator -> Tool Subagent */}
        <path d="M 135 55 C 165 55, 175 35, 205 35" className="vis-path-flow vis-purple-flow" />
        {/* Orchestrator -> Code Sandbox */}
        <path d="M 135 55 C 165 55, 175 125, 205 125" className="vis-path-flow vis-gold-flow" />
        {/* Tool -> Evaluator */}
        <path d="M 235 35 C 265 35, 275 80, 295 80" className="vis-path-flow vis-cyan-flow" />
        {/* Sandbox -> Evaluator */}
        <path d="M 235 125 C 265 125, 275 80, 295 80" className="vis-path-flow vis-gold-flow" />

        {/* Nodes */}
        {/* Prompt Node */}
        <g transform="translate(45, 80)">
          <circle r="14" fill="#0d1929" stroke="#00f0ff" strokeWidth="1.5" />
          <circle r="5" fill="#00f0ff" className="vis-pulse" />
          <text y="24" textAnchor="middle" className="vis-label">PROMPT</text>
        </g>

        {/* Orchestrator Node */}
        <g transform="translate(122, 55)">
          <circle r="20" fill="#14142b" stroke="url(#visAgentGrad)" strokeWidth="2" />
          <circle r="26" fill="none" stroke="#00f0ff40" strokeDasharray="3 3" className="vis-spin-slow" />
          <text y="4" textAnchor="middle" fill="#00f0ff" fontSize="9" fontWeight="700" fontFamily="var(--mono)">ORCH</text>
          <text y="32" textAnchor="middle" className="vis-label">PLANNER AGENT</text>
        </g>

        {/* Tool Subagent Node */}
        <g transform="translate(220, 35)">
          <rect x="-24" y="-12" width="48" height="24" rx="6" fill="#1c1335" stroke="#c0a2ff" strokeWidth="1.5" />
          <text y="3" textAnchor="middle" fill="#c0a2ff" fontSize="8" fontWeight="600" fontFamily="var(--mono)">TOOLS</text>
          <text y="23" textAnchor="middle" className="vis-label">SUBAGENT</text>
        </g>

        {/* Code Sandbox Node */}
        <g transform="translate(220, 125)">
          <rect x="-26" y="-12" width="52" height="24" rx="6" fill="#201a11" stroke="#f0b429" strokeWidth="1.5" />
          <text y="3" textAnchor="middle" fill="#f0b429" fontSize="8" fontWeight="600" fontFamily="var(--mono)">EXEC</text>
          <text y="23" textAnchor="middle" className="vis-label">SANDBOX</text>
        </g>

        {/* Evaluator Output Node */}
        <g transform="translate(295, 80)">
          <circle r="16" fill="#0d241c" stroke="#34d399" strokeWidth="1.8" />
          <circle r="7" fill="#34d399" className="vis-pulse" />
          <text y="26" textAnchor="middle" className="vis-label">RESULT</text>
        </g>
      </svg>
      <div className="vis-caption">Autonomous multi-agent orchestration & execution flow</div>
    </div>
  )
})

// 2. HR Analytics: Department-wise Attrition Analytics
export const HrAttritionVisualizer = memo(function HrAttritionVisualizer() {
  return (
    <div className="repo-visual-viewport" role="img" aria-label="Animated HR employee attrition and retention comparison chart">
      <div className="vis-badge">ATTRITION ANALYTICS</div>
      <svg className="vis-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="retainedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#005577" />
          </linearGradient>
          <linearGradient id="attritionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#882233" />
          </linearGradient>
        </defs>

        {/* Grid and benchmark line */}
        <line x1="30" y1="130" x2="310" y2="130" stroke="rgba(240, 246, 252, 0.2)" strokeWidth="1" />
        <line x1="30" y1="50" x2="310" y2="50" stroke="#f0b429" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
        <text x="305" y="45" textAnchor="end" fill="#f0b429" fontSize="8" fontFamily="var(--mono)">Target: 85% Retention</text>

        {/* Department 1: R&D */}
        <g transform="translate(55, 0)">
          <rect x="0" y="42" width="16" height="88" rx="3" fill="url(#retainedGrad)" className="vis-bar-grow-1" />
          <rect x="19" y="104" width="16" height="26" rx="3" fill="url(#attritionGrad)" className="vis-bar-grow-2" />
          <text x="17" y="145" textAnchor="middle" className="vis-label">R&D</text>
        </g>

        {/* Department 2: Sales */}
        <g transform="translate(125, 0)">
          <rect x="0" y="58" width="16" height="72" rx="3" fill="url(#retainedGrad)" className="vis-bar-grow-2" />
          <rect x="19" y="92" width="16" height="38" rx="3" fill="url(#attritionGrad)" className="vis-bar-grow-3" />
          <text x="17" y="145" textAnchor="middle" className="vis-label">Sales</text>
        </g>

        {/* Department 3: Engineering */}
        <g transform="translate(195, 0)">
          <rect x="0" y="32" width="16" height="98" rx="3" fill="url(#retainedGrad)" className="vis-bar-grow-3" />
          <rect x="19" y="112" width="16" height="18" rx="3" fill="url(#attritionGrad)" className="vis-bar-grow-1" />
          <text x="17" y="145" textAnchor="middle" className="vis-label">Eng</text>
        </g>

        {/* Department 4: HR */}
        <g transform="translate(265, 0)">
          <rect x="0" y="65" width="16" height="65" rx="3" fill="url(#retainedGrad)" className="vis-bar-grow-1" />
          <rect x="19" y="106" width="16" height="24" rx="3" fill="url(#attritionGrad)" className="vis-bar-grow-2" />
          <text x="17" y="145" textAnchor="middle" className="vis-label">HR</text>
        </g>

        {/* Legend */}
        <circle cx="45" cy="20" r="4" fill="#00f0ff" />
        <text x="54" y="23" fill="#cbd5e1" fontSize="8" fontFamily="var(--mono)">Retained</text>
        <circle cx="120" cy="20" r="4" fill="#f87171" />
        <text x="129" y="23" fill="#cbd5e1" fontSize="8" fontFamily="var(--mono)">Attrition Risk</text>
      </svg>
      <div className="vis-caption">Departmental workforce distribution & attrition factors</div>
    </div>
  )
})

// 3. E-commerce Sales Dashboard: Sales Trend & Revenue Breakdown
export const EcommerceDashboardVisualizer = memo(function EcommerceDashboardVisualizer() {
  return (
    <div className="repo-visual-viewport" role="img" aria-label="Animated E-Commerce sales trend line and revenue breakdown">
      <div className="vis-badge">SALES DASHBOARD</div>
      <svg className="vis-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="ecomAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="ecomLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="50%" stopColor="#c0a2ff" />
            <stop offset="100%" stopColor="#f0b429" />
          </linearGradient>
        </defs>

        {/* Background Grid */}
        <line x1="25" y1="125" x2="235" y2="125" className="vis-grid-line" />
        <line x1="25" y1="85" x2="235" y2="85" className="vis-grid-line" />
        <line x1="25" y1="45" x2="235" y2="45" className="vis-grid-line" />

        {/* Area fill */}
        <path d="M 30 115 Q 65 105, 95 85 T 150 70 T 195 45 T 235 32 L 235 125 L 30 125 Z" fill="url(#ecomAreaGrad)" />

        {/* Trend Line */}
        <path d="M 30 115 Q 65 105, 95 85 T 150 70 T 195 45 T 235 32" fill="none" stroke="url(#ecomLineGrad)" strokeWidth="2.5" className="vis-path-flow" />

        {/* Animated tracer point */}
        <circle cx="235" cy="32" r="5" fill="#f0b429" className="vis-pulse" />
        <circle cx="150" cy="70" r="3.5" fill="#c0a2ff" />
        <circle cx="95" cy="85" r="3.5" fill="#00f0ff" />

        {/* Time labels */}
        <text x="35" y="142" className="vis-label">Q1</text>
        <text x="100" y="142" className="vis-label">Q2</text>
        <text x="165" y="142" className="vis-label">Q3</text>
        <text x="230" y="142" className="vis-label">Q4</text>

        {/* Category Breakdown Bars on Right */}
        <g transform="translate(255, 30)">
          <text x="0" y="8" fill="#cbd5e1" fontSize="8" fontWeight="600" fontFamily="var(--mono)">CATEGORY</text>

          {/* Tech */}
          <text x="0" y="27" fill="#00f0ff" fontSize="7.5" fontFamily="var(--mono)">Tech 44%</text>
          <rect x="0" y="32" width="65" height="6" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="0" y="32" width="44" height="6" rx="2" fill="#00f0ff" className="vis-bar-grow-1" />

          {/* Fashion */}
          <text x="0" y="53" fill="#c0a2ff" fontSize="7.5" fontFamily="var(--mono)">Style 32%</text>
          <rect x="0" y="58" width="65" height="6" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="0" y="58" width="32" height="6" rx="2" fill="#c0a2ff" className="vis-bar-grow-2" />

          {/* Home */}
          <text x="0" y="79" fill="#f0b429" fontSize="7.5" fontFamily="var(--mono)">Home 24%</text>
          <rect x="0" y="84" width="65" height="6" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="0" y="84" width="24" height="6" rx="2" fill="#f0b429" className="vis-bar-grow-3" />
        </g>
      </svg>
      <div className="vis-caption">Interactive revenue stream & category distribution metrics</div>
    </div>
  )
})

// 4. Customer Segmentation System: K-Means Clustering Visualization
export const KMeansClusteringVisualizer = memo(function KMeansClusteringVisualizer() {
  return (
    <div className="repo-visual-viewport" role="img" aria-label="Animated K-Means clustering visualization with centroids and data points">
      <div className="vis-badge">K-MEANS CLUSTERING (k=3)</div>
      <svg className="vis-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {/* Subtle coordinate planes */}
        <line x1="20" y1="140" x2="320" y2="140" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="20" y1="20" x2="20" y2="140" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Cluster 1: High Spenders (Cyan) */}
        <g>
          {/* Centroid 1 */}
          <ellipse cx="85" cy="55" rx="42" ry="28" fill="#00f0ff0e" stroke="#00f0ff44" strokeDasharray="3 3" />
          <circle cx="85" cy="55" r="7" fill="#00f0ff" className="vis-pulse" />
          <circle cx="85" cy="55" r="13" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.4" />
          <text x="85" y="93" textAnchor="middle" fill="#00f0ff" fontSize="8" fontFamily="var(--mono)">High Value</text>

          {/* Drifting Cluster 1 Points */}
          <circle cx="65" cy="45" r="3.5" fill="#00f0ff" className="vis-float-1" />
          <circle cx="102" cy="48" r="3" fill="#00f0ff" className="vis-float-2" />
          <circle cx="75" cy="68" r="3" fill="#00f0ff" className="vis-float-3" />
          <circle cx="95" cy="62" r="3.5" fill="#00f0ff" className="vis-float-1" />
          <circle cx="80" cy="38" r="2.8" fill="#00f0ff" className="vis-float-2" />
        </g>

        {/* Cluster 2: Frequent / Loyal (Purple) */}
        <g>
          {/* Centroid 2 */}
          <ellipse cx="255" cy="50" rx="46" ry="26" fill="#c0a2ff0e" stroke="#c0a2ff44" strokeDasharray="3 3" />
          <circle cx="255" cy="50" r="7" fill="#c0a2ff" className="vis-pulse" />
          <circle cx="255" cy="50" r="13" fill="none" stroke="#c0a2ff" strokeWidth="1" opacity="0.4" />
          <text x="255" y="88" textAnchor="middle" fill="#c0a2ff" fontSize="8" fontFamily="var(--mono)">Loyal Core</text>

          {/* Drifting Cluster 2 Points */}
          <circle cx="230" cy="42" r="3.5" fill="#c0a2ff" className="vis-float-2" />
          <circle cx="275" cy="46" r="3" fill="#c0a2ff" className="vis-float-1" />
          <circle cx="245" cy="62" r="3" fill="#c0a2ff" className="vis-float-3" />
          <circle cx="268" cy="58" r="3.5" fill="#c0a2ff" className="vis-float-2" />
          <circle cx="282" cy="40" r="2.8" fill="#c0a2ff" className="vis-float-1" />
        </g>

        {/* Cluster 3: Selective / Occasional (Gold) */}
        <g>
          {/* Centroid 3 */}
          <ellipse cx="170" cy="115" rx="48" ry="22" fill="#f0b4290e" stroke="#f0b42944" strokeDasharray="3 3" />
          <circle cx="170" cy="115" r="7" fill="#f0b429" className="vis-pulse" />
          <circle cx="170" cy="115" r="13" fill="none" stroke="#f0b429" strokeWidth="1" opacity="0.4" />
          <text x="170" y="148" textAnchor="middle" fill="#f0b429" fontSize="8" fontFamily="var(--mono)">Selective</text>

          {/* Drifting Cluster 3 Points */}
          <circle cx="145" cy="110" r="3.5" fill="#f0b429" className="vis-float-3" />
          <circle cx="192" cy="118" r="3" fill="#f0b429" className="vis-float-1" />
          <circle cx="160" cy="124" r="3.5" fill="#f0b429" className="vis-float-2" />
          <circle cx="180" cy="108" r="2.8" fill="#f0b429" className="vis-float-3" />
        </g>
      </svg>
      <div className="vis-caption">Feature space clustering with iterative centroid convergence</div>
    </div>
  )
})

// 5. Heart Disease Prediction: Random Forest Decision Tree Architecture
export const RandomForestVisualizer = memo(function RandomForestVisualizer() {
  return (
    <div className="repo-visual-viewport" role="img" aria-label="Animated Random Forest decision tree model architecture">
      <div className="vis-badge">RANDOM FOREST ENSEMBLE</div>
      <svg className="vis-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {/* Tree Branches with Animated Flow */}
        {/* Root -> Left Branch */}
        <line x1="170" y1="28" x2="90" y2="70" className="vis-path-flow vis-cyan-flow" />
        {/* Root -> Right Branch */}
        <line x1="170" y1="28" x2="250" y2="70" className="vis-path-flow vis-purple-flow" />

        {/* Left -> Leaves */}
        <line x1="90" y1="70" x2="50" y2="115" className="vis-path-flow vis-cyan-flow" />
        <line x1="90" y1="70" x2="130" y2="115" className="vis-path-flow vis-gold-flow" />

        {/* Right -> Leaves */}
        <line x1="250" y1="70" x2="210" y2="115" className="vis-path-flow vis-gold-flow" />
        <line x1="250" y1="70" x2="290" y2="115" className="vis-path-flow vis-purple-flow" />

        {/* Root Node */}
        <g transform="translate(170, 28)">
          <rect x="-38" y="-12" width="76" height="24" rx="6" fill="#0f172a" stroke="#00f0ff" strokeWidth="1.5" />
          <text y="3" textAnchor="middle" fill="#00f0ff" fontSize="8" fontWeight="600" fontFamily="var(--mono)">MAX HR SPLIT</text>
        </g>

        {/* Level 1 Nodes */}
        <g transform="translate(90, 70)">
          <rect x="-34" y="-10" width="68" height="20" rx="5" fill="#1e1533" stroke="#c0a2ff" strokeWidth="1.3" />
          <text y="3" textAnchor="middle" fill="#c0a2ff" fontSize="7.5" fontWeight="600" fontFamily="var(--mono)">ST SLOPE</text>
        </g>
        <g transform="translate(250, 70)">
          <rect x="-36" y="-10" width="72" height="20" rx="5" fill="#1e1533" stroke="#c0a2ff" strokeWidth="1.3" />
          <text y="3" textAnchor="middle" fill="#c0a2ff" fontSize="7.5" fontWeight="600" fontFamily="var(--mono)">CHOLESTEROL</text>
        </g>

        {/* Leaf Nodes */}
        <g transform="translate(50, 115)">
          <circle r="10" fill="#0d241c" stroke="#34d399" strokeWidth="1.5" />
          <text y="3" textAnchor="middle" fill="#34d399" fontSize="7" fontWeight="700" fontFamily="var(--mono)">L1</text>
        </g>
        <g transform="translate(130, 115)">
          <circle r="10" fill="#2b1a1a" stroke="#f87171" strokeWidth="1.5" />
          <text y="3" textAnchor="middle" fill="#f87171" fontSize="7" fontWeight="700" fontFamily="var(--mono)">L2</text>
        </g>
        <g transform="translate(210, 115)">
          <circle r="10" fill="#0d241c" stroke="#34d399" strokeWidth="1.5" />
          <text y="3" textAnchor="middle" fill="#34d399" fontSize="7" fontWeight="700" fontFamily="var(--mono)">L3</text>
        </g>
        <g transform="translate(290, 115)">
          <circle r="10" fill="#2b1a1a" stroke="#f87171" strokeWidth="1.5" />
          <text y="3" textAnchor="middle" fill="#f87171" fontSize="7" fontWeight="700" fontFamily="var(--mono)">L4</text>
        </g>

        {/* Voting Synthesis Bar */}
        <text x="170" y="145" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="var(--mono)">Ensemble Decision: Majority Leaf Voting</text>
      </svg>
      <div className="vis-caption">Decision tree path convergence & multi-tree ensemble voting</div>
    </div>
  )
})

// 6. Calories Burnt App: Metabolic Prediction Pipeline & Radial Gauge
export const CaloriesBurnedVisualizer = memo(function CaloriesBurnedVisualizer() {
  return (
    <div className="repo-visual-viewport" role="img" aria-label="Animated XGBoost calories prediction pipeline and metabolic gauge">
      <div className="vis-badge">METABOLIC GAUGE & PIPELINE</div>
      <svg className="vis-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="50%" stopColor="#f0b429" />
            <stop offset="100%" stopColor="#f87171" />
          </linearGradient>
        </defs>

        {/* Input Feature Streams on Left */}
        <g transform="translate(20, 20)">
          <rect x="0" y="8" width="85" height="22" rx="5" fill="#0f172a" stroke="#00f0ff55" />
          <text x="8" y="22" fill="#00f0ff" fontSize="7.5" fontFamily="var(--mono)">Duration: 45m</text>

          <rect x="0" y="42" width="85" height="22" rx="5" fill="#0f172a" stroke="#c0a2ff55" />
          <text x="8" y="56" fill="#c0a2ff" fontSize="7.5" fontFamily="var(--mono)">HR: 148 bpm</text>

          <rect x="0" y="76" width="85" height="22" rx="5" fill="#0f172a" stroke="#f0b42955" />
          <text x="8" y="90" fill="#f0b429" fontSize="7.5" fontFamily="var(--mono)">Body Temp: 38°C</text>

          {/* Arrows into core */}
          <path d="M 88 19 L 135 55" className="vis-path-flow vis-cyan-flow" />
          <path d="M 88 53 L 135 55" className="vis-path-flow vis-purple-flow" />
          <path d="M 88 87 L 135 55" className="vis-path-flow vis-gold-flow" />
        </g>

        {/* XGBoost Processing Block */}
        <g transform="translate(140, 40)">
          <circle r="18" fill="#1e1533" stroke="#c0a2ff" strokeWidth="1.8" />
          <text y="4" textAnchor="middle" fill="#c0a2ff" fontSize="8" fontWeight="700" fontFamily="var(--mono)">XGB</text>
          <text y="28" textAnchor="middle" className="vis-label">REGRESSOR</text>
        </g>

        {/* Radial Gauge on Right */}
        <g transform="translate(250, 85)">
          {/* Gauge Background Track */}
          <path d="M -50 0 A 50 50 0 1 1 50 0" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" strokeLinecap="round" />
          {/* Gauge Active Progress */}
          <path d="M -50 0 A 50 50 0 1 1 35 -35" fill="none" stroke="url(#gaugeGrad)" strokeWidth="8" strokeLinecap="round" className="vis-gauge-arc" />

          {/* Needle */}
          <line x1="0" y1="0" x2="28" y2="-28" stroke="#f0f6fc" strokeWidth="2.5" strokeLinecap="round" className="vis-needle-pulse" />
          <circle cx="0" cy="0" r="6" fill="#00f0ff" />
          <circle cx="0" cy="0" r="2.5" fill="#010409" />

          {/* Gauge Readout */}
          <text y="24" textAnchor="middle" fill="#f0b429" fontSize="9" fontWeight="700" fontFamily="var(--mono)">CALORIC BURN</text>
          <text y="38" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="var(--mono)">DYNAMIC ESTIMATION</text>
        </g>
      </svg>
      <div className="vis-caption">Feature stream transformation into continuous metabolic prediction</div>
    </div>
  )
})

// 7. Delhi House Price Predictor: Property Feature Comparison & Regression
export const HousePriceVisualizer = memo(function HousePriceVisualizer() {
  return (
    <div className="repo-visual-viewport" role="img" aria-label="Animated Delhi house price regression flow and tier comparison">
      <div className="vis-badge">PRICE REGRESSION MODEL</div>
      <svg className="vis-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="houseBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#004466" />
          </linearGradient>
        </defs>

        {/* Axis & Baseline */}
        <line x1="25" y1="125" x2="185" y2="125" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

        {/* Property Tier Bars */}
        <g transform="translate(35, 0)">
          <rect x="0" y="85" width="22" height="40" rx="3" fill="url(#houseBarGrad)" className="vis-bar-grow-1" />
          <text x="11" y="140" textAnchor="middle" className="vis-label">1 BHK</text>
        </g>
        <g transform="translate(70, 0)">
          <rect x="0" y="65" width="22" height="60" rx="3" fill="url(#houseBarGrad)" className="vis-bar-grow-2" />
          <text x="11" y="140" textAnchor="middle" className="vis-label">2 BHK</text>
        </g>
        <g transform="translate(105, 0)">
          <rect x="0" y="45" width="22" height="80" rx="3" fill="url(#houseBarGrad)" className="vis-bar-grow-3" />
          <text x="11" y="140" textAnchor="middle" className="vis-label">3 BHK</text>
        </g>
        <g transform="translate(140, 0)">
          <rect x="0" y="25" width="22" height="100" rx="3" fill="url(#houseBarGrad)" className="vis-bar-grow-1" />
          <text x="11" y="140" textAnchor="middle" className="vis-label">Villa</text>
        </g>

        {/* Regression Fit Slope Line */}
        <line x1="40" y1="95" x2="160" y2="35" stroke="#f0b429" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="160" cy="35" r="4" fill="#f0b429" className="vis-pulse" />

        {/* Feature Importance Weights on Right */}
        <g transform="translate(205, 25)">
          <text x="0" y="10" fill="#cbd5e1" fontSize="8" fontWeight="600" fontFamily="var(--mono)">FEATURE WEIGHTS</text>

          {/* Area */}
          <text x="0" y="30" fill="#00f0ff" fontSize="7" fontFamily="var(--mono)">Carpet Area (Sq Ft)</text>
          <rect x="0" y="35" width="115" height="5" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="0" y="35" width="98" height="5" rx="2" fill="#00f0ff" className="vis-bar-grow-1" />

          {/* Locality */}
          <text x="0" y="55" fill="#c0a2ff" fontSize="7" fontFamily="var(--mono)">Locality Rating</text>
          <rect x="0" y="60" width="115" height="5" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="0" y="60" width="76" height="5" rx="2" fill="#c0a2ff" className="vis-bar-grow-2" />

          {/* Bathrooms / Metro */}
          <text x="0" y="80" fill="#f0b429" fontSize="7" fontFamily="var(--mono)">Metro Proximity</text>
          <rect x="0" y="85" width="115" height="5" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="0" y="85" width="58" height="5" rx="2" fill="#f0b429" className="vis-bar-grow-3" />

          <text x="0" y="110" fill="#94a3b8" fontSize="7" fontFamily="var(--mono)">Output: INR Valuation Flow</text>
        </g>
      </svg>
      <div className="vis-caption">Feature weighting and regression curve across property classes</div>
    </div>
  )
})

// 8. Sales Prediction ML: Historical vs. Predicted Forecast Horizon
export const SalesPredictionVisualizer = memo(function SalesPredictionVisualizer() {
  return (
    <div className="repo-visual-viewport" role="img" aria-label="Animated historical vs. predicted sales forecasting horizon">
      <div className="vis-badge">FORECAST HORIZON</div>
      <svg className="vis-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="forecastArea" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c0a2ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#c0a2ff" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1="25" y1="130" x2="315" y2="130" className="vis-grid-line" />
        <line x1="25" y1="85" x2="315" y2="85" className="vis-grid-line" />

        {/* Forecast Horizon Boundary */}
        <line x1="170" y1="20" x2="170" y2="130" stroke="#f0b429" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />
        <text x="165" y="32" textAnchor="end" fill="#f0b429" fontSize="7.5" fontFamily="var(--mono)">HISTORICAL</text>
        <text x="175" y="32" textAnchor="start" fill="#c0a2ff" fontSize="7.5" fontFamily="var(--mono)">PREDICTED (95% CI)</text>

        {/* Historical Solid Line (Cyan) */}
        <path d="M 30 110 Q 60 75, 95 90 T 140 65 T 170 75" fill="none" stroke="#00f0ff" strokeWidth="2.5" />
        <circle cx="30" cy="110" r="3" fill="#00f0ff" />
        <circle cx="95" cy="90" r="3" fill="#00f0ff" />
        <circle cx="140" cy="65" r="3" fill="#00f0ff" />
        <circle cx="170" cy="75" r="4" fill="#00f0ff" />

        {/* Confidence Interval Ribbon */}
        <path d="M 170 75 Q 210 50, 250 40 T 310 25 L 310 65 Q 250 75, 210 85 T 170 75 Z" fill="url(#forecastArea)" />

        {/* Predicted Dashed Forecast Curve (Purple) */}
        <path d="M 170 75 Q 210 62, 250 55 T 310 42" fill="none" stroke="#c0a2ff" strokeWidth="2.2" strokeDasharray="4 4" className="vis-path-flow" />

        {/* Animated Moving Frontier Point */}
        <circle cx="310" cy="42" r="5" fill="#c0a2ff" className="vis-pulse" />

        {/* Legend */}
        <text x="30" y="145" fill="#64748b" fontSize="7.5" fontFamily="var(--mono)">T - 12M</text>
        <text x="170" y="145" textAnchor="middle" fill="#f0b429" fontSize="7.5" fontFamily="var(--mono)">Current Date</text>
        <text x="310" y="145" textAnchor="end" fill="#c0a2ff" fontSize="7.5" fontFamily="var(--mono)">T + 6M Projection</text>
      </svg>
      <div className="vis-caption">Historical baseline connected to projected forecast confidence corridor</div>
    </div>
  )
})

// 9. Diabetes Prediction ML: Biomarker Classification Pipeline
export const DiabetesPredictionVisualizer = memo(function DiabetesPredictionVisualizer() {
  return (
    <div className="repo-visual-viewport" role="img" aria-label="Animated biomarker classification pipeline for diabetes prediction">
      <div className="vis-badge">BIOMARKER PIPELINE</div>
      <svg className="vis-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {/* Stage 1: Input Biomarkers */}
        <g transform="translate(25, 30)">
          <rect x="0" y="0" width="58" height="100" rx="6" fill="#0f172a" stroke="#00f0ff50" />
          <text x="29" y="18" textAnchor="middle" fill="#00f0ff" fontSize="7.5" fontWeight="700" fontFamily="var(--mono)">INPUTS</text>
          <text x="10" y="38" fill="#94a3b8" fontSize="7" fontFamily="var(--mono)">Glucose</text>
          <text x="10" y="54" fill="#94a3b8" fontSize="7" fontFamily="var(--mono)">BMI</text>
          <text x="10" y="70" fill="#94a3b8" fontSize="7" fontFamily="var(--mono)">Insulin</text>
          <text x="10" y="86" fill="#94a3b8" fontSize="7" fontFamily="var(--mono)">Age</text>
        </g>

        {/* Flow 1 -> 2 */}
        <path d="M 85 80 L 115 80" className="vis-path-flow vis-cyan-flow" strokeWidth="2" />

        {/* Stage 2: Normalization / Scaler */}
        <g transform="translate(115, 52)">
          <rect x="0" y="0" width="58" height="56" rx="6" fill="#141a2e" stroke="#c0a2ff" strokeWidth="1.2" />
          <text x="29" y="22" textAnchor="middle" fill="#c0a2ff" fontSize="7.5" fontWeight="700" fontFamily="var(--mono)">SCALER</text>
          <text x="29" y="36" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="var(--mono)">StandardScaler</text>
          <text x="29" y="47" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="var(--mono)">Imputer</text>
        </g>

        {/* Flow 2 -> 3 */}
        <path d="M 175 80 L 205 80" className="vis-path-flow vis-purple-flow" strokeWidth="2" />

        {/* Stage 3: Ensemble Classifier */}
        <g transform="translate(205, 50)">
          <rect x="0" y="0" width="60" height="60" rx="6" fill="#20152b" stroke="#f0b429" strokeWidth="1.5" />
          <circle cx="30" cy="22" r="8" fill="#f0b42922" stroke="#f0b429" />
          <text x="30" y="25" textAnchor="middle" fill="#f0b429" fontSize="7" fontWeight="700" fontFamily="var(--mono)">GBM</text>
          <text x="30" y="45" textAnchor="middle" fill="#f0b429" fontSize="7" fontWeight="600" fontFamily="var(--mono)">CLASSIFIER</text>
        </g>

        {/* Flow 3 -> 4 */}
        <path d="M 267 80 L 292 80" className="vis-path-flow vis-gold-flow" strokeWidth="2" />

        {/* Stage 4: Probability Calibration & Outcome */}
        <g transform="translate(295, 80)">
          <circle r="16" fill="#0d241c" stroke="#34d399" strokeWidth="1.8" />
          <circle r="7" fill="#34d399" className="vis-pulse" />
          <text y="28" textAnchor="middle" fill="#34d399" fontSize="7.5" fontWeight="700" fontFamily="var(--mono)">RISK SCORE</text>
        </g>
      </svg>
      <div className="vis-caption">Sequential biomarker normalization, feature scaling & classification</div>
    </div>
  )
})

// 10. Sales Revenue Analysis Dashboard: Tableau Regional Revenue & KPI
export const SalesRevenueTableauVisualizer = memo(function SalesRevenueTableauVisualizer() {
  return (
    <div className="repo-visual-viewport" role="img" aria-label="Animated Tableau sales and revenue KPI dashboard">
      <div className="vis-badge">TABLEAU KPI DASHBOARD</div>
      <svg className="vis-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="tableauGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0b429" />
            <stop offset="100%" stopColor="#b47d0e" />
          </linearGradient>
        </defs>

        {/* Mini KPI Cards at Top */}
        <g transform="translate(25, 16)">
          <rect x="0" y="0" width="85" height="28" rx="4" fill="#0f172a" stroke="rgba(255,255,255,0.08)" />
          <text x="8" y="12" fill="#94a3b8" fontSize="6.5" fontFamily="var(--mono)">Gross Margin</text>
          <text x="8" y="24" fill="#00f0ff" fontSize="9" fontWeight="700" fontFamily="var(--mono)">38.4%</text>

          <rect x="100" y="0" width="85" height="28" rx="4" fill="#0f172a" stroke="rgba(255,255,255,0.08)" />
          <text x="108" y="12" fill="#94a3b8" fontSize="6.5" fontFamily="var(--mono)">YoY Growth</text>
          <text x="108" y="24" fill="#34d399" fontSize="9" fontWeight="700" fontFamily="var(--mono)">+18.2%</text>

          <rect x="200" y="0" width="90" height="28" rx="4" fill="#0f172a" stroke="rgba(255,255,255,0.08)" />
          <text x="208" y="12" fill="#94a3b8" fontSize="6.5" fontFamily="var(--mono)">Target Variance</text>
          <text x="208" y="24" fill="#f0b429" fontSize="9" fontWeight="700" fontFamily="var(--mono)">+6.8%</text>
        </g>

        {/* Regional Revenue Columns */}
        <line x1="25" y1="130" x2="315" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

        <g transform="translate(50, 0)">
          <rect x="0" y="60" width="30" height="70" rx="3" fill="url(#tableauGrad)" className="vis-bar-grow-1" />
          <text x="15" y="144" textAnchor="middle" className="vis-label">North</text>
        </g>
        <g transform="translate(120, 0)">
          <rect x="0" y="48" width="30" height="82" rx="3" fill="#00f0ff" className="vis-bar-grow-2" />
          <text x="15" y="144" textAnchor="middle" className="vis-label">West</text>
        </g>
        <g transform="translate(190, 0)">
          <rect x="0" y="72" width="30" height="58" rx="3" fill="#c0a2ff" className="vis-bar-grow-3" />
          <text x="15" y="144" textAnchor="middle" className="vis-label">South</text>
        </g>
        <g transform="translate(260, 0)">
          <rect x="0" y="54" width="30" height="76" rx="3" fill="#34d399" className="vis-bar-grow-1" />
          <text x="15" y="144" textAnchor="middle" className="vis-label">East</text>
        </g>
      </svg>
      <div className="vis-caption">Regional performance metrics, sales margins & variance indicators</div>
    </div>
  )
})

// 11. C++ / Algorithms / LeetCode Visualizer (Systems, C++, DSA)
export const CppAlgorithmsVisualizer = memo(function CppAlgorithmsVisualizer() {
  return (
    <div className="repo-visual-viewport" role="img" aria-label="Animated C++ data structures and algorithmic execution stack">
      <div className="vis-badge">ALGORITHMS & SYSTEMS</div>
      <svg className="vis-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {/* Memory Call Stack on Left */}
        <g transform="translate(25, 25)">
          <text x="0" y="8" fill="#cbd5e1" fontSize="7.5" fontWeight="600" fontFamily="var(--mono)">CALL STACK</text>
          <rect x="0" y="16" width="70" height="20" rx="3" fill="#141a2e" stroke="#00f0ff" strokeWidth="1.2" />
          <text x="35" y="29" textAnchor="middle" fill="#00f0ff" fontSize="7" fontFamily="var(--mono)">solve()</text>

          <rect x="0" y="40" width="70" height="20" rx="3" fill="#141a2e" stroke="#c0a2ff" strokeWidth="1.2" />
          <text x="35" y="53" textAnchor="middle" fill="#c0a2ff" fontSize="7" fontFamily="var(--mono)">partition()</text>

          <rect x="0" y="64" width="70" height="20" rx="3" fill="#141a2e" stroke="#f0b429" strokeWidth="1.2" />
          <text x="35" y="77" textAnchor="middle" fill="#f0b429" fontSize="7" fontFamily="var(--mono)">recurse()</text>

          <rect x="0" y="88" width="70" height="20" rx="3" fill="#0f172a" stroke="rgba(255,255,255,0.15)" />
          <text x="35" y="101" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="var(--mono)">main()</text>
        </g>

        {/* Binary Search Tree / Graph Traversal in Center */}
        <g transform="translate(130, 20)">
          {/* Tree Edges */}
          <line x1="85" y1="20" x2="45" y2="55" className="vis-path-flow vis-cyan-flow" />
          <line x1="85" y1="20" x2="125" y2="55" className="vis-path-flow vis-purple-flow" />
          <line x1="45" y1="55" x2="25" y2="90" className="vis-path-flow vis-cyan-flow" />
          <line x1="45" y1="55" x2="65" y2="90" className="vis-path-flow vis-gold-flow" />

          {/* Root */}
          <circle cx="85" cy="20" r="12" fill="#0f172a" stroke="#00f0ff" strokeWidth="1.8" />
          <text x="85" y="23" textAnchor="middle" fill="#00f0ff" fontSize="7.5" fontFamily="var(--mono)">42</text>

          {/* Nodes */}
          <circle cx="45" cy="55" r="10" fill="#181329" stroke="#c0a2ff" strokeWidth="1.5" />
          <text x="45" y="58" textAnchor="middle" fill="#c0a2ff" fontSize="7" fontFamily="var(--mono)">21</text>

          <circle cx="125" cy="55" r="10" fill="#181329" stroke="#c0a2ff" strokeWidth="1.5" />
          <text x="125" y="58" textAnchor="middle" fill="#c0a2ff" fontSize="7" fontFamily="var(--mono)">67</text>

          <circle cx="25" cy="90" r="8" fill="#0d241c" stroke="#34d399" strokeWidth="1.5" />
          <text x="25" y="93" textAnchor="middle" fill="#34d399" fontSize="6.5" fontFamily="var(--mono)">14</text>

          <circle cx="65" cy="90" r="8" fill="#201a11" stroke="#f0b429" strokeWidth="1.5" />
          <text x="65" y="93" textAnchor="middle" fill="#f0b429" fontSize="6.5" fontFamily="var(--mono)">28</text>

          {/* Memory Pointer Tracker */}
          <text x="85" y="125" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="var(--mono)">ptr: 0x7ffd98e2</text>
        </g>
      </svg>
      <div className="vis-caption">Dynamic data structures, tree search & memory layout visualization</div>
    </div>
  )
})

// 12. Data Science & Jupyter Notebook Visualizer
export const DataScienceNotebookVisualizer = memo(function DataScienceNotebookVisualizer() {
  return (
    <div className="repo-visual-viewport" role="img" aria-label="Animated data science correlation matrix and statistical distribution">
      <div className="vis-badge">DATA SCIENCE & EXPLORATION</div>
      <svg className="vis-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {/* Heatmap Grid on Left */}
        <g transform="translate(35, 25)">
          <text x="0" y="0" fill="#cbd5e1" fontSize="7.5" fontWeight="600" fontFamily="var(--mono)">CORRELATION HEATMAP</text>

          {/* Row 1 */}
          <rect x="0" y="10" width="22" height="22" fill="#00f0ff" opacity="0.9" rx="2" />
          <rect x="25" y="10" width="22" height="22" fill="#00f0ff" opacity="0.4" rx="2" />
          <rect x="50" y="10" width="22" height="22" fill="#c0a2ff" opacity="0.6" rx="2" />
          <rect x="75" y="10" width="22" height="22" fill="#f0b429" opacity="0.3" rx="2" />

          {/* Row 2 */}
          <rect x="0" y="35" width="22" height="22" fill="#00f0ff" opacity="0.4" rx="2" />
          <rect x="25" y="35" width="22" height="22" fill="#00f0ff" opacity="0.95" rx="2" />
          <rect x="50" y="35" width="22" height="22" fill="#c0a2ff" opacity="0.25" rx="2" />
          <rect x="75" y="35" width="22" height="22" fill="#f87171" opacity="0.5" rx="2" />

          {/* Row 3 */}
          <rect x="0" y="60" width="22" height="22" fill="#c0a2ff" opacity="0.6" rx="2" />
          <rect x="25" y="60" width="22" height="22" fill="#c0a2ff" opacity="0.25" rx="2" />
          <rect x="50" y="60" width="22" height="22" fill="#00f0ff" opacity="0.9" rx="2" />
          <rect x="75" y="60" width="22" height="22" fill="#34d399" opacity="0.7" rx="2" />

          {/* Row 4 */}
          <rect x="0" y="85" width="22" height="22" fill="#f0b429" opacity="0.3" rx="2" />
          <rect x="25" y="85" width="22" height="22" fill="#f87171" opacity="0.5" rx="2" />
          <rect x="50" y="85" width="22" height="22" fill="#34d399" opacity="0.7" rx="2" />
          <rect x="75" y="85" width="22" height="22" fill="#00f0ff" opacity="0.9" rx="2" />
        </g>

        {/* Normal Distribution Bell Curve on Right */}
        <g transform="translate(175, 25)">
          <text x="0" y="0" fill="#cbd5e1" fontSize="7.5" fontWeight="600" fontFamily="var(--mono)">NORMAL DISTRIBUTION</text>
          <line x1="0" y1="105" x2="135" y2="105" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* Bell Curve */}
          <path d="M 5 105 Q 40 105, 55 70 T 70 25 T 85 70 Q 100 105, 130 105" fill="none" stroke="#00f0ff" strokeWidth="2" />
          <path d="M 5 105 Q 40 105, 55 70 T 70 25 T 85 70 Q 100 105, 130 105 Z" fill="#00f0ff14" />

          {/* Mean line */}
          <line x1="70" y1="25" x2="70" y2="105" stroke="#f0b429" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="70" cy="25" r="3.5" fill="#f0b429" className="vis-pulse" />
          <text x="70" y="118" textAnchor="middle" fill="#f0b429" fontSize="7" fontFamily="var(--mono)">μ (Mean)</text>
        </g>
      </svg>
      <div className="vis-caption">Empirical covariance analysis & probability distribution modeling</div>
    </div>
  )
})

// 13. General Code / Script Visualizer
export const GeneralCodeVisualizer = memo(function GeneralCodeVisualizer() {
  return (
    <div className="repo-visual-viewport" role="img" aria-label="Animated code syntax parsing and execution pipeline">
      <div className="vis-badge">SYNTAX & EXECUTION STREAM</div>
      <svg className="vis-svg" viewBox="0 0 340 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {/* Code token lines */}
        <g transform="translate(30, 25)">
          <rect x="0" y="8" width="45" height="7" rx="2" fill="#c0a2ff" />
          <rect x="52" y="8" width="70" height="7" rx="2" fill="#00f0ff" />
          <rect x="128" y="8" width="30" height="7" rx="2" fill="#f0b429" />

          <rect x="15" y="24" width="35" height="7" rx="2" fill="#94a3b8" />
          <rect x="56" y="24" width="85" height="7" rx="2" fill="#34d399" />

          <rect x="15" y="40" width="55" height="7" rx="2" fill="#00f0ff" />
          <rect x="76" y="40" width="40" height="7" rx="2" fill="#f0b429" />

          <rect x="30" y="56" width="90" height="7" rx="2" fill="#c0a2ff" />
          <rect x="126" y="56" width="35" height="7" rx="2" fill="#34d399" />

          <rect x="15" y="72" width="45" height="7" rx="2" fill="#f87171" />

          <rect x="0" y="88" width="40" height="7" rx="2" fill="#c0a2ff" />
        </g>

        {/* Execution Pipeline on Right */}
        <g transform="translate(225, 25)">
          <text x="0" y="8" fill="#cbd5e1" fontSize="7.5" fontWeight="600" fontFamily="var(--mono)">EXECUTION</text>

          <circle cx="20" cy="35" r="14" fill="#0f172a" stroke="#00f0ff" strokeWidth="1.5" />
          <text x="20" y="38" textAnchor="middle" fill="#00f0ff" fontSize="7.5" fontFamily="var(--mono)">PARSER</text>

          <line x1="20" y1="50" x2="20" y2="68" className="vis-path-flow vis-cyan-flow" strokeWidth="1.5" />

          <circle cx="20" cy="85" r="14" fill="#181329" stroke="#c0a2ff" strokeWidth="1.5" />
          <text x="20" y="88" textAnchor="middle" fill="#c0a2ff" fontSize="7.5" fontFamily="var(--mono)">RUN</text>

          <circle cx="20" cy="85" r="20" fill="none" stroke="#c0a2ff40" strokeDasharray="3 3" className="vis-spin-slow" />
        </g>
      </svg>
      <div className="vis-caption">Lexical tokenization, abstract syntax tree & runtime stream</div>
    </div>
  )
})

/**
 * Main Repository Visualization Dispatcher
 * Selects the optimal animated visualization matching each repository's domain.
 */
export function RepoVisualization({ repo }: { repo: Repository }) {
  const name = repo.name.toLowerCase()

  // 1. Specific Named Repositories (Exact Match)
  if (name === 'agentic-ai-engineering-lab') return <AgenticPipelineVisualizer />
  if (name === 'hr-analytics-ml') return <HrAttritionVisualizer />
  if (name === 'ecommerce-sales-dashboard') return <EcommerceDashboardVisualizer />
  if (name === 'customer-segmentation-system') return <KMeansClusteringVisualizer />
  if (name === 'heart-disease-app') return <RandomForestVisualizer />
  if (name === 'calories-burnt-app') return <CaloriesBurnedVisualizer />
  if (name === 'delhi-house-price-predictor') return <HousePriceVisualizer />
  if (name === 'sales-prediction-ml') return <SalesPredictionVisualizer />
  if (name === 'diabetes-prediction-ml') return <DiabetesPredictionVisualizer />
  if (name === 'sales-revenue-analysis-dashboard') return <SalesRevenueTableauVisualizer />

  // 2. Clustered / Segmentation Notebooks
  if (name.includes('customer') || name.includes('segmentation') || name.includes('mall_customers')) {
    return <KMeansClusteringVisualizer />
  }

  // 3. Sales / Business / Analytics
  if (name.includes('sales') || name.includes('revenue') || name.includes('supermarket') || name.includes('advertising')) {
    return <EcommerceDashboardVisualizer />
  }

  // 4. Prediction / Forecasting / Regression
  if (name.includes('predict') || name.includes('price') || name.includes('performance')) {
    return <SalesPredictionVisualizer />
  }

  // 5. C++ / DSA / LeetCode / Low Level
  if (repo.language === 'C++' || repo.language === 'C' || name.includes('leetcode')) {
    return <CppAlgorithmsVisualizer />
  }

  // 6. Jupyter Notebooks / Data Science / EDA
  if (repo.language === 'Jupyter Notebook' || name.includes('analysis') || name.includes('data')) {
    return <DataScienceNotebookVisualizer />
  }

  // 7. General Python / Code / Web
  return <GeneralCodeVisualizer />
}
