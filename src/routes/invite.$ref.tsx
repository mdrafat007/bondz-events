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

  const [invite, setInvite] = useState<{ title: string; host: string; date: string; slot: Slot; place: string; tagline: string } | null>(null);
  useEffect(() => {
    try {
      const raw = inviteToken ? new TextDecoder().decode(Uint8Array.from(atob(inviteToken), (char) => char.charCodeAt(0))) : localStorage.getItem(`bondz_invite_${ref}`);
      if (raw) {
        const data = JSON.parse(raw);
        if (typeof data.title === "string" && typeof data.host === "string" && typeof data.place === "string" && typeof data.date === "string" && !Number.isNaN(new Date(data.date).getTime()) && ["Morning", "Afternoon", "Evening"].includes(data.slot)) setInvite(data);
      }
    } catch { /* local preview unavailable */ }
  }, [ref, inviteToken]);
  const eventTitle = invite?.title ?? "Invitation preview";
  const hostName = invite?.host ?? "Your host";
  const dateStr = invite ? new Date(invite.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "Date to be confirmed";
  const timeWindow = invite?.slot ? `${invite.slot} · ${SLOT_TIMES[invite.slot]}` : "Time to be confirmed";
  const locationName = invite?.place ?? "Location to be confirmed";
  const locationArea = "Preview only";
  const attire = invite?.tagline ?? "Details will appear after the booking preview";

  const storageKey = `bondz_rsvp_${ref}`;
  const [attending, setAttending] = useState<boolean | null>(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setRsvpCount(saved && JSON.parse(saved).attending ? 1 : 0);
    } catch { /* optional */ }
  }, [storageKey]);

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
    setRsvpCount(attending ? 1 : 0);
    try { localStorage.setItem(storageKey, JSON.stringify({ attending, name, email, selectedTags, notes })); } catch {}
    toast.success("Response saved on this device only. Your host has not been notified.");
  };

  const addToGoogleCalendar = () => {
    triggerTap();
    if (!invite) { toast.error("Event details are not available on this device."); return; }
    const startDate = new Date(invite.date);
    startDate.setHours(invite.slot === "Morning" ? 10 : invite.slot === "Afternoon" ? 14 : 17, 0, 0, 0);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const start = fmt(startDate);
    const end = fmt(endDate);
    const title = encodeURIComponent(eventTitle);
    const details = encodeURIComponent(
      `Celebration hosted by ${hostName}.\nAttire: ${attire}\nRef: ${ref}\nGuest Invitation: ${typeof window !== "undefined" ? window.location.href : ""}`
    );
    const location = encodeURIComponent(locationName);
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
    window.open(gCalUrl, "_blank", "noopener,noreferrer");
    toast.success("Opening Google Calendar...");
  };

  return (
    <div className="scroll-quiet h-full overflow-y-auto px-4 py-8 md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        {/* Header Breadcrumb / Ref (No duplicate navbar logo) */}
        <div className="flex items-center justify-between border-b hairline pb-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink/65">
            <span className="uppercase tracking-wider">Guest Invitation Portal</span>
            <span>·</span>
            <span className="font-mono text-primary font-bold">Ref: {ref}</span>
          </div>
          <span className="eyebrow rounded-full border hairline bg-surface-light px-3.5 py-1 text-ink/70 flex items-center gap-1.5">
            <span className="live-dot size-1.5 rounded-full bg-success" />
            Local preview
          </span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Swiss Editorial Invitation Card */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border hairline bg-surface-light p-6 shadow-xl md:p-10">
              {/* Brand Logo & Header inside Invitation Card */}
              <div className="flex items-center justify-between border-b hairline pb-5">
                <Lockup className="h-6 sm:h-7" />
                <span className="eyebrow inline-flex items-center gap-1.5 rounded-full border hairline bg-canvas px-3 py-1 font-bold text-xs uppercase text-primary">
                  <span className="live-dot size-1.5 rounded-full bg-success" />
                  Invitation preview
                </span>
              </div>

              <h1 className="font-serif-i mt-6 text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-ink">
                {eventTitle}
              </h1>

              <p className="eyebrow mt-3 text-ink/55">
                Hosted with care by <span className="font-bold text-ink">{hostName}</span>
              </p>

              <div className="mt-8 space-y-4 border-t hairline pt-6">
                <div className="grid grid-cols-[7rem_1fr] items-baseline gap-2">
                  <span className="eyebrow text-ink/40">When</span>
                  <div>
                    <p className="font-display font-bold text-ink">{dateStr}</p>
                    <p className="text-xs text-ink/65">{timeWindow}</p>
                  </div>
                </div>

                <div className="grid grid-cols-[7rem_1fr] items-baseline gap-2">
                  <span className="eyebrow text-ink/40">Where</span>
                  <div>
                    <p className="font-display font-bold text-ink">{locationName}</p>
                    <p className="text-xs text-ink/65">{locationArea}</p>
                  </div>
                </div>

                <div className="grid grid-cols-[7rem_1fr] items-baseline gap-2">
                  <span className="eyebrow text-ink/40">Notes</span>
                  <p className="text-xs font-medium text-ink/80">{attire}</p>
                </div>
              </div>

              {/* Action Buttons: Add to Google Calendar & Live Attendance */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t hairline pt-6">
                <button
                  onClick={addToGoogleCalendar}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-foreground shadow-md transition hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  <span>📅</span> Add to Google Calendar
                </button>
                <div className="flex items-center gap-2 rounded-lg bg-canvas px-3 py-2 border hairline text-xs text-ink/80">
                  <span className="live-dot size-2 rounded-full bg-emerald-500" />
                  <span>
                    <strong className="font-black text-ink tabular-nums">{rsvpCount}</strong> response on this device
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 text-xs text-ink/50">
              <span>This preview is not a confirmed event</span>
              <Link to="/book" className="font-bold text-primary hover:underline">
                Plan your celebration →
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Guest RSVP Form */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border hairline bg-surface-light p-6 shadow-xl md:p-8">
              <h2 className="display text-3xl">Your RSVP</h2>
              <p className="mt-1 text-xs text-ink/60">
                 Preview a response here. It remains on this device and is not sent to the host.
              </p>

              {submitted ? (
                <div className="mt-6 rounded-2xl bg-canvas p-6 text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-full bg-success text-success-foreground text-xl font-bold">
                    ✓
                  </div>
                  <h3 className="display mt-4 text-2xl">
                    {attending ? "You're on the list!" : "Response Recorded"}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink/70">
                    {attending
                      ? `Your sample response for ${dateStr} is saved on this device. No reminder will be sent.`
                      : "Your sample response is saved on this device. The host has not been notified."}
                  </p>
                  <button
                    onClick={() => {
                      triggerTap();
                      setSubmitted(false);
                    }}
                    className="mt-6 text-xs font-bold text-primary hover:underline"
                  >
                    Update response
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
