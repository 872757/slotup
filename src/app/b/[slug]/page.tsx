import { supabase } from "@/lib/supabase";
import type { Shop, Service } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";

function serviceEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("beard") || n.includes("shave")) return "🪒";
  if (n.includes("hair") || n.includes("cut")) return "✂️";
  if (n.includes("massage")) return "💆";
  if (n.includes("facial") || n.includes("clean")) return "🧖";
  if (n.includes("color") || n.includes("dye")) return "🎨";
  if (n.includes("wash")) return "🚿";
  return "💈";
}

const SHOP_HERO =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80";

export default async function ShopBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single<Shop>();

  if (!shop) notFound();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("shop_id", shop.id)
    .eq("active", true)
    .order("price", { ascending: true });

  return (
    <main className="min-h-screen max-w-lg mx-auto pb-16">
      {/* Hero banner */}
      <header className="relative">
        <div className="relative h-56 sm:h-64 overflow-hidden rounded-b-[2rem]">
          <img
            src={SHOP_HERO}
            alt="Barber shop"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Link
              href="/"
              className="rounded-full bg-white/20 backdrop-blur text-white text-xs font-medium px-3 py-1.5 border border-white/20"
            >
              ← Home
            </Link>
            <span className="rounded-full bg-green-500 text-white text-[11px] font-semibold px-2.5 py-1">
              ● Open now
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="text-2xl font-extrabold drop-shadow-sm">
              {shop.name}
            </h1>
            {shop.address && (
              <p className="text-xs text-white/85 mt-1">📍 {shop.address}</p>
            )}
          </div>
        </div>
      </header>

      {/* Info chips */}
      <section className="px-5 -mt-5 relative z-10">
        <div className="bg-white rounded-3xl border border-orange-100 shadow-card p-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[11px] text-gray-500">Opens</div>
            <div className="text-sm font-semibold">
              {shop.opening_time?.slice(0, 5)}
            </div>
          </div>
          <div className="border-x border-orange-100">
            <div className="text-[11px] text-gray-500">Closes</div>
            <div className="text-sm font-semibold">
              {shop.closing_time?.slice(0, 5)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-gray-500">Chairs</div>
            <div className="text-sm font-semibold">{shop.number_of_chairs}</div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-5 mt-8">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Choose a service
        </h2>

        {(services ?? []).length === 0 ? (
          <div className="bg-white rounded-3xl border border-orange-100 p-8 text-center text-gray-500 shadow-card">
            No services available yet.
          </div>
        ) : (
          <div className="space-y-3">
            {(services as Service[]).map((service) => (
              <Link
                key={service.id}
                href={`/b/${slug}/book?service=${service.id}`}
                className="group block bg-white rounded-3xl border border-orange-100 p-4 shadow-card hover:shadow-soft hover:border-brand-200 active:scale-[0.99] transition flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-50 to-orange-100 text-2xl flex items-center justify-center shrink-0">
                  {serviceEmoji(service.name)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {service.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    ⏱ {service.duration_minutes} min
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    ₹{service.price}
                  </div>
                  <div className="text-[11px] text-brand-600 font-medium mt-0.5">
                    Book →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Trust strip */}
      <section className="px-5 mt-8">
        <div className="bg-white/70 backdrop-blur rounded-3xl border border-orange-100 p-4 flex items-center justify-around text-center text-[11px] text-gray-600">
          <div>
            <div className="text-lg">⚡</div>
            <div className="mt-1 font-medium">Instant booking</div>
          </div>
          <div>
            <div className="text-lg">🛡️</div>
            <div className="mt-1 font-medium">Free for you</div>
          </div>
          <div>
            <div className="text-lg">💬</div>
            <div className="mt-1 font-medium">WhatsApp confirm</div>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-gray-400 mt-8">
        Tap a service to pick a time
      </p>
    </main>
  );
}
