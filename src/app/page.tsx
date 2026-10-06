"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ---------- data ---------- */

const SLOTS = [
  { t: "10:00 AM", taken: true },
  { t: "10:30 AM", taken: true },
  { t: "11:00 AM", taken: false },
  { t: "11:30 AM", taken: false },
  { t: "12:00 PM", taken: true },
  { t: "12:30 PM", taken: false },
  { t: "4:00 PM", taken: false },
  { t: "4:30 PM", taken: true },
  { t: "5:00 PM", taken: false },
];

const SERVICES = [
  { name: "Haircut", price: 150, mins: 30 },
  { name: "Beard trim", price: 80, mins: 15 },
  { name: "Cut + beard", price: 200, mins: 45 },
];

const FEED = [
  "Arjun booked 5:00 PM at Royal Cuts",
  "Imran booked 11:30 AM at Style Studio",
  "Karthik booked 12:30 PM at Royal Cuts",
  "Vikram booked 4:00 PM at The Barber Co.",
];

const STEPS = [
  {
    title: "Find your shop",
    body: "Open the link your barber shares, or search near you.",
  },
  {
    title: "Pick a slot",
    body: "Only free times are shown. Tap one you like.",
  },
  {
    title: "Walk in",
    body: "Show your confirmation. Your chair is ready.",
  },
];

const PERKS = [
  {
    icon: "⚡",
    title: "No waiting",
    body: "Your chair is reserved before you leave home.",
  },
  {
    icon: "🔔",
    title: "Live slots",
    body: "Availability updates the moment someone books.",
  },
  {
    icon: "🛡️",
    title: "Free for you",
    body: "No app to install. No signup. No fees.",
  },
  {
    icon: "💬",
    title: "WhatsApp reminders",
    body: "A confirmation and a nudge before your time.",
  },
];

const BARBER_POINTS = [
  "Your own booking link to put on WhatsApp and Instagram",
  "Fewer no-shows with automatic reminders",
  "See your day at a glance, from your phone",
  "Set your hours, breaks and prices in minutes",
];

const QUOTES = [
  {
    text: "Earlier my phone rang all day with booking calls. Now customers book themselves and I just cut hair.",
    who: "Rahul",
    where: "Royal Cuts, Chennai",
    initials: "R",
    tint: "bg-orange-500",
  },
  {
    text: "I save an hour every evening that I used to spend on calls and notes. Sundays are no longer chaos.",
    who: "Imran",
    where: "Style Studio, Hyderabad",
    initials: "I",
    tint: "bg-rose-500",
  },
  {
    text: "I booked at 8 AM and walked in at 11. Zero waiting. I won't go back to the old way.",
    who: "Karthik",
    where: "Customer, Bengaluru",
    initials: "K",
    tint: "bg-amber-500",
  },
];

const FAQS = [
  {
    q: "Is SlotUp really free for customers?",
    a: "Yes. Booking a slot is free, and you don't need to install an app or create an account.",
  },
  {
    q: "What if I'm running late or can't make it?",
    a: "Use the link in your confirmation to cancel or pick another time, so the slot opens up for someone else.",
  },
  {
    q: "How do I add my own shop?",
    a: "Message us on WhatsApp. We set up your shop, hours and services, usually within a day.",
  },
  {
    q: "Do I pay online?",
    a: "Not required. You pay at the shop. Online payment through UPI is something barbers can turn on.",
  },
];

const STATS = [
  { end: 0, suffix: " min", label: "Average wait" },
  { end: 5, suffix: " sec", label: "To book a slot" },
  { end: 0, prefix: "₹", label: "Cost to customers" },
];

/* ---------- hooks ---------- */

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function useCountUp(end: number, start: boolean, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (end === 0) {
      setValue(0);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, start, duration]);

  return value;
}

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/* ---------- helpers ---------- */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- components ---------- */

