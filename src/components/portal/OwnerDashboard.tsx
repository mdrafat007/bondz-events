import { useState, useMemo } from "react";
import {
  type PortalBooking,
  type CustomPartner,
  getAllPortalBookings,
  getCustomPartners,
  getPartnerBlackouts,
  togglePartnerBlackout,
} from "@/lib/portal-store";
import { PARTNERS, VENUES, isBusy, type EventTypeId, type Partner } from "@/lib/bondz-data";
import { AddPartnerModal } from "./AddPartnerModal";
import { triggerTap, playTapSound } from "@/lib/haptics";
import mascotWhite from "@/assets/mascot-white.png";

export function OwnerDashboard({
  onLogout,
  onSwitchToPartner,
}: {
  onLogout: () => void;
  onSwitchToPartner?: (partnerId: string) => void;
}) {
  const [filterEvent, setFilterEvent] = useState<string>("all");
  const [partnerFilter, setPartnerFilter] = useState<string>("all");
  const [inspectedPartnerId, setInspectedPartnerId] = useState<string | null>(null);
  const [partnerBlackoutsVersion, setPartnerBlackoutsVersion] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<PortalBooking | null>(null);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [customPartners, setCustomPartners] = useState<CustomPartner[]>(() => getCustomPartners());
  const [expandedMobileBooking, setExpandedMobileBooking] = useState<string | null>(null);

  const bookings = useMemo(() => getAllPortalBookings(), []);

  const filteredBookings = useMemo(() => {
    if (filterEvent === "all") return bookings;
    return bookings.filter((b) => b.event === filterEvent);
  }, [bookings, filterEvent]);

  // Overall financial and logistical metrics
  const totalVolume = bookings.reduce((sum, b) => sum + b.totalCost, 0);
  const totalDeposits = bookings.reduce((sum, b) => sum + b.depositPaid, 0);
  const totalPartnerLocks = bookings.reduce((sum, b) => sum + b.assignedPartners.length, 0);

  return (
    <div className="space-y-8">
      {/* Owner Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b hairline pb-6">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/50 bg-night p-2 shadow-raised">
            <img src={mascotWhite} alt="Mr. Bondz" className="size-full object-contain filter drop-shadow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="eyebrow text-primary text-[0.68rem] tracking-wider uppercase font-bold">Operations</span>
              <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[0.62rem] font-bold text-success flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
                Live Sync
              </span>
            </div>
            <h1 className="display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mt-0.5">
              Mr. Bondz
            </h1>
            <p className="text-[0.72rem] text-ink/65">
              London Studio HQ · 42 Bermondsey Street, Studio 4B · 8 Signature Event Pipelines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <a
            href="#partner-status-fleet"
            onClick={playTapSound}
            className="inline-flex h-8 sm:h-8.5 items-center justify-center whitespace-nowrap rounded-full border hairline bg-surface px-3 text-[0.68rem] font-bold text-ink/80 hover:border-primary hover:text-primary transition cursor-pointer"
          >
            Partner Status ↓
          </a>
          <button
            type="button"
            onClick={() => {
              playTapSound();
              setShowAddPartner(true);
            }}
            className="inline-flex h-8 sm:h-8.5 items-center justify-center whitespace-nowrap rounded-full bg-primary px-3 text-[0.68rem] font-bold text-primary-foreground hover:brightness-110 active:scale-95 transition shadow-xs cursor-pointer"
          >
            + Onboard Partner
          </button>
          <button
            type="button"
            onClick={() => {
              playTapSound();
              onLogout();
            }}
            className="inline-flex h-8 sm:h-8.5 items-center justify-center whitespace-nowrap rounded-full border hairline bg-surface px-3 text-[0.68rem] font-bold text-ink/75 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Top Key Performance Metric Bento */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border hairline bg-surface-light p-4 sm:p-5 shadow-xs">
          <span className="eyebrow text-ink/50 text-[0.68rem] block">Active Pipeline Value</span>
          <p className="display mt-1 text-2xl sm:text-3xl font-black text-ink">${totalVolume.toLocaleString()}</p>
          <span className="text-[0.68rem] font-medium text-ink/65 mt-0.5 block">Across 8 demo event types</span>
        </div>

        <div className="rounded-2xl border hairline bg-surface-light p-4 sm:p-5 shadow-xs">
          <span className="eyebrow text-primary text-[0.68rem] block font-bold">Cleared 25% Deposits</span>
          <p className="display mt-1 text-2xl sm:text-3xl font-black text-primary">${totalDeposits.toLocaleString()}</p>
          <span className="text-[0.68rem] font-medium text-ink/65 mt-0.5 block">Locked upon client signing</span>
        </div>

        <div className="rounded-2xl border hairline bg-surface-light p-4 sm:p-5 shadow-xs">
          <span className="eyebrow text-ink/50 text-[0.68rem] block">Partner Calendar Locks</span>
          <p className="display mt-1 text-2xl sm:text-3xl font-black text-ink">{totalPartnerLocks} Locked</p>
          <span className="text-[0.68rem] font-medium text-ink/65 mt-0.5 block">Zero phone call holds</span>
        </div>

        <div className="rounded-2xl border hairline bg-surface-light p-4 sm:p-5 shadow-xs">
          <span className="eyebrow text-ink/50 text-[0.68rem] block">Active Fleet Network</span>
          <p className="display mt-1 text-2xl sm:text-3xl font-black text-ink">
            {PARTNERS.length + customPartners.length} Partners
          </p>
          <span className="text-[0.68rem] font-medium text-ink/65 mt-0.5 block">Venues, catering, audio, decor</span>
        </div>
      </div>

      {/* Section 1: Bookings & Run of Show Management */}
      <div className="rounded-3xl border hairline bg-surface-light p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b hairline pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="eyebrow text-primary text-[0.68rem] font-mono">Live Operations</span>
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-[0.62rem] font-bold text-success">
                ● Synced
              </span>
            </div>
            <h2 className="display text-xl sm:text-2xl font-bold text-ink mt-0.5">Confirmed Event Bookings</h2>
            <p className="text-xs text-ink/60">
              Active celebrations matching the 8 event categories from the booking engine.
            </p>
          </div>

          {/* Mobile Category Dropdown (sm:hidden) */}
          <div className="sm:hidden flex items-center justify-between gap-2 border hairline rounded-2xl bg-canvas p-2">
            <span className="eyebrow text-ink/50 text-[0.68rem] uppercase font-bold pl-1">Filter Event:</span>
            <select
              value={filterEvent}
              onChange={(e) => {
                triggerTap();
                setFilterEvent(e.target.value);
              }}
              className="bg-transparent text-xs font-bold text-ink outline-none cursor-pointer capitalize pr-2"
            >
              {["all", "wedding", "birthday", "bbq", "corporate", "anniversary", "family", "hybrid", "custom"].map(
                (cat) => (
                  <option key={cat} value={cat} className="bg-canvas text-ink capitalize">
                    {cat === "all" ? "All Event Types" : cat}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Desktop & Tablet Event Filter Pills (hidden sm:flex) */}
          <div className="hidden sm:flex flex-wrap gap-1.5">
            {["all", "wedding", "birthday", "bbq", "corporate", "anniversary", "family", "hybrid", "custom"].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    triggerTap();
                    setFilterEvent(cat);
                  }}
                  className={`rounded-full px-3 py-1 text-[0.70rem] font-bold uppercase transition cursor-pointer ${
                    filterEvent === cat
                      ? "bg-ink text-canvas shadow-xs"
                      : "border hairline bg-canvas text-ink/70 hover:border-ink hover:text-ink"
                  }`}
                >
                  {cat}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Responsive Interactive Bookings Cards Grid (Mobile, Tablet & Desktop) */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredBookings.map((b) => {
            const isExpanded = expandedMobileBooking === b.id;
            return (
              <div key={b.id} className="rounded-2xl border hairline bg-canvas p-4 shadow-2xs transition flex flex-col justify-between">
                <div>
                  <div
                    className="flex items-start justify-between cursor-pointer select-none"
                    onClick={() => {
                      playTapSound();
                      setExpandedMobileBooking(isExpanded ? null : b.id);
                    }}
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-mono text-primary font-bold text-xs">{b.ref}</span>
                      <h3 className="font-bold text-ink text-base truncate mt-0.5">{b.eventTitle}</h3>
                      <p className="text-[0.72rem] text-ink/60 mt-0.5">
                        {b.dateStr} · {b.slot} · {b.guests} guests
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="font-mono font-bold text-ink text-sm">${b.totalCost.toLocaleString()}</span>
                      <span className="mt-1 flex items-center gap-1 rounded-full border hairline bg-surface px-2 py-0.5 text-[0.65rem] font-bold text-ink/70">
                        <span>{isExpanded ? "Hide" : "Details"}</span>
                        <span className="text-[0.60rem]">{isExpanded ? "▲" : "▼"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Collapsible Dropdown Card Body */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t hairline space-y-3 text-xs animate-in fade-in duration-200">
                      <div className="grid grid-cols-2 gap-2 text-[0.75rem]">
                        <div>
                          <span className="eyebrow text-ink/45 block text-[0.62rem]">Venue / Setup</span>
                          <p className="font-semibold text-ink mt-0.5">{b.venueName}</p>
                          <p className="text-ink/60 capitalize text-[0.70rem]">{b.where}</p>
                        </div>
                        <div>
                          <span className="eyebrow text-ink/45 block text-[0.62rem]">Deposit Locked</span>
                          <p className="font-mono font-bold text-success mt-0.5">${b.depositPaid.toLocaleString()}</p>
                          <p className="text-ink/60 text-[0.70rem]">25% confirmed</p>
                        </div>
                      </div>

                      <div>
                        <span className="eyebrow text-ink/45 block text-[0.62rem]">Client Contact</span>
                        <p className="font-medium text-ink mt-0.5">{b.clientName}</p>
                        <p className="text-ink/60 font-mono text-[0.70rem]">
                          {b.clientPhone} · {b.clientEmail}
                        </p>
                      </div>

                      <div>
                        <span className="eyebrow text-ink/45 block text-[0.62rem] mb-1">Assigned Fleet Partners</span>
                        <div className="flex flex-wrap gap-1">
                          {b.assignedPartners.map((p) => (
                            <span
                              key={p.partnerName}
                              className="rounded-md border hairline bg-surface px-2 py-0.5 text-[0.65rem] font-medium text-ink"
                            >
                              {p.partnerName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t hairline flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.70rem] text-success font-semibold">
                    ${b.depositPaid.toLocaleString()} deposit (25%)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      playTapSound();
                      setSelectedBooking(b);
                    }}
                    className="rounded-lg border hairline bg-surface px-2.5 py-1 text-[0.68rem] font-bold text-ink hover:border-primary hover:text-primary transition cursor-pointer shrink-0"
                  >
                    Inspect Timeline →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Partner Status & Fleet Dispatch */}
      <div
        id="partner-status-fleet"
        className="rounded-3xl border hairline bg-surface-light p-5 sm:p-7 shadow-xs scroll-mt-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b hairline pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="eyebrow text-primary text-[0.68rem] font-mono">Real-Time Fleet</span>
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-[0.62rem] font-bold text-success">
                ● 100% Calendar Linked
              </span>
            </div>
            <h2 className="display text-xl sm:text-2xl font-bold text-ink mt-0.5">Partner Status</h2>
            <p className="text-xs text-ink/60">
              Active vendors bound by the 100% calendar hold and quality guarantee. Switch directly into partner view to
              inspect availability.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
            {/* In-Place Partner Filter Dropdown */}
            <div className="flex items-center gap-1.5 rounded-full border hairline bg-canvas px-3 py-1.5 shadow-2xs">
              <span className="eyebrow text-ink/50 text-[0.65rem] uppercase font-bold">Filter:</span>
              <select
                value={partnerFilter}
                onChange={(e) => {
                  playTapSound();
                  const val = e.target.value;
                  setPartnerFilter(val);
                  if (val === "all") {
                    setInspectedPartnerId(null);
                  } else {
                    setInspectedPartnerId(val);
                  }
                }}
                className="bg-transparent text-xs font-bold text-ink outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-canvas text-ink">
                  All Fleet Partners ({PARTNERS.length + customPartners.length})
                </option>
                <optgroup label="Core Network" className="bg-canvas text-ink font-semibold">
                  {PARTNERS.map((p) => (
                    <option key={p.id} value={p.id} className="bg-canvas text-ink">
                      {p.name} ({p.category})
                    </option>
                  ))}
                </optgroup>
                {customPartners.length > 0 && (
                  <optgroup label="Custom Onboarded" className="bg-canvas text-ink font-semibold">
                    {customPartners.map((p) => (
                      <option key={p.id} value={p.id} className="bg-canvas text-ink">
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                playTapSound();
                setShowAddPartner(true);
              }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border hairline bg-canvas px-3.5 py-1.5 text-xs font-bold text-ink hover:border-primary hover:text-primary transition cursor-pointer"
            >
              + Onboard Partner
            </button>
          </div>
        </div>

        {/* Partner Cards Grid (Filtered in-place) */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Default Partners */}
          {PARTNERS.filter((p) => partnerFilter === "all" || partnerFilter === p.id).map((p) => {
            const blackouts = getPartnerBlackouts(p.id);
            const isSelected = inspectedPartnerId === p.id;
            return (
              <div
                key={p.id}
                className={`rounded-2xl border bg-canvas p-4 flex flex-col justify-between transition ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 shadow-md bg-primary/5"
                    : "hairline hover:border-primary/50"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="eyebrow text-primary text-[0.65rem] capitalize">{p.category}</span>
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[0.62rem] font-bold text-success">
                      Active
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-ink text-base mt-1">{p.name}</h4>
                  <p className="text-xs text-ink/65 mt-0.5">
                    Capacity: {p.min} - {p.max} guests · {p.perGuest ? `$${p.perGuest}/guest` : `$${p.flat} flat`}
                  </p>
                  <p className="text-[0.68rem] text-ink/50 mt-1 font-mono">
                    {blackouts.length > 0 ? `${blackouts.length} blackout dates set` : "All 75 days open"}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t hairline flex items-center justify-between text-[0.68rem] text-ink/60">
                  <span className="text-primary font-bold">Synchronized ✓</span>
                  <button
                    type="button"
                    onClick={() => {
                      playTapSound();
                      if (isSelected) {
                        setInspectedPartnerId(null);
                        setPartnerFilter("all");
                      } else {
                        setInspectedPartnerId(p.id);
                        setPartnerFilter(p.id);
                      }
                    }}
                    className={`font-bold transition cursor-pointer underline underline-offset-2 ${
                      isSelected ? "text-primary font-black" : "text-ink hover:text-primary"
                    }`}
                  >
                    {isSelected ? "Hide Inspection ▲" : "Inspect Status →"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Newly Added Custom Partners */}
          {customPartners
            .filter((p) => partnerFilter === "all" || partnerFilter === p.id)
            .map((p) => {
              const isSelected = inspectedPartnerId === p.id;
              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border p-4 flex flex-col justify-between transition ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 shadow-md bg-primary/10"
                      : "border-primary/30 bg-primary/5"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="eyebrow text-primary text-[0.65rem] capitalize">{p.category}</span>
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[0.62rem] font-bold text-primary">
                        Custom Onboarded
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-ink text-base mt-1">{p.name}</h4>
                    <p className="text-xs text-ink/75 mt-0.5">
                      Contact: {p.contact} · {p.rateLabel}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t hairline flex items-center justify-between text-[0.68rem] text-ink/60">
                    <span>{p.phone}</span>
                    <button
                      type="button"
                      onClick={() => {
                        playTapSound();
                        if (isSelected) {
                          setInspectedPartnerId(null);
                          setPartnerFilter("all");
                        } else {
                          setInspectedPartnerId(p.id);
                          setPartnerFilter(p.id);
                        }
                      }}
                      className="font-bold text-primary hover:underline transition cursor-pointer"
                    >
                      {isSelected ? "Hide ▲" : "Inspect →"}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* In-Place Partner Inspection Drawer / Panel */}
        {inspectedPartnerId && (() => {
          const defaultPartner = PARTNERS.find((p) => p.id === inspectedPartnerId);
          const customPartner = customPartners.find((p) => p.id === inspectedPartnerId);
          const activePartner = defaultPartner || (customPartner ? {
            id: customPartner.id,
            name: customPartner.name,
            category: customPartner.category,
            min: 10,
            max: 200,
            events: "all" as const,
            flat: 500,
            seed: 99,
            busyRate: 0.2,
          } : null);

          if (!activePartner) return null;

          const blackouts = getPartnerBlackouts(activePartner.id);
          const assignedOrders = bookings.filter((b) =>
            b.assignedPartners.some(
              (p) =>
                p.partnerId === activePartner.id ||
                p.partnerName.toLowerCase().includes(activePartner.name.toLowerCase()),
            ),
          );

          const totalEarnings = bookings.reduce((sum, b) => {
            const match = b.assignedPartners.find(
              (p) =>
                p.partnerId === activePartner.id ||
                p.partnerName.toLowerCase().includes(activePartner.name.toLowerCase()),
            );
            return sum + (match?.agreedFee || 0);
          }, 0);

          return (
            <div className="mt-6 border-t hairline pt-6 space-y-6 animate-in fade-in slide-in-from-top-3 duration-200">
              {/* Inspection Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-canvas p-4 sm:p-5 rounded-2xl border hairline">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="eyebrow text-primary text-[0.68rem] capitalize font-mono">
                      Partner In-Place Inspector
                    </span>
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[0.62rem] font-bold text-success">
                      ● Active Fleet Connection
                    </span>
                  </div>
                  <h3 className="display text-xl sm:text-2xl font-bold text-ink mt-0.5">
                    {activePartner.name}
                  </h3>
                  <p className="text-xs text-ink/65">
                    Category: <span className="capitalize font-semibold text-ink">{activePartner.category}</span> · Capacity: {activePartner.min} - {activePartner.max} guests · {assignedOrders.length} Confirmed Work Orders
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      playTapSound();
                      setInspectedPartnerId(null);
                      setPartnerFilter("all");
                    }}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full border hairline bg-surface px-3.5 py-1.5 text-xs font-bold text-ink/80 hover:bg-ink hover:text-canvas transition cursor-pointer"
                  >
                    ✕ Close Inspector
                  </button>
                </div>
              </div>

              {/* Partner Quick Bento */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border hairline bg-canvas p-4 shadow-2xs">
                  <span className="eyebrow text-ink/50 text-[0.65rem] block">Assigned Work Orders</span>
                  <p className="display mt-1 text-xl sm:text-2xl font-black text-ink">{assignedOrders.length} Events</p>
                  <span className="text-[0.65rem] font-medium text-ink/60 mt-0.5 block">Synced from Mr. Bondz</span>
                </div>
                <div className="rounded-2xl border hairline bg-canvas p-4 shadow-2xs">
                  <span className="eyebrow text-primary text-[0.65rem] block font-bold">Contracted Revenue</span>
                  <p className="display mt-1 text-xl sm:text-2xl font-black text-primary">${totalEarnings.toLocaleString()}</p>
                  <span className="text-[0.65rem] font-medium text-ink/60 mt-0.5 block">Guaranteed 25% deposit base</span>
                </div>
                <div className="rounded-2xl border hairline bg-canvas p-4 shadow-2xs">
                  <span className="eyebrow text-ink/50 text-[0.65rem] block">Guest Capacity</span>
                  <p className="display mt-1 text-xl sm:text-2xl font-black text-ink">{activePartner.min} - {activePartner.max}</p>
                  <span className="text-[0.65rem] font-medium text-ink/60 mt-0.5 block">Operational threshold</span>
                </div>
                <div className="rounded-2xl border hairline bg-canvas p-4 shadow-2xs">
                  <span className="eyebrow text-ink/50 text-[0.65rem] block">Active Blackout Holds</span>
                  <p className="display mt-1 text-xl sm:text-2xl font-black text-ink">{blackouts.length} Days</p>
                  <span className="text-[0.65rem] font-medium text-ink/60 mt-0.5 block">Excluded dates</span>
                </div>
              </div>

              {/* Assigned Work Orders List */}
              <div className="rounded-2xl border hairline bg-canvas p-4 sm:p-5 shadow-2xs">
                <h4 className="font-display font-bold text-ink text-base">
                  Assigned Work Orders for {activePartner.name}
                </h4>
                <p className="text-xs text-ink/60 mt-0.5">
                  Synchronized live dispatches matching client bookings.
                </p>
                {assignedOrders.length === 0 ? (
                  <p className="mt-3 py-6 text-center text-xs text-ink/50 italic font-serif-i">
                    No active bookings assigned to this partner in the current demo roster.
                  </p>
                ) : (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {assignedOrders.map((b) => {
                      const match = b.assignedPartners.find(
                        (p) =>
                          p.partnerId === activePartner.id ||
                          p.partnerName.toLowerCase().includes(activePartner.name.toLowerCase()),
                      );
                      return (
                        <div key={b.id} className="rounded-xl border hairline bg-surface p-3.5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between">
                              <span className="font-mono text-primary font-bold text-xs">{b.ref}</span>
                              <span className="font-mono font-bold text-success text-xs">
                                ${match?.agreedFee.toLocaleString()}
                              </span>
                            </div>
                            <h5 className="font-bold text-ink text-sm mt-1">{b.eventTitle}</h5>
                            <p className="text-[0.70rem] text-ink/65 mt-0.5">
                              {b.dateStr} · {b.slot} · {b.guests} guests · {b.venueName}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t hairline flex items-center justify-between text-[0.68rem]">
                            <span className="text-ink/60">Client: {b.clientName}</span>
                            <button
                              type="button"
                              onClick={() => {
                                playTapSound();
                                setSelectedBooking(b);
                              }}
                              className="font-bold text-primary hover:underline cursor-pointer"
                            >
                              Timeline & Strike →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 75-Day Availability & Blackout Controls (In-Place) */}
              <div className="rounded-2xl border hairline bg-canvas p-4 sm:p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b hairline pb-3">
                  <div>
                    <h4 className="font-display font-bold text-ink text-base">
                      75-Day Availability &amp; Blackout Manager
                    </h4>
                    <p className="text-xs text-ink/60">
                      Toggle blackout dates for {activePartner.name} in real time without navigating away.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[0.70rem] font-semibold text-ink/75">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded bg-success/20 border border-success/40" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded bg-primary" />
                      <span>Blackout (Blocked)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {Array.from({ length: 30 }, (_, dayIdx) => {
                    const isBlockedByPartner = blackouts.includes(dayIdx);
                    const isSimulatedBusy = isBusy(activePartner.seed, activePartner.busyRate, dayIdx);
                    const isBlocked = isBlockedByPartner || isSimulatedBusy;

                    const d = new Date();
                    d.setDate(d.getDate() + dayIdx);
                    const monthShort = d.toLocaleDateString("en-US", { month: "short" });
                    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
                    const dayNum = d.getDate();

                    return (
                      <button
                        key={dayIdx}
                        type="button"
                        onClick={() => {
                          playTapSound();
                          togglePartnerBlackout(activePartner.id, dayIdx);
                          setPartnerBlackoutsVersion((v) => v + 1);
                        }}
                        title={`Day +${dayIdx} (${weekday}, ${monthShort} ${dayNum}): ${
                          isBlocked ? "Blocked - Click to mark Available" : "Available - Click to mark Blocked"
                        }`}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-xl border transition-all cursor-pointer select-none text-left ${
                          isBlocked
                            ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                            : "hairline bg-surface hover:border-primary/50 text-ink hover:bg-canvas"
                        }`}
                      >
                        <div className="flex items-baseline gap-1.5 min-w-0">
                          <span className="font-mono text-sm font-black leading-none">{dayNum}</span>
                          <div className="flex flex-col leading-none">
                            <span className="text-[0.60rem] font-bold uppercase tracking-tight opacity-90">
                              {monthShort}
                            </span>
                            <span className="text-[0.52rem] uppercase opacity-65 font-medium">{weekday}</span>
                          </div>
                        </div>

                        <span
                          className={`text-[0.55rem] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                            isBlocked ? "bg-white/20 text-white" : "bg-success/15 text-success border border-success/30"
                          }`}
                        >
                          {isBlocked ? "Blocked" : "Open"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[0.70rem] text-ink/50 text-center font-serif-i italic">
                  Showing 30-day forecast. Live updates are directly linked to client booking availability.
                </p>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Booking Timeline & Run-of-Show Inspection Modal */}
      {selectedBooking && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl border hairline bg-surface-light p-6 sm:p-8 text-ink shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b hairline pb-4">
              <div>
                <span className="eyebrow text-primary font-mono">{selectedBooking.ref}</span>
                <h2 className="display mt-1 text-2xl font-bold tracking-tight sm:text-3xl text-ink">
                  {selectedBooking.eventTitle}
                </h2>
                <p className="mt-0.5 text-xs text-ink/65">
                  {selectedBooking.dateStr} · {selectedBooking.slot} · {selectedBooking.venueName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-full p-2 text-ink/60 hover:bg-canvas hover:text-ink transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Client & Financial Specs */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl border hairline bg-canvas p-4 text-xs">
                <div>
                  <span className="eyebrow text-ink/45 block text-[0.65rem]">Client Details</span>
                  <p className="font-bold text-ink text-sm mt-0.5">{selectedBooking.clientName}</p>
                  <p className="text-ink/70 font-mono">{selectedBooking.clientPhone}</p>
                  <p className="text-ink/70 font-mono">{selectedBooking.clientEmail}</p>
                </div>
                <div>
                  <span className="eyebrow text-ink/45 block text-[0.65rem]">Financials</span>
                  <p className="font-bold text-ink text-sm mt-0.5">
                    ${selectedBooking.totalCost.toLocaleString()} Total
                  </p>
                  <p className="text-success font-semibold">
                    ${selectedBooking.depositPaid.toLocaleString()} Deposit Paid (25%)
                  </p>
                  <p className="text-ink/65">Balance due 7 days prior</p>
                </div>
              </div>

              {/* Run of Show */}
              <div>
                <h3 className="font-display text-base font-bold text-ink uppercase tracking-tight [font-variation-settings:'wdth'_85] mb-3">
                  Live Run of Show &amp; Strike Schedule
                </h3>
                <div className="space-y-2 border-l-2 border-primary/40 pl-4">
                  {selectedBooking.runOfShow.map((item) => (
                    <div key={item.time} className="flex items-start gap-3 text-xs">
                      <span className="font-mono font-bold text-primary w-14 shrink-0">{item.time}</span>
                      <span className="text-ink/85">{item.action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Partner Work Orders */}
              <div>
                <h3 className="font-display text-base font-bold text-ink uppercase tracking-tight [font-variation-settings:'wdth'_85] mb-3">
                  Assigned Partner Work Orders
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {selectedBooking.assignedPartners.map((p) => (
                    <div
                      key={p.partnerName}
                      className="rounded-xl border hairline bg-canvas p-3 text-xs flex justify-between items-center"
                    >
                      <div>
                        <span className="eyebrow text-ink/45 block text-[0.62rem]">{p.category}</span>
                        <span className="font-bold text-ink">{p.partnerName}</span>
                      </div>
                      <span className="font-mono font-bold text-primary">${p.agreedFee.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t hairline flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-full bg-ink px-5 py-2 text-xs font-bold text-canvas hover:bg-primary transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Partner Dialog */}
      {showAddPartner && (
        <AddPartnerModal
          onClose={() => setShowAddPartner(false)}
          onAdded={(newPartner) => {
            setCustomPartners((prev) => [newPartner, ...prev]);
          }}
        />
      )}
    </div>
  );
}
