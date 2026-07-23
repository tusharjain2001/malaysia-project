import React, { useState, useEffect, useRef } from "react";
import { BookingFlow } from "./booking-flow.jsx";
import {
  createOrderForPricing,
  confirmRegistration,
  resendConfirmationCode,
  deepGet,
  loadGoogleMaps,
} from "../api/client.js";

// Hero — full-viewport editorial headline, centered.
// Quote form lives in its own full-width band below.

function Hero({ quoteState }) {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <div className="hero-left">
          <div className="eyebrow">KUALA LUMPUR · BASED · WORLDWIDE</div>
          <h1 className="display mt-24">
            Begin your international move from Malaysia with us.
          </h1>

          <div className="hero-desc mt-32">
            <p className="lede">
              Relocating internationally involves more than moving your belongings. Each
              stage, from planning and packing to shipping, customs clearance, and
              delivery, requires careful coordination.
            </p>
            <p className="lede mt-16">
              <strong>APAC Relocation assists</strong> individuals, families, and
              businesses moving from Malaysia to worldwide. Our experienced team manages
              the entire process, providing a single point of contact from your initial
              quote to the safe arrival of your belongings.
            </p>
            <p className="lede mt-16">
              We offer international moving services from major Malaysian cities,
              including Kuala Lumpur, Penang, Johor Bahru, Shah Alam, Petaling Jaya,
              Malacca, Ipoh, Kuching, and Kota Kinabalu. Whether moving a few items or an
              entire household, we tailor each relocation to your destination, timeline,
              and requirements.
            </p>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-visual">
            <image-slot
              id="hero-photo"
              shape="rect"
              placeholder="Drop a family / moving photo"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            ></image-slot>
            <div className="hero-visual-meta">
              <span><i />LIVE TRACKING</span>
              <span>KUL → SYD</span>
            </div>
            <div className="hero-route-card">
              <div className="from-to">
                <span>KUL</span>
                <span className="arr">→</span>
                <span>SYD</span>
              </div>
              <div className="label">Sea freight · 24–34 days</div>
              <div className="live">In transit · updated hourly</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── OTP verification gate ───────────────────────────────────────────────────
// Shown after "Get my quote" — verifies the customer's email before the live quote.
function OtpGate({ email, onVerified, onBack }) {
  const LEN = 6;
  const [digits, setDigits] = useState(() => Array(LEN).fill(""));
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [verifying, setVerifying] = useState(false);
  const refs = useRef([]);

  useEffect(() => { refs.current[0] && refs.current[0].focus(); }, []);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const masked = (() => {
    const [user, domain] = (email || "").split("@");
    if (!domain) return "your email";
    const head = user.length <= 2 ? user.slice(0, 1) : user.slice(0, 2);
    return head + "•••@" + domain;
  })();

  const setDigit = (i, v) => {
    const c = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => { const n = [...prev]; n[i] = c; return n; });
    setError("");
    if (c && i < LEN - 1) refs.current[i + 1] && refs.current[i + 1].focus();
  };
  const onKey = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1].focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1].focus();
    if (e.key === "ArrowRight" && i < LEN - 1) refs.current[i + 1].focus();
  };
  const onPaste = (e) => {
    const txt = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, LEN);
    if (!txt) return;
    e.preventDefault();
    const n = Array(LEN).fill("");
    txt.split("").forEach((d, i) => (n[i] = d));
    setDigits(n);
    setError("");
    const last = Math.min(txt.length, LEN - 1);
    refs.current[last] && refs.current[last].focus();
  };

  const entered = digits.join("");
  const full = entered.length === LEN;

  const verify = async () => {
    if (!full || verifying) return;
    setVerifying(true);
    setError("");
    try {
      await confirmRegistration(entered, email);
      onVerified();
    } catch (e) {
      const msg = (e.message || "").toLowerCase();
      // Account already confirmed on a previous visit — nothing to verify.
      if (msg.includes("already") && msg.includes("confirm")) {
        onVerified();
        return;
      }
      setError(e.message || "That code doesn't match. Check your email and try again.");
      setDigits(Array(LEN).fill(""));
      refs.current[0] && refs.current[0].focus();
      setVerifying(false);
    }
  };
  const resend = async () => {
    setDigits(Array(LEN).fill(""));
    setError("");
    setNotice("");
    try {
      await resendConfirmationCode(email);
      setNotice("A new code is on its way to your inbox.");
      setSeconds(30);
    } catch (e) {
      setError(e.message || "Couldn't resend the code. Please try again.");
    }
    refs.current[0] && refs.current[0].focus();
  };

  return (
    <div className="otp">
      <div className="otp-card">
        <div className="otp-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
            <line x1="10" y1="18.5" x2="14" y2="18.5" />
          </svg>
        </div>
        <div className="text-mono-sm">SECURE · VERIFICATION</div>
        <h3 className="otp-title">Verify your email</h3>
        <p className="otp-sub">
          We sent a 6-digit code to <span className="mono">{masked}</span>. Enter it below to
          unlock your live quote.
        </p>

        <div className="otp-inputs" onPaste={onPaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              className={"otp-box" + (error ? " err" : "") + (d ? " filled" : "")}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
            />
          ))}
        </div>

        {error && <div className="otp-error mono">{error}</div>}
        {notice && !error && <div className="otp-notice mono">{notice}</div>}

        <button className="btn primary otp-verify" disabled={!full || verifying} onClick={verify}>
          {verifying ? "Verifying…" : "Verify & continue"} <span className="arr">→</span>
        </button>

        <div className="otp-foot">
          <button type="button" className="otp-link" onClick={onBack}>← Edit details</button>
          {seconds > 0 ? (
            <span className="muted mono">Resend in 0:{String(seconds).padStart(2, "0")}</span>
          ) : (
            <button type="button" className="otp-link" onClick={resend}>Resend code</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── City autocomplete (origin & destination) ────────────────────────────────
// Text input backed by google.maps.places.Autocomplete (cities only). The
// selected place is normalized to "City, Country" — the backend's lead
// creation requires that shape. Without an API key (VITE_GOOGLE_PLACES_API_KEY
// in .env) it degrades to a plain text field.
function CityAutocomplete({ value, onChange }) {
  const inputRef = useRef(null);
  const acRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then((g) => {
      if (cancelled || !g || !g.maps?.places?.Autocomplete || !inputRef.current) return;
      // "(regions)" covers cities AND countries/states — searching "malaysia"
      // offers Malaysia itself, "sydney" offers the city.
      const ac = new g.maps.places.Autocomplete(inputRef.current, {
        types: ["(regions)"],
        fields: ["address_components", "name"],
      });
      ac.addListener("place_changed", () => {
        const place = ac.getPlace() || {};
        const comps = place.address_components || [];
        const get = (t) => (comps.find((c) => c.types.includes(t)) || {}).long_name;
        const city = get("locality") || get("postal_town") || get("administrative_area_level_1");
        const country = get("country");
        const next =
          city && country && city !== country ? `${city}, ${country}`
          : country || place.name || inputRef.current.value;
        onChangeRef.current(next);
      });
      acRef.current = ac;
    });
    return () => {
      cancelled = true;
      if (acRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(acRef.current);
      }
    };
  }, []);

  return (
    <input
      ref={inputRef}
      className="qc-input"
      type="text"
      placeholder="City, country"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// ── Full-width quote band ───────────────────────────────────────────────────
// Sits directly under the hero; horizontal row of inputs with a single big CTA.

function QuoteBand({ values, setValues, scrollToCalc }) {
  const update = (k, v) => setValues({ ...values, [k]: v });
  const [started, setStarted] = useState(false);
  const [gate, setGate] = useState("form"); // form | otp
  const [orderId, setOrderId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const reset = () => { setStarted(false); setGate("form"); setOrderId(null); setFormError(""); };

  // "Get my quote" — create the order (Step 1). New users get an OTP email;
  // already-verified users go straight into the booking flow.
  const submitQuote = async () => {
    if (submitting) return;
    setFormError("");
    if (!values.dest.trim() || !values.date || !values.name.trim() || !values.email.trim() || !values.phone.trim()) {
      setFormError("Please fill in every field so we can prepare your quote.");
      return;
    }
    // The backend's lead creation 500s (PRO_ERR_008) on a country-only
    // destination — require "City, Country". City-states like Singapore are OK.
    const destParts = values.dest.split(",").map((s) => s.trim()).filter(Boolean);
    if (destParts.length < 2 && destParts[0]?.toLowerCase() !== "singapore") {
      setFormError('Please choose a specific destination city — e.g. "Sydney, Australia" rather than just "Australia".');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
      setFormError("That email address doesn't look right — please check it.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createOrderForPricing(values);
      const id = deepGet(res, ["order_id", "orderId", "orderID"]);
      if (!id) throw new Error("We couldn't create your order. Please try again.");
      setOrderId(id);
      // Response includes user_exist — existing (already verified) users skip the OTP.
      const exists = deepGet(res, ["user_exist", "userExist", "user_exists"]);
      if (exists === true || exists === "true") setStarted(true);
      else setGate("otp");
    } catch (e) {
      setFormError(e.message || "Something went wrong creating your quote. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Once "Get my quote" is clicked, focus the page on just the form/flow —
  // hide every other page section until the customer resets.
  const flowActive = started || gate === "otp";
  useEffect(() => {
    document.body.classList.toggle("booking-active", flowActive);
    if (flowActive) {
      const el = document.getElementById("quote-band");
      if (el) window.scrollTo({ top: Math.max(0, el.offsetTop - 24), behavior: "smooth" });
    }
    return () => document.body.classList.remove("booking-active");
  }, [flowActive]);

  return (
    <section className="quote-band" id="quote-band">
      <div className="wrap">
        <div className="quote-band-hd">
          <div>
            {flowActive && (
              <button type="button" className="quote-band-home" onClick={reset}>
                <span className="arr">←</span> Back to home
              </button>
            )}
            <div className="eyebrow">INSTANT · QUOTE · 01</div>
            <h2 className="h1 mt-16">
              {started
                ? <>Real-time booking, <span className="serif">step by step.</span></>
                : gate === "otp"
                ? <>One quick check, <span className="serif">then your quote.</span></>
                : <>Tell us where you're moving. <span className="serif">Get a real-time quote.</span></>}
            </h2>
            {started && (
              <div className="quote-band-desc">
                <p>
                  Plan your international move in just a few simple steps. Use our AI-powered
                  video survey to create your inventory, receive a real-time quotation, complete
                  your payment securely, and confirm your booking — all from one place.
                </p>
              </div>
            )}
            {!started && gate !== "otp" && (
              <div className="quote-band-desc">
                <p>
                  Every international move is unique. The cost depends on your destination,
                  shipment volume, preferred shipping method, and any additional services you
                  require. Share a few details with us, and our relocation specialists will
                  prepare a tailored quotation based on your specific moving requirements.
                </p>
                <p>
                  Whether you're relocating a small apartment, a family home, or an office,
                  we'll recommend the most suitable shipping option and provide a clear
                  breakdown of the estimated costs and transit time.
                </p>
              </div>
            )}
          </div>
          <div className="quote-band-meta">
            <span><i />Real-time pricing</span>
            <span><i />AI video survey</span>
            <span><i />Pay &amp; book online</span>
          </div>
        </div>

        {started ? (
          <BookingFlow values={values} orderId={orderId} onReset={reset} />
        ) : gate === "otp" ? (
          <OtpGate
            email={values.email}
            onVerified={() => { setGate("form"); setStarted(true); }}
            onBack={() => setGate("form")}
          />
        ) : (
          <>
        <div className="quote-row single-row">
          <div className="quote-cell no-caret">
            <span className="qc-label">Moving from</span>
            <CityAutocomplete value={values.origin} onChange={(v) => update("origin", v)} />
          </div>
          <div className="quote-cell no-caret">
            <span className="qc-label">Moving to</span>
            <CityAutocomplete value={values.dest} onChange={(v) => update("dest", v)} />
          </div>
          <label className="quote-cell no-caret">
            <span className="qc-label">Moving date</span>
            <input
              className="qc-input"
              type="date"
              value={values.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </label>
          <label className="quote-cell">
            <span className="qc-label">Move type</span>
            <select
              className="qc-select"
              value={values.size}
              onChange={(e) => update("size", e.target.value)}
            >
              <option>Full Household</option>
              <option>Partial Household</option>
              <option>Few Boxes</option>
            </select>
          </label>
          <label className="quote-cell no-caret">
            <span className="qc-label">Name</span>
            <input
              className="qc-input"
              type="text"
              placeholder="Full name"
              value={values.name || ""}
              onChange={(e) => update("name", e.target.value)}
            />
          </label>
          <label className="quote-cell no-caret">
            <span className="qc-label">Email</span>
            <input
              className="qc-input"
              type="email"
              placeholder="you@email.com"
              value={values.email || ""}
              onChange={(e) => update("email", e.target.value)}
            />
          </label>
          <label className="quote-cell no-caret">
            <span className="qc-label">Phone number</span>
            <input
              className="qc-input"
              type="tel"
              placeholder="+60 XX-XXX XXXX"
              value={values.phone || ""}
              onChange={(e) => update("phone", e.target.value)}
            />
          </label>
        </div>

        <div className="quote-submit">
          <button className="btn primary" disabled={submitting} onClick={submitQuote}>
            {submitting ? "Creating your quote…" : "Get my quote"} <span className="arr">→</span>
          </button>
        </div>

        {formError && <div className="quote-error mono">{formError}</div>}

        <div className="quote-band-foot">
          <span><span className="check">✓</span> Transparent pricing</span>
          <span><span className="check">✓</span> IAM trusted member</span>
          <span><span className="check">✓</span> Singapore Logistics Association</span>
        </div>
        </>
        )}
      </div>
    </section>
  );
}

export { Hero, QuoteBand };