function LiveFeed() {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setI((n) => (n + 1) % FEED.length);
        setShow(true);
      }, 350);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur"
      aria-live="polite"
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-400 motion-safe:animate-pulse" />
      <span
        className={`truncate transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        {FEED[i]}
      </span>
    </div>
  );
}

function SlotPicker() {
  const [service, setService] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const svc = SERVICES[service];

  if (done && slot) {
    return (
      <div className="animate-[fadeIn_0.35s_ease] rounded-3xl border border-orange-100 bg-white p-6 shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
          ✓
        </div>
        <h3 className="mt-4 text-center text-xl font-bold text-gray-900">
          You're booked
        </h3>
        <p className="mt-1 text-center text-sm text-gray-600">
          {svc.name} at {slot} today. Show this at Royal Cuts.
        </p>
        <div className="mt-4 rounded-2xl bg-orange-50 py-3 text-center text-sm font-semibold text-gray-800">
          Pay ₹{svc.price} at the shop
        </div>
        <button
          onClick={() => {
            setDone(false);
            setSlot(null);
          }}
          className="mt-4 w-full rounded-xl py-2 text-sm font-medium text-brand-600 underline underline-offset-4 transition hover:text-brand-700"
        >
          Try another slot
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-gray-900">
            Royal Cuts, Anna Nagar
          </div>
          <div className="text-xs text-gray-500">
            Today · 4 slots left in the evening
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 motion-safe:animate-pulse" />
          Open
        </span>
      </div>

      {/* Service */}
      <div
        className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar"
        role="radiogroup"
        aria-label="Service"
      >
        {SERVICES.map((s, i) => {
          const active = i === service;
          return (
            <button
              key={s.name}
              role="radio"
              aria-checked={active}
              onClick={() => setService(i)}
              className={`shrink-0 rounded-xl border px-3 py-2 text-left text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 ${
                active
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-brand-300"
              }`}
            >
              <div className="font-semibold">{s.name}</div>
              <div className={active ? "text-white/80" : "text-gray-500"}>
                ₹{s.price} · {s.mins} min
              </div>
            </button>
          );
        })}
      </div>

      {/* Slots */}
      <div
        className="mt-4 grid grid-cols-3 gap-2"
        role="radiogroup"
        aria-label="Time slot"
      >
        {SLOTS.map((s) => {
          const active = slot === s.t;
          return (
            <button
              key={s.t}
              disabled={s.taken}
              role="radio"
              aria-checked={active}
              onClick={() => setSlot(s.t)}
              className={`rounded-xl py-2.5 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 ${
                s.taken
                  ? "cursor-not-allowed bg-gray-100 text-gray-400 line-through"
                  : active
                  ? "bg-gray-900 text-white shadow-soft"
                  : "border border-orange-200 bg-orange-50/60 text-gray-800 hover:border-brand-300 hover:bg-orange-100"
              }`}
            >
              {s.t}
            </button>
          );
        })}
      </div>

      <button
        disabled={!slot}
        onClick={() => setDone(true)}
        className="mt-4 w-full rounded-2xl bg-brand-600 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
      >
        {slot ? `Book ${svc.name} at ${slot}` : "Choose a time to continue"}
      </button>

      <p className="mt-3 text-center text-[11px] text-gray-400">
        This is a demo — no money is taken.
      </p>
    </div>
  );
}

function StatCard({
  end,
  suffix = "",
  prefix = "",
  label,
  start,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  start: boolean;
}) {
  const value = useCountUp(end, start);
  return (
    <div className="py-5 text-center">
      <div className="text-xl font-extrabold text-gradient-brand sm:text-2xl">
        {prefix}
        {value}
        {suffix}
      </div>
      <div className="mt-0.5 text-[11px] font-medium text-gray-500 sm:text-xs">
        {label}
      </div>
    </div>
  );
}

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-orange-100 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-semibold transition hover:bg-orange-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
      >
        <span>{q}</span>
        <span
          className={`shrink-0 text-xl text-brand-600 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-gray-600">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

export default function HomePage() {
  const scrolled = useScrolled(40);
  const statsRef = useInView<HTMLDivElement>(0.3);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[#fdfaf6] text-gray-900">
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Nav */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b border-orange-100/70 bg-white/85 backdrop-blur-md"
            : "border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Link
            href="/"
            className={`text-lg font-extrabold tracking-tight transition-colors ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            Slot
            <span className={scrolled ? "text-brand-600" : "text-brand-300"}>
              Up
            </span>
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium">
            <a
              href="#barbers"
              className={`hidden transition sm:block ${
                scrolled
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-white/90 hover:text-white"
              }`}
            >
              For barbers
            </a>
            <a
              href="#faq"
              className={`hidden transition sm:block ${
                scrolled
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-white/90 hover:text-white"
              }`}
            >
              FAQ
            </a>
            <Link
              href="/b/demo-barber"
              className={`rounded-full px-4 py-2 transition ${
                scrolled
                  ? "bg-brand-600 text-white hover:bg-brand-700"
                  : "bg-white text-gray-900 hover:bg-orange-50"
              }`}
            >
              Book a slot
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=80"
          alt="Barber cutting a customer's hair"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/60 to-[#fdfaf6]" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-24 pt-32 lg:grid-cols-2 lg:pb-28 lg:pt-40">
          <div className="text-center lg:text-left">
            <LiveFeed />
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your chair is waiting.
              <br />
              <span className="text-brand-300">Your time is yours.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base text-white/85 lg:mx-0">
              Pick a free slot at a barber near you. No calls, no queue, no app.
              Try it on the card — it works.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/b/demo-barber"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-600 px-8 py-4 font-semibold text-white shadow-soft transition hover:bg-brand-700 active:scale-[0.99] sm:w-auto"
              >
                💈 Book a slot now
              </Link>
              <a
                href="#barbers"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-white/30 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
              >
                I own a barber shop
              </a>
            </div>

            <div className="mt-8 hidden items-center gap-3 text-xs text-white/60 sm:flex">
              <span className="flex items-center gap-1.5">
                <span className="text-brand-300">★★★★★</span>
                <span>Loved by early users</span>
              </span>
              <span className="text-white/30">·</span>
              <span>Made in India 🇮🇳</span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm lg:ml-auto">
            <SlotPicker />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        ref={statsRef.ref}
        className="relative z-10 mx-auto -mt-12 max-w-3xl px-5"
      >
        <div className="grid grid-cols-3 divide-x divide-orange-100 rounded-3xl border border-orange-100 bg-white shadow-soft">
          {STATS.map((s) => (
            <StatCard
              key={s.label}
              end={s.end}
              suffix={s.suffix}
              prefix={s.prefix}
              label={s.label}
              start={statsRef.inView}
            />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-5 pt-20">
        <Reveal>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Three taps, then you're in the chair
          </h2>
        </Reveal>

        <div className="relative mt-10 grid gap-4 md:grid-cols-3">
          {/* Connector line on desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent md:block"
          />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div className="relative flex items-start gap-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-card">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-rose-500 font-bold text-white shadow-soft">
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold">{s.title}</div>
                  <p className="mt-0.5 text-sm text-gray-600">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-5xl px-5 pt-20">
        <Reveal>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Made for real life
          </h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="h-full rounded-3xl border border-orange-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
                <div className="text-2xl">{p.icon}</div>
                <div className="mt-2 text-sm font-semibold">{p.title}</div>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* For barbers */}
      <section
        id="barbers"
        className="mx-auto max-w-5xl scroll-mt-20 px-5 pt-20"
      >
        <Reveal>
          <div className="grid overflow-hidden rounded-[2rem] bg-gray-900 text-white md:grid-cols-2">
            <img
              src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80"
              alt="Inside a barber shop"
              className="h-56 w-full object-cover md:h-full"
              loading="lazy"
            />
            <div className="p-7 sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Now onboarding shops
              </div>
              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                Run your shop, not your phone
              </h2>
              <p className="mt-3 text-sm text-white/70">
                Big chains have booking systems. Now your shop does too, without
                the setup headache.
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                {BARBER_POINTS.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-0.5 text-brand-300">✓</span>
                    <span className="text-white/90">{b}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/910000000000?text=Hi%2C%20I%20want%20to%20add%20my%20shop%20to%20SlotUp"
                className="mt-7 inline-flex items-center justify-center rounded-2xl bg-green-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-green-600"
              >
                Add my shop on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-5xl px-5 pt-20">
        <Reveal>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            What people say
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.who} delay={i * 100}>
              <figure className="h-full rounded-3xl border border-orange-100 bg-white p-5 shadow-card">
                <div className="text-sm text-amber-500">★★★★★</div>
                <blockquote className="mt-3 text-sm leading-relaxed text-gray-700">
                  "{q.text}"
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3 text-xs">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-white font-bold ${q.tint}`}
                  >
                    {q.initials}
                  </span>
                  <span>
                    <span className="font-semibold text-gray-900">
                      {q.who}
                    </span>
                    <span className="text-gray-500"> · {q.where}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-2xl scroll-mt-20 px-5 pt-20">
        <Reveal>
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Questions, answered
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-card">
            {FAQS.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-2xl px-5 pb-24 pt-20 text-center sm:pb-12">
        <Reveal>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready for your best haircut yet?
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Try the demo shop. It takes 10 seconds.
          </p>
          <Link
            href="/b/demo-barber"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-brand-600 px-6 py-4 font-semibold text-white shadow-soft transition hover:bg-brand-700 active:scale-[0.99] sm:w-auto sm:px-10"
          >
            Open the demo barber shop
          </Link>
        </Reveal>
      </section>

      <footer className="border-t border-orange-100 py-8 text-center text-xs text-gray-400">
        Built with ❤️ in India · SlotUp © 2026
      </footer>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-orange-100 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden">
        <Link
          href="/b/demo-barber"
          className="flex items-center justify-center rounded-2xl bg-brand-600 py-3.5 text-sm font-semibold text-white shadow-soft active:scale-[0.99]"
        >
          💈 Book a slot now
        </Link>
      </div>
      {/* Spacer so sticky CTA doesn't cover footer on mobile */}
      <div className="h-20 sm:hidden" aria-hidden />
    </main>
  );
}
