import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AppShell, SiteFooter, Button } from "../index";
import { MarketingNav } from "../components/layout/MarketingNav";
import { useBookingLaunch } from "../lib/use-booking-launch";
import { EVENT_TYPES } from "../lib/bondz-data";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — Bondz Events" },
    { name: "description", content: "Talk to Mr. Bondz directly. Send an inquiry with your date and guest count, or skip the queue and book your celebration in one sitting." },
    { property: "og:title", content: "Contact — Bondz Events" },
    { property: "og:description", content: "Reach Mr. Bondz directly, or fast-track straight to booking your celebration." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ContactPage,
});

const STUDIO = [
  { label: "Email", value: "hello@bondzevents.com", href: "mailto:hello@bondzevents.com" },
  { label: "Phone", value: "+1 (555) 014-2266", href: "tel:+15550142266" },
  { label: "Studio", value: "Studio 4, Old Mill Row" },
  { label: "Response time", value: "Replies within one business day" },
];

const fieldClass = "w-full rounded-card border border-hairline bg-surface-light px-4 py-3 font-sans text-sm text-ink placeholder:text-subtle/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const labelClass = "font-sans text-[0.65rem] font-extrabold uppercase tracking-widest text-subtle";

function ContactPage() {
  const { launchBooking, launching, curtain } = useBookingLaunch();
  const [form, setForm] = useState({ name: "", email: "", date: "", guests: "", interest: "", message: "" });

  const update = (key: keyof typeof form) => (event: { target: { value: string } }) => setForm((previous) => ({ ...previous, [key]: event.target.value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    const validEmail = /\S+@\S+\.\S+/.test(form.email.trim());
    if (!name || !validEmail || !form.message.trim()) {
      toast.error("Name, a valid email and a message, please.");
      return;
    }
    const firstName = name.split(" ")[0];
    toast.success(`Thanks ${firstName} — Mr. Bondz will reply within a business day.`);
    setForm({ name: "", email: "", date: "", guests: "", interest: "", message: "" });
  };

  return <AppShell header={<MarketingNav active="/contact" />} footer={<SiteFooter className="hidden sm:block" />}>
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 md:px-8">
      <span className="font-sans text-[0.68rem] font-extrabold uppercase tracking-widest text-primary">Direct line</span>
      <h1 className="mt-3 max-w-3xl font-sans text-[clamp(2.1rem,5.4vw,4rem)] font-black uppercase leading-[0.95] tracking-tight text-ink [font-variation-settings:'wdth'_85]">
        Talk to<span className="font-serif font-normal italic tracking-normal text-primary"> Mr. Bondz</span>
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
        <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-hairline bg-surface p-6 shadow-soft sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="contact-name" className={labelClass}>Name</label>
              <input id="contact-name" name="name" required value={form.name} onChange={update("name")} placeholder="Your full name" className={`mt-2 ${fieldClass}`} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contact-email" className={labelClass}>Email</label>
              <input id="contact-email" name="email" type="email" required value={form.email} onChange={update("email")} placeholder="you@example.com" className={`mt-2 ${fieldClass}`} />
            </div>
            <div>
              <label htmlFor="contact-date" className={labelClass}>Preferred date</label>
              <input id="contact-date" name="date" type="date" value={form.date} onChange={update("date")} className={`mt-2 ${fieldClass}`} />
            </div>
            <div>
              <label htmlFor="contact-guests" className={labelClass}>Guest count</label>
              <input id="contact-guests" name="guests" type="number" min={1} max={400} value={form.guests} onChange={update("guests")} placeholder="e.g. 90" className={`mt-2 ${fieldClass}`} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contact-interest" className={labelClass}>Event interest</label>
              <select id="contact-interest" name="interest" value={form.interest} onChange={update("interest")} className={`mt-2 ${fieldClass}`}>
                <option value="">Not sure yet</option>
                {EVENT_TYPES.map((type) => <option key={type.id} value={type.id}>{type.title}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contact-message" className={labelClass}>Notes</label>
              <textarea id="contact-message" name="message" required rows={5} value={form.message} onChange={update("message")} placeholder="Tell us what you're celebrating." className={`mt-2 resize-y ${fieldClass}`} />
            </div>
          </div>
          <Button type="submit" variant="dark" size="lg" className="mt-6 w-full rounded-full sm:w-auto">Send inquiry →</Button>
        </form>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-hairline bg-surface-light p-6 shadow-soft">
            <h2 className="font-sans text-xs font-black uppercase tracking-widest text-ink">The studio</h2>
            <dl className="mt-5 space-y-4">
              {STUDIO.map((row) => <div key={row.label}>
                <dt className={labelClass}>{row.label}</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{row.href ? <a href={row.href} className="underline decoration-primary underline-offset-4 hover:text-primary">{row.value}</a> : row.value}</dd>
              </div>)}
            </dl>
          </div>
          <div className="rounded-2xl bg-night p-6 text-white shadow-raised sm:p-8">
            <h2 className="font-sans text-xs font-black uppercase tracking-widest text-primary">Skip the queue</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">Every date we show you already works for Mr. Bondz, the venue and every partner you pick. Lock yours in one sitting.</p>
            <Button variant="primary" size="lg" className="mt-6 w-full rounded-full" onClick={launchBooking} disabled={launching}>Get Booked Now →</Button>
          </div>
        </aside>
      </div>
    </div>
    {curtain}
  </AppShell>;
}
