import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { BookingEngine } from "@/components/booking/BookingEngine";
import { EVENT_TYPES, type EventTypeId } from "@/lib/bondz-data";

const search = z.object({
  event: z.enum(EVENT_TYPES.map((e) => e.id) as [EventTypeId, ...EventTypeId[]]).optional().catch(undefined),
  where: z.enum(["home", "venue"]).optional().catch(undefined),
  intro: z.number().optional().catch(undefined),
  step: z.coerce.number().min(1).max(6).optional().catch(undefined),
  reveal: z.coerce.number().optional().catch(undefined),
});

export const Route = createFileRoute("/book")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Get a Booking - Bondz Events" },
      { name: "description", content: "Six steps from “what are we celebrating?” to “You're Booked!” - only dates every partner can make are ever shown." },
      { property: "og:title", content: "Get a Booking - Bondz Events" },
      { property: "og:description", content: "Build your event and see only the dates that genuinely work." },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const s = Route.useSearch();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-full bg-ink" />;
  return (
    <BookingEngine
      key={`${s.event}-${s.where}-${s.step}-${s.reveal}`}
      init={{ event: s.event, where: s.where, step: s.step as any, reveal: !!s.reveal }}
      intro={!!s.intro}
    />
  );
}
