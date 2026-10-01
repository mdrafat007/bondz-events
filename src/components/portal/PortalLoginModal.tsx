import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { type PortalRole, setStoredRole, setStoredPartnerId } from "@/lib/portal-store";
import { PARTNERS } from "@/lib/bondz-data";
import { triggerTap, playTapSound } from "@/lib/haptics";
import { useTheme } from "@/lib/theme";
import mascotWhite from "@/assets/mascot-white.png";
import mascotRed from "@/assets/mascot-red.png";
import { cn } from "@/lib/utils";

export function PortalLoginModal({ onSelectRole }: { onSelectRole: (role: PortalRole, partnerId?: string) => void }) {
  const { theme } = useTheme();
  const mascotImg = theme === "dark" ? mascotWhite : mascotRed;

  const [activeTab, setActiveTab] = useState<"owner" | "partner">("owner");
  const [selectedPartner, setSelectedPartner] = useState("ember");

  // Owner credentials state (prefilled)
  const [ownerUsername, setOwnerUsername] = useState("mr.bondz@bondzevents.com");
  const [ownerPassword, setOwnerPassword] = useState("••••••••••••");

  // Partner credentials state (prefilled)
  const [partnerUsername, setPartnerUsername] = useState("ember.oak@bondzpartners.uk");
  const [partnerPassword, setPartnerPassword] = useState("••••••••••••");

  // Loading transition state
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loadingPartnerName, setLoadingPartnerName] = useState("");

  const handleOwnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    triggerTap();
    setIsLoggingIn(true);
    setLoadingPartnerName("Mr. Bondz");

    setTimeout(() => {
      setStoredRole("owner");
      onSelectRole("owner");
    }, 1200);
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    triggerTap();
    setIsLoggingIn(true);
    const partnerObj = PARTNERS.find((p) => p.id === selectedPartner);
    setLoadingPartnerName(partnerObj?.name || "Partner Fleet");

    setTimeout(() => {
      setStoredRole("partner");
      setStoredPartnerId(selectedPartner);
      onSelectRole("partner", selectedPartner);
    }, 1200);
  };

  const handlePartnerChange = (newId: string) => {
    setSelectedPartner(newId);
    setPartnerUsername(`${newId}.fleet@bondzpartners.uk`);
  };

  // Peek-a-boo mascot animation calibrated from HeroBookingCTA / Booking Loading
  const loadingMascotVariants: Variants = {
    animate: {
      y: [28, -6, -6, 28],
      rotate: [0, 8, 8, 0],
      transition: {
        times: [0, 0.3, 0.7, 1],
        duration: 1.1,
        repeat: Infinity,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  if (isLoggingIn) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center text-center px-4">
        {/* Animated Mascot Peek Container */}
        <div className="relative mb-6">
          <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-full border-2 border-primary/50 bg-night p-2 shadow-2xl">
            <motion.img
              variants={loadingMascotVariants}
              animate="animate"
              src={mascotImg}
              alt="Mr. Bondz mascot"
              className="size-20 object-contain drop-shadow-md select-none"
            />
          </div>
          <span className="live-dot absolute bottom-1 right-1 size-3.5 rounded-full bg-success border-2 border-night" />
        </div>

        <div className="space-y-2">
          <span className="eyebrow text-primary text-xs font-mono tracking-widest uppercase">
            Synchronizing Operating Core
          </span>
          <h2 className="font-display partner-name text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-ink [font-variation-settings:'wdth'_85]">
            {loadingPartnerName}
          </h2>
          <p className="font-serif-i italic text-sm text-ink/65">Good times, beautifully made.</p>
        </div>
      </div>
    );
  }

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

        {/* Role Toggle Switch */}
        <div className="mt-6 inline-flex rounded-full border hairline bg-surface-light p-1 shadow-xs">
          <button
            type="button"
            onClick={() => {
              playTapSound();
              setActiveTab("owner");
            }}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer",
              activeTab === "owner" ? "bg-ink text-canvas shadow-raised" : "text-ink/60 hover:text-ink",
            )}
          >
            Mr. Bondz (Owner)
          </button>
          <button
            type="button"
            onClick={() => {
              playTapSound();
              setActiveTab("partner");
            }}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer",
              activeTab === "partner" ? "bg-ink text-canvas shadow-raised" : "text-ink/60 hover:text-ink",
            )}
          >
            Partner Portal
          </button>
        </div>
      </div>

      <div className="mt-8">
        {activeTab === "owner" ? (
          <form
            onSubmit={handleOwnerSubmit}
            className="rounded-3xl border hairline bg-surface-light p-6 sm:p-8 shadow-raised space-y-5"
          >
            <div className="flex items-center gap-4 border-b hairline pb-5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-night p-2 shadow-inner">
                <img src={mascotWhite} alt="Mr. Bondz" className="size-full object-contain filter drop-shadow" />
              </div>
              <div>
                <span className="eyebrow text-primary text-[0.68rem] font-mono">Executive Command</span>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink [font-variation-settings:'wdth'_85]">
                  Mr. Bondz Operations
                </h3>
                <p className="text-xs text-ink/65">Full 360° booking pipeline &amp; partner fleet management.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="eyebrow block text-ink/65 text-xs mb-1.5 font-bold">Account Identifier</label>
                <input
                  type="text"
                  value={ownerUsername}
                  onChange={(e) => setOwnerUsername(e.target.value)}
                  required
                  className="w-full rounded-xl border hairline bg-canvas px-4 py-2.5 text-sm font-medium text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
                />
              </div>

              <div>
                <label className="eyebrow block text-ink/65 text-xs mb-1.5 font-bold">Security Passkey</label>
                <input
                  type="password"
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border hairline bg-canvas px-4 py-2.5 text-sm font-medium text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs tracking-wider"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-ink py-3.5 text-xs font-extrabold uppercase tracking-wider text-canvas hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Enter Command Center →
            </button>
          </form>
        ) : (
          <form
            onSubmit={handlePartnerSubmit}
            className="rounded-3xl border hairline bg-surface-light p-6 sm:p-8 shadow-raised space-y-5"
          >
            <div className="flex items-center gap-4 border-b hairline pb-5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border hairline bg-canvas text-2xl shadow-inner">
                🤝
              </div>
              <div>
                <span className="eyebrow text-primary text-[0.68rem] font-mono">Vendors &amp; Venues</span>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink [font-variation-settings:'wdth'_85]">
                  Partner Fleet Portal
                </h3>
                <p className="text-xs text-ink/65">
                  Work orders, real-time client headcount &amp; calendar blackout toggles.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="eyebrow block text-ink/65 text-xs mb-1.5 font-bold">Partner Organization</label>
                <select
                  value={selectedPartner}
                  onChange={(e) => handlePartnerChange(e.target.value)}
                  className="w-full rounded-xl border hairline bg-canvas px-4 py-2.5 text-sm font-bold text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
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

              <div>
                <label className="eyebrow block text-ink/65 text-xs mb-1.5 font-bold">Partner Dispatch Login</label>
                <input
                  type="text"
                  value={partnerUsername}
                  onChange={(e) => setPartnerUsername(e.target.value)}
                  required
                  className="w-full rounded-xl border hairline bg-canvas px-4 py-2.5 text-sm font-medium text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
                />
              </div>

              <div>
                <label className="eyebrow block text-ink/65 text-xs mb-1.5 font-bold">Authorization Key</label>
                <input
                  type="password"
                  value={partnerPassword}
                  onChange={(e) => setPartnerPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border hairline bg-canvas px-4 py-2.5 text-sm font-medium text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs tracking-wider"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-ink py-3.5 text-xs font-extrabold uppercase tracking-wider text-canvas hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Enter Partner Dashboard →
            </button>
          </form>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-ink/50 font-serif-i italic">
        Good times, beautifully made. Single-sitting verified access.
      </p>
    </div>
  );
}
