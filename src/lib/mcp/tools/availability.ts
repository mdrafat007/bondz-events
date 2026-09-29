import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  availableDays, estimate, dayToDate, slotOpen, SLOTS, VENUES, GUEST_MIN, GUEST_MAX,
  type CategoryId, type EventTypeId, type Sel,
} from "../../bondz-data";

const events = ["wedding", "anniversary", "birthday", "bbq", "family", "corporate", "hybrid", "custom"] as const;
const cats = ["catering", "decor", "dj", "equipment", "staff", "cleaning", "photo", "lighting", "hybrid"] as const;

export default defineTool({
  name: "check_availability",
  title: "Check availability & estimate",
  description: "Find dates in the next 75 days when Mr. Bondz, the venue and every chosen partner are all free, plus a price estimate.",
  inputSchema: {
    event: z.enum(events).describe("Celebration type."),
    guests: z.number().int().min(GUEST_MIN).max(GUEST_MAX).describe("Guest count."),
    venue: z.string().optional().describe("Venue id from get_catalog; omit to host at your own place."),
    services: z.array(z.enum(cats)).default([]).describe("Service category ids."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ event, guests, venue, services }) => {
    if (venue && !VENUES.some((v) => v.id === venue)) throw new ToolError(`Unknown venue "${venue}"`);
    const sel: Sel = {
      event: event as EventTypeId, guests, where: venue ? "venue" : "home", venue: venue ?? null,
      services: services as CategoryId[],
    };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates = availableDays(sel).map((d) => ({
      date: dayToDate(today, d).toISOString().slice(0, 10),
      openSlots: SLOTS.filter((_, i) => slotOpen(d, i)).map((s) => String(s)),
    }));
    const est = estimate(sel);
    const data = {
      availableDates: dates,
      estimate: {
        lines: est.lines.map((l) => ({ label: l.label, amount: l.amount, note: l.note ?? null })),
        total: est.total, deposit: est.deposit, balance: est.balance,
      },
    };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: data };
  },
});
