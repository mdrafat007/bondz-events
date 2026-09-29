import { defineTool } from "@lovable.dev/mcp-js";
import { CATEGORIES, EVENT_TYPES, PARTNERS, VENUES, VIBES_BY_EVENT, BONDZ_FEE, DEPOSIT_RATE } from "../../bondz-data";

export default defineTool({
  name: "get_catalog",
  title: "Get event catalog",
  description: "List Bondz Events celebration types, vibes, service categories, partners and venues with prices.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const data = {
      organizerFee: { home: BONDZ_FEE.home, venue: BONDZ_FEE.venue },
      depositRate: DEPOSIT_RATE,
      events: EVENT_TYPES.map((e) => ({ id: e.id, title: e.title, line: e.line, vibes: [...VIBES_BY_EVENT[e.id]] })),
      services: CATEGORIES.map((c) => ({ id: c.id, label: c.label, description: c.desc })),
      partners: PARTNERS.map((p) => ({
        id: p.id, name: p.name, category: p.category, minGuests: p.min, maxGuests: p.max,
        events: p.events === "all" ? ["all"] : [...p.events], flatPrice: p.flat ?? null, perGuestPrice: p.perGuest ?? null,
      })),
      venues: VENUES.map((v) => ({
        id: v.id, name: v.name, area: v.area, minGuests: v.min, maxGuests: v.max, price: v.price, minSpend: v.minSpend,
        events: v.events === "all" ? ["all"] : [...v.events], amenities: [...v.amenities],
      })),
    };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: data };
  },
});
