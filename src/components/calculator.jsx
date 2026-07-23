import React, { useState, useEffect, useRef } from "react";
import { SectionHeader } from "./chrome.jsx";
import { getApacPricing, CURRENCY } from "../api/client.js";

// Live cost & timeline calculator. Sliders + mode selector → live API price + Gantt.
// Pricing comes from the APAC pricing-with-split endpoint; the timeline stays local.

// Destination = country + city (two dropdowns). The API is queried with the
// city as destination_port/destination_city and apiCountry as to_country.
const DESTINATIONS = {
  "Australia": {
    apiCountry: "Australia",
    cities: {
      "Brisbane":  { code: "BNE", airDays: [8, 11], seaDays: [22, 32], distanceKm: 6150 },
      "Melbourne": { code: "MEL", airDays: [8, 11], seaDays: [26, 36], distanceKm: 6300 },
      "Sydney":    { code: "SYD", airDays: [8, 11], seaDays: [24, 34], distanceKm: 6600 },
    },
  },
  "USA": {
    apiCountry: "United States",
    cities: {
      "New York":      { code: "JFK", airDays: [9, 12], seaDays: [36, 46], distanceKm: 15300 },
      "San Francisco": { code: "SFO", airDays: [9, 12], seaDays: [26, 36], distanceKm: 13600 },
      "Washington":    { code: "IAD", airDays: [9, 12], seaDays: [36, 46], distanceKm: 15200 },
    },
  },
  "Germany": {
    apiCountry: "Germany",
    cities: {
      "Hamburg":   { code: "HAM", airDays: [9, 12], seaDays: [30, 40], distanceKm: 10300 },
      "Berlin":    { code: "BER", airDays: [9, 12], seaDays: [30, 40], distanceKm: 9900 },
      "Stuttgart": { code: "STR", airDays: [9, 12], seaDays: [30, 40], distanceKm: 10200 },
    },
  },
};
const DEFAULT_DEST = "Australia";
const firstCityOf = (country) => Object.keys(DESTINATIONS[country].cities)[0];

// quoteState.dest is stored as "City, Country" — the backend's lead creation
// 500s (PRO_ERR_008) on a country-only destination_address, and the booking
// flow sends dest verbatim as the address. Parse it back for the dropdowns.
const parseDest = (dest) => {
  const parts = (dest || "").split(",").map((s) => s.trim()).filter(Boolean);
  const countryPart = parts.length > 1 ? parts[parts.length - 1] : parts[0] || "";
  const destKey = DESTINATIONS[countryPart] ? countryPart : DEFAULT_DEST;
  const cityPart = parts.length > 1 ? parts[0] : "";
  const cityKey = DESTINATIONS[destKey].cities[cityPart] ? cityPart : firstCityOf(destKey);
  return { destKey, cityKey };
};
const routeFor = (dest) => {
  const { destKey, cityKey } = parseDest(dest);
  return DESTINATIONS[destKey].cities[cityKey];
};

// Country-level view kept for the contact form's destination options.
const ROUTES = Object.fromEntries(
  Object.entries(DESTINATIONS).map(([k, v]) => [k, v.cities[firstCityOf(k)]])
);

const ORIGIN_CODES = {
  "Kuala Lumpur, Malaysia": { code: "KUL", city: "Kuala Lumpur" },
  "Penang, Malaysia":       { code: "PEN", city: "Penang" },
  "Johor Bahru, Malaysia":  { code: "JHB", city: "Johor Bahru" },
};

