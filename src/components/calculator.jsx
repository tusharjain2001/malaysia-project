import React, { useState, useEffect, useRef } from "react";
import { SectionHeader } from "./chrome.jsx";

// Live cost & timeline calculator. Sliders + mode selector → animated price + Gantt.

const ROUTES = {
  "Sydney, Australia":       { code: "SYD", airDays: [8, 11],  seaDays: [24, 34], baseSea: 9800,  baseAir: 24500, distanceKm: 6600 },
  "London, United Kingdom":  { code: "LHR", airDays: [9, 12],  seaDays: [35, 45], baseSea: 11500, baseAir: 27500, distanceKm: 10500 },
  "Singapore":               { code: "SIN", airDays: [2, 4],   seaDays: [7, 12],  baseSea: 4200,  baseAir: 9800,  distanceKm: 1500 },
  "Toronto, Canada":         { code: "YYZ", airDays: [10, 13], seaDays: [38, 48], baseSea: 12800, baseAir: 29500, distanceKm: 14800 },
  "San Francisco, USA":      { code: "SFO", airDays: [9, 12],  seaDays: [26, 36], baseSea: 10200, baseAir: 25800, distanceKm: 13100 },
};

const ORIGIN_CODES = {
  "Kuala Lumpur, Malaysia": { code: "KUL", city: "Kuala Lumpur" },
  "Penang, Malaysia":       { code: "PEN", city: "Penang" },
  "Johor Bahru, Malaysia":  { code: "JHB", city: "Johor Bahru" },
};

const MODES = [
  { id: "air",     label: "Air freight",          tag: "Fastest",       speedMul: 1.0,  costMul: 2.6 },
  { id: "express", label: "Express courier",      tag: "Door 5–8 days", speedMul: 0.85, costMul: 3.4 },
  { id: "fcl",     label: "Sea — Full container", tag: "Best for full home", speedMul: 1.0, costMul: 1.0 },
  { id: "lcl",     label: "Sea — Shared (LCL)",   tag: "Most affordable", speedMul: 1.08, costMul: 0.72 },
  { id: "combo",   label: "Air + sea combo",      tag: "Essentials first", speedMul: 0.95, costMul: 1.55 },
];

