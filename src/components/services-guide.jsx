import React, { useState } from "react";
import { SectionHeader } from "./chrome.jsx";

// Door-to-door services row + step-by-step interactive timeline guide.

const SERVICES = [
  {
    n: "01",
    title: "Consultation & move planning",
    body: "We begin by understanding your moving requirements, destination, preferred timeline, and shipment size. Based on your needs, we'll recommend the most suitable relocation plan and provide a detailed quotation.",
    bullets: ["Pre-move survey", "Full container / groupage option", "Dedicated move coordinator"],
  },
  {
    n: "02",
    title: "Professional packing",
    body: "Our trained packing specialists use high-quality packing materials and industry-approved techniques to protect your household goods, furniture, electronics, and fragile items for international transport.",
    bullets: ["Experienced crew", "International packing standard", "High quality materials"],
  },
  {
    n: "03",
    title: "International shipping",
    body: "We suggest you the cost effective shipping option. Choose between air freight or sea freight based on your budget and delivery timeline. We coordinate transportation, shipping schedules, and logistics to ensure your shipment moves efficiently.",
    bullets: ["Sea & air freight", "Groupage / shared containers", "Insurance coverage"],
  },
  {
    n: "04",
    title: "Customs clearance & delivery",
    body: "Our team assists with customs documentation and clearance requirements before arranging the final delivery of your belongings to your new home, making your international move as smooth as possible.",
    bullets: ["Documentation", "Customs clearance", "Delivery"],
  },
];

function Services() {
  return (
    <section className="band cream" id="services">
      <div className="wrap">
        <div className="services-hd">
          <div>
            <div className="eyebrow">DOOR · TO · DOOR · 02</div>
            <h2 className="h1 mt-16">
              One team. <span className="serif">One contract.</span><br />
              A simple and well-planned relocation process.
            </h2>
          </div>
          <p className="lede" style={{ maxWidth: 44 + "ch" }}>
            At APAC Relocation, we believe international moving should be straightforward
            and hassle-free. Our experienced team manages every stage of your relocation,
            ensuring your belongings are handled with care from your home in Malaysia to
            your destination overseas.
          </p>
        </div>

        <div className="services-grid mt-48">
          {SERVICES.map((s) => (
            <article key={s.n} className="svc-card">
              <div className="svc-top">
                <span className="mono svc-num">{s.n}</span>
                <span className="svc-line" />
              </div>
              <h3 className="h3 mt-24">{s.title}</h3>
              <p className="muted mt-12" style={{ fontSize: 14, lineHeight: 1.5 }}>{s.body}</p>
              <ul className="svc-bullets mt-24">
                {s.bullets.map((b) => (
                  <li key={b}><span className="mono">✓</span> {b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="services-footer mt-48">
          <div className="chip"><span className="dot" /> Single point of contact</div>
          <div className="chip"><span className="dot" style={{ background: "var(--sage)" }} /> Fixed-price guarantee</div>
          <div className="chip"><span className="dot" style={{ background: "var(--gold)" }} /> Bilingual EN · 中文 · ID · TH · 한국어</div>
          <div className="chip"><span className="dot" style={{ background: "var(--ink)" }} /> 4.94★ verified rating</div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    week: "T − 12 weeks",
    title: "Get a quote & plan your move",
    body: "Every successful international move starts with careful planning. Share your moving requirements with our relocation specialists, and we'll assess your shipment, recommend the most suitable shipping method, and prepare a personalized moving plan.",
    tasks: ["Initial relocation consultation", "Shipment assessment & quotation", "Dedicated move coordinator assigned"],
  },
  {
    week: "T − 8 weeks",
    title: "Documentation & customs preparation",
    body: "Our team guides you through the documentation required for your international move, ensuring your shipment complies with destination customs regulations before departure.",
    tasks: ["Customs documentation guidance", "Shipping document preparation", "Import and export compliance support"],
  },
  {
    week: "T − 4 weeks",
    title: "Preparing for your move",
    body: "Before moving day, we help you organize your shipment and prepare everything for a smooth relocation. This ensures packing and transportation can begin without delays.",
    tasks: ["Pre-move planning and scheduling", "Inventory preparation", "Shipment readiness review"],
  },
  {
    week: "T − 1 week",
    title: "Professional packing & collection",
    body: "Our experienced packing team carefully packs, labels, and prepares your belongings using high-quality export packing materials. Every item is handled with care to ensure safe international transportation.",
    tasks: ["Professional export packing", "Protective wrapping for fragile items", "Secure loading and collection"],
  },
  {
    week: "T + 2 days",
    title: "International shipping",
    body: "Once your shipment is collected, we coordinate its journey through our trusted international logistics network. Throughout transit, our team keeps you informed until your shipment reaches its destination.",
    tasks: ["Air or sea freight coordination", "Shipment tracking updates", "Customs clearance coordination"],
  },
  {
    week: "T + 4 weeks",
    title: "Delivery & move-in",
    body: "After customs clearance, your shipment is delivered safely to your new home. Our destination partners complete the final delivery so you can settle in with confidence.",
    tasks: ["Final destination delivery", "Unloading and placement of belongings", "Completion of your international relocation"],
  },
];

function Guide() {
  const [active, setActive] = useState(0);
  return (
    <section className="band paper" id="guide">
      <div className="wrap">
        <SectionHeader
          kicker="STEP · BY · STEP · 05"
          title="How a move from Malaysia actually unfolds."
          lede="Twelve weeks from quote to keys is typical. Click any step to see what's happening that week — and what we handle so you don't have to."
        />

        <div className="guide mt-48">
          <ol className="guide-rail">
            {STEPS.map((s, i) => (
              <li
                key={i}
                className={"guide-step" + (active === i ? " active" : "")}
                onClick={() => setActive(i)}
              >
                <div className="guide-week mono">{s.week}</div>
                <div className="guide-step-title">{s.title}</div>
                <span className="guide-dot" />
              </li>
            ))}
          </ol>

          <div className="guide-detail card">
            <div className="between">
              <div className="mono text-mono-sm">STEP {String(active + 1).padStart(2, "0")} / 06</div>
              <div className="mono text-mono-sm">{STEPS[active].week}</div>
            </div>
            <h3 className="h2 mt-16">{STEPS[active].title}</h3>
            <p className="lede mt-16">{STEPS[active].body}</p>

            <div className="guide-tasks mt-32">
              <div className="text-mono-sm mb-16">WE HANDLE</div>
              <ul>
                {STEPS[active].tasks.map((t) => (
                  <li key={t}><span className="mono">→</span> {t}</li>
                ))}
              </ul>
            </div>

            <div className="guide-nav mt-32">
              <button
                className="btn ghost"
                onClick={() => setActive(Math.max(0, active - 1))}
                disabled={active === 0}
              >
                ← Previous
              </button>
              <button
                className="btn primary"
                onClick={() => setActive(Math.min(STEPS.length - 1, active + 1))}
                disabled={active === STEPS.length - 1}
              >
                Next step <span className="arr">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Services, Guide };
