import React, { useState } from "react";
import { SectionHeader, Placeholder } from "./chrome.jsx";

// Visa option comparison cards (filterable) + Popular destinations for Malaysians (clickable cards with details).

const VISAS = [
  {
    code: "189",
    name: "Skilled Independent Visa (Australia)",
    category: "Work",
    leadTime: "8–14 months",
    visaType: "Permanent residence",
    bestFor: "Skilled professionals",
    summary: "A points-tested permanent residence visa for skilled professionals who meet Australia's migration requirements and wish to live and work independently.",
    requires: ["Skills assessment", "Invitation to apply", "English language proficiency"],
  },
  {
    code: "482",
    name: "Skilled Worker Visa (United Kingdom)",
    category: "Work",
    leadTime: "2–4 months",
    visaType: "Work visa",
    bestFor: "Professionals with a job offer",
    summary: "A work visa for professionals who have secured employment with a licensed employer in the UK.",
    requires: ["Confirmed job offer", "Salary threshold", "English language requirement"],
  },
  {
    code: "EP",
    name: "Employment Pass (Singapore)",
    category: "Work",
    leadTime: "3–8 weeks",
    visaType: "Employment visa",
    bestFor: "Professionals and executives",
    summary: "A professional work visa designed for foreign professionals, managers, and executives employed by Singapore-based companies.",
    requires: ["Valid employment offer", "Minimum qualifying salary", "Recognized qualifications"],
  },
  {
    code: "FSW",
    name: "Express Entry (Canada)",
    category: "Work",
    leadTime: "6–8 months",
    visaType: "Permanent residence",
    bestFor: "Skilled workers",
    summary: "Canada's points-based immigration pathway for skilled professionals seeking permanent residence.",
    requires: ["Educational assessment", "Language test", "Competitive CRS score"],
  },
  {
    code: "H-1B",
    name: "H-1B Visa (United States)",
    category: "Work",
    leadTime: "Varies by application cycle",
    visaType: "Employment visa",
    bestFor: "Specialised professionals",
    summary: "A temporary work visa for qualified professionals employed in specialty occupations.",
    requires: ["Employer sponsorship", "Relevant qualifications", "Lottery selection (where applicable)"],
  },
  {
    code: "Student",
    name: "Student Visa (United Kingdom)",
    category: "Study",
    leadTime: "3–6 weeks",
    visaType: "Student visa",
    bestFor: "International students",
    summary: "Allows international students to study full-time at an approved UK educational institution.",
    requires: ["Confirmation of Acceptance for Studies (CAS)", "Proof of financial support", "English language proficiency"],
  },
  {
    code: "Study Permit",
    name: "Study Permit (Canada)",
    category: "Study",
    leadTime: "4–8 weeks",
    visaType: "Student visa",
    bestFor: "Higher education",
    summary: "A study permit that allows international students to pursue education at designated Canadian institutions.",
    requires: ["Letter of acceptance", "Proof of funds", "Medical examination (if applicable)"],
  },
  {
    code: "820/801",
    name: "Partner Visa (Australia)",
    category: "Family",
    leadTime: "12–24 months",
    visaType: "Family visa",
    bestFor: "Partners and spouses",
    summary: "A visa pathway that allows spouses and eligible partners of Australian citizens or permanent residents to live in Australia.",
    requires: ["Genuine relationship evidence", "Sponsor eligibility", "Health and character checks"],
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
              Find the right visa for your move.<br />
              <span className="serif">Explore the most popular relocation pathways.</span>
            </h2>
          </div>
          <p className="lede" style={{ maxWidth: 42 + "ch" }}>
            Choosing the right visa is one of the most important steps in an international
            move. Whether you're relocating for work, study, business, or family, understanding
            your visa options early helps make the relocation process smoother. Below are some
            of the most common visa pathways our clients choose when moving abroad.
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
                <div><dt>Visa type</dt><dd className="mono">{v.visaType}</dd></div>
                <div style={{ gridColumn: "1 / -1" }}><dt>Best for</dt><dd className="mono">{v.bestFor}</dd></div>
              </dl>

              <div className="visa-reqs">
                <div className="text-mono-sm mb-8">REQUIREMENTS</div>
                <ul>
                  {v.requires.map((r) => <li key={r}><span className="mono">·</span> {r}</li>)}
                </ul>
              </div>

              <a className="visa-link mt-24" href="#contact">
                Speak with our relocation team <span className="arr">→</span>
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
    avgCost: "From RM 19,000*",
    population: "5.4 Million",
    climate: "Mild · 54–77°F",
    community: "Strong Malaysian community and excellent lifestyle.",
    why: "One of the most popular destinations for Malaysian families and professionals, offering excellent career opportunities, quality education, and a high standard of living.",
    neighborhoods: ["Chatswood", "Parramatta", "Eastwood", "Burwood", "Strathfield"],
    accent: "var(--accent)",
  },
  {
    city: "London",
    state: "England, United Kingdom",
    code: "LHR",
    coord: { x: 46, y: 22 },
    transit: "35–45 days",
    air: "9–12 days",
    avgCost: "From RM 22,500*",
    population: "9.6 Million",
    climate: "Cool · 40–73°F",
    community: "Financial hub with leading universities and multinational employers.",
    why: "A preferred destination for professionals and students seeking global career opportunities, world-class universities, and international business exposure.",
    neighborhoods: ["Canary Wharf", "Wembley", "Croydon", "Ealing", "Kingston"],
    accent: "var(--sage)",
  },
  {
    city: "Singapore",
    state: "Singapore",
    code: "SIN",
    coord: { x: 66, y: 52 },
    transit: "7–12 days",
    air: "2–4 days",
    avgCost: "From RM 8,500*",
    population: "5.9 Million",
    climate: "Tropical · 75–88°F",
    community: "Short transit time and strong employment opportunities.",
    why: "A convenient destination for Malaysians relocating for employment, business, or family, with close cultural ties and excellent connectivity.",
    neighborhoods: ["Woodlands", "Jurong East", "Bukit Timah", "Novena", "Tampines"],
    accent: "var(--gold)",
  },
  {
    city: "Toronto",
    state: "Ontario, Canada",
    code: "YYZ",
    coord: { x: 24, y: 24 },
    transit: "38–48 days",
    air: "10–13 days",
    avgCost: "From RM 24,500*",
    population: "6.7 Million",
    climate: "Variable · 23–80°F",
    community: "Strong immigration pathways and diverse communities.",
    why: "A leading destination for skilled professionals, families, and international students looking for long-term settlement opportunities.",
    neighborhoods: ["North York", "Markham", "Mississauga", "Scarborough", "Richmond Hill"],
    accent: "var(--accent)",
  },
  {
    city: "San Francisco",
    state: "California, USA",
    code: "SFO",
    coord: { x: 10, y: 40 },
    transit: "26–36 days",
    air: "9–12 days",
    avgCost: "From RM 21,000*",
    population: "7.7 Million (Metro)",
    climate: "Mild · 50–70°F",
    community: "Global technology hub with excellent career prospects.",
    why: "A major destination for technology professionals relocating to Silicon Valley and the surrounding Bay Area.",
    neighborhoods: ["Fremont", "Sunnyvale", "Mission Bay", "Daly City", "Milpitas"],
    accent: "var(--ink)",
  },
  {
    city: "Melbourne",
    state: "Victoria, Australia",
    code: "MEL",
    coord: { x: 84, y: 64 },
    transit: "24–34 days",
    air: "8–11 days",
    avgCost: "From RM 18,800*",
    population: "5.3 Million",
    climate: "Mild · 48–79°F",
    community: "Excellent lifestyle and highly ranked universities.",
    why: "Popular among families and students for its quality education, multicultural environment, and excellent healthcare.",
    neighborhoods: ["Box Hill", "Glen Waverley", "Clayton", "Footscray", "Carlton"],
    accent: "var(--sage)",
  },
  {
    city: "Dubai",
    state: "Dubai, United Arab Emirates",
    code: "DXB",
    coord: { x: 57, y: 38 },
    transit: "18–28 days",
    air: "5–7 days",
    avgCost: "From RM 15,500*",
    population: "3.7 Million",
    climate: "Hot · 66–106°F",
    community: "Business-friendly environment and excellent global connectivity.",
    why: "A preferred destination for professionals and entrepreneurs seeking tax-efficient living and international business opportunities.",
    neighborhoods: ["Dubai Marina", "Business Bay", "Jumeirah", "Downtown Dubai", "Al Barsha"],
    accent: "var(--gold)",
  },
  {
    city: "Auckland",
    state: "Auckland, New Zealand",
    code: "AKL",
    coord: { x: 93, y: 63 },
    transit: "28–38 days",
    air: "8–10 days",
    avgCost: "From RM 20,000*",
    population: "1.7 Million",
    climate: "Mild · 46–74°F",
    community: "High quality of life and family-friendly communities.",
    why: "An attractive destination for families looking for a relaxed lifestyle, excellent education, and a safe living environment.",
    neighborhoods: ["Mount Eden", "Epsom", "Remuera", "Albany", "Takapuna"],
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
          title="Popular destinations for international moves from Malaysia."
          lede="Explore some of the most popular destinations our customers relocate to from Malaysia. Compare estimated transit times, average moving costs, and destination highlights to help plan your international move."
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
                  <div className="num" style={{ fontSize: 20 }}>{d.avgCost}</div>
                  <div className="lbl">Average move cost</div>
                </div>
                <div className="numtile">
                  <div className="num" style={{ fontSize: 15, lineHeight: 1.3 }}>{d.community}</div>
                  <div className="lbl">Why people move here</div>
                </div>
              </div>

              <div className="mt-24">
                <div className="text-mono-sm mb-8">POPULAR AREAS</div>
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
                  Get a quote for {d.city} <span className="arr">→</span>
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
