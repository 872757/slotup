"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAvailableSlots } from "@/lib/availability";
import type { Shop, Service } from "@/lib/types";

type Props = {
  shop: Shop;
  service: Service;
};

function nextNDates(n: number): { iso: string; label: string; sub: string }[] {
  const out: { iso: string; label: string; sub: string }[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const iso = `${y}-${m}-${day}`;
    const label =
      i === 0
        ? "Today"
        : i === 1
        ? "Tomorrow"
        : d.toLocaleDateString("en-IN", { weekday: "short" });
    const sub =
      i < 2
        ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
        : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    out.push({ iso, label, sub });
  }
  return out;
}

export default function BookingWizard({ shop, service }: Props) {
  const dates = nextNDates(7);

  const [selectedDate, setSelectedDate] = useState(dates[0].iso);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingSlots(true);
    setSelectedSlot(null);
    getAvailableSlots(shop, selectedDate, service.duration_minutes).then(
      (result) => {
        if (!cancelled) {
          setSlots(result);
          setLoadingSlots(false);
        }
      }
    );
    return () => {
      cancelled = true;
    };
  }, [selectedDate, shop, service.duration_minutes]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim().replace(/\s+/g, "");

    if (trimmedName.length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setSubmitting(true);

    try {
      const { data: customer, error: cErr } = await supabase
        .from("customers")
        .upsert(
          { name: trimmedName, phone: trimmedPhone },
          { onConflict: "phone" }
        )
        .select("*")
        .single();

      if (cErr || !customer) {
        throw new Error(cErr?.message || "Could not save customer");
      }

      const [h, m] = selectedSlot!.split(":").map(Number);
      const endMinutes = h * 60 + m + service.duration_minutes;
      const endTime = `${String(Math.floor(endMinutes / 60)).padStart(
        2,
        "0"
      )}:${String(endMinutes % 60).padStart(2, "0")}:00`;

      const { data: booking, error: bErr } = await supabase
        .from("bookings")
        .insert({
          shop_id: shop.id,
          customer_id: customer.id,
          service_id: service.id,
          booking_date: selectedDate,
          start_time: selectedSlot! + ":00",
          end_time: endTime,
          status: "confirmed",
        })
        .select("manage_token")
        .single();

      if (bErr || !booking) {
        throw new Error(bErr?.message || "Could not create booking");
      }

      window.location.href = `/b/${shop.slug}/confirmed?token=${booking.manage_token}`;
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Service summary */}
      <div className="bg-white rounded-3xl border border-orange-100/70 shadow-card p-4 flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-brand-50 text-2xl flex items-center justify-center shrink-0">
          {service.name.toLowerCase().includes("beard") ? "🪒" : "✂️"}
        </div>
        <div className="flex-1">
          <div className="text-[11px] text-gray-500 uppercase tracking-widest">
            Service
          </div>
          <div className="font-semibold text-gray-900">{service.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            {service.duration_minutes} min
          </div>
        </div>
        <div className="font-bold text-gray-900">₹{service.price}</div>
      </div>

      {/* Date picker */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Pick a date
        </h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5">
          {dates.map((d) => {
            const active = selectedDate === d.iso;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => setSelectedDate(d.iso)}
                className={`flex-shrink-0 min-w-[76px] py-3 px-3 rounded-2xl border text-center transition ${
                  active
                    ? "bg-brand-600 border-brand-600 text-white shadow-soft"
                    : "bg-white border-orange-100/70 text-gray-700 hover:border-brand-200"
                }`}
              >
                <div className="text-sm font-semibold">{d.label}</div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    active ? "text-white/80" : "text-gray-400"
                  }`}
                >
                  {d.sub}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Slot picker */}
      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Pick a time
        </h2>

        {loadingSlots ? (
          <div className="bg-white rounded-3xl border border-orange-100/70 p-6 text-center text-gray-400 text-sm shadow-card">
            Finding open slots…
          </div>
        ) : slots.length === 0 ? (
          <div className="bg-white rounded-3xl border border-orange-100/70 p-6 text-center text-gray-500 text-sm shadow-card">
            No slots available on this day.
            <br />
            Try another date.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {slots.map((s) => {
              const active = selectedSlot === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSlot(s)}
                  className={`py-3 rounded-2xl border text-sm font-semibold transition ${
                    active
                      ? "bg-brand-600 border-brand-600 text-white shadow-soft"
                      : "bg-white text-gray-800 border-orange-100/70 hover:border-brand-200 active:scale-[0.98]"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Contact form */}
      {selectedSlot && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-orange-100/70 shadow-card p-5 space-y-4"
        >
          <div>
            <div className="text-[11px] text-gray-500 uppercase tracking-widest">
              Your slot
            </div>
            <div className="font-semibold text-gray-900 text-lg">
              {selectedSlot}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">
              Your name
            </label>
            <input
              type="text"
              placeholder="e.g. Ravi Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">
              Mobile number
            </label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
              autoComplete="tel"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-semibold shadow-soft disabled:opacity-50 transition"
          >
            {submitting ? "Booking…" : `Confirm booking · ₹${service.price}`}
          </button>

          <p className="text-[11px] text-center text-gray-400">
            You'll get a confirmation with your slot details.
          </p>
        </form>
      )}
    </div>
  );
}
