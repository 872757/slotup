"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAvailableSlots } from "@/lib/availability";
import type { Shop, Service } from "@/lib/types";

type Props = {
  shop: Shop;
  service: Service;
};

function nextNDates(n: number): { iso: string; label: string }[] {
  const out: { iso: string; label: string }[] = [];
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
        : d.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
    out.push({ iso, label });
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
      {/* Selected service summary */}
      <div className="bg-white rounded-xl border p-4">
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          Service
        </div>
        <div className="font-medium text-gray-900 mt-0.5">
          {service.name} · ₹{service.price} · {service.duration_minutes} min
        </div>
      </div>

      {/* Date picker */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Pick a date
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {dates.map((d) => (
            <button
              key={d.iso}
              type="button"
              onClick={() => setSelectedDate(d.iso)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl border text-sm font-medium transition ${
                selectedDate === d.iso
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>

      {/* Slot picker */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Pick a time
        </h2>

        {loadingSlots ? (
          <div className="bg-white rounded-xl border p-6 text-center text-gray-500 text-sm">
            Loading times…
          </div>
        ) : slots.length === 0 ? (
          <div className="bg-white rounded-xl border p-6 text-center text-gray-500 text-sm">
            No slots available on this day. Try another date.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {slots.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSlot(s)}
                className={`py-3 rounded-xl border text-sm font-medium transition ${
                  selectedSlot === s
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-800 border-gray-200 active:bg-gray-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Contact form */}
      {selectedSlot && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Your details
          </h2>

          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
            autoComplete="name"
          />

          <input
            type="tel"
            inputMode="numeric"
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-black"
            autoComplete="tel"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-3 px-6 rounded-xl font-medium disabled:opacity-50"
          >
            {submitting ? "Booking…" : "Confirm booking"}
          </button>
        </form>
      )}
    </div>
  );
}
