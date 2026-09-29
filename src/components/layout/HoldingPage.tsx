import { AppShell, SiteFooter } from "../../index";
import { MarketingNav } from "./MarketingNav";

export function HoldingPage({ title, eyebrow, description, path }: { title: string; eyebrow: string; description: string; path: string }) {
  return <AppShell header={<MarketingNav active={path} />} footer={<SiteFooter className="hidden sm:block" />}>
    <div className="mx-auto flex min-h-full max-w-7xl flex-col justify-center px-5 py-16 sm:px-8">
      <span className="mb-6 text-xs font-extrabold uppercase text-primary">{eyebrow}</span>
      <h1 className="max-w-4xl font-serif text-5xl leading-tight text-ink sm:text-7xl">{title}</h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-subtle">{description}</p>
      <div className="mt-12 border-t border-hairline pt-4 text-xs font-bold uppercase text-subtle">Bondz Events · More to come</div>
    </div>
  </AppShell>;
}