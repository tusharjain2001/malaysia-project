import React from "react";
import { SectionHeader, Placeholder } from "./chrome.jsx";

// Blog teaser section — 4 article cards linking out. Sits before the Footer.

const BLOG_POSTS = [
  {
    tag: "Budgeting",
    corner: "GUIDE",
    title: "How much does it really cost to move from Malaysia to Australia in 2026?",
    excerpt:
      "A full breakdown of freight, customs, insurance, and hidden fees for a household move from Kuala Lumpur to Sydney — with real RM figures.",
    read: "7 min read",
  },
  {
    tag: "Packing",
    corner: "CHECKLIST",
    title: "The export-grade packing checklist we use for every household move",
    excerpt:
      "What our crews crate first, how fragile items and pianos are protected for weeks at sea, and what you should pack yourself.",
    read: "5 min read",
  },
  {
    tag: "Settling in",
    corner: "LIVING ABROAD",
    title: "First 30 days in London: banking, GP registration, and school enrolment",
    excerpt:
      "The paperwork order that actually works — from opening a UK bank account to registering with a GP and enrolling your kids in school.",
    read: "6 min read",
  },
  {
    tag: "Packing",
    corner: "CUSTOMS",
    title: "What you can't ship: the restricted items list for 5 countries",
    excerpt:
      "Alcohol, plant materials, lithium batteries and more — a country-by-country guide to what customs will stop at the border.",
    read: "4 min read",
  },
];

function Blog() {
  return (
    <section className="band paper" id="blog">
      <div className="wrap">
        <SectionHeader
          kicker="FROM · THE · BLOG · 12"
          title="Guides for moving from Malaysia."
          lede="Practical, number-backed reading on cost, packing, and settling in — written by our move managers."
        />

        <div className="blog-grid mt-48">
          {BLOG_POSTS.map((p, i) => (
            <a key={i} className="blog-card card" href="#">
              <Placeholder ratio="wide" corner={p.corner} label="Editorial photo" />
              <div className="blog-card-body">
                <div className="chip">{p.tag}</div>
                <h3 className="h3 mt-16">{p.title}</h3>
                <p className="muted mt-12" style={{ fontSize: 14, lineHeight: 1.55 }}>{p.excerpt}</p>
                <div className="blog-card-foot mt-24">
                  <span className="mono text-mono-sm">{p.read}</span>
                  <span className="blog-card-arr">Read the guide <span className="arr">→</span></span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Blog };
