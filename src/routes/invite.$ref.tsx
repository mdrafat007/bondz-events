// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Lockup } from "@/components/site/Brand";
import { triggerTap, triggerHaptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { SLOT_TIMES, type Slot } from "@/lib/bondz-data";
import { z } from "zod";

export const Route = createFileRoute("/invite/$ref")({
  validateSearch: z.object({ invite: z.string().max(4000).optional().catch(undefined) }),
  head: ({ params }) => ({
    meta: [
      { title: `You're Invited - ${params.ref} · Bondz Events` },
      { name: "description", content: "You are invited to an extraordinary celebration orchestrated by Mr. Bondz." },
      { property: "og:title", content: "You're Invited · Bondz Events" },
      { property: "og:description", content: "Confirm your attendance, select dietary preferences, and add to your calendar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InvitePage,
});

const DIETARY_TAGS = ["Halal", "Vegan", "Gluten-Free", "Nut-Free", "Vegetarian", "Dairy-Free"];

function InvitePage() {
  const { ref } = Route.useParams();
  const { invite: inviteToken } = Route.useSearch();

  const [invite, setInvite] = useState<{ title: string; host: string; date: string; slot: Slot; place: string; tagline: string; guests?: number } | null>(null);

  useEffect(() => {
    try {
      let data = null;
      if (inviteToken) {
        const raw = new TextDecoder().decode(Uint8Array.from(atob(inviteToken), (char) => char.charCodeAt(0)));
        data = JSON.parse(raw);
      } else if (typeof window !== "undefined") {
        const local = localStorage.getItem(`bondz_invite_${ref}`);
        if (local) data = JSON.parse(local);
      }

      if (data && typeof data.title === "string") {
        setInvite(data);
      } else {
        // Fallback realistic celebration data for direct visits
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 24);
        setInvite({
          title: "Amira & Jonah’s Wedding Celebration",
          host: "Amira & Jonah",
          date: targetDate.toISOString(),
          slot: "Evening",
          place: "Smokestack Yard, 44 Industrial Way",
          tagline: "Come hungry. Leave with stories.",
          guests: 90,
        });
      }
    } catch {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 24);
      setInvite({
        title: "Celebration with Mr. Bondz",
        host: "Your Host",
        date: targetDate.toISOString(),
        slot: "Evening",
        place: "Smokestack Yard",
        tagline: "Come hungry. Leave with stories.",
        guests: 60,
      });
    }
  }, [ref, inviteToken]);

  const eventTitle = invite?.title ?? "Celebration with Mr. Bondz";
  const hostName = invite?.host ?? "Your Host";
  const dateStr = invite ? new Date(invite.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "Saturday, October 24, 2026";
  const timeWindow = invite?.slot ? `${invite.slot} (${SLOT_TIMES[invite.slot]})` : "Evening (17:00 - 23:00)";
  const locationName = invite?.place ?? "Smokestack Yard";
  const attire = invite?.tagline ?? "Come hungry. Leave with stories.";

  const storageKey = `bondz_rsvp_${ref}`;
  const [attending, setAttending] = useState<boolean | null>(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(1);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) {
          setName(parsed.name);
          setEmail(parsed.email || "");
          setAttending(parsed.attending);
          setSelectedTags(parsed.selectedTags || []);
          setNotes(parsed.notes || "");
          setSubmitted(true);
        }
      }
      const count = localStorage.getItem(`bondz_count_${ref}`);
      setRsvpCount(count ? parseInt(count, 10) : 12);
    } catch { /* optional */ }
  }, [storageKey, ref]);

  const toggleTag = (tag: string) => {
    triggerTap();
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please provide your name.");
      return;
    }
    triggerTap();
    triggerHaptic([30, 40, 50]);
    setSubmitted(true);
    const newCount = rsvpCount + (attending ? 1 : 0);
    setRsvpCount(newCount);
    try {
      localStorage.setItem(storageKey, JSON.stringify({ attending, name, email, selectedTags, notes }));
      localStorage.setItem(`bondz_count_${ref}`, String(newCount));
    } catch {}
    toast.success(attending ? `RSVP confirmed, ${name}! Your seat is locked.` : "Thank you for letting your host know.");
  };

  const addToGoogleCalendar = () => {
    triggerTap();
    if (!invite) return;
    const startDate = new Date(invite.date);
    startDate.setHours(invite.slot === "Morning" ? 10 : invite.slot === "Afternoon" ? 14 : 17, 0, 0, 0);
    const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const start = fmt(startDate);
    const end = fmt(endDate);
    const title = encodeURIComponent(eventTitle);
    const details = encodeURIComponent(
      `Celebration hosted by ${hostName}.\nAttire / Vibe: ${attire}\nBooking Ref: ${ref}\nGuest Portal: ${typeof window !== "undefined" ? window.location.href : ""}`
    );
    const location = encodeURIComponent(locationName);
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(gCalUrl, "_blank", "noopener,noreferrer");
    toast.success("Opening Google Calendar...");
  };

  const downloadIcs = () => {
    triggerTap();
    if (!invite) return;
    const startDate = new Date(invite.date);
    startDate.setHours(invite.slot === "Morning" ? 10 : invite.slot === "Afternoon" ? 14 : 17, 0, 0, 0);
    const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Bondz Events//Guest Portal//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${attire}\\nHosted by ${hostName}\\nRef: ${ref}`,
      `LOCATION:${locationName}`,
      `DTSTART:${fmt(startDate)}`,
      `DTEND:${fmt(endDate)}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `celebration-${ref}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Apple Calendar (.ics) downloaded");
  };

  return (
    <div className="scroll-quiet h-full overflow-y-auto px-4 py-8 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        {/* Header Breadcrumb / Ref */}
        <div className="flex items-center justify-between border-b hairline pb-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink/65">
            <span className="uppercase tracking-wider">Guest Invitation Portal</span>
            <span>·</span>
            <span className="font-mono text-primary font-bold">Ref: {ref}</span>
          </div>
          <span className="eyebrow rounded-full border border-success/30 bg-success/10 px-3.5 py-1 text-success flex items-center gap-1.5 font-bold">
            <span className="live-dot size-1.5 rounded-full bg-success" />
            Verified Guest Pass
          </span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Swiss Editorial Invitation Card */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border hairline bg-surface-light p-6 shadow-xl md:p-10">
              {/* Brand Logo & Header inside Invitation Card */}
              <div className="flex items-center justify-between border-b hairline pb-5">
                <Lockup className="h-6 sm:h-7" />
                <span className="eyebrow inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-bold text-xs uppercase text-primary">
                  <span className="live-dot size-1.5 rounded-full bg-primary" />
                  Official Invitation
                </span>
              </div>

              <h1 className="font-serif-i mt-6 text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-ink">
                {eventTitle}
              </h1>

              <p className="eyebrow mt-3 text-ink/75">
                Hosted with care by <span className="font-bold text-ink">{hostName}</span> · Orchestrated by Mr. Bondz
              </p>

              <div className="mt-8 space-y-4 border-t hairline pt-6">
                <div className="grid grid-cols-[6rem_1fr] sm:grid-cols-[7rem_1fr] items-baseline gap-2">
                  <span className="eyebrow text-ink/50">When</span>
                  <div>
                    <p className="font-display font-bold text-ink text-base sm:text-lg">{dateStr}</p>
                    <p className="text-xs text-primary font-semibold mt-0.5">{timeWindow}</p>
                  </div>
                </div>

                <div className="grid grid-cols-[6rem_1fr] sm:grid-cols-[7rem_1fr] items-baseline gap-2">
                  <span className="eyebrow text-ink/50">Where</span>
                  <div>
                    <p className="font-display font-bold text-ink text-base sm:text-lg">{locationName}</p>
                    <p className="text-xs text-ink/65">Full coordinates & directions sent upon RSVP</p>
                  </div>
                </div>

                <div className="grid grid-cols-[6rem_1fr] sm:grid-cols-[7rem_1fr] items-baseline gap-2">
                  <span className="eyebrow text-ink/50">Vibe</span>
                  <p className="text-xs sm:text-sm font-medium text-ink/80 italic">{attire}</p>
                </div>
              </div>

              {/* Action Buttons: Add to Google Calendar & Live Attendance */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t hairline pt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={addToGoogleCalendar}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition hover:brightness-110 active:scale-95 cursor-pointer"
                  >
                    <span>📅</span> Add to Google Cal
                  </button>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-canvas px-3.5 py-2 border hairline text-xs text-ink/80">
                  <span className="live-dot size-2 rounded-full bg-emerald-500" />
                  <span>
                    <strong className="font-black text-ink tabular-nums">{rsvpCount}</strong> guests confirmed
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 text-xs text-ink/60">
              <span>Bondz Events · 100% Confirmed Availability</span>
              <Link to="/book" className="font-bold text-primary hover:underline">
                Plan your celebration →
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Guest RSVP Form */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border hairline bg-surface-light p-6 shadow-xl md:p-8">
              <h2 className="display text-3xl">Your RSVP</h2>
              <p className="mt-1 text-xs text-ink/65">
                Confirm your attendance and notify {hostName} in one click.
              </p>

              {submitted ? (
                <div className="mt-6 rounded-2xl bg-canvas p-6 text-center border hairline">
                  <div className="mx-auto grid size-12 place-items-center rounded-full bg-success text-success-foreground text-xl font-bold shadow-sm">
                    ✓
                  </div>
                  <h3 className="display mt-4 text-2xl">
                    {attending ? "You're on the list!" : "Response Recorded"}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink/75">
                    {attending
                      ? `Thank you, ${name}! Your attendance for ${dateStr} is locked on the roster.`
                      : `Thank you for letting ${hostName} know.`}
                  </p>
                  {selectedTags.length > 0 && attending && (
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                      {selectedTags.map((t) => (
                        <span key={t} className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[0.65rem] font-bold">
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      triggerTap();
                      setSubmitted(false);
                    }}
                    className="mt-6 inline-block text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    Edit RSVP details
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRSVP} className="mt-6 space-y-4">
                  {/* Attendance Toggle */}
                  <div>
                    <label className="eyebrow block text-ink/60 mb-2">Will you be attending?</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          triggerTap();
                          setAttending(true);
                        }}
                        className={cn(
                          "rounded-xl py-3 text-xs font-bold transition active:scale-95",
                          attending === true
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "border hairline bg-canvas text-ink/70 hover:border-ink",
                        )}
                      >
                        ✓ Attending Joyfully
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          triggerTap();
                          setAttending(false);
                        }}
                        className={cn(
                          "rounded-xl py-3 text-xs font-bold transition active:scale-95",
                          attending === false
                            ? "bg-ink text-canvas shadow-md"
                            : "border hairline bg-canvas text-ink/70 hover:border-ink",
                        )}
                      >
                        ✕ Regretfully Decline
                      </button>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="eyebrow block text-ink/60 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Miller"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="eyebrow block text-ink/60 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="For updates & directions"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Dietary Requirements Pills */}
                  {attending && (
                    <div>
                      <label className="eyebrow block text-ink/60 mb-2">Dietary Preferences</label>
                      <div className="flex flex-wrap gap-1.5">
                        {DIETARY_TAGS.map((tag) => {
                          const active = selectedTags.includes(tag);
                          return (
                            <button
                              type="button"
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={cn(
                                "rounded-lg px-2.5 py-1 text-xs font-semibold transition active:scale-95",
                                active
                                  ? "bg-primary text-primary-foreground"
                                  : "border hairline bg-canvas text-ink/70 hover:border-ink/50",
                              )}
                            >
                              {active ? "✓ " : ""}{tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Notes / Special Requests */}
                  <div>
                    <label className="eyebrow block text-ink/60 mb-1">Note for Host (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Song request, dietary details, or a kind note..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full resize-none rounded-xl border hairline bg-canvas px-3.5 py-2 text-xs text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary py-3.5 text-xs font-extrabold uppercase tracking-wider text-primary-foreground transition hover:brightness-110 active:scale-95 shadow-md shadow-primary/20"
                  >
                    Submit RSVP →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
