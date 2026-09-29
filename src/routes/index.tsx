import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Badge, BrandLockup, Button, Card, SiteFooter, SiteNav } from "../index";
import { playCelebrationSound, playPeekabooSound } from "../design-system/lib/haptics";
import lightInvite from "../design-system/assets/templates/BONDZ_EVENTS_INVITE_CARD_-_LIGHT.png";
import darkInvite from "../design-system/assets/templates/BONDZ_EVENTS_INVITE_CARD_-_DARK.png";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Bondz Events — Design System" },
    { name: "description", content: "A preview of Bondz Events brand colors, typography, controls, audio, and invitation artwork." },
    { property: "og:title", content: "Bondz Events — Design System" },
    { property: "og:description", content: "A preview of Bondz Events brand colors, typography, controls, audio, and invitation artwork." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const palette = [
  { name: "Canvas", token: "canvas", usage: "The backdrop" },
  { name: "Surface", token: "surface", usage: "The stage" },
  { name: "Surface Light", token: "surface-light", usage: "The highlight" },
  { name: "Ink", token: "ink", usage: "The signature" },
  { name: "Primary", token: "primary", usage: "The spark" },
  { name: "Hairline", token: "hairline", usage: "The detail" },
  { name: "Subtle", token: "subtle", usage: "The whisper" },
] as const;
const swatchClasses = ["bg-canvas", "bg-surface", "bg-surface-light", "bg-ink", "bg-primary", "bg-hairline", "bg-subtle"];

function Index() {
  return <AppShell header={<SiteNav items={[{ label: "System", href: "/", active: true }, { label: "Who is Mr. Bondz" }, { label: "Events Gallery" }, { label: "Event Services" }, { label: "Partners" }, { label: "Contact" }]} />} footer={<SiteFooter />}>
    <div>
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-6 md:px-8 md:pt-12">
        <div className="flex flex-wrap items-center gap-2 text-[0.7rem] font-bold uppercase text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Bondz Events <span className="text-subtle">/</span> Foundation <span className="text-subtle">/</span> 01</div>
        <div className="mt-8 grid items-end gap-8 border-b border-hairline pb-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div><h1 className="font-serif text-6xl leading-[0.95] text-ink sm:text-7xl lg:text-8xl">Every celebration<br /><em className="font-normal text-primary">has a signature.</em></h1><p className="mt-6 max-w-lg text-base leading-relaxed text-subtle">The visual language of Bondz Events. Thoughtful details, bold gestures, and a personal touch in every moment.</p><div className="mt-8 flex flex-wrap gap-3"><Button onClick={triggerTap}>Feel the tap <span aria-hidden="true">↗</span></Button><Button variant="dark" onMouseEnter={playPeekabooSound} onFocus={playPeekabooSound} onClick={playPeekabooSound}>Hear the peekaboo <span aria-hidden="true">♫</span></Button></div></div>
          <div className="flex justify-start lg:justify-end"><BrandLockup size="lg" className="w-56 sm:w-72 lg:w-80" /></div>
        </div>
        <section className="py-10 md:py-14" aria-labelledby="color-heading"><SectionTitle number="01" title="The palette" id="color-heading" detail="Seven roles. Two moods." /><div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">{palette.map((item, i) => <div key={item.name} className="min-w-0"><div className={`aspect-[4/3] rounded-card border border-hairline ${swatchClasses[i]}`} /><p className="mt-3 text-xs font-extrabold uppercase text-ink">{item.name}</p><p className="mt-0.5 text-xs text-subtle">{item.usage}</p><code className="mt-1 block break-words text-[0.65rem] text-primary">{item.token}</code></div>)}</div></section>
        <section className="border-t border-hairline py-10 md:py-14" aria-labelledby="type-heading"><SectionTitle number="02" title="Type with character" id="type-heading" detail="Editorial meets exacting." /><div className="mt-7 grid gap-10 lg:grid-cols-2"><div><p className="mb-4 text-xs font-bold uppercase text-primary">Instrument Serif / Display</p><p className="font-serif text-6xl leading-none sm:text-7xl">Make it <em>memorable.</em></p><p className="mt-4 font-serif text-2xl italic text-subtle">The art of bringing people together.</p></div><div><p className="mb-4 text-xs font-bold uppercase text-primary">Bricolage Grotesque / Interface</p><p className="text-3xl font-extrabold leading-tight sm:text-4xl">A little magic. <br />A lot of heart.</p><p className="mt-4 text-base leading-relaxed text-subtle">Celebrations of every shape and size, made personal by Mr. Bondz.</p><p className="mt-4 font-mono text-xs text-subtle">01 — 02 — 03 / EVERY DETAIL COUNTS</p></div></div></section>
        <section className="border-t border-hairline py-10 md:py-14" aria-labelledby="controls-heading"><SectionTitle number="03" title="The essentials" id="controls-heading" detail="A tactile little toolkit." /><div className="mt-7 grid gap-8 lg:grid-cols-2"><div><p className="mb-4 text-xs font-bold uppercase text-subtle">BUTTONS / INTERACTION</p><div className="flex flex-wrap items-center gap-3"><Button onClick={triggerTap}>Primary action →</Button><Button variant="dark" onClick={triggerTap}>Dark action ↗</Button><Button variant="outline" onClick={triggerTap}>Outline action</Button><Button variant="ghost" onClick={triggerTap}>Ghost action</Button></div><p className="mb-4 mt-9 text-xs font-bold uppercase text-subtle">BADGES / SIGNALS</p><div className="flex flex-wrap gap-2"><Badge variant="accent">Featured</Badge><Badge variant="neutral">Available</Badge><Badge variant="outline">Limited</Badge><Badge variant="muted">Coming soon</Badge></div><div className="mt-8"><Button variant="outline" onClick={playCelebrationSound}>Play celebration <span aria-hidden="true">♫</span></Button></div></div><div><p className="mb-4 text-xs font-bold uppercase text-subtle">CARDS / DEPTH</p><div className="grid gap-3 sm:grid-cols-2"><Card variant="flat"><span className="text-xs font-bold uppercase text-primary">01 / Flat</span><p className="mt-4 font-serif text-3xl">The invitation</p><p className="mt-2 text-sm text-subtle">Quiet structure, clear intent.</p></Card><Card variant="elevated"><span className="text-xs font-bold uppercase text-primary">02 / Raised</span><p className="mt-4 font-serif text-3xl">The occasion</p><p className="mt-2 text-sm text-subtle">Physical depth, no glow.</p></Card></div></div></div></section>
        <section className="border-t border-hairline py-10 md:py-14" aria-labelledby="brand-heading"><SectionTitle number="04" title="A personal signature" id="brand-heading" detail="Original Bondz artwork." /><div className="mt-7 grid items-center gap-8 md:grid-cols-2"><div className="border border-hairline bg-surface p-5"><img src={lightInvite} alt="Bondz Events light invitation template" className="mx-auto max-h-96 object-contain dark:hidden" /><img src={darkInvite} alt="Bondz Events dark invitation template" className="mx-auto hidden max-h-96 object-contain dark:block" /></div><div><Badge variant="outline">By Mr. Bondz</Badge><p className="mt-5 font-serif text-5xl leading-none">Good times,<br /><em>beautifully made.</em></p><p className="mt-5 max-w-sm text-sm leading-relaxed text-subtle">16 years of making every gathering feel one of a kind. 700+ celebrations and counting.</p><div className="mt-8 border-l-2 border-primary pl-4 text-xs font-bold uppercase text-subtle">The beginning of something brilliant.</div></div></div></section>
        <div className="border-t border-hairline py-10 text-xs font-bold uppercase text-subtle">Bondz Events · The foundation / End of canvas</div>
      </div>
    </div>
  </AppShell>;
}
function SectionTitle({ number, title, detail, id }: { number: string; title: string; detail: string; id: string }) {
  return <div className="flex flex-wrap items-end justify-between gap-2"><div className="flex items-baseline gap-3"><span className="font-serif text-2xl italic text-primary">{number}</span><h2 id={id} className="text-2xl font-extrabold text-ink sm:text-3xl">{title}</h2></div><p className="text-sm text-subtle">{detail}</p></div>;
}
