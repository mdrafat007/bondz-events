import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { playTapSound, triggerTap } from "@/lib/haptics";
import { triggerBookingTransition } from "@/lib/booking-transition";
import mascotWhite from "@/assets/mascot-white.png";
import wedding from "@/assets/pf-wedding.jpg";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "Who is Mr. Bondz - Solo Event Organizer & The Rule" },
      { name: "description", content: "Solo Event Organizer for 16 years and 700+ celebrations. One point of contact, live calendar sync, and zero telephone tag." },
      { property: "og:title", content: "Who is Mr. Bondz - Bondz Events" },
      { property: "og:description", content: "The event organizer, the rule, and the architecture behind Bondz Events." },
    ],
  }),
  component: WhoIsBondz,
});

const TABS = ["Mr. Bondz", "The Rule", "Before / After"] as const;

const BEFORE = [
  "Client calls, texts, emails - often all three",
  "Mr. Bondz rings the venue to check the date",
  "Then the caterer. Then decor. Then the DJ",
  "One says no - start again from scratch",
  "Deposit chased by message, tracked in memory",
  "Vendors hear about the job days later",
  "No written confirmation anyone can point to",
];

const AFTER = [
  "One guided session, on the client's schedule",
  "Every calendar polled at render time live",
  "Impossible dates never appear on screen",
  "Price and breakdown updates on every choice",
  "Signed terms + 25% deposit locked in one sitting",
  "Every party notified at the exact same second",
  "Receipt and contract generated instantly on file",
];

