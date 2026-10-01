import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { EVENT_TYPES } from "@/lib/bondz-data";
import { playTapSound, playTickSound, triggerTap } from "@/lib/haptics";
import { triggerBookingTransition } from "@/lib/booking-transition";
import mascotWhite from "@/assets/mascot-white.png";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Bondz Events" },
      {
        name: "description",
        content: "Explore ways to plan a celebration with Mr. Bondz, Solo Event Organizer.",
      },
      { property: "og:title", content: "Contact - Bondz Events" },
      { property: "og:description", content: "Tell Mr. Bondz what you're celebrating." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function prettyDate(value: string) {
  if (!value) return "";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function Contact() {
  const [f, setF] = useState({ name: "", email: "", interest: "", date: "", msg: "" });
  const [guests, setGuests] = useState(60);
  const [touchedMsg, setTouchedMsg] = useState(false);
  const lastTick = useRef(guests);
  const navigate = useNavigate();

  const template = useMemo(() => {
    const who = f.name.trim() || "I";
    const what = f.interest || "a celebration";
    const when = f.date ? prettyDate(f.date) : "a date I'm still deciding on";
    return `Hi Mr. Bondz,

${who === "I" ? "I'm" : `${who} here - I'm`} planning ${what.toLowerCase().startsWith("a") ? what.toLowerCase() : `a ${what.toLowerCase()}`} for about ${guests} guests on ${when}.

I'd like one sitting where the venue and every partner are confirmed together. Could you tell me what's open around that date and what it would cost?

Thank you.`;
  }, [f.name, f.interest, f.date, guests]);

  const message = touchedMsg ? f.msg : template;

  const handleBookNow = () => {
    triggerTap();
    triggerBookingTransition(() => navigate({ to: "/book", search: { intro: 1 } }));
  };

  const submit = (e: React.FormEvent): void => {
    e.preventDefault();
    triggerTap();
    if (!f.name || !/\S+@\S+\.\S+/.test(f.email) || !message.trim()) {
      toast.error("Name, a valid email and a message, please.");
      return;
    }
    toast.info("This preview cannot send messages yet. Your message is still here so you can copy it.");
  };

  const input =
    "mt-1 w-full border-0 border-b border-ink/25 bg-transparent px-0 py-2 text-base font-semibold text-ink outline-none transition focus:border-primary placeholder:text-ink/35 sm:text-lg";
  const label = "eyebrow text-ink/65";

  return (
    <div className="scroll-quiet grid h-full gap-8 overflow-y-auto px-5 pb-8 pt-6 md:px-8 lg:grid-cols-12 lg:gap-10 lg:overflow-hidden">
      {/* Left column: kicker and headline at the top, Mr. Bondz card pinned to the bottom */}
      <div className="flex min-w-0 flex-col justify-between gap-8 lg:col-span-5">
        <div className="min-w-0">
          <p className="eyebrow text-primary">Direct line to Mr. Bondz</p>
          <h1 className="display mt-3 text-4xl leading-none tracking-tight sm:text-5xl md:text-6xl">
            Tell me what you’re celebrating.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70">
            This contact form is a preview and cannot send messages yet. You can still explore a sample booking end to
            end.
          </p>
        </div>

        {/* London Studio HQ & Operating Location Card */}
        <div className="rounded-2xl border hairline bg-surface-light p-4 sm:p-5 shadow-xs">
          <div className="flex items-start justify-between gap-3 border-b hairline pb-3">
            <div>
              <span className="eyebrow text-primary">London Studio HQ</span>
              <h3 className="font-display text-base font-black uppercase tracking-tight text-ink mt-0.5 [font-variation-settings:'wdth'_85]">
                Bondz Events London
              </h3>
            </div>
            <span className="rounded-full border hairline bg-canvas px-2.5 py-1 text-[0.68rem] font-bold text-ink/75">
              Studio 4B
            </span>
          </div>

          <div className="mt-3.5 space-y-2.5 text-xs text-ink/80">
            <div className="flex items-start gap-2.5">
              <span className="text-primary font-bold text-sm">📍</span>
              <div>
                <p className="font-bold text-ink">42 Bermondsey Street, Studio 4B</p>
                <p className="text-ink/60">London SE1 3UD · Private Planning Studio</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-primary font-bold text-sm">🗺️</span>
              <div>
                <p className="font-bold text-ink">Coverage &amp; Destination Bookings</p>
                <p className="text-ink/60">Greater London, Home Counties &amp; Global Private Celebrations</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-primary font-bold text-sm">⏱️</span>
              <div>
                <p className="font-bold text-ink">Studio Consultations &amp; Event Hours</p>
                <p className="text-ink/60">Mon – Sat: 9:00 AM – 7:00 PM · 24/7 Live Event Strike</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto flex max-w-lg items-center gap-4 rounded-2xl border border-paper/20 bg-night p-4 text-paper shadow-raised sm:p-5">
          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/60 bg-night p-1 shadow-inner sm:size-20">
            <img
              src={mascotWhite}
              alt="Mr. Bondz Seal"
              className="size-full object-contain brightness-125 drop-shadow filter"
            />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="eyebrow text-primary">Personal Event Organizer Guarantee</span>
            <p className="mt-0.5 font-sans text-base font-black tracking-tight text-paper [font-variation-settings:'wdth'_85] sm:text-lg">
              “Mr. Bondz will take care of it.”
            </p>
            <p className="mt-1 font-sans text-xs leading-relaxed text-paper/85">
              No handoffs, no junior reps. From initial concept to 2am strike, you coordinate directly with Mr. Bondz.
            </p>
          </div>
        </div>
      </div>

      {/* Right column: editorial contact form */}
      <form
        onSubmit={submit}
        className="flex min-w-0 flex-col gap-5 rounded-3xl border hairline bg-surface-light p-5 shadow-sm sm:p-7 lg:col-span-7 lg:self-center"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="min-w-0">
            <span className={label}>Your name</span>
            <input
              className={input}
              placeholder="e.g. Maya Lin"
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              autoComplete="name"
            />
          </label>
          <label className="min-w-0">
            <span className={label}>Direct email</span>
            <input
              type="email"
              placeholder="e.g. maya@domain.com"
              className={input}
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
              autoComplete="email"
            />
          </label>
        </div>

        <div className="min-w-0">
          <span className={label}>I'm thinking about</span>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {EVENT_TYPES.map((e) => (
              <button
                type="button"
                key={e.id}
                onClick={() => {
                  playTapSound();
                  setF({ ...f, interest: e.title });
                }}
                aria-pressed={f.interest === e.title}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                  f.interest === e.title
                    ? "border-ink bg-ink text-canvas shadow-sm"
                    : "hairline text-ink/75 hover:border-ink/50"
                }`}
              >
                {f.interest === e.title && "✓ "}
                {e.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Guest headcount bar with tactile detents */}
          <label className="min-w-0">
            <span className="flex items-baseline justify-between gap-3">
              <span className={label}>Guest headcount</span>
              <span className="display text-2xl tabular-nums text-ink">{guests}</span>
            </span>
            <input
              type="range"
              min={10}
              max={300}
              step={5}
              value={guests}
              aria-label="Guest headcount"
              onChange={(e) => {
                const next = +e.target.value;
                if (next !== lastTick.current) {
                  lastTick.current = next;
                  playTickSound(Math.min(next / 300, 1));
                }
                setGuests(next);
              }}
              onPointerUp={playTapSound}
              className="mt-3 w-full accent-primary"
            />
            <span className="eyebrow mt-1 flex justify-between text-ink/40">
              <span>10</span>
              <span>300</span>
            </span>
          </label>

          <label className="min-w-0">
            <span className={label}>Preferred date</span>
            <input
              type="date"
              className={input}
              value={f.date}
              onChange={(e) => {
                playTapSound();
                setF({ ...f, date: e.target.value });
              }}
            />
            <span className="mt-1 block text-xs text-ink/55">
              {f.date ? prettyDate(f.date) : "Pick a target day - flexible is fine."}
            </span>
          </label>
        </div>

        <label className="min-w-0">
          <span className="flex flex-wrap items-baseline justify-between gap-2">
            <span className={label}>Message</span>
            {touchedMsg && (
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  setTouchedMsg(false);
                  setF({ ...f, msg: "" });
                }}
                className="eyebrow text-primary underline-offset-4 hover:underline"
              >
                Rewrite from my details
              </button>
            )}
          </span>
          <textarea
            rows={7}
            value={message}
            onChange={(e) => {
              setTouchedMsg(true);
              setF({ ...f, msg: e.target.value });
            }}
            className="scroll-quiet mt-2 w-full resize-none rounded-2xl border hairline bg-canvas px-4 py-3 text-sm font-medium leading-relaxed text-ink outline-none transition focus:border-primary"
          />
          <span className="mt-1 block text-xs text-ink/50">
            Written for you from your event, headcount and date. Edit anything you like.
          </span>
        </label>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <button
            type="button"
            onClick={handleBookNow}
            className="cursor-pointer text-xs font-bold text-ink/70 underline underline-offset-4 transition-colors hover:text-primary"
          >
            Or skip the wait - launch live booking engine →
          </button>
          <button
            type="submit"
            className="rounded-full bg-primary px-7 py-3.5 font-sans text-sm font-black uppercase tracking-wider text-primary-foreground shadow-xl transition-all [font-variation-settings:'wdth'_85] hover:brightness-110 active:scale-95"
          >
            Send to Mr. Bondz →
          </button>
        </div>
      </form>
    </div>
  );
}
