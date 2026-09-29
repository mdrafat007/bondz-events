import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { BookingEngine } from "@/components/booking/BookingEngine";
import type { Step } from "@/components/booking/store";
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
      { name: "description", content: "Explore six steps to plan a sample celebration with Mr. Bondz using simulated partner availability and estimated pricing." },
      { property: "og:title", content: "Get a Booking - Bondz Events" },
      { property: "og:description", content: "Build a sample event and compare available dates in the planning preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
      init={{ event: s.event, where: s.where, step: s.step as Step | undefined, reveal: !!s.reveal }}
      intro={!!s.intro}
    />
  );
}
