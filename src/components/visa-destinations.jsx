import React, { useState } from "react";
import { SectionHeader, Placeholder } from "./chrome.jsx";

// Visa option comparison cards (filterable) + Popular destinations for Malaysians (clickable cards with details).

const VISAS = [
  {
    code: "189",
    name: "Skilled Independent (Australia)",
    category: "Work",
    durationMonths: 999,
    cap: "Points-tested · 65 pts min",
    leadTime: "8–14 months",
    cost: "RM 6,500–RM 8,200",
    family: "Spouse + dependents",
    greenCardPath: "Direct (PR)",
    summary: "Points-tested permanent visa for skilled Malaysians with an occupation on Australia's skilled list. No employer sponsor needed.",
    requires: ["Skills assessment", "EOI + invitation", "IELTS/PTE score"],
  },
  {
    code: "482",
    name: "Skilled Worker (UK)",
    category: "Work",
    durationMonths: 60,
    cap: "No cap · sponsor required",
    leadTime: "2–4 months",
    cost: "RM 4,200–RM 7,800",
    family: "Dependent visa",
    greenCardPath: "Via ILR (5 yrs)",
    summary: "The standard route for Malaysians with a confirmed UK job offer from a licensed sponsor, across most skilled occupations.",
    requires: ["Job offer + CoS", "Salary threshold met", "English requirement"],
  },
  {
    code: "EP",
    name: "Employment Pass (Singapore)",
    category: "Work",
    durationMonths: 24,
    cap: "No cap · salary-based",
    leadTime: "3–8 weeks",
    cost: "RM 500–RM 1,200",
    family: "Dependant's Pass",
    greenCardPath: "Via PR (case-by-case)",
    summary: "Fastest route for Malaysians — no quota, minimal paperwork, and often approved within weeks given proximity and ties.",
    requires: ["Job offer", "Min. salary RM 15,800/mo", "Recognised degree"],
  },
  {
    code: "FSW",
    name: "Express Entry (Canada)",
    category: "Work",
    durationMonths: 999,
    cap: "Points-tested · CRS ranked",
    leadTime: "6–8 months",
    cost: "RM 3,800–RM 5,500",
    family: "Spouse + children",
    greenCardPath: "Direct (PR)",
    summary: "Federal Skilled Worker stream ranks candidates by age, education, and work experience — top-ranked profiles get an invitation to apply.",
    requires: ["ECA credential check", "IELTS/CELPIP score", "CRS profile"],
  },
  {
    code: "H-1B",
    name: "Specialty Occupation (USA)",
    category: "Work",
    durationMonths: 36,
    cap: "Annual lottery · 85,000",
    leadTime: "8–14 months",
    cost: "RM 15,000–RM 34,000",
    family: "H-4 dependents",
    greenCardPath: "Yes",
    summary: "Employer-sponsored work visa for specialty occupations — the most common route for Malaysian tech and finance hires.",
    requires: ["Bachelor's degree", "Employer sponsor", "Lottery selection"],
  },
  {
    code: "Student",
    name: "Student Route (UK)",
    category: "Study",
    durationMonths: 36,
    cap: "No cap",
    leadTime: "3–6 weeks",
    cost: "RM 1,800 + IHS",
    family: "Dependants (PG only)",
    greenCardPath: "Via Graduate Route (2 yrs)",
    summary: "Full-time study at a licensed UK sponsor institution, with a 2-year post-study work window on the Graduate Route.",
    requires: ["CAS from sponsor", "Financial proof", "English requirement"],
  },
  {
    code: "Study Permit",
    name: "Study Permit (Canada)",
    category: "Study",
    durationMonths: 48,
    cap: "No cap",
    leadTime: "4–8 weeks",
    cost: "RM 550 + proof of funds",
    family: "Open work permit (spouse)",
    greenCardPath: "Via PGWP → PR",
    summary: "Study at a Designated Learning Institution, with a post-graduation work permit that's a common bridge to permanent residence.",
    requires: ["Letter of acceptance", "Proof of funds", "Ties to Malaysia"],
  },
  {
    code: "820/801",
    name: "Partner Visa (Australia)",
    category: "Family",
    durationMonths: 999,
    cap: "Unlimited",
    leadTime: "12–24 months",
    cost: "RM 8,500–RM 10,000",
    family: "Direct path",
    greenCardPath: "Direct (PR)",
    summary: "Permanent residence for spouses and de facto partners of Australian citizens or PR holders — temporary visa granted first.",
    requires: ["Genuine relationship", "Sponsor eligibility", "Health & character checks"],
  },
];

const VISA_CATS = ["All", "Work", "Study", "Family"];

