import React, { useState, useEffect, useRef } from "react";
import { SectionHeader, Placeholder } from "./chrome.jsx";
import { ROUTES, routeFor } from "./calculator.jsx";

// Pet teaser + animated stats + FAQ accordion + Contact form + Sticky quote widget.

const PET_SERVICES = [
  {
    title: "Pet travel planning",
    body: "We outline your destination country's import requirements, travel timelines, and necessary documentation before your pet's journey begins.",
  },
  {
    title: "Documentation support",
    body: "Our team prepares all required paperwork, including import permits, veterinary documents, health certificates, and vaccination records.",
  },
  {
    title: "Travel crate guidance",
    body: "We advise you on selecting airline-approved travel crates to ensure your pet's safety and comfort.",
  },
  {
    title: "International transport coordination",
    body: "We coordinate your pet's travel arrangements and work with trusted partners to ensure a smooth relocation from departure to arrival.",
  },
  {
    title: "Arrival assistance",
    body: "Where available, we assist with destination procedures to ensure your pet's arrival is completed efficiently.",
  },
];

function PetTeaser() {
  return (
    <section className="band cream" id="pets">
      <div className="wrap">
        <div className="pet-card card">
          <div className="pet-left">
            <div className="eyebrow">PET · RELOCATION · 08</div>
            <h2 className="h1 mt-16">
              Every family member<br />
              <span className="serif">deserves a safe arrival.</span>
            </h2>
            <p className="lede mt-24" style={{ maxWidth: 46 + "ch" }}>
              Moving overseas with a pet requires careful planning, accurate documentation,
              and compliance with destination regulations. At APAC Relocation, we manage each
              stage of your pet's relocation to ensure a smooth and comfortable journey.
            </p>
            <p className="lede mt-16" style={{ maxWidth: 46 + "ch" }}>
              Whether you are relocating with a dog, cat, bird, or other eligible companion
              animal, our experienced team guides you through travel requirements, health
              documentation, transport arrangements, and destination regulations for a safe
              international move.
            </p>
            <div className="pet-services mt-32">
              <div className="text-mono-sm mb-16">OUR PET RELOCATION SERVICES</div>
              <ul>
                {PET_SERVICES.map((s) => (
                  <li key={s.title}>
                    <span className="pet-service-t">{s.title}</span>
                    <span className="muted">{s.body}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-32 gap-12 row" style={{ flexWrap: "wrap" }}>
              <a className="btn primary" href="#contact">
                Plan a pet move <span className="arr">→</span>
              </a>
              <a className="btn ghost" href="#">
                See the IATA checklist
              </a>
            </div>
          </div>
          <div className="pet-right">
            <Placeholder ratio="photo" corner="IATA·CR82" label="Pet relocation editorial photo" />
            <div className="pet-badge">
              <div className="mono text-mono-sm">EST. PET MOVE</div>
              <div className="mono" style={{ fontSize: 32, letterSpacing: "-0.02em" }}>RM 9,200</div>
              <div className="muted" style={{ fontSize: 12 }}>Mid-size dog, KUL → SYD, all-in</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Stats ────────────────────────────────────────────────────────────────────

function CountUp({ to, suffix = "", duration = 1400, decimals = 0, group = true }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let raf;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(to * eased);
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  const formatted = decimals > 0
    ? n.toFixed(decimals)
    : group
    ? Math.round(n).toLocaleString()
    : String(Math.round(n));   // years etc. — no thousands separator
  return <span ref={ref} className="mono">{formatted}{suffix}</span>;
}

function Stats() {
  const stats = [
    { value: 1000, suffix: "+", label: "International moves annually", note: "Trusted by families & businesses" },
    { value: 2012, group: false, suffix: "", label: "Established", note: "Serving clients worldwide" },
    { value: 20, suffix: "%", label: "Average annual growth", note: "Year-on-year business growth" },
    { value: 3, suffix: "", label: "Countries of operation", note: "Singapore, Malaysia & India" },
    { value: 0, suffix: "", label: "Hidden charges", note: "Transparent pricing" },
    { value: 48, suffix: "h", label: "Average quote turnaround", note: "Fast and responsive support" },
  ];
  return (
    <section className="band ink stats">
      <div className="wrap">
        <div className="between" style={{ flexWrap: "wrap", gap: 16 }}>
          <div className="eyebrow" style={{ color: "var(--gold)" }}>BY THE NUMBERS · 09</div>
          <div className="mono text-mono-sm" style={{ color: "rgba(246,242,236,0.6)" }}>
            VERIFIED 2025 · INDEPENDENT AUDIT
          </div>
        </div>
        <h2 className="h1 mt-24" style={{ maxWidth: 24 + "ch" }}>
          Trusted by customers, supported by proven experience.<br />
          <span className="serif" style={{ color: "var(--gold)" }}>Experience you can trust.</span>
        </h2>

        <div className="stats-grid mt-48">
          {stats.map((s, i) => (
            <div key={i} className="stat-cell">
              <div className="stat-val">
                <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals || 0} group={s.group !== false} />
              </div>
              <div className="stat-lbl">{s.label}</div>
              <div className="stat-note">{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ──────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How much does it cost to move overseas from Malaysia?",
    a: "The cost depends on factors such as your destination, shipment volume, shipping method, and additional services like packing or storage. Contact APAC Relocation for a personalized quotation based on your moving requirements.",
  },
  {
    q: "How long does an international move take?",
    a: "Transit times vary depending on the destination and shipping method. Air freight is generally faster, while sea freight is a more economical option for larger shipments.",
  },
  {
    q: "Do you provide door-to-door international moving services?",
    a: "Yes. APAC Relocation offers complete door-to-door relocation services, including packing, transportation, customs support, and final delivery.",
  },
  {
    q: "Which countries do you provide relocation services to?",
    a: "We assist with international moves from Malaysia to destinations including Australia, Singapore, Canada, the United Kingdom, New Zealand, the United States, Europe, the Middle East, and many other countries.",
  },
  {
    q: "Can you help with customs clearance?",
    a: "Yes. Our team provides guidance on the customs documentation required for your shipment and coordinates the customs clearance process with our destination partners.",
  },
  {
    q: "Should I choose air freight or sea freight?",
    a: "Air freight is ideal for urgent or smaller shipments, while sea freight is more cost-effective for larger household moves. Our relocation specialists will help you choose the best option based on your budget and timeline.",
  },
  {
    q: "Do you offer packing services?",
    a: "Yes. We provide professional export packing using high-quality materials to ensure your belongings are protected throughout the journey.",
  },
  {
    q: "Can I store my belongings before delivery?",
    a: "Yes. We offer secure short-term and long-term storage solutions if your new home is not ready to receive your shipment.",
  },
  {
    q: "Is transit insurance available?",
    a: "Yes. We offer transit insurance options to provide additional protection for your belongings during international transportation.",
  },
  {
    q: "How can I get a moving quote?",
    a: "Simply share your moving details, including your current location in Malaysia, destination, preferred moving date, and estimated shipment size. Our team will prepare a customized quotation based on your requirements.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="band paper" id="faq">
      <div className="wrap">
        <div className="faq-shell">
          <div className="faq-side">
            <div className="eyebrow">FAQ · 10</div>
            <h2 className="h1 mt-16">
              Questions, <span className="serif">answered.</span>
            </h2>
            <p className="lede mt-24">
              Answers to common questions about moving from Malaysia.
              Couldn't find yours?
            </p>
            <a className="btn ghost mt-24" href="#contact">
              Ask a move manager <span className="arr">→</span>
            </a>
          </div>

          <ul className="faq-list">
            {FAQS.map((f, i) => (
              <li key={i} className={"faq-item" + (open === i ? " open" : "")}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span className="mono faq-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="faq-q-text">{f.q}</span>
                  <span className="faq-toggle mono">{open === i ? "−" : "+"}</span>
                </button>
                <div className="faq-a">
                  <p>{f.a}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "+60 ",
    moveDate: "", from: "Kuala Lumpur", to: "Sydney, Australia",
    rooms: "2-bed apt", notes: "",
    contact: "email",
  });
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <section className="band cream" id="contact">
      <div className="wrap">
        <div className="contact-shell">
          <div className="contact-side">
            <div className="eyebrow">GET · IN · TOUCH · 11</div>
            <h2 className="h1 mt-16">
              Speak to a move<br />
              manager, <span className="serif">today.</span>
            </h2>
            <p className="lede mt-24">
              Tell us a little about your move and we'll come back within 4 working hours
              with a survey slot and a senior manager assigned to your account.
            </p>

            <div className="contact-meta mt-32">
              <div className="contact-block">
                <div className="text-mono-sm">CALL</div>
                <div className="mono contact-big">+65 6520 1914</div>
                <div className="muted" style={{ fontSize: 13 }}>Mon–Sat · 09:00–19:00 MYT</div>
              </div>
              <div className="contact-block">
                <div className="text-mono-sm">EMAIL</div>
                <div className="mono contact-big">contact@apacrelocation.com</div>
                <div className="muted" style={{ fontSize: 13 }}>Replies within 4 working hours</div>
              </div>
              <div className="contact-block">
                <div className="text-mono-sm">WHATSAPP</div>
                <div className="mono contact-big">+65 6520 1914</div>
                <div className="muted" style={{ fontSize: 13 }}>Fastest channel · 7 days</div>
              </div>
            </div>
          </div>

          <form
            className="contact-form card"
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          >
            {submitted ? (
              <div className="contact-success">
                <div className="success-mark">
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="11" fill="none" stroke="var(--success)" strokeWidth="1.5" />
                    <path d="M7 12 L11 16 L17 8" fill="none" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="h2 mt-24">Got it, {form.name.split(" ")[0] || "thanks"}.</h3>
                <p className="lede mt-16">
                  A senior move manager will email you within 4 working hours with a survey
                  slot. Reference <span className="mono" style={{ background: "var(--cream)", padding: "2px 8px", borderRadius: 4 }}>APX-{Math.floor(Math.random() * 9000 + 22850)}</span>.
                </p>
                <button type="button" className="btn ghost mt-24" onClick={() => setSubmitted(false)}>
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <>
                <div className="between">
                  <div>
                    <div className="eyebrow no-dash">New enquiry</div>
                    <div className="h3 mt-8">Tell us about your move</div>
                  </div>
                  <div className="chip"><span className="dot" /> Avg reply · 47 min</div>
                </div>

                <div className="form-grid mt-24">
                  <div className="field" style={{ gridColumn: "span 2" }}>
                    <label>Full name</label>
                    <input required value={form.name} onChange={update("name")} placeholder="Wei Lin Tan" />
                  </div>
                  <div className="field">
                    <label>Email</label>
                    <input required type="email" value={form.email} onChange={update("email")} placeholder="you@company.com" />
                  </div>
                  <div className="field">
                    <label>Phone</label>
                    <input value={form.phone} onChange={update("phone")} placeholder="+60 12-345 6789" />
                  </div>
                  <div className="field">
                    <label>Move from</label>
                    <select value={form.from} onChange={update("from")}>
                      <option>Kuala Lumpur</option><option>Penang</option><option>Johor Bahru</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Move to</label>
                    <select value={form.to} onChange={update("to")}>
                      {Object.keys(ROUTES).map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Approx. date</label>
                    <input type="date" value={form.moveDate} onChange={update("moveDate")} />
                  </div>
                  <div className="field">
                    <label>Home size</label>
                    <select value={form.rooms} onChange={update("rooms")}>
                      <option>Studio</option><option>1-bed apt</option>
                      <option>2-bed apt</option><option>3-bed home</option>
                      <option>4-bed home</option><option>5-bed +</option>
                    </select>
                  </div>
                  <div className="field" style={{ gridColumn: "span 2" }}>
                    <label>Anything else? (Pets, oversized items, visa class)</label>
                    <textarea rows="3" value={form.notes} onChange={update("notes")} placeholder="2 cats, a Yamaha upright piano, L-1A on hand…" />
                  </div>
                </div>

                <div className="form-foot mt-24">
                  <div className="contact-pref">
                    <span className="text-mono-sm">PREFERRED CONTACT</span>
                    <div className="seg" style={{ marginTop: 8 }}>
                      {["email", "phone", "whatsapp"].map((c) => (
                        <button key={c} type="button"
                          className={form.contact === c ? "on" : ""}
                          onClick={() => setForm({ ...form, contact: c })}>
                          {c[0].toUpperCase() + c.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="btn primary">
                    Send enquiry <span className="arr">→</span>
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

// ── Sticky quote widget — collapses when calculator is in view ────────────────

function StickyQuote({ quoteState, scrollToCalc }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const qband = document.getElementById("quote-band");
    const calc = document.getElementById("calculator");
    const contact = document.getElementById("contact");
    const on = () => {
      const sy = window.scrollY;
      const qbandEnd = qband ? qband.offsetTop + qband.offsetHeight : 0;
      const calcTop = calc?.offsetTop ?? 0;
      const calcEnd = calcTop + (calc?.offsetHeight ?? 0);
      const contactTop = contact?.offsetTop ?? Infinity;
      // hide while quote-band itself is in view (gives the user that form);
      // hide inside the calculator (it has its own price card);
      // hide once contact is in view (form is there).
      const inCalc = sy + window.innerHeight * 0.6 > calcTop && sy < calcEnd;
      const inContact = sy + window.innerHeight * 0.6 > contactTop;
      setShow(sy > qbandEnd && !inCalc && !inContact);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className={"sticky-quote" + (show ? " in" : "")}>
      <div className="sticky-inner">
        <div className="sq-route mono">
          <span>KUL</span>
          <span className="arr">→</span>
          <span>{routeFor(quoteState.dest).code}</span>
        </div>
        <div className="sq-meta">
          <span>{quoteState.size}</span>
          <span className="sq-dot" />
          <span className="mono">From RM 8,900</span>
        </div>
        <button className="btn primary" onClick={scrollToCalc}>
          Live quote <span className="arr">→</span>
        </button>
      </div>
    </div>
  );
}

export { PetTeaser, Stats, FAQ, Contact, StickyQuote };