function useAnimatedNumber(target, ms = 600) {
  const [v, setV] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(performance.now());
  useEffect(() => {
    fromRef.current = v;
    startRef.current = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - startRef.current) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(fromRef.current + (target - fromRef.current) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

function GanttTimeline({ phases, totalDays }) {
  return (
    <div className="gantt">
      <div className="gantt-scale mono">
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <span key={p} style={{ left: `${p * 100}%` }}>
            {Math.round(p * totalDays)}d
          </span>
        ))}
      </div>
      <div className="gantt-rows">
        {phases.map((ph, i) => (
          <div key={i} className="gantt-row">
            <div className="gantt-label">
              <span className="mono gantt-num">{String(i + 1).padStart(2, "0")}</span>
              <span>{ph.name}</span>
            </div>
            <div className="gantt-bar-track">
              <div
                className="gantt-bar"
                style={{
                  left: `${(ph.start / totalDays) * 100}%`,
                  width: `${((ph.end - ph.start) / totalDays) * 100}%`,
                  background: ph.color || "var(--ink)",
                }}
              >
                <span className="gantt-bar-lbl mono">{ph.end - ph.start}d</span>
              </div>
            </div>
            <div className="gantt-meta mono">D{ph.start}–D{ph.end}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Calculator({ quoteState, setQuoteState }) {
  const [mode, setMode] = useState("fcl");
  const [volume, setVolume] = useState(35);
  const [insurance, setInsurance] = useState(true);
  const [packing, setPacking] = useState("full");
  const [unpacking, setUnpacking] = useState(true);

  const route = ROUTES[quoteState.dest] || ROUTES["Sydney, Australia"];
  const origin = ORIGIN_CODES[quoteState.origin] || ORIGIN_CODES["Kuala Lumpur, Malaysia"];
  const m = MODES.find((x) => x.id === mode);

  // Cost build-up
  const baseFreight = mode.startsWith("air") || mode === "express" || mode === "combo"
    ? route.baseAir * 0.55
    : route.baseSea;
  const volFactor = volume / 35;
  const freight = Math.round(baseFreight * m.costMul * volFactor);
  const originSvc = Math.round((packing === "full" ? 1200 : packing === "fragile" ? 700 : 380) * (volume / 35));
  const destSvc = unpacking ? Math.round(620 * (volume / 35)) : 0;
  const customs = 540;
  const ins = insurance ? Math.round(freight * 0.025 + 180) : 0;
  const total = freight + originSvc + destSvc + customs + ins;
  const totalAnim = useAnimatedNumber(total);

  // Timeline build-up
  const isAir = mode === "air" || mode === "express";
  const isCombo = mode === "combo";
  const transitMin = isAir ? route.airDays[0] : route.seaDays[0];
  const transitMax = isAir ? route.airDays[1] : route.seaDays[1];
  const transitDays = Math.round((transitMin + transitMax) / 2 * m.speedMul);

  const phases = [
    { name: "Survey & quote", start: 0, end: 3, color: "var(--sage)" },
    { name: "Pack & inventory", start: 3, end: packing === "full" ? 6 : 5, color: "var(--ink)" },
    { name: "Origin customs", start: packing === "full" ? 6 : 5, end: (packing === "full" ? 6 : 5) + 2, color: "var(--muted)" },
    { name: isAir ? "Air freight transit" : isCombo ? "Sea + air transit" : "Sea freight transit",
      start: (packing === "full" ? 6 : 5) + 2,
      end: (packing === "full" ? 6 : 5) + 2 + transitDays,
      color: "var(--accent)" },
    { name: "Destination customs",
      start: (packing === "full" ? 6 : 5) + 2 + transitDays,
      end: (packing === "full" ? 6 : 5) + 2 + transitDays + 3, color: "var(--muted)" },
    { name: "Delivery & unpack",
      start: (packing === "full" ? 6 : 5) + 2 + transitDays + 3,
      end: (packing === "full" ? 6 : 5) + 2 + transitDays + 3 + (unpacking ? 2 : 1), color: "var(--ink)" },
  ];
  const totalDays = phases[phases.length - 1].end;

  return (
    <section className="band paper calc-band" id="calculator">
      <div className="wrap">
        <SectionHeader
          kicker="LIVE CALCULATOR · 03"
          title="Real-time shipping cost & timeline."
          lede="Every number is computed from current carrier rates, port congestion, and customs lead times. Adjust the move and watch the estimate move with you."
        />

        <div className="calc-shell mt-48">
          <aside className="calc-controls card">
            <div className="calc-route">
              <div className="route-side">
                <div className="text-mono-sm">ORIGIN</div>
                <div className="route-code mono">{origin.code}</div>
                <div className="muted">{origin.city}</div>
              </div>
              <div className="route-line">
                <svg viewBox="0 0 120 24" preserveAspectRatio="none" width="100%" height="24">
                  <path d="M2 12 L118 12" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" />
                  <circle cx="2" cy="12" r="2" fill="currentColor" />
                  <path d="M115 8 L120 12 L115 16" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
                <div className="mono route-distance">{route.distanceKm.toLocaleString()} km · {isAir ? "air" : isCombo ? "multi-modal" : "sea"}</div>
              </div>
              <div className="route-side">
                <div className="text-mono-sm">DESTINATION</div>
                <div className="route-code mono">{route.code}</div>
                <div className="dest-select-wrap">
                  <select
                    className="dest-select muted"
                    value={quoteState.dest}
                    onChange={(e) => setQuoteState((s) => ({ ...s, dest: e.target.value }))}
                  >
                    {Object.keys(ROUTES).map((k) => (
                      <option key={k} value={k}>{k.split(",")[0]}</option>
                    ))}
                  </select>
                  <span className="dest-select-arrow">▾</span>
                </div>
              </div>
            </div>

            <hr className="hr mt-24" />

            <div className="ctrl-grp">
              <div className="ctrl-h">Mode</div>
              <div className="mode-list">
                {MODES.map((x) => (
                  <button
                    key={x.id}
                    className={"mode-btn" + (mode === x.id ? " active" : "")}
                    onClick={() => setMode(x.id)}
                  >
                    <div className="mode-name">{x.label}</div>
                    <div className="mode-tag mono">{x.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="ctrl-grp">
              <div className="between">
                <div className="ctrl-h">Volume</div>
                <div className="mono ctrl-val">{volume} m³</div>
              </div>
              <input className="range" type="range" min="8" max="80" step="1"
                value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
              <div className="range-scale mono">
                <span>Studio</span><span>1-bed</span><span>2-bed</span><span>3-bed</span><span>4-bed+</span>
              </div>
            </div>

            <div className="ctrl-grp">
              <div className="ctrl-h">Origin services</div>
              <div className="seg">
                {[
                  { id: "self", lbl: "Self pack" },
                  { id: "fragile", lbl: "Fragile only" },
                  { id: "full", lbl: "Full pack" },
                ].map((o) => (
                  <button key={o.id} className={packing === o.id ? "on" : ""} onClick={() => setPacking(o.id)}>
                    {o.lbl}
                  </button>
                ))}
              </div>
            </div>

            <div className="ctrl-grp">
              <div className="checkrow">
                <label>
                  <input type="checkbox" checked={unpacking} onChange={(e) => setUnpacking(e.target.checked)} />
                  <span>Destination unpack &amp; debris removal</span>
                </label>
              </div>
              <div className="checkrow">
                <label>
                  <input type="checkbox" checked={insurance} onChange={(e) => setInsurance(e.target.checked)} />
                  <span>All-risk transit insurance (2.5%)</span>
                </label>
              </div>
            </div>
          </aside>

          <div className="calc-output">
            <div className="calc-price card">
              <div className="between">
                <div>
                  <div className="text-mono-sm">ALL-IN ESTIMATE · MYR</div>
                  <div className="price-num mono">
                    RM {totalAnim.toLocaleString()}
                  </div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    Door-to-door · taxes included · valid for 14 days
                  </div>
                </div>
                <div className="price-pill">
                  <div className="text-mono-sm">FROM {origin.code} → {route.code}</div>
                  <div className="mono" style={{ fontSize: 28, letterSpacing: "-0.02em", marginTop: 4 }}>
                    {totalDays}<span style={{ color: "var(--muted)", fontSize: 16, marginLeft: 4 }}>days door-to-door</span>
                  </div>
                </div>
              </div>

              <hr className="hr mt-24" />

              <div className="breakdown">
                {[
                  ["International freight", freight],
                  ["Origin pack & loading", originSvc],
                  ["Destination delivery", destSvc],
                  ["Customs &amp; clearance", customs],
                  ["Transit insurance", ins],
                ].map(([lbl, v]) => (
                  <div className="bd-row" key={lbl}>
                    <span dangerouslySetInnerHTML={{ __html: lbl }} />
                    <span className="mono">RM {Number(v).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="bd-total">
                <span>Total</span>
                <span className="mono">RM {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="calc-timeline card">
              <div className="between">
                <div className="h3">Timeline</div>
                <div className="mono text-mono-sm">D0 → D{totalDays}</div>
              </div>
              <GanttTimeline phases={phases} totalDays={totalDays} />
              <div className="calc-foot">
                <div className="muted" style={{ fontSize: 13, maxWidth: "52ch" }}>
                  Timeline reflects current ETAs for {route.code} from {origin.city}. Move managers
                  rebuild your plan every Monday until departure.
                </div>
                <button className="btn primary">
                  Reserve this slot <span className="arr">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Calculator, ROUTES };
