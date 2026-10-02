import { useState, useMemo, useEffect, useRef } from "react";
import {
  type PortalBooking,
  getAllPortalBookings,
  getPartnerBlackouts,
  togglePartnerBlackout,
  getCustomPartners,
  setStoredPartnerId,
} from "@/lib/portal-store";
import { PARTNERS, VENUES, HORIZON, isBusy } from "@/lib/bondz-data";
import { triggerTap, playTapSound } from "@/lib/haptics";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PartnerDashboard({
  currentPartnerId,
  onLogout,
}: {
  currentPartnerId: string;
  onLogout: () => void;
}) {
  const [partnerId, setPartnerId] = useState(currentPartnerId);
  const [blackouts, setBlackouts] = useState<number[]>(() => getPartnerBlackouts(partnerId));
  const [expandedMobileOrder, setExpandedMobileOrder] = useState<string | null>(null);
  const [bookings, setBookings] = useState<PortalBooking[]>(() => getAllPortalBookings());
  const [isPartnerMenuOpen, setIsPartnerMenuOpen] = useState(false);
  const partnerMenuRef = useRef<HTMLDivElement>(null);

  // Sync internal partnerId state if currentPartnerId prop changes
  useEffect(() => {
    setPartnerId(currentPartnerId);
    setBlackouts(getPartnerBlackouts(currentPartnerId));
    setBookings(getAllPortalBookings());
  }, [currentPartnerId]);

  // Click-outside listener for custom dropdown
  useEffect(() => {
    if (!isPartnerMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (partnerMenuRef.current && !partnerMenuRef.current.contains(e.target as Node)) {
        setIsPartnerMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPartnerMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isPartnerMenuOpen]);

  const customPartners = useMemo(() => getCustomPartners(), []);
  const allPartners = useMemo(() => {
    return [
      ...PARTNERS,
      ...VENUES.map((v) => ({
        id: v.id,
        name: v.name,
        category: "Venue",
        min: v.min,
        max: v.max,
        events: v.events,
        seed: v.seed,
        busyRate: v.busyRate,
        perGuest: 0,
        flat: v.price,
      })),
      ...customPartners.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        min: 10,
        max: 250,
        events: "all" as const,
        seed: 99,
        busyRate: 0.2,
        perGuest: 0,
        flat: 1000,
      })),
    ];
  }, [customPartners]);

  const activePartner = useMemo(
    () => allPartners.find((p) => p.id === partnerId) || allPartners[0]!,
    [allPartners, partnerId],
  );

  // Filter bookings where this partner is assigned
  const partnerBookings = useMemo(() => {
    return bookings.filter((b) =>
      b.assignedPartners?.some(
        (p) =>
          p.partnerId === partnerId ||
          p.partnerName.toLowerCase().trim() === activePartner.name.toLowerCase().trim() ||
          p.partnerName.toLowerCase().includes(activePartner.name.toLowerCase()) ||
          activePartner.name.toLowerCase().includes(p.partnerName.toLowerCase()) ||
          (activePartner.category === "Venue" && b.venueName.toLowerCase().includes(activePartner.name.toLowerCase())),
      ),
    );
  }, [bookings, partnerId, activePartner]);

  const totalEarnings = partnerBookings.reduce((sum, b) => {
    const match = b.assignedPartners?.find(
      (p) =>
        p.partnerId === partnerId ||
        p.partnerName.toLowerCase().trim() === activePartner.name.toLowerCase().trim() ||
        p.partnerName.toLowerCase().includes(activePartner.name.toLowerCase()) ||
        activePartner.name.toLowerCase().includes(p.partnerName.toLowerCase()) ||
        (activePartner.category === "Venue" && b.venueName.toLowerCase().includes(activePartner.name.toLowerCase())),
    );
    return sum + (match?.agreedFee || 0);
  }, 0);

  const handleToggleDay = (dayIndex: number) => {
    playTapSound();
    const updated = togglePartnerBlackout(partnerId, dayIndex);
    setBlackouts([...updated]);
    const isNowBlocked = updated.includes(dayIndex);
    if (isNowBlocked) {
      toast.warning(`Day +${dayIndex} marked UNAVAILABLE. Bondz booking engine will bypass this date.`);
    } else {
      toast.success(`Day +${dayIndex} reopened. Available for automatic booking matches.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Partner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b hairline pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow text-primary font-mono">{activePartner.category.toUpperCase()} FLEET</span>
            <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-success">
              ● Synced with Mr. Bondz
            </span>
          </div>
          <h1 className="display text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mt-0.5">
            {activePartner.name}
          </h1>
          <p className="text-xs text-ink/65">
            Partner Operational Dashboard · Real-time work orders &amp; 75-Day availability controls
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center justify-start sm:justify-end gap-2 sm:shrink-0">
          {/* Custom Partner Switcher Menu (Scroll-Quiet, Zero Scrollbar Visuals) */}
          <div className="relative" ref={partnerMenuRef}>
            <button
              type="button"
              onClick={() => {
                playTapSound();
                setIsPartnerMenuOpen(!isPartnerMenuOpen);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border hairline bg-surface px-3 py-1.5 text-xs font-bold text-ink hover:border-primary/50 transition cursor-pointer"
            >
              <span className="eyebrow text-ink/50 text-[0.65rem] font-bold">Partner:</span>
              <span className="truncate max-w-[140px] sm:max-w-[180px]">{activePartner.name}</span>
              <span className="text-[0.65rem] text-ink/50">▾</span>
            </button>

            {isPartnerMenuOpen && (
              <div className="scroll-quiet absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto rounded-2xl border hairline bg-surface p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider eyebrow text-primary/80">
                  Core Network
                </div>
                <div className="space-y-0.5">
                  {PARTNERS.map((p) => {
                    const isCur = partnerId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          playTapSound();
                          setPartnerId(p.id);
                          setStoredPartnerId(p.id);
                          setBlackouts(getPartnerBlackouts(p.id));
                          setBookings(getAllPortalBookings());
                          setIsPartnerMenuOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition cursor-pointer",
                          isCur
                            ? "bg-primary/15 text-primary font-bold"
                            : "text-ink/80 hover:bg-surface-light hover:text-ink font-medium",
                        )}
                      >
                        <span className="truncate">
                          {p.name}{" "}
                          <span className="text-[0.68rem] text-ink/40 font-normal">({p.category})</span>
                        </span>
                        {isCur && <span className="text-primary font-bold text-xs ml-1">✓</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 border-t hairline pt-1.5 px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider eyebrow text-primary/80">
                  Venues
                </div>
                <div className="space-y-0.5">
                  {VENUES.map((v) => {
                    const isCur = partnerId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          playTapSound();
                          setPartnerId(v.id);
                          setStoredPartnerId(v.id);
                          setBlackouts(getPartnerBlackouts(v.id));
                          setBookings(getAllPortalBookings());
                          setIsPartnerMenuOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition cursor-pointer",
                          isCur
                            ? "bg-primary/15 text-primary font-bold"
                            : "text-ink/80 hover:bg-surface-light hover:text-ink font-medium",
                        )}
                      >
                        <span className="truncate">
                          {v.name}{" "}
                          <span className="text-[0.68rem] text-ink/40 font-normal">(Venue)</span>
                        </span>
                        {isCur && <span className="text-primary font-bold text-xs ml-1">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {customPartners.length > 0 && (
                  <>
                    <div className="mt-2 border-t hairline pt-1.5 px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider eyebrow text-primary/80">
                      Custom Onboarded
                    </div>
                    <div className="space-y-0.5">
                      {customPartners.map((c) => {
                        const isCur = partnerId === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              playTapSound();
                              setPartnerId(c.id);
                              setStoredPartnerId(c.id);
                              setBlackouts(getPartnerBlackouts(c.id));
                              setBookings(getAllPortalBookings());
                              setIsPartnerMenuOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition cursor-pointer",
                              isCur
                                ? "bg-primary/15 text-primary font-bold"
                                : "text-ink/80 hover:bg-surface-light hover:text-ink font-medium",
                            )}
                          >
                            <span className="truncate">
                              {c.name}{" "}
                              <span className="text-[0.68rem] text-ink/40 font-normal">({c.category})</span>
                            </span>
                            {isCur && <span className="text-primary font-bold text-xs ml-1">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              playTapSound();
              onLogout();
            }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full border hairline bg-canvas px-3.5 py-2 text-xs font-bold text-ink/75 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Partner Performance Summary Bento */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border hairline bg-surface-light p-4 sm:p-5 shadow-xs">
          <span className="eyebrow text-ink/50 text-[0.68rem] block">Confirmed Work Orders</span>
          <p className="display mt-1 text-2xl sm:text-3xl font-black text-ink">{partnerBookings.length} Events</p>
          <span className="text-[0.68rem] font-medium text-ink/65 mt-0.5 block">Locked via Mr. Bondz</span>
        </div>

        <div className="rounded-2xl border hairline bg-surface-light p-4 sm:p-5 shadow-xs">
          <span className="eyebrow text-primary text-[0.68rem] block font-bold">Contracted Revenue</span>
          <p className="display mt-1 text-2xl sm:text-3xl font-black text-primary">${totalEarnings.toLocaleString()}</p>
          <span className="text-[0.68rem] font-medium text-ink/65 mt-0.5 block">Guaranteed 25% deposit base</span>
        </div>

        <div className="rounded-2xl border hairline bg-surface-light p-4 sm:p-5 shadow-xs">
          <span className="eyebrow text-ink/50 text-[0.68rem] block">Capacity Range</span>
          <p className="display mt-1 text-2xl sm:text-3xl font-black text-ink">
            {activePartner.min} - {activePartner.max}
          </p>
          <span className="text-[0.68rem] font-medium text-ink/65 mt-0.5 block">Guests supported</span>
        </div>

        <div className="rounded-2xl border hairline bg-surface-light p-4 sm:p-5 shadow-xs">
          <span className="eyebrow text-ink/50 text-[0.68rem] block">Active Blackout Holds</span>
          <p className="display mt-1 text-2xl sm:text-3xl font-black text-ink">{blackouts.length} Days</p>
          <span className="text-[0.68rem] font-medium text-ink/65 mt-0.5 block">Custom blocked dates</span>
        </div>
      </div>

      {/* Section 1: Assigned Work Orders */}
      <div className="rounded-3xl border hairline bg-surface-light p-5 sm:p-7 shadow-xs">
        <div className="border-b hairline pb-4">
          <h2 className="display text-xl sm:text-2xl font-bold text-ink">Assigned Work Orders &amp; Dispatches</h2>
          <p className="text-xs text-ink/60">
            Events synchronized directly from the Mr. Bondz booking engine. No manual invoicing or cold scheduling
            calls.
          </p>
        </div>

        {partnerBookings.length === 0 ? (
          <div className="py-12 text-center text-xs text-ink/50 font-serif-i italic">
            No active work orders currently scheduled for this partner. Select another partner above (e.g. Ember &amp;
            Oak Kitchen or DJ Nova) to inspect live schedules.
          </div>
        ) : (
          /* Responsive Interactive Cards (Mobile, Tablet & Desktop) */
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {partnerBookings.map((b) => {
              const match = b.assignedPartners.find(
                (p) =>
                  p.partnerId === partnerId || p.partnerName.toLowerCase().includes(activePartner.name.toLowerCase()),
              );
              const isExpanded = expandedMobileOrder === b.id;

              return (
                <div key={b.id} className="rounded-2xl border hairline bg-canvas p-4 shadow-2xs transition flex flex-col justify-between">
                  <div>
                    <div
                      className="flex items-start justify-between cursor-pointer select-none"
                      onClick={() => {
                        playTapSound();
                        setExpandedMobileOrder(isExpanded ? null : b.id);
                      }}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-mono text-primary font-bold text-xs">{b.ref}</span>
                        <h3 className="font-bold text-ink text-base truncate mt-0.5">{b.eventTitle}</h3>
                        <p className="text-[0.72rem] text-ink/60 mt-0.5">
                          {b.dateStr} · {b.slot}
                        </p>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="font-mono font-bold text-primary text-sm">
                          ${match?.agreedFee.toLocaleString()}
                        </span>
                        <span className="mt-1 flex items-center gap-1 rounded-full border hairline bg-surface px-2 py-0.5 text-[0.65rem] font-bold text-ink/70">
                          <span>{isExpanded ? "Hide" : "Details"}</span>
                          <span className="text-[0.60rem]">{isExpanded ? "▲" : "▼"}</span>
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t hairline space-y-2.5 text-xs animate-in fade-in duration-200">
                        <div className="grid grid-cols-2 gap-2 text-[0.75rem]">
                          <div>
                            <span className="eyebrow text-ink/45 block text-[0.62rem]">Venue / Setup</span>
                            <p className="font-semibold text-ink mt-0.5">{b.venueName}</p>
                            <p className="text-ink/60 capitalize text-[0.70rem]">{b.where}</p>
                          </div>
                          <div>
                            <span className="eyebrow text-ink/45 block text-[0.62rem]">Client Headcount</span>
                            <p className="font-bold text-ink mt-0.5">{b.guests} Guests</p>
                            <p className="text-ink/60 text-[0.70rem]">Guaranteed capacity</p>
                          </div>
                        </div>

                        <div>
                          <span className="eyebrow text-ink/45 block text-[0.62rem]">Client Contact</span>
                          <p className="font-medium text-ink mt-0.5">{b.clientName}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t hairline flex items-center justify-between text-[0.72rem]">
                    <span className="text-ink/60">{b.guests} guests</span>
                    <span className="rounded-full bg-success/15 px-2.5 py-0.5 font-bold text-success text-[0.68rem]">
                      ✓ Calendar Locked
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Interactive 75-Day Availability Manager */}
      <div className="rounded-3xl border hairline bg-surface-light p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b hairline pb-4">
          <div>
            <h2 className="display text-xl sm:text-2xl font-bold text-ink">
              75-Day Availability &amp; Blackout Manager
            </h2>
            <p className="text-xs text-ink/60">
              Click any date box to toggle availability. Unavailable days are instantly removed from the client booking
              calendar.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-ink/75">
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-success/20 border border-success/40" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-primary text-white" />
              <span>Blackout (Blocked)</span>
            </div>
          </div>
        </div>

        {/* 75-Day Responsive Horizontal Cards Grid */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
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
                onClick={() => handleToggleDay(dayIdx)}
                title={`Day +${dayIdx} (${weekday}, ${monthShort} ${dayNum}): ${isBlocked ? "Blocked - Click to mark Available" : "Available - Click to mark Blocked"}`}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all cursor-pointer select-none text-left ${
                  isBlocked
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "hairline bg-canvas hover:border-primary/50 text-ink hover:bg-surface"
                }`}
              >
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span className="font-mono text-sm sm:text-base font-black leading-none">{dayNum}</span>
                  <div className="flex flex-col leading-none">
                    <span className="text-[0.62rem] font-bold uppercase tracking-tight opacity-90">{monthShort}</span>
                    <span className="text-[0.55rem] uppercase opacity-65 font-medium">{weekday}</span>
                  </div>
                </div>

                <span
                  className={`text-[0.60rem] uppercase tracking-wider px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                    isBlocked ? "bg-white/20 text-white" : "bg-success/15 text-success border border-success/30"
                  }`}
                >
                  {isBlocked ? "Blocked" : "Open"}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-ink/55 text-center font-serif-i italic">
          Showing next 30 days of the 75-day rolling window. Changes reflect instantaneously in all client calendar intersections.
        </p>
      </div>
    </div>
  );
}
