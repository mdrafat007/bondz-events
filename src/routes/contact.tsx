import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CONTACT, EVENT_TYPES } from "@/lib/bondz-data";
import { playTapSound, triggerTap } from "@/lib/haptics";
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

function Contact() {
  const [f, setF] = useState({ name: "", email: "", interest: "", msg: "" });
  const navigate = useNavigate();

  const handleBookNow = () => {
    triggerTap();
    triggerBookingTransition(() => navigate({ to: "/book", search: { intro: 1 } }));
  };

  const submit = (e: React.FormEvent): void => {
    e.preventDefault();
    triggerTap();
    if (!f.name || !/\S+@\S+\.\S+/.test(f.email) || !f.msg) {
      toast.error("Name, a valid email and a message, please.");
      return;
    }
    toast.info("This preview cannot send messages yet. Your message is still here so you can copy it.");
  };

  const input =
    "mt-1 w-full border-0 border-b border-ink/25 bg-transparent px-0 py-2 text-lg font-semibold text-ink outline-none transition focus:border-primary placeholder:text-ink/35";

  return (
    <div className="scroll-quiet grid h-full gap-6 overflow-y-auto px-4 pb-4 pt-4 md:px-8 lg:grid-cols-12 lg:overflow-hidden">
      {/* Left Column: Headline, Mascot Seal, and Direct Channels */}
      <div className="flex flex-col lg:col-span-6 justify-between">
        <div>
          <p className="eyebrow text-primary font-bold tracking-widest uppercase">
            Nº 06 - Direct Line to Mr. Bondz
          </p>
          <h1 className="display mt-3 text-[clamp(2.8rem,min(6vw,11vh),7rem)] tracking-tight leading-[0.95]">
            Tell me what you’re celebrating.
          </h1>

          {/* Bespoke Dark Mascot Seal with Event Organizer Guarantee */}
          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/20 bg-gradient-to-b from-[#1c1622] to-[#0f0b13] text-white p-4 sm:p-5 shadow-xl max-w-lg">
            <div className="size-16 sm:size-18 shrink-0 rounded-full border-2 border-primary/60 bg-[#0d0a0e] flex items-center justify-center overflow-hidden shadow-inner p-1">
              <img
                src={mascotWhite}
                alt="Mr. Bondz Seal"
                className="size-full object-contain filter drop-shadow brightness-125"
              />
            </div>
            <div className="flex flex-col">
              <span className="eyebrow text-primary text-[0.68rem] tracking-widest uppercase font-bold">
                Personal Event Organizer Guarantee
              </span>
              <p className="font-display text-base sm:text-lg font-black tracking-tight text-white mt-0.5 [font-variation-settings:'wdth'_85]">
                “Mr. Bondz will take care of it.”
              </p>
              <p className="mt-1 text-xs text-white/85 leading-relaxed font-sans">
                No handoffs, no junior reps. From initial concept to 2am strike, you coordinate directly with Mr. Bondz.
              </p>
            </div>
          </div>
        </div>

        {/* Studio & Contact Footnotes */}
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink/15 pt-5 text-sm">
          <div>
            <dt className="eyebrow text-ink/50 text-xs uppercase tracking-wider font-bold">Direct Email</dt>
            <dd className="font-semibold text-ink mt-0.5">
              <a href={`mailto:${CONTACT.email}`} className="hover:text-primary transition-colors">
                {CONTACT.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-ink/50 text-xs uppercase tracking-wider font-bold">Phone</dt>
            <dd className="font-semibold text-ink mt-0.5">{CONTACT.phone}</dd>
          </div>
          <div>
            <dt className="eyebrow text-ink/50 text-xs uppercase tracking-wider font-bold">Private Studio</dt>
            <dd className="font-semibold text-ink mt-0.5">{CONTACT.studio}</dd>
          </div>
          <div>
            <dt className="eyebrow text-ink/50 text-xs uppercase tracking-wider font-bold">Turnaround</dt>
            <dd className="font-semibold text-ink mt-0.5">{CONTACT.hours}</dd>
          </div>
        </dl>
      </div>

      {/* Right Column: Editorial Contact Form */}
      <form
        onSubmit={submit}
        className="flex flex-col gap-4 rounded-3xl border hairline bg-surface-light p-6 lg:col-span-6 lg:self-center md:p-8 shadow-sm"
      >
        <label>
          <span className="eyebrow text-ink/65 text-xs font-bold uppercase tracking-wider">Your Name</span>
          <input
            className={input}
            placeholder="e.g. Maya Lin"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            autoComplete="name"
          />
        </label>
        <label>
          <span className="eyebrow text-ink/65 text-xs font-bold uppercase tracking-wider">Direct Email</span>
          <input
            type="email"
            placeholder="e.g. maya@domain.com"
            className={input}
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
            autoComplete="email"
          />
        </label>
        <div>
          <span className="eyebrow text-ink/65 text-xs font-bold uppercase tracking-wider">
            I'm thinking about
          </span>
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
                    : "hairline hover:border-ink/50 text-ink/75"
                }`}
              >
                {f.interest === e.title && "✓ "}
                {e.title}
              </button>
            ))}
          </div>
        </div>
        <label>
          <span className="eyebrow text-ink/65 text-xs font-bold uppercase tracking-wider">Message</span>
          <textarea
            rows={3}
            placeholder="Estimated date, guest count, or any specific details..."
            className={input + " resize-none text-base font-medium"}
            value={f.msg}
            onChange={(e) => setF({ ...f, msg: e.target.value })}
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
          <button
            type="button"
            onClick={handleBookNow}
            className="text-xs font-bold text-ink/70 underline underline-offset-4 hover:text-primary transition-colors cursor-pointer"
          >
            Or skip the wait - launch live booking engine →
          </button>
          <button
            type="submit"
            className="rounded-full bg-primary px-7 py-3.5 font-display text-sm font-black uppercase tracking-wider text-primary-foreground shadow-xl hover:brightness-110 active:scale-95 transition-all [font-variation-settings:'wdth'_85]"
          >
            Send to Mr. Bondz →
          </button>
        </div>
      </form>
    </div>
  );
}