function Visa() {
  const [cat, setCat] = useState("All");
  const list = VISAS.filter((v) => cat === "All" || v.category === cat);
  return (
    <section className="band cream" id="visa">
      <div className="wrap">
        <div className="services-hd">
          <div>
            <div className="eyebrow">VISA · OPTIONS · 06</div>
            <h2 className="h1 mt-16">
              Pick a path.<br />
              <span className="serif">We'll meet you at the embassy.</span>
            </h2>
          </div>
          <p className="lede" style={{ maxWidth: 42 + "ch" }}>
            Visa choice shapes everything — your customs forms, your tax residency, your kids'
            school enrollment. Our immigration partners hold a 96.3% first-attempt approval
            rate for Malaysian applicants since 2019.
          </p>
        </div>

        <div className="visa-filters mt-32">
          {VISA_CATS.map((c) => (
            <button
              key={c}
              className={"visa-filter" + (cat === c ? " on" : "")}
              onClick={() => setCat(c)}
            >
              {c}
              <span className="mono">
                {c === "All" ? VISAS.length : VISAS.filter((v) => v.category === c).length}
              </span>
            </button>
          ))}
        </div>

        <div className="visa-grid mt-32">
          {list.map((v) => (
            <article key={v.code} className="visa-card">
              <div className="between visa-card-hd">
                <div className="visa-code mono">{v.code}</div>
                <span className={"visa-tag tag-" + v.category.toLowerCase()}>{v.category}</span>
              </div>
              <h3 className="h3 mt-16">{v.name}</h3>
              <p className="muted mt-8" style={{ fontSize: 14 }}>{v.summary}</p>

              <dl className="visa-specs mt-24">
                <div><dt>Lead time</dt><dd className="mono">{v.leadTime}</dd></div>
                <div><dt>Government cost</dt><dd className="mono">{v.cost}</dd></div>
                <div><dt>Cap</dt><dd className="mono" style={{ fontSize: 12 }}>{v.cap}</dd></div>
                <div><dt>Green card path</dt><dd className="mono">{v.greenCardPath}</dd></div>
              </dl>

              <div className="visa-reqs">
                <div className="text-mono-sm mb-8">REQUIREMENTS</div>
                <ul>
                  {v.requires.map((r) => <li key={r}><span className="mono">·</span> {r}</li>)}
                </ul>
              </div>

              <a className="visa-link mt-24" href="#contact">
                Talk to an immigration partner <span className="arr">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Destinations ──────────────────────────────────────────────────────────────

const DEST = [
  {
    city: "Sydney",
    state: "New South Wales, Australia",
    code: "SYD",
    coord: { x: 88, y: 60 },
    transit: "24–34 days",
    air: "8–11 days",
    avgCost: "RM 19,400",
    population: "5.4M metro",
    climate: "Mild · 54–77°F",
    community: "Largest Malaysian community in Australia",
    why: "Finance, tech, and healthcare hub. Direct 8hr flight from KL. Strong Malaysian student and professional network.",
    neighborhoods: ["Chatswood", "Hurstville", "Parramatta", "Eastwood"],
    accent: "var(--accent)",
  },
  {
    city: "London",
    state: "England, United Kingdom",
    code: "LHR",
    coord: { x: 46, y: 22 },
    transit: "35–45 days",
    air: "9–12 days",
    avgCost: "RM 22,600",
    population: "9.6M metro",
    climate: "Cool · 40–73°F",
    community: "Top study destination for Malaysian students",
    why: "Global finance, law, and postgraduate study. Historic ties via Commonwealth and JPA scholarship pipelines.",
    neighborhoods: ["Kingston", "Wembley", "Croydon", "Ealing"],
    accent: "var(--sage)",
  },
  {
    city: "Singapore",
    state: "Singapore",
    code: "SIN",
    coord: { x: 66, y: 52 },
    transit: "7–12 days",
    air: "2–4 days",
    avgCost: "RM 8,900",
    population: "5.9M metro",
    climate: "Tropical · 75–88°F",
    community: "Closest and most common move for Malaysians",
    why: "An hour from KL by air, no time zone change. The single most common cross-border move for Malaysian professionals.",
    neighborhoods: ["Woodlands", "Jurong East", "Bukit Timah", "Sengkang"],
    accent: "var(--gold)",
  },
  {
    city: "Toronto",
    state: "Ontario, Canada",
    code: "YYZ",
    coord: { x: 24, y: 24 },
    transit: "38–48 days",
    air: "10–13 days",
    avgCost: "RM 24,800",
    population: "6.7M metro",
    climate: "Variable · 23–80°F",
    community: "Fast-growing Malaysian community via Express Entry",
    why: "Finance, tech, and one of the clearest permanent residence pathways for skilled Malaysians.",
    neighborhoods: ["Scarborough", "Markham", "Mississauga", "North York"],
    accent: "var(--accent)",
  },
  {
    city: "San Francisco",
    state: "California, USA",
    code: "SFO",
    coord: { x: 10, y: 40 },
    transit: "26–36 days",
    air: "9–12 days",
    avgCost: "RM 21,200",
    population: "7.7M metro",
    climate: "Mild · 50–70°F",
    community: "Established Malaysian tech professional network",
    why: "Bay Area tech corridor. The top destination for Malaysian engineers on employer-sponsored visas.",
    neighborhoods: ["Mission Bay", "Sunnyvale", "Fremont", "Daly City"],
    accent: "var(--ink)",
  },
];

function Destinations() {
  const [active, setActive] = useState(0);
  const d = DEST[active];
  return (
    <section className="band paper" id="destinations">
      <div className="wrap">
        <SectionHeader
          kicker="POPULAR · DESTINATIONS · 07"
          title="Where Malaysians relocate in 2026."
          lede="The five countries our Kuala Lumpur office sees most often, ranked by move volume. Tap a pin or card to compare."
        />

        <div className="dest-shell mt-48">
          <div className="dest-map card">
            <div className="dest-map-hd between">
              <div className="text-mono-sm">WORLDWIDE · MOVE VOLUME</div>
              <div className="text-mono-sm">2025 Q4 · Kuala Lumpur origin</div>
            </div>
            <div className="us-map">
              <svg viewBox="0 0 100 70" preserveAspectRatio="none" className="us-map-svg">
                {/* abstract continental outline */}
                <path
                  d="M4 32 Q 3 22 9 16 Q 14 11 20 12 L 30 9 Q 38 6 46 9 L 56 6 Q 66 4 74 8 L 84 11 Q 92 14 95 22 L 96 32 Q 95 42 90 48 L 84 55 Q 78 63 70 64 L 56 66 Q 46 68 38 65 L 28 64 Q 18 62 12 56 Q 6 50 5 42 Z"
                  fill="var(--cream)"
                  stroke="var(--hair-strong)"
                  strokeWidth="0.3"
                />
                {/* state hairlines */}
                <g stroke="var(--hair)" strokeWidth="0.2" fill="none">
                  <path d="M30 12 L30 64" /><path d="M50 8 L50 67" /><path d="M70 8 L70 65" />
                  <path d="M5 32 L96 32" /><path d="M8 48 L94 48" />
                </g>
                {/* pins */}
                {DEST.map((p, i) => (
                  <g key={p.code} onClick={() => setActive(i)} style={{ cursor: "pointer" }}>
                    <circle
                      cx={p.coord.x} cy={p.coord.y}
                      r={active === i ? 2.2 : 1.4}
                      fill={active === i ? p.accent : "var(--ink)"}
                      stroke="var(--paper)"
                      strokeWidth="0.4"
                    />
                    {active === i && (
                      <circle cx={p.coord.x} cy={p.coord.y} r="4" fill="none"
                        stroke={p.accent} strokeWidth="0.3" opacity="0.6" />
                    )}
                    <text
                      x={p.coord.x + 2.5}
                      y={p.coord.y + 0.8}
                      fontSize="2"
                      fontFamily="var(--font-mono)"
                      fill="var(--ink)"
                      fontWeight={active === i ? 600 : 400}
                    >
                      {p.code}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="dest-map-foot">
              {DEST.map((p, i) => (
                <button
                  key={p.code}
                  className={"dest-tab" + (active === i ? " on" : "")}
                  onClick={() => setActive(i)}
                >
                  <span className="mono">{p.code}</span>
                  <span>{p.city}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="dest-detail">
            <div className="dest-photo">
              <Placeholder
                ratio="wide"
                corner={`KUL→${d.code}`}
                label={`Editorial photo · ${d.city} skyline`}
              />
            </div>
            <div className="dest-detail-body card">
              <div className="between">
                <div>
                  <div className="text-mono-sm">{d.state.toUpperCase()} · {d.code}</div>
                  <h3 className="h2 mt-8" style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    {d.city}
                    <span className="serif muted" style={{ fontSize: 24 }}>{d.population}</span>
                  </h3>
                </div>
                <div className="mono" style={{ textAlign: "right", fontSize: 12, color: "var(--muted)" }}>
                  {String(active + 1).padStart(2, "0")} / {String(DEST.length).padStart(2, "0")}
                </div>
              </div>

              <p className="mt-16" style={{ fontSize: 15, lineHeight: 1.5 }}>{d.why}</p>

              <div className="dest-stats mt-24">
                <div className="numtile">
                  <div className="num" style={{ fontSize: 24 }}>{d.transit}</div>
                  <div className="lbl">Sea transit</div>
                </div>
                <div className="numtile">
                  <div className="num" style={{ fontSize: 24 }}>{d.air}</div>
                  <div className="lbl">Air transit</div>
                </div>
                <div className="numtile">
                  <div className="num" style={{ fontSize: 24 }}>{d.avgCost}</div>
                  <div className="lbl">Avg move cost</div>
                </div>
                <div className="numtile">
                  <div className="num" style={{ fontSize: 15, lineHeight: 1.3 }}>{d.community}</div>
                  <div className="lbl">Community</div>
                </div>
              </div>

              <div className="mt-24">
                <div className="text-mono-sm mb-8">POPULAR NEIGHBORHOODS</div>
                <div className="dest-tags">
                  {d.neighborhoods.map((n) => (
                    <span key={n} className="chip">{n}</span>
                  ))}
                </div>
              </div>

              <div className="mt-24 between">
                <div className="muted mono" style={{ fontSize: 12 }}>
                  {d.climate}
                </div>
                <a className="btn ghost" href="#calculator">
                  Quote a move to {d.city} <span className="arr">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Visa, Destinations };
