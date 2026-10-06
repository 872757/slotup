import { supabase } from "./supabase";
import type { Shop } from "./types";

const SLOT_INTERVAL_MINUTES = 30;

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
}

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

function isoDateOf(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function getAvailableSlots(
  shop: Shop,
  date: string,
  durationMinutes: number
): Promise<string[]> {
  // Closed day check
  const dayOfWeek = new Date(date + "T00:00:00").getDay();
  const closedDays = (shop as any).closed_days as number[] | null;
  if (closedDays && closedDays.includes(dayOfWeek)) return [];

  const openMin = timeToMinutes(shop.opening_time);
  const closeMin = timeToMinutes(shop.closing_time);

  const [{ data: bookings }, { data: walkIns }, { data: blocked }] =
    await Promise.all([
      supabase
        .from("bookings")
        .select("start_time, end_time")
        .eq("shop_id", shop.id)
        .eq("booking_date", date)
        .eq("status", "confirmed"),
      supabase
        .from("walk_ins")
        .select("start_time, estimated_end_time")
        .eq("shop_id", shop.id)
        .eq("status", "in_progress")
        .gte("start_time", `${date}T00:00:00`)
        .lte("start_time", `${date}T23:59:59`),
      supabase
        .from("blocked_slots")
        .select("start_time, end_time")
        .eq("shop_id", shop.id)
        .gte("start_time", `${date}T00:00:00`)
        .lte("start_time", `${date}T23:59:59`),
    ]);

  type Interval = { start: number; end: number; blocks: boolean };
  const busy: Interval[] = [];

  for (const b of bookings ?? []) {
    busy.push({
      start: timeToMinutes(b.start_time),
      end: timeToMinutes(b.end_time),
      blocks: false,
    });
  }

  for (const w of walkIns ?? []) {
    const start = new Date(w.start_time);
    if (isoDateOf(start) !== date) continue;
    const end = new Date(w.estimated_end_time);
    busy.push({
      start: start.getHours() * 60 + start.getMinutes(),
      end: end.getHours() * 60 + end.getMinutes(),
      blocks: false,
    });
  }

  for (const bl of blocked ?? []) {
    const start = new Date(bl.start_time);
    if (isoDateOf(start) !== date) continue;
    const end = new Date(bl.end_time);
    busy.push({
      start: start.getHours() * 60 + start.getMinutes(),
      end: end.getHours() * 60 + end.getMinutes(),
      blocks: true,
    });
  }

  const chairs = shop.number_of_chairs;
  const slots: string[] = [];

  for (
    let start = openMin;
    start + durationMinutes <= closeMin;
    start += SLOT_INTERVAL_MINUTES
  ) {
    const end = start + durationMinutes;

    const isBlocked = busy.some(
      (b) => b.blocks && b.start < end && b.end > start
    );
    if (isBlocked) continue;

    const overlapping = busy.filter(
      (b) => !b.blocks && b.start < end && b.end > start
    ).length;

    if (overlapping < chairs) {
      slots.push(minutesToTime(start));
    }
  }

  return slots;
}
