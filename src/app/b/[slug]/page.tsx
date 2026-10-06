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
    <main className="min-h-screen px-5 max-w-lg mx-auto pb-16">
      {/* Shop header card */}
      <header className="pt-8 pb-6">
        <div className="bg-white rounded-3xl border border-orange-100/70 shadow-card overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-brand-500 via-brand-600 to-rose-500 relative">
            <div className="absolute -bottom-7 left-5 w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center text-3xl">
              💈
            </div>
          </div>
          <div className="pt-10 pb-5 px-5">
            <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
            {shop.address && (
              <p className="text-sm text-gray-500 mt-1">📍 {shop.address}</p>
            )}
            {shop.phone && (
              <p className="text-sm text-gray-500 mt-0.5">📞 {shop.phone}</p>
            )}
            <div className="mt-3 flex gap-2">
              <span className="text-[11px] font-medium bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">
                Open {shop.opening_time?.slice(0, 5)} –{" "}
                {shop.closing_time?.slice(0, 5)}
              </span>
              <span className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                {shop.number_of_chairs}{" "}
                {shop.number_of_chairs === 1 ? "chair" : "chairs"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Services */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Choose a service
        </h2>

        {(services ?? []).length === 0 ? (
          <div className="bg-white rounded-3xl border border-orange-100/70 p-8 text-center text-gray-500 shadow-card">
            No services available yet.
          </div>
        ) : (
          <div className="space-y-3">
            {(services as Service[]).map((service) => (
              <Link
                key={service.id}
                href={`/b/${slug}/book?service=${service.id}`}
                className="group block bg-white rounded-3xl border border-orange-100/70 p-4 shadow-card hover:shadow-soft hover:border-brand-200 active:scale-[0.99] transition flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-2xl flex items-center justify-center shrink-0">
                  {serviceEmoji(service.name)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {service.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {service.duration_minutes} min
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

      <p className="text-center text-xs text-gray-400 mt-8">
        Tap a service to pick a time
      </p>
    </main>
  );
}
