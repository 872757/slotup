import Link from "next/link";

const features = [
  {
    icon: "📍",
    title: "Find a barber",
    body: "Browse nearby shops and see their services and prices upfront.",
  },
  {
    icon: "🕐",
    title: "Pick your slot",
    body: "Choose a time that works for you. No calls, no waiting in line.",
  },
  {
    icon: "✅",
    title: "Skip the wait",
    body: "Show up at your slot. Get your haircut. Walk out. That's it.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="px-5 pt-14 pb-10 max-w-lg mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur rounded-full px-3 py-1 text-xs font-medium text-brand-700 border border-brand-100 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          Now live in your neighbourhood
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight leading-[1.05]">
          <span className="text-gradient-brand">SlotUp</span>
        </h1>

        <p className="mt-4 text-lg text-gray-700">
          Book your haircut and{" "}
          <span className="font-semibold text-gray-900">skip the wait</span>.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          The simple way to find a barber, pick a time, and walk in like a VIP.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/b/demo-barber"
            className="inline-flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-semibold shadow-soft transition"
          >
            💈 Try the demo shop
          </Link>

          <p className="text-xs text-gray-400">
            No signup. No app download. Just book.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 max-w-lg mx-auto pb-14">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest text-center mb-5">
          How it works
        </h2>

        <div className="space-y-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-3xl border border-orange-100/70 p-5 shadow-card flex gap-4 items-start"
            >
              <div className="text-2xl bg-brand-50 rounded-2xl w-12 h-12 flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{f.title}</div>
                <div className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                  {f.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="pb-10 text-center text-xs text-gray-400">
        Built with ❤️ in India · SlotUp
      </footer>
    </main>
  );
}
