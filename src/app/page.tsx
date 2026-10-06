"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

const steps = [
  { title: "Find your shop", body: "Open the link your barber shares, or search near you." },
  { title: "Pick a slot", body: "Only free times are shown. Tap one." },
  { title: "Walk in", body: "Show your confirmation. Your chair is ready." },
];

const perks = [
  { icon: "⚡", title: "No waiting", body: "Your chair is reserved before you leave home." },
  { icon: "🔔", title: "Live slots", body: "Availability updates the moment someone books." },
  { icon: "🛡️", title: "Free for you", body: "No app to install. No signup. No fees." },
  { icon: "💬", title: "WhatsApp reminders", body: "A confirmation and a nudge before your time." },
];

const barberPoints = [
  "Your own booking link to put on WhatsApp and Instagram",
  "Fewer no-shows with automatic reminders",
  "See your day at a glance, from your phone",
  "Set your hours, breaks and prices in minutes",
];

const quotes = [
  {
    text: "Earlier my phone rang all day with booking calls. Now customers book themselves and I just cut hair.",
    who: "Rahul, Royal Cuts",
    where: "Chennai",
  },
  {
    text: "I save an hour every evening that I used to spend on calls and notes. Sundays are no longer chaos.",
    who: "Imran, Style Studio",
    where: "Hyderabad",
  },
  {
    text: "I booked at 8 AM and walked in at 11. Zero waiting. I won't go back to the old way.",
    who: "Karthik",
    where: "Customer, Bengaluru",
  },
];

const faqs = [
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

/* ---------- components ---------- */

function SlotPicker() {
  const [service, setService] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const svc = SERVICES[service];

  if (done && slot) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-soft border border-orange-100 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
          ✓
        </div>
        <h3 className="mt-4 text-xl font-bold text-gray-900">You're booked</h3>
        <p className="mt-1 text-sm text-gray-600">
          {svc.name} at {slot} today. Show this at Royal Cuts.
        </p>
        <div className="mt-4 rounded-2xl bg-orange-50 py-3 text-sm font-semibold text-gray-800">
          Pay ₹{svc.price} at the shop
        </div>
        <button
          onClick={() => {
            setDone(false);
            setSlot(null);
          }}
          className="mt-4 text-sm font-medium text-brand-600 underline underline-offset-4"
        >
          Try another slot
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft border border-orange-100">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-gray-900">Royal Cuts, Anna Nagar</div>
          <div className="text-xs text-gray-500">Today · 4 slots left in the evening</div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 motion-safe:animate-pulse" />
          Open
        </span>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="radiogroup" aria-label="Service">
        {SERVICES.map((s, i) => (
          <button
            key={s.name}
            role="radio"
            aria-checked={i === service}
            onClick={() => setService(i)}
            className={`shrink-0 rounded-xl border px-3 py-2 text-left text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 ${
              i === service
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-brand-300"
            }`}
          >
            <div className="font-semibold">{s.name}</div>
            <div className={i === service ? "text-white/80" : "text-gray-500"}>
              ₹{s.price} · {s.mins} min
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Time slot">
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
                  ? "bg-gray-900 text-white"
                  : "border border-orange-200 bg-orange-50/60 text-gray-800 hover:bg-orange-100"
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
        className="mt-4 w-full rounded-2xl bg-brand-600 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.99] disabled:bg-gray-200 disabled:text-gray-500"
      >
        {slot ? `Book ${svc.name} at ${slot}` : "Choose a time to continue"}
      </button>
    </div>
  );
}

function LiveFeed() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % FEED.length), 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur"
      aria-live="polite"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-green-400 motion-safe:animate-pulse" />
      <span key={i}>{FEED[i]}</span>
    </div>
  );
}