const MODES = [
  { id: "fcl", label: "Sea — Full container", tag: "Best for full home", speedMul: 1.0,
    containerType: "FT_40", shipmentType: "FCL", movingType: "FULL_HOUSEHOLD" },
  { id: "lcl", label: "Sea — Shared (LCL)",   tag: "Most affordable", speedMul: 1.08,
    containerType: "FT_20", shipmentType: "CONSOLE", movingType: "PARTIAL_HOUSEHOLD" },
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

  const { destKey, cityKey } = parseDest(quoteState.dest);
  const route = DESTINATIONS[destKey].cities[cityKey];
  const origin = ORIGIN_CODES[quoteState.origin] || ORIGIN_CODES["Kuala Lumpur, Malaysia"];
  const m = MODES.find((x) => x.id === mode);

  // Live pricing from the APAC split endpoint (debounced — the slider fires fast).
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0); // bump to retry after an error

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    const t = setTimeout(async () => {
      try {
        // The UI shows the Malaysian origin (KUL etc.), but the rate tables only
        // have Singapore-origin prices — the payload always sends Singapore.
        const res = await getApacPricing({
          originPort: "Singapore",
          originCountry: "Singapore",
          destinationCity: cityKey,
          toCountry: DESTINATIONS[destKey].apiCountry,
          volumeM3: volume,
          containerType: m.containerType,
          shipmentType: m.shipmentType,
          movingType: m.movingType,
        });
        if (!alive) return;
        const money = (p) => {
          const n = p && Number(typeof p === "object" ? p.amount : p);
          return Number.isFinite(n) ? n : 0;
        };
        const freightPrice =
          (res.lcl_pricing && res.lcl_pricing.price) || (res.fcl_pricing && res.fcl_pricing.price);
        const total = money(res.final_price);
        if (!total) throw new Error("No live rate is available for this route yet.");
        setPricing({
          currency: (res.final_price && res.final_price.currency) || CURRENCY,
          freight: money(freightPrice),
          originPack: money(res.origin_total),
          destDelivery: money(res.destination_agent_pricing && res.destination_agent_pricing.price),
          total,
        });
        setLoading(false);
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Could not fetch live pricing. Please try again.");
        setPricing(null);
        setLoading(false);
      }
    }, 450);
    return () => { alive = false; clearTimeout(t); };
  }, [destKey, cityKey, mode, volume, attempt]);

  const cur = (pricing && pricing.currency) || CURRENCY;
  const fmt = (n) => Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
  const totalAnim = useAnimatedNumber(pricing ? pricing.total : 0);

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
                    value={destKey}
                    onChange={(e) => {
                      const c = e.target.value;
                      setQuoteState((s) => ({ ...s, dest: `${firstCityOf(c)}, ${c}` }));
                    }}
                  >
                    {Object.keys(DESTINATIONS).map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                  <span className="dest-select-arrow">▾</span>
                </div>
                <div className="dest-select-wrap">
                  <select
                    className="dest-select muted"
                    value={cityKey}
                    onChange={(e) => setQuoteState((s) => ({ ...s, dest: `${e.target.value}, ${destKey}` }))}
                  >
                    {Object.keys(DESTINATIONS[destKey].cities).map((k) => (
                      <option key={k} value={k}>{k}</option>
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
                  <div className="text-mono-sm">ALL-IN ESTIMATE · {cur}</div>
                  <div className="price-num mono">
                    {loading ? "…" : error ? "—" : `${cur} ${totalAnim.toLocaleString()}`}
                  </div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {loading
                      ? "Fetching live carrier rates…"
                      : "Door-to-door · taxes included · valid for 14 days"}
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

              {error && !loading && (
                <div style={{ marginTop: 16 }}>
                  <div className="mono" style={{ color: "var(--accent)", fontSize: 13 }}>{error}</div>
                  <button className="btn ghost" style={{ marginTop: 12 }} onClick={() => setAttempt((a) => a + 1)}>
                    Retry
                  </button>
                </div>
              )}

              <div className="breakdown" style={loading ? { opacity: 0.45 } : undefined}>
                {[
                  ["International freight", pricing ? pricing.freight : 0],
                  ["Origin pack & loading", pricing ? pricing.originPack : 0],
                  ["Destination delivery", pricing ? pricing.destDelivery : 0],
                  ["Customs & clearance", 0],
                  ["Transit insurance", 0],
                ].map(([lbl, v]) => (
                  <div className="bd-row" key={lbl}>
                    <span>{lbl}</span>
                    <span className="mono">{cur} {fmt(v)}</span>
                  </div>
                ))}
              </div>

              <div className="bd-total" style={loading ? { opacity: 0.45 } : undefined}>
                <span>Total</span>
                <span className="mono">{cur} {fmt(pricing ? pricing.total : 0)}</span>
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

export { Calculator, ROUTES, routeFor };
