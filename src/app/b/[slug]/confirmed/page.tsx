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

type ShopRow = { name: string; slug: string; address: string | null; phone: string };
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
    <main className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="pt-10 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          Booking confirmed
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Show this at the shop. See you soon!
        </p>
      </div>

      <div className="mt-8 bg-white rounded-2xl border p-6 space-y-4">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Shop
          </div>
          <div className="font-medium text-gray-900">{shop.name}</div>
          {shop.address && (
            <div className="text-sm text-gray-500 mt-0.5">{shop.address}</div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            When
          </div>
          <div className="font-medium text-gray-900">
            {prettyDate(booking.booking_date)}
          </div>
          <div className="text-gray-700">
            {prettyTime(booking.start_time)} – {prettyTime(booking.end_time)}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Service
          </div>
          <div className="font-medium text-gray-900">
            {service.name} · ₹{service.price}
          </div>
          <div className="text-sm text-gray-500">
            {service.duration_minutes} min
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Booked for
          </div>
          <div className="font-medium text-gray-900">{customer.name}</div>
          <div className="text-sm text-gray-500">{customer.phone}</div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href={`/b/${slug}`}
          className="text-sm text-gray-500 hover:text-black"
        >
          Book another appointment
        </Link>
      </div>
    </main>
  );
}
