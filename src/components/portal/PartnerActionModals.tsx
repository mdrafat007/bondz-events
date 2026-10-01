import { useState } from "react";
import { type CategoryId, CATEGORIES, PARTNERS } from "@/lib/bondz-data";
import {
  type CustomPartner,
  saveCustomPartner,
  removeCustomPartner,
  togglePartnerPause,
  isPartnerPaused,
  togglePartnerArchive,
  isPartnerArchived,
  getCustomPartners,
} from "@/lib/portal-store";
import { triggerTap, playTapSound } from "@/lib/haptics";
import { toast } from "sonner";

export type PartnerActionModalType = "onboard" | "pause" | "archive" | "remove" | null;

/* ─────────────────────────────────────────────────────────────
   1. Onboard Partner Modal
────────────────────────────────────────────────────────────── */
export function OnboardPartnerModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (p: CustomPartner) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryId>("catering");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [rateLabel, setRateLabel] = useState("");
  const [capacity, setCapacity] = useState("10 - 250 guests");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please provide a partner name");
      return;
    }
    playTapSound();
    const newPartner: CustomPartner = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      contact: contact.trim() || "Lead Contact",
      phone: phone.trim() || "+44 20 7946 0912",
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, "")}@partner.co.uk`,
      rateLabel: rateLabel.trim() || "On request",
      capacity: capacity.trim() || "10 - 250 guests",
      active: true,
    };
    saveCustomPartner(newPartner);
    onAdded(newPartner);
    toast.success(`Partner "${newPartner.name}" onboarded to active fleet`);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Onboard new event partner"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border hairline bg-surface-light p-6 sm:p-8 text-ink shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b hairline pb-4">
          <div>
            <span className="eyebrow text-primary">Mr. Bondz Fleet Expansion</span>
            <h2 className="display mt-1 text-2xl font-bold tracking-tight sm:text-3xl text-ink">
              Onboard Event Partner
            </h2>
            <p className="mt-1 text-xs text-ink/65">
              Add a trusted specialist to Mr. Bondz’s 360° synchronized calendar roster.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink/60 hover:bg-canvas hover:text-ink transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="eyebrow block text-ink/60 text-xs mb-1">Partner / Business Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Blooms Floral Studio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-sm font-semibold text-ink outline-none transition focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="eyebrow block text-ink/60 text-xs mb-1">Discipline / Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full rounded-xl border hairline bg-canvas px-3 py-2.5 text-xs font-bold text-ink outline-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-canvas text-ink">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="eyebrow block text-ink/60 text-xs mb-1">Guest Capacity Threshold</label>
              <input
                type="text"
                placeholder="e.g. 20 - 300 guests"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-sm font-semibold text-ink outline-none transition focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="eyebrow block text-ink/60 text-xs mb-1">Lead Liaison Contact</label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-sm font-semibold text-ink outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="eyebrow block text-ink/60 text-xs mb-1">Contract / Rate Structure</label>
              <input
                type="text"
                placeholder="e.g. £45/guest or £1,200 flat"
                value={rateLabel}
                onChange={(e) => setRateLabel(e.target.value)}
                className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-sm font-semibold text-ink outline-none transition focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="eyebrow block text-ink/60 text-xs mb-1">Operational Phone</label>
              <input
                type="tel"
                placeholder="+44 20 7946 0912"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-sm font-semibold text-ink outline-none transition focus:border-primary"
              />
            </div>
            <div>
              <label className="eyebrow block text-ink/60 text-xs mb-1">Dispatch Email</label>
              <input
                type="email"
                placeholder="ops@royalblooms.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-sm font-semibold text-ink outline-none transition focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-3 border-t hairline flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border hairline px-4 py-2 text-xs font-bold text-ink/75 hover:bg-canvas transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-primary px-5 py-2 text-xs font-black uppercase tracking-wider text-primary-foreground hover:brightness-110 active:scale-95 transition shadow-sm cursor-pointer"
            >
              Confirm Onboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. Pause Partner Modal
────────────────────────────────────────────────────────────── */
export function PausePartnerModal({
  customPartners,
  onClose,
  onUpdated,
}: {
  customPartners: CustomPartner[];
  onClose: () => void;
  onUpdated: () => void;
}) {
  const allList = [
    ...PARTNERS.map((p) => ({ id: p.id, name: p.name, category: p.category, isCustom: false })),
    ...customPartners.map((p) => ({ id: p.id, name: p.name, category: p.category, isCustom: true })),
  ];

  const [selectedPartnerId, setSelectedPartnerId] = useState(allList[0]?.id || "");
  const selectedPartner = allList.find((p) => p.id === selectedPartnerId) || allList[0];
  const paused = selectedPartner ? isPartnerPaused(selectedPartner.id) : false;

  const handleToggle = () => {
    if (!selectedPartner) return;
    playTapSound();
    const nowPaused = togglePartnerPause(selectedPartner.id);
    onUpdated();
    toast.success(
      nowPaused
        ? `Partner "${selectedPartner.name}" is now PAUSED (Calendar hold enabled).`
        : `Partner "${selectedPartner.name}" is now ACTIVE (Calendar sync resumed).`
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pause partner fleet status"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border hairline bg-surface-light p-6 sm:p-8 text-ink shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b hairline pb-4">
          <div>
            <span className="eyebrow text-amber-500 font-mono">Fleet Dispatch Hold</span>
            <h2 className="display mt-1 text-2xl font-bold tracking-tight sm:text-3xl text-ink">
              Pause Partner Status
            </h2>
            <p className="mt-1 text-xs text-ink/65">
              Temporarily freeze partner dispatches and pause booking calendar visibility without deleting their profile.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink/60 hover:bg-canvas hover:text-ink transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="eyebrow block text-ink/60 text-xs mb-1.5">Select Fleet Member</label>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-sm font-bold text-ink outline-none cursor-pointer"
            >
              {allList.map((p) => (
                <option key={p.id} value={p.id} className="bg-canvas text-ink">
                  {p.name} ({p.category}) {isPartnerPaused(p.id) ? "⏸ [PAUSED]" : "✓ [Active]"}
                </option>
              ))}
            </select>
          </div>

          {selectedPartner && (
            <div className="rounded-2xl border hairline bg-canvas p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="eyebrow text-primary text-[0.68rem] capitalize">{selectedPartner.category}</span>
                  <h4 className="font-display font-bold text-ink text-base mt-0.5">{selectedPartner.name}</h4>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    paused
                      ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                      : "bg-success/15 text-success border border-success/30"
                  }`}
                >
                  {paused ? "⏸ Paused (Hold)" : "● Active Sync"}
                </span>
              </div>
              <p className="text-xs text-ink/65 leading-relaxed">
                {paused
                  ? "This partner is currently paused. They are flagged as unavailable for upcoming sits and hold dispatches."
                  : "This partner is currently active and accepting automated calendar dispatches."}
              </p>
            </div>
          )}

          <div className="pt-3 border-t hairline flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border hairline px-4 py-2 text-xs font-bold text-ink/75 hover:bg-canvas transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleToggle}
              className={`rounded-full px-5 py-2 text-xs font-bold transition shadow-xs cursor-pointer ${
                paused
                  ? "bg-success text-white hover:brightness-110 active:scale-95"
                  : "bg-amber-600 text-white hover:brightness-110 active:scale-95"
              }`}
            >
              {paused ? "Resume Partner Sync ▶" : "Pause Partner ⏸"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. Archive Partner Modal
────────────────────────────────────────────────────────────── */
export function ArchivePartnerModal({
  customPartners,
  onClose,
  onUpdated,
}: {
  customPartners: CustomPartner[];
  onClose: () => void;
  onUpdated: () => void;
}) {
  const allList = [
    ...PARTNERS.map((p) => ({ id: p.id, name: p.name, category: p.category, isCustom: false })),
    ...customPartners.map((p) => ({ id: p.id, name: p.name, category: p.category, isCustom: true })),
  ];

  const [selectedPartnerId, setSelectedPartnerId] = useState(allList[0]?.id || "");
  const selectedPartner = allList.find((p) => p.id === selectedPartnerId) || allList[0];
  const archived = selectedPartner ? isPartnerArchived(selectedPartner.id) : false;

  const handleToggle = () => {
    if (!selectedPartner) return;
    playTapSound();
    const nowArchived = togglePartnerArchive(selectedPartner.id);
    onUpdated();
    toast.success(
      nowArchived
        ? `Partner "${selectedPartner.name}" has been moved to ARCHIVE.`
        : `Partner "${selectedPartner.name}" restored to ACTIVE fleet roster.`
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Archive partner"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border hairline bg-surface-light p-6 sm:p-8 text-ink shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b hairline pb-4">
          <div>
            <span className="eyebrow text-primary font-mono">Long-Term Inactive</span>
            <h2 className="display mt-1 text-2xl font-bold tracking-tight sm:text-3xl text-ink">
              Archive Partner
            </h2>
            <p className="mt-1 text-xs text-ink/65">
              Move off-season or legacy partners to the archive vault without losing historical dispatch contracts.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink/60 hover:bg-canvas hover:text-ink transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="eyebrow block text-ink/60 text-xs mb-1.5">Select Fleet Member</label>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-sm font-bold text-ink outline-none cursor-pointer"
            >
              {allList.map((p) => (
                <option key={p.id} value={p.id} className="bg-canvas text-ink">
                  {p.name} ({p.category}) {isPartnerArchived(p.id) ? "📦 [Archived]" : "✓ [Active Roster]"}
                </option>
              ))}
            </select>
          </div>

          {selectedPartner && (
            <div className="rounded-2xl border hairline bg-canvas p-4 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="eyebrow text-primary text-[0.68rem] capitalize">{selectedPartner.category}</span>
                  <h4 className="font-display font-bold text-ink text-base mt-0.5">{selectedPartner.name}</h4>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    archived
                      ? "bg-ink/15 text-ink/80 border hairline"
                      : "bg-success/15 text-success border border-success/30"
                  }`}
                >
                  {archived ? "📦 Archived" : "● Active Fleet"}
                </span>
              </div>
              <p className="text-xs text-ink/65 leading-relaxed">
                {archived
                  ? "This partner is archived. They are tucked away from the main active cards but can be restored anytime."
                  : "This partner is currently in the primary active roster."}
              </p>
            </div>
          )}

          <div className="pt-3 border-t hairline flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border hairline px-4 py-2 text-xs font-bold text-ink/75 hover:bg-canvas transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleToggle}
              className={`rounded-full px-5 py-2 text-xs font-bold transition shadow-xs cursor-pointer ${
                archived
                  ? "bg-ink text-canvas hover:bg-primary active:scale-95"
                  : "bg-ink/80 text-canvas hover:bg-ink active:scale-95"
              }`}
            >
              {archived ? "Unarchive & Restore ▶" : "Move to Archive 📦"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. Remove Partner Modal
────────────────────────────────────────────────────────────── */
export function RemovePartnerModal({
  customPartners,
  onClose,
  onRemoved,
}: {
  customPartners: CustomPartner[];
  onClose: () => void;
  onRemoved: (partnerId: string) => void;
}) {
  const [selectedPartnerId, setSelectedPartnerId] = useState(customPartners[0]?.id || "");
  const selectedPartner = customPartners.find((p) => p.id === selectedPartnerId) || customPartners[0];

  const handleRemove = () => {
    if (!selectedPartner) return;
    playTapSound();
    removeCustomPartner(selectedPartner.id);
    onRemoved(selectedPartner.id);
    toast.success(`Partner "${selectedPartner.name}" permanently removed from fleet`);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Remove partner from fleet"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border hairline bg-surface-light p-6 sm:p-8 text-ink shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b hairline pb-4">
          <div>
            <span className="eyebrow text-red-500 font-mono">Permanent Roster Deletion</span>
            <h2 className="display mt-1 text-2xl font-bold tracking-tight sm:text-3xl text-ink">
              Remove Partner
            </h2>
            <p className="mt-1 text-xs text-ink/65">
              Permanently remove custom onboarded partners from Mr. Bondz’s operational fleet.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink/60 hover:bg-canvas hover:text-ink transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {customPartners.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm font-semibold text-ink">No custom onboarded partners found.</p>
            <p className="text-xs text-ink/60 max-w-sm mx-auto">
              Core network partners (Ember &amp; Oak, Halal Feast Co., etc.) are locked baseline fixtures. You can use <b>Pause</b> or <b>Archive</b> on them instead!
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border hairline px-5 py-2 text-xs font-bold text-ink hover:bg-canvas transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div>
              <label className="eyebrow block text-ink/60 text-xs mb-1.5">Select Custom Partner to Delete</label>
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-sm font-bold text-ink outline-none cursor-pointer"
              >
                {customPartners.map((p) => (
                  <option key={p.id} value={p.id} className="bg-canvas text-ink">
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            {selectedPartner && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-display font-bold text-ink text-base">{selectedPartner.name}</h4>
                  <span className="eyebrow text-red-500 text-[0.68rem] font-bold">Will be deleted</span>
                </div>
                <p className="text-xs text-ink/75">
                  Contact: {selectedPartner.contact} · {selectedPartner.phone} · {selectedPartner.rateLabel}
                </p>
                <p className="text-[0.70rem] text-red-600/80 font-medium">
                  ⚠️ This action immediately deletes this vendor from your custom roster and cannot be undone.
                </p>
              </div>
            )}

            <div className="pt-3 border-t hairline flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border hairline px-4 py-2 text-xs font-bold text-ink/75 hover:bg-canvas transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 active:scale-95 transition shadow-xs cursor-pointer"
              >
                Delete from Fleet ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
