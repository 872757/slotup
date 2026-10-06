import Link from "next/link";

const stats = [
  { value: "0 min", label: "Average wait" },
  { value: "5 sec", label: "To book a slot" },
  { value: "100%", label: "Free for customers" },
];

const steps = [
  {
    n: "1",
    title: "Find your shop",
    body: "Open SlotUp, pick a barber near you.",
  },
  {
    n: "2",
    title: "Pick a time",
    body: "See real availability. Choose what suits you.",
  },
  {
    n: "3",
    title: "Walk in, sit down",
    body: "Show your confirmation. Get the cut. Leave.",
  },
];

const perks = [
  {
    icon: "⚡",
    title: "Skip the wait",
    body: "No more standing around. Your chair is reserved.",
  },
  {
    icon: "🔔",
    title: "Live availability",
    body: "See real open slots — updated as bookings come in.",
  },
  {
    icon: "🛡️",
    title: "Free for you",
    body: "Always free for customers. No app. No signup.",
  },
  {
    icon: "📱",
    title: "Works on any phone",
    body: "Just open the link. That's it.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero with background image */}
      <section className="relative">
        <div className="relative h-[420px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80"
            alt="Barber cutting hair"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#fdfaf6]" />

          <div className="relative z-10 max-w-lg mx-auto px-5 pt-14 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-xs font-medium text-white mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Booking is live now
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Skip the wait.
              <br />
              <span className="text-brand-300">Get your haircut.</span>
            </h1>

            <p className="mt-4 text-white/90 text-base">
              Find a barber near you, book a slot in seconds, and walk in like
              you own the place.
            </p>

            <div className="mt-7 flex flex-col gap-3 items-center">
              <Link
                href="/b/demo-barber"
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white py-4 px-8 rounded-2xl font-semibold shadow-soft transition"
              >
                💈 Book a slot now
              </Link>
              <span className="text-xs text-white/70">
                No app. No signup. No waiting.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="max-w-lg mx-auto px-5 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-soft border border-orange-100/70 grid grid-cols-3 divide-x divide-orange-100/70">
          {stats.map((s) => (
            <div key={s.label} className="py-5 text-center">
              <div className="text-xl font-extrabold text-gradient-brand">
                {s.value}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-lg mx-auto px-5 pt-14">
        <div className="text-center mb-7">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest">
            How it works
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            Three taps. That's it.
          </h2>
        </div>

        <div className="space-y-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="bg-white rounded-3xl border border-orange-100/70 shadow-card p-5 flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-rose-500 text-white font-bold flex items-center justify-center shrink-0">
                {s.n}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{s.title}</div>
                <div className="text-sm text-gray-600 mt-0.5">{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why SlotUp */}
      <section className="max-w-lg mx-auto px-5 pt-14">
        <div className="text-center mb-7">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest">
            Why SlotUp
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            Made for real life
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {perks.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-3xl border border-orange-100/70 shadow-card p-4"
            >
              <div className="text-2xl">{p.icon}</div>
              <div className="font-semibold text-gray-900 text-sm mt-2">
                {p.title}
              </div>
              <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                {p.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Image + text band */}
      <section className="max-w-lg mx-auto px-5 pt-14">
        <div className="rounded-3xl overflow-hidden shadow-soft border border-orange-100/70 bg-white">
          <img
            src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80"
            alt="Barber shop interior"
            className="w-full h-48 object-cover"
          />
          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900">
              Your neighbourhood barber, now online.
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Small shops deserve the same tools as big chains. SlotUp brings
              real-time booking to barbers you already trust.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-lg mx-auto px-5 pt-14 pb-10 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Ready for your best haircut yet?
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Try the demo shop — takes 10 seconds.
        </p>
        <Link
          href="/b/demo-barber"
          className="mt-5 inline-flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-semibold shadow-soft transition"
        >
          Open Demo Barber Shop →
        </Link>
      </section>

      <footer className="pb-10 text-center text-xs text-gray-400">
        Built with ❤️ in India · SlotUp © 2026
      </footer>
    </main>
  );
}
