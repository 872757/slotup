import { supabase } from "@/lib/supabase";
import type { Shop, Service } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";

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

  if (!shop) {
    notFound();
  }

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("shop_id", shop.id)
    .eq("active", true)
    .order("price", { ascending: true });

  return (
    <main className="min-h-screen p-4 max-w-lg mx-auto pb-24">
      <header className="pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
        {shop.address && (
          <p className="text-sm text-gray-500 mt-1">{shop.address}</p>
        )}
        {shop.phone && (
          <p className="text-sm text-gray-500">📞 {shop.phone}</p>
        )}
      </header>

      <section className="mt-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Choose a service
        </h2>

        {(services ?? []).length === 0 ? (
          <div className="bg-white rounded-xl border p-6 text-center text-gray-500">
            No services available yet.
          </div>
        ) : (
          <div className="space-y-2">
            {(services as Service[]).map((service) => (
              <Link
                key={service.id}
                href={`/b/${slug}/book?service=${service.id}`}
                className="block bg-white rounded-xl border p-4 flex items-center justify-between active:bg-gray-50 transition"
              >
                <div>
                  <div className="font-medium text-gray-900">
                    {service.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {service.duration_minutes} min
                  </div>
                </div>
                <div className="font-semibold text-gray-900">
                  ₹{service.price}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <p className="text-center text-xs text-gray-400 mt-8">
        Tap a service to continue.
      </p>
    </main>
  );
}
