import React from "react";

// "Our services" — 6 discrete service cards with iconography.
// Sits between the live calculator (03) and the step-by-step guide.

const OUR_SERVICES = [
  {
    key: "door",
    title: "Door-to-door international moving",
    body: "We manage your move from your home in Malaysia to your new destination, coordinating every stage of the relocation process for a seamless experience.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    key: "packing",
    title: "Professional packing services",
    body: "Our experienced packing team uses high-quality packing materials and proven techniques to protect your furniture, household goods, electronics, artwork, and fragile items during transit.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 13h18" />
      </svg>
    ),
  },
  {
    key: "air",
    title: "Air freight services",
    body: "For urgent relocations, our air freight solutions offer a faster way to transport your belongings worldwide.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 3L3 10l7 3 3 7 8-17z" />
        <path d="M10 13l5-5" />
      </svg>
    ),
  },
  {
    key: "sea",
    title: "Sea freight services",
    body: "Sea freight is a cost-effective option for larger household shipments. We offer both Full Container Load (FCL) and Less-than-Container Load (LCL) solutions based on your shipment size.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l1.5 3h15L21 17" />
        <path d="M5 17V9h14v8" />
        <path d="M12 4v5" />
        <path d="M9 9h6" />
      </svg>
    ),
  },
  {
    key: "customs",
    title: "Customs clearance support",
    body: "International shipping involves customs regulations and documentation. Our team assists with the required paperwork and helps ensure a smooth customs clearance process.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 12l3 3 5-6" />
      </svg>
    ),
  },
  {
    key: "storage",
    title: "Secure storage solutions",
    body: "If your new home isn't ready, we offer secure short-term and long-term storage options to keep your belongings safe until you're ready for delivery.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    ),
  },
  {
    key: "insurance",
    title: "Transit insurance",
    body: "For peace of mind, we offer transit insurance to protect your belongings throughout your international move.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v5.5c0 4.2-2.9 7.6-7 8.5-4.1-.9-7-4.3-7-8.5V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

function OurServices() {
  return (
    <section className="band cream" id="our-services">
      <div className="wrap">
        <div className="eyebrow">OUR · INTERNATIONAL · MOVING · SERVICES · 04</div>
        <h2 className="h1 mt-16" style={{ maxWidth: "18ch" }}>
          Everything you need for a <span className="serif">smooth move</span> from Malaysia.
        </h2>
        <p className="lede mt-16" style={{ maxWidth: "62ch" }}>
          Every international relocation is unique. Whether moving a few items or an entire
          household, APAC Relocation offers a full range of services to make your move simple,
          secure, and hassle-free.
        </p>

        <div className="our-services-grid mt-48">
          {OUR_SERVICES.map((s) => (
            <article key={s.key} className="our-svc-card card">
              <div className="our-svc-icon">{s.icon}</div>
              <h3 className="h3 mt-32">{s.title}</h3>
              <p className="muted mt-12" style={{ fontSize: 15, lineHeight: 1.55 }}>
                {s.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export { OurServices };