function WhoIsBondz() {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const handleBook = () => {
    triggerTap();
    triggerBookingTransition(() => navigate({ to: "/book", search: { intro: 1 } }));
  };

  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-4 md:px-8">
      {/* Header Bar */}
      <div className="flex shrink-0 flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <p className="eyebrow text-primary font-bold tracking-widest uppercase">
            Solo Event Organizer · 16 Years · 700+ Celebrations
          </p>
          <h1 className="display mt-1 text-4xl sm:text-5xl md:text-6xl tracking-tight">
            Who is Mr. Bondz?
          </h1>
        </div>

        {/* Tab Controls */}
        <div
          role="tablist"
          className="scroll-quiet inline-flex items-center gap-1 rounded-full border hairline bg-surface-light/60 p-1 shadow-xs max-w-full overflow-x-auto"
        >
          {TABS.map((t, i) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === i}
              onClick={() => {
                playTapSound();
                setTab(i);
              }}
              className={cn(
                "whitespace-nowrap shrink-0 rounded-full px-4 py-2 font-display text-xs font-black uppercase tracking-wider transition-all duration-200 [font-variation-settings:'wdth'_85]",
                tab === i
                  ? "bg-ink text-canvas shadow-sm"
                  : "text-ink/70 hover:text-ink hover:bg-canvas/50",
              )}
            >
              <span className="font-serif-i mr-1.5 italic text-primary font-bold">
                {String(i + 1).padStart(2, "0")}
              </span>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Panes */}
      <div key={tab} className="rise scroll-quiet min-h-0 flex-1 overflow-y-auto pt-5">
        {/* TAB 01: MR. BONDZ */}
        {tab === 0 && (
          <div className="grid h-full gap-8 lg:grid-cols-12 items-start pb-6">
            {/* Left Column: Biography & Philosophy */}
            <div className="flex flex-col gap-6 lg:col-span-7">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border hairline bg-surface-light px-3 py-1 text-[0.72rem] font-bold tracking-widest text-ink/85 uppercase">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Nº 01 - The Solo Event Organizer
                </span>
                <h2 className="display mt-4 text-[clamp(2.4rem,4.6vw,4.8rem)] leading-[0.94]">
                  “I don't run an agency with 40 juniors.{" "}
                  <span className="font-serif-i text-primary font-normal">
                    I organize your event myself.”
                  </span>
                </h2>
              </div>

              <p className="text-base sm:text-lg leading-relaxed text-ink/85 font-medium">
                For over 16 years across 700+ boutique celebrations, Mr. Bondz has engineered private feasts, weddings, milestone anniversaries, and corporate spectacles with an uncompromising conviction:{" "}
                <strong className="text-ink font-bold">
                  Host like a patron, plan like an architect.
                </strong>
              </p>

              <div className="grid gap-3 sm:grid-cols-3 pt-2">
                {[
                  {
                    icon: "✦",
                    title: "Direct Command",
                    desc: "One coordinator on-site from 7am load-in to 2am strike.",
                  },
                  {
                    icon: "⌂",
                    title: "Vetted Family",
                    desc: "12 premier caterers, florists, and DJs tied to our live calendar.",
                  },
                  {
                    icon: "✓",
                    title: "The Calm Promise",
                    desc: "Take a sip of champagne. Every friction point is solved before guests arrive.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border hairline bg-surface-light p-4 flex flex-col justify-between"
                  >
                    <span className="text-2xl text-primary font-serif-i">{item.icon}</span>
                    <h3 className="font-display font-black text-sm uppercase tracking-tight text-ink mt-3">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-ink/75 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleBook}
                  className="rounded-full bg-primary px-8 py-4 font-display font-black text-sm uppercase tracking-wider text-primary-foreground shadow-xl hover:brightness-110 active:scale-95 transition-all [font-variation-settings:'wdth'_85]"
                >
                  Start Your Booking With Mr. Bondz →
                </button>
              </div>
            </div>

            {/* Right Column: Editorial Profile & Metrics (High Contrast & Readability) */}
            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-[#1c1622] to-[#0f0b13] p-6 sm:p-7 text-white shadow-2xl [box-shadow:0_25px_50px_rgba(0,0,0,0.85)]">
                {/* Subtle luxury glow accent */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

                <div className="relative flex items-center gap-4 border-b border-white/15 pb-5">
                  <div className="size-20 rounded-full border-2 border-primary/70 bg-[#0d0910] flex items-center justify-center overflow-hidden shrink-0 shadow-xl ring-4 ring-primary/10">
                    <img
                      src={mascotWhite}
                      alt="Mr. Bondz"
                      className="size-14 object-contain brightness-125 drop-shadow-md"
                    />
                  </div>
                  <div>
                    <span className="font-serif-i italic text-primary font-bold text-sm tracking-wide">
                      Event Organizer & Founder
                    </span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white mt-0.5 [font-variation-settings:'wdth'_85]">
                      Mr. Bondz
                    </h3>
                    <p className="text-xs text-white/90 font-medium mt-1">
                      Downtown Studio HQ · Global Private Bookings
                    </p>
                  </div>
                </div>

                <div className="relative grid grid-cols-2 gap-4 py-5 border-b border-white/15">
                  <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-3.5 shadow-2xs">
                    <p className="display text-4xl sm:text-5xl text-primary font-black leading-none">16</p>
                    <p className="font-display text-xs font-black uppercase tracking-wider text-white mt-1.5 [font-variation-settings:'wdth'_85]">
                      Years Organizing
                    </p>
                    <p className="text-[0.68rem] text-white/75 mt-0.5 font-medium">Zero junior handoffs</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-3.5 shadow-2xs">
                    <p className="display text-4xl sm:text-5xl text-primary font-black leading-none">700+</p>
                    <p className="font-display text-xs font-black uppercase tracking-wider text-white mt-1.5 [font-variation-settings:'wdth'_85]">
                      Celebrations
                    </p>
                    <p className="text-[0.68rem] text-white/75 mt-0.5 font-medium">All individually run</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-3.5 shadow-2xs">
                    <p className="display text-4xl sm:text-5xl text-primary font-black leading-none">0</p>
                    <p className="font-display text-xs font-black uppercase tracking-wider text-white mt-1.5 [font-variation-settings:'wdth'_85]">
                      Telephone Tag
                    </p>
                    <p className="text-[0.68rem] text-white/75 mt-0.5 font-medium">Direct calendar sync</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-3.5 shadow-2xs">
                    <p className="display text-4xl sm:text-5xl text-primary font-black leading-none">100%</p>
                    <p className="font-display text-xs font-black uppercase tracking-wider text-white mt-1.5 [font-variation-settings:'wdth'_85]">
                      On-Site Presence
                    </p>
                    <p className="text-[0.68rem] text-white/75 mt-0.5 font-medium">Physical guarantee</p>
                  </div>
                </div>

                <div className="relative pt-4 flex items-center justify-between gap-2 text-xs">
                  <span className="font-serif-i italic text-white/95 font-semibold text-[0.82rem]">
                    “No intermediaries. Single point of physical contact.”
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-[0.68rem] font-bold text-emerald-300 shrink-0">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified Active
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border hairline bg-surface-light relative h-48">
                <img
                  src={wedding}
                  alt="Courtyard celebration"
                  className="w-full h-full object-cover grayscale contrast-125 opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <p className="font-display text-xs font-bold uppercase tracking-wider text-white">
                    Smokestack Courtyard · 90 Guests · Organized Live
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 02: THE RULE */}
        {tab === 1 && (
          <div className="grid h-full gap-6 lg:grid-cols-12 pb-6">
            <h1 className="display text-[clamp(2.8rem,min(8.5vw,17vh),10rem)] lg:col-span-8 leading-[0.92]">
              Impossible options <span className="font-serif-i text-primary font-normal">never exist</span> on screen.
            </h1>
            <div className="flex flex-col justify-end gap-5 lg:col-span-4">
              <span className="inline-flex items-center gap-2 rounded-full border hairline bg-surface-light px-3 py-1 text-[0.72rem] font-bold tracking-widest text-ink/85 uppercase w-fit">
                <span className="size-1.5 rounded-full bg-primary" />
                Nº 02 - The Fundamental Rule
              </span>
              <p className="text-base sm:text-lg leading-relaxed text-ink/85 font-medium">
                Every date, venue, and vendor a client sees has already been reconciled live against Mr. Bondz's calendar, the venue's schedule, and every vendor partner involved.
              </p>
              <p className="text-sm leading-relaxed text-ink/75 font-medium">
                Nothing is greyed out. Nothing is “maybe”. If a date cannot be executed with flawless perfection, it simply never renders.
              </p>
              <div className="grid grid-cols-3 border-t border-ink/20 pt-4">
                {[
                  ["0", "Phone Chases"],
                  ["75", "Days Polled"],
                  ["1", "Sitting, Done"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <p className="display text-4xl sm:text-5xl text-primary font-black">{n}</p>
                    <p className="font-display text-[0.72rem] font-bold uppercase tracking-wider text-ink/65 mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 03: BEFORE / AFTER */}
        {tab === 2 && (
          <div className="grid gap-4 md:grid-cols-2 pb-6">
            <div className="rounded-2xl border hairline bg-surface-light p-6 flex flex-col justify-between">
              <div>
                <p className="eyebrow text-ink/50">Nº 03 - The Legacy Way</p>
                <h2 className="display mt-2 text-4xl sm:text-5xl text-ink/40 line-through decoration-primary decoration-4">
                  Seven conversations.
                </h2>
                <ol className="mt-6 space-y-2">
                  {BEFORE.map((b, i) => (
                    <li key={b} className="flex gap-3 border-t hairline py-2.5 text-sm text-ink/70 font-medium">
                      <span className="font-serif-i w-6 font-bold text-ink/35">{String(i + 1).padStart(2, "0")}</span>
                      {b}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="rounded-2xl bg-ink p-6 text-canvas flex flex-col justify-between shadow-2xl">
              <div>
                <p className="eyebrow opacity-60">Nº 03 - The Bondz Architecture</p>
                <h2 className="display mt-2 text-4xl sm:text-5xl">
                  One session. <span className="font-serif-i text-primary font-normal">You're booked.</span>
                </h2>
                <ol className="mt-6 space-y-2">
                  {AFTER.map((b, i) => (
                    <li key={b} className="flex gap-3 border-t border-canvas/15 py-2.5 text-sm font-medium">
                      <span className="w-6 font-bold text-success">✓</span>
                      <span className="mr-auto">{b}</span>
                      <span className="font-serif-i opacity-40">{String(i + 1).padStart(2, "0")}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