/* ---------- page ---------- */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fdfaf6] text-gray-900">
      {/* Nav */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-white">
            Slot<span className="text-brand-300">Up</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm font-medium text-white/90">
            <a href="#barbers" className="hidden hover:text-white sm:block">
              For barbers
            </a>
            <a href="#faq" className="hidden hover:text-white sm:block">
              FAQ
            </a>
            <Link
              href="/b/demo-barber"
              className="rounded-full bg-white px-4 py-2 text-gray-900 transition hover:bg-orange-50"
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
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/65 to-[#fdfaf6]" />

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-24 pt-28 lg:grid-cols-2 lg:pt-32">
          <div className="text-center lg:text-left">
            <LiveFeed />
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your chair is waiting.
              <br />
              Your time is yours.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base text-white/85 lg:mx-0">
              Pick a free slot at a barber near you. No calls, no queue, no app. Try it on the card
              — it works.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/b/demo-barber"
                className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-8 py-4 font-semibold text-white shadow-soft transition hover:bg-brand-700 active:scale-[0.99]"
              >
                💈 Book a slot now
              </Link>
              <a
                href="#barbers"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                I own a barber shop
              </a>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm lg:ml-auto">
            <SlotPicker />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto -mt-10 max-w-3xl px-5">
        <div className="grid grid-cols-3 divide-x divide-orange-100 rounded-3xl border border-orange-100 bg-white shadow-soft">
          {[
            ["0 min", "Average wait"],
            ["5 sec", "To book a slot"],
            ["₹0", "Cost to customers"],
          ].map(([v, l]) => (
            <div key={l} className="py-5 text-center">
              <div className="text-xl font-extrabold text-gradient-brand sm:text-2xl">{v}</div>
              <div className="mt-0.5 text-[11px] font-medium text-gray-500 sm:text-xs">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-5 pt-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Three taps, then you're in the chair</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="flex items-start gap-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-card"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-rose-500 font-bold text-white">
                {i + 1}
              </div>
              <div>
                <div className="font-semibold">{s.title}</div>
                <p className="mt-0.5 text-sm text-gray-600">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-5xl px-5 pt-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Made for real life</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title} className="rounded-3xl border border-orange-100 bg-white p-4 shadow-card">
              <div className="text-2xl">{p.icon}</div>
              <div className="mt-2 text-sm font-semibold">{p.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For barbers */}
      <section id="barbers" className="mx-auto max-w-5xl scroll-mt-6 px-5 pt-20">
        <div className="grid overflow-hidden rounded-[2rem] bg-gray-900 text-white md:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80"
            alt="Inside a barber shop"
            className="h-56 w-full object-cover md:h-full"
          />
          <div className="p-7 sm:p-10">
            <h2 className="text-2xl font-bold sm:text-3xl">Run your shop, not your phone</h2>
            <p className="mt-3 text-sm text-white/70">
              Big chains have booking systems. Now your shop does too, without the setup headache.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {barberPoints.map((b) => (
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
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-5xl px-5 pt-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">What people say</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.who} className="rounded-3xl border border-orange-100 bg-white p-5 shadow-card">
              <blockquote className="text-sm leading-relaxed text-gray-700">“{q.text}”</blockquote>
              <figcaption className="mt-4 text-xs">
                <span className="font-semibold text-gray-900">{q.who}</span>
                <span className="text-gray-500"> · {q.where}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-2xl scroll-mt-6 px-5 pt-20">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Questions, answered</h2>
        <div className="mt-8 divide-y divide-orange-100 rounded-3xl border border-orange-100 bg-white shadow-card">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600">
                {f.q}
                <span className="text-brand-600 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-2xl px-5 pb-12 pt-20 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Ready for your best haircut yet?</h2>
        <p className="mt-2 text-sm text-gray-500">Try the demo shop. It takes 10 seconds.</p>
        <Link
          href="/b/demo-barber"
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-brand-600 px-6 py-4 font-semibold text-white shadow-soft transition hover:bg-brand-700 active:scale-[0.99] sm:w-auto sm:px-10"
        >
          Open the demo barber shop
        </Link>
      </section>

      <footer className="border-t border-orange-100 py-8 text-center text-xs text-gray-400">
        Built with ❤️ in India · SlotUp © 2026
      </footer>
    </main>
  );
}
