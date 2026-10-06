import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

type BookingRow = {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  shop_id: string;
  service_id: string;
  customer_id: string;
};

type ShopRow = {
  name: string;
  slug: string;
  address: string | null;
  phone: string;
};
type ServiceRow = { name: string; price: number; duration_minutes: number };
type CustomerRow = { name: string; phone: string };

function prettyTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  let h = Number(hStr);
  const m = mStr;
  const ampm = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${ampm}`;
}

function prettyDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default async function ConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug } = await params;
  const { token } = await searchParams;

  if (!token) notFound();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("manage_token", token)
    .single<BookingRow>();

  if (!booking) notFound();

  const [{ data: shop }, { data: service }, { data: customer }] =
    await Promise.all([
      supabase
        .from("shops")
        .select("name, slug, address, phone")
        .eq("id", booking.shop_id)
        .single<ShopRow>(),
      supabase
        .from("services")
        .select("name, price, duration_minutes")
        .eq("id", booking.service_id)
        .single<ServiceRow>(),
      supabase
        .from("customers")
        .select("name, phone")
        .eq("id", booking.customer_id)
        .single<CustomerRow>(),
    ]);

  if (!shop || !service || !customer) notFound();

  return (
    <main className="min-h-screen max-w-lg mx-auto pb-16">
      {/* Hero */}
      <div className="relative h-44 overflow-hidden rounded-b-[2rem]">
        <img
          src="https://images.unsplash.com/photo-1521490878406-4948107ec98f?auto=format&fit=crop&w=1200&q=80"
          alt="Barber tools"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-5">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-3xl shadow-soft">
            ✓
          </div>
          <h1 className="text-2xl font-extrabold mt-3">You're booked!</h1>
          <p className="text-xs text-white/85 mt-1">
            Show this at the shop. See you soon.
          </p>
        </div>
      </div>

      {/* Details card */}
      <section className="px-5 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl border border-orange-100 shadow-soft p-6 space-y-5">
          <div>
            <div className="text-[11px] text-gray-500 uppercase tracking-widest">
              Shop
            </div>
            <div className="font-semibold text-gray-900 mt-1">{shop.name}</div>
            {shop.address && (
              <div className="text-sm text-gray-500 mt-0.5">
                📍 {shop.address}
              </div>
            )}
          </div>

          <div className="border-t border-orange-100 pt-5">
            <div className="text-[11px] text-gray-500 uppercase tracking-widest">
              When
            </div>
            <div className="font-semibold text-gray-900 mt-1">
              {prettyDate(booking.booking_date)}
            </div>
            <div className="text-brand-700 font-semibold">
              {prettyTime(booking.start_time)} – {prettyTime(booking.end_time)}
            </div>
          </div>

          <div className="border-t border-orange-100 pt-5">
            <div className="text-[11px] text-gray-500 uppercase tracking-widest">
              Service
            </div>
            <div className="font-semibold text-gray-900 mt-1">
              {service.name}
            </div>
            <div className="text-sm text-gray-500">
              {service.duration_minutes} min · ₹{service.price}
            </div>
          </div>

          <div className="border-t border-orange-100 pt-5">
            <div className="text-[11px] text-gray-500 uppercase tracking-widest">
              Booked for
            </div>
            <div className="font-semibold text-gray-900 mt-1">
              {customer.name}
            </div>
            <div className="text-sm text-gray-500">{customer.phone}</div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="px-5 mt-6 flex flex-col gap-3">
        <a
          href={`tel:${shop.phone}`}
          className="w-full text-center bg-white border border-orange-200 text-gray-800 py-3.5 rounded-2xl font-semibold shadow-card"
        >
          📞 Call the shop
        </a>
        <Link
          href={`/b/${slug}`}
          className="w-full text-center bg-brand-600 text-white py-3.5 rounded-2xl font-semibold shadow-soft"
        >
          Book another slot
        </Link>
      </section>

      <p className="text-center text-[11px] text-gray-400 mt-8 px-5">
        You'll receive a WhatsApp confirmation shortly.
      </p>
    </main>
  );
}
