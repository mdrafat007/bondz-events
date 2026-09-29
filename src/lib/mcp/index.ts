import { defineMcp } from "@lovable.dev/mcp-js";
import catalogTool from "./tools/catalog";
import availabilityTool from "./tools/availability";

export default defineMcp({
  name: "bondz-events",
  title: "BONDZ EVENTS",
  version: "0.1.0",
  instructions:
    "Tools for Bondz Events, Mr. Bondz's solo event-organizing service. Use `get_catalog` for event types, services, partners and venues, then `check_availability` to find dates where everyone is free and get a price estimate with the 25% deposit.",
  tools: [catalogTool, availabilityTool],
});
