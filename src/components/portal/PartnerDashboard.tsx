import { useState, useMemo } from "react";
import {
  type PortalBooking,
  getAllPortalBookings,
  getPartnerBlackouts,
  togglePartnerBlackout,
  setStoredPartnerId,
} from "@/lib/portal-store";
import { PARTNERS, VENUES, HORIZON, isBusy } from "@/lib/bondz-data";
import { triggerTap, playTapSound } from "@/lib/haptics";
import { toast } from "sonner";

export function PartnerDashboard({
  currentPartnerId,
  onLogout,
  onBackToOwner,
}: {
  currentPartnerId: string;
  onLogout: () => void;
  onBackToOwner?: () => void;
}) {
  const [partnerId, setPartnerId] = useState(currentPartnerId);
  const [blackouts, setBlackouts] = useState<number[]>(() => getPartnerBlackouts(partnerId));

  const allPartners = useMemo(() => PARTNERS, []);
  const activePartner = useMemo(
    () => allPartners.find((p) => p.id === partnerId) || allPartners[0]!,
    [allPartners, partnerId],
  );

  const bookings = useMemo(() => getAllPortalBookings(), []);

  // Filter bookings where this partner is assigned
  const partnerBookings = useMemo(() => {
    return bookings.filter((b) =>
      b.assignedPartners.some(
        (p) => p.partnerId === partnerId || p.partnerName.toLowerCase().includes(activePartner.name.toLowerCase()),
      ),
    );
  }, [bookings, partnerId, activePartner]);

  const totalEarnings = partnerBookings.reduce((sum, b) => {
    const match = b.assignedPartners.find(
      (p) => p.partnerId === partnerId || p.partnerName.toLowerCase().includes(activePartner.name.toLowerCase()),
    );
    return sum + (match?.agreedFee || 0);
  }, 0);

  const handlePartnerSwitch = (newId: string) => {
    playTapSound();
    setPartnerId(newId);
    setStoredPartnerId(newId);
    setBlackouts(getPartnerBlackouts(newId));
  };

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

        <div className="flex flex-wrap items-center gap-2.5">
          {onBackToOwner && (
            <button
              type="button"
              onClick={() => {
                playTapSound();
                onBackToOwner();
              }}
              className="rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-canvas hover:bg-primary transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span>←</span>
              <span>Back to Owner Portal</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="eyebrow text-ink/50 text-[0.65rem]">Partner Switcher:</span>
            <select
              value={partnerId}
              onChange={(e) => handlePartnerSwitch(e.target.value)}
              className="rounded-full border hairline bg-surface px-3 py-1.5 text-xs font-bold text-ink outline-none focus:border-primary"
            >
              {allPartners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              playTapSound();
              onLogout();
            }}
            className="rounded-full border hairline bg-canvas px-4 py-1.5 text-xs font-bold text-ink/75 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition cursor-pointer"
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
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs text-ink/80 border-collapse">
              <thead>
                <tr className="border-b hairline text-[0.68rem] uppercase font-bold text-ink/50">
                  <th className="py-2.5 px-3">Event / Reference</th>
                  <th className="py-2.5 px-3">Scheduled Date</th>
                  <th className="py-2.5 px-3">Location / Venue</th>
                  <th className="py-2.5 px-3">Guests</th>
                  <th className="py-2.5 px-3">Agreed Fee</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y hairline">
                {partnerBookings.map((b) => {
                  const match = b.assignedPartners.find(
                    (p) =>
                      p.partnerId === partnerId ||
                      p.partnerName.toLowerCase().includes(activePartner.name.toLowerCase()),
                  );
                  return (
                    <tr key={b.id} className="hover:bg-canvas/50 transition">
                      <td className="py-3 px-3">
                        <span className="font-mono text-primary font-bold block">{b.ref}</span>
                        <span className="font-bold text-ink text-sm block">{b.eventTitle}</span>
                        <span className="text-[0.68rem] text-ink/55">{b.clientName}</span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-semibold text-ink block">{b.dateStr}</span>
                        <span className="text-[0.68rem] text-primary font-bold">{b.slot}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-ink block">{b.venueName}</span>
                        <span className="text-[0.68rem] text-ink/55 capitalize">{b.where}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-ink">{b.guests} guests</td>
                      <td className="py-3 px-3 font-mono font-bold text-primary text-sm">
                        ${match?.agreedFee.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-[0.68rem] font-bold text-success">
                          ✓ Calendar Locked
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

        {/* 75-Day Grid */}
        <div className="mt-6 grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-15 gap-1.5">
          {Array.from({ length: 30 }, (_, dayIdx) => {
            const isBlockedByPartner = blackouts.includes(dayIdx);
            const isSimulatedBusy = isBusy(activePartner.seed, activePartner.busyRate, dayIdx);
            const isBlocked = isBlockedByPartner || isSimulatedBusy;

            const d = new Date();
            d.setDate(d.getDate() + dayIdx);
            const monthShort = d.toLocaleDateString("en-US", { month: "short" });
            const weekday = d.toLocaleDateString("en-US", { weekday: "narrow" });
            const dayNum = d.getDate();

            return (
              <button
                key={dayIdx}
                type="button"
                onClick={() => handleToggleDay(dayIdx)}
                title={`Day +${dayIdx} (${monthShort} ${dayNum}): ${isBlocked ? "Blocked - Click to mark Available" : "Available - Click to mark Blocked"}`}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  isBlocked
                    ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                    : "hairline bg-canvas hover:border-primary/50 text-ink/80 hover:bg-surface"
                }`}
              >
                <span className="text-[0.55rem] uppercase opacity-75">{weekday}</span>
                <span className="text-xs font-black leading-tight mt-0.5">{dayNum}</span>
                <span className="text-[0.62rem] font-bold opacity-80 mt-0.5">{monthShort}</span>
                <span
                  className={`mt-1 text-[0.50rem] uppercase tracking-wider px-1 py-0.2 rounded font-mono ${
                    isBlocked ? "bg-white/20 text-white" : "bg-success/20 text-success font-bold"
                  }`}
                >
                  {isBlocked ? "Blocked" : "Open"}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-ink/55 text-center font-serif-i italic">
          Showing next 30 days of the 75-day rolling window. Changes reflect instantaneously in all client calendar
          intersections.
        </p>
      </div>
    </div>
  );
}
