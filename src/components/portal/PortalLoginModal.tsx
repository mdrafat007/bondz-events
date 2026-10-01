import { useState } from "react";
import { type PortalRole, setStoredRole, setStoredPartnerId } from "@/lib/portal-store";
import { PARTNERS, VENUES } from "@/lib/bondz-data";
import { triggerTap, playTapSound } from "@/lib/haptics";
import mascotWhite from "@/assets/mascot-white.png";

export function PortalLoginModal({ onSelectRole }: { onSelectRole: (role: PortalRole, partnerId?: string) => void }) {
  const [selectedPartner, setSelectedPartner] = useState("ember");

  const handleSelectOwner = () => {
    playTapSound();
    setStoredRole("owner");
    onSelectRole("owner");
  };

  const handleSelectPartner = () => {
    playTapSound();
    setStoredRole("partner");
    setStoredPartnerId(selectedPartner);
    onSelectRole("partner", selectedPartner);
  };

  return (
    <div className="mx-auto w-full max-w-xl py-6 sm:py-10">
      <div className="text-center">
        <span className="eyebrow rounded-full border hairline bg-surface px-3 py-1 text-[0.68rem] font-bold text-ink/75">
          🔒 Bondz Events Authenticated Gate
        </span>
        <h1 className="display mt-4 text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
          Select Portal Access
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-ink/70 max-w-md mx-auto">
          Single-sitting, authenticated control center. Choose your role to access synchronized production schedules and
          live calendars.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {/* Role Card 1: Mr. Bondz (Owner) */}
        <div
          onClick={handleSelectOwner}
          className="group relative flex flex-col justify-between rounded-3xl border hairline bg-surface-light p-6 sm:p-7 shadow-raised transition-all duration-300 hover:border-primary/60 hover:shadow-xl cursor-pointer"
        >
          <div>
            <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/40 bg-night p-2 shadow-inner">
              <img src={mascotWhite} alt="Mr. Bondz" className="size-full object-contain filter drop-shadow" />
            </div>
            <span className="eyebrow text-primary mt-4 block text-[0.68rem] font-mono">Owner &amp; Producer</span>
            <h3 className="font-display mt-1 text-xl font-bold uppercase tracking-tight text-ink [font-variation-settings:'wdth'_85]">
              Mr. Bondz
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink/70">
              Master control panel. Monitor live 360° bookings, inspect client run-of-shows, and onboard new fleet
              partners.
            </p>
          </div>
          <button
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-xs font-extrabold uppercase tracking-wider text-canvas transition group-hover:bg-primary group-hover:text-primary-foreground shadow-xs"
          >
            Enter Command Center →
          </button>
        </div>

        {/* Role Card 2: Event Partner */}
        <div className="group relative flex flex-col justify-between rounded-3xl border hairline bg-surface-light p-6 sm:p-7 shadow-raised transition-all duration-300 hover:border-primary/60 hover:shadow-xl">
          <div>
            <div className="flex size-14 items-center justify-center rounded-2xl border hairline bg-canvas text-2xl shadow-inner">
              🤝
            </div>
            <span className="eyebrow text-primary mt-4 block text-[0.68rem] font-mono">Vendors &amp; Venues</span>
            <h3 className="font-display mt-1 text-xl font-bold uppercase tracking-tight text-ink [font-variation-settings:'wdth'_85]">
              Partner Portal
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink/70">
              Synchronized work orders, live guest headcounts, agreed revenue splits, and interactive availability
              toggles.
            </p>

            <div className="mt-4">
              <label className="eyebrow block text-ink/50 text-[0.65rem] mb-1">Select Partner Identity:</label>
              <select
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="w-full rounded-xl border hairline bg-canvas px-3 py-2 text-xs font-bold text-ink outline-none focus:border-primary"
              >
                <optgroup label="Catering & Culinary">
                  <option value="ember">Ember &amp; Oak Kitchen</option>
                  <option value="halal">Halal Feast Co.</option>
                  <option value="smoke">Smoke &amp; Cedar Catering</option>
                </optgroup>
                <optgroup label="Music, DJ & Audio">
                  <option value="nova">DJ Nova</option>
                  <option value="static">Static Bloom Sound</option>
                  <option value="aura">Aura Sound &amp; Lighting</option>
                </optgroup>
                <optgroup label="Decorations & Florals">
                  <option value="petal">Petal Theory</option>
                  <option value="linen">Linen &amp; Light Studio</option>
                </optgroup>
                <optgroup label="Venues">
                  <option value="smokestack">Smokestack Yard</option>
                  <option value="glasshouse">The Glasshouse</option>
                  <option value="loft9">Loft Nine</option>
                </optgroup>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSelectPartner}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border hairline bg-surface py-3 text-xs font-extrabold uppercase tracking-wider text-ink transition hover:bg-canvas group-hover:border-primary group-hover:text-primary shadow-xs cursor-pointer"
          >
            Enter Partner Hub →
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-ink/50 font-serif-i italic">
        Good times, beautifully made. Zero passwords required for instant evaluation.
      </p>
    </div>
  );
}
