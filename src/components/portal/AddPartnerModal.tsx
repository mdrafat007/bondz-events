import { useState } from "react";
import { type CategoryId, CATEGORIES } from "@/lib/bondz-data";
import { type CustomPartner, saveCustomPartner } from "@/lib/portal-store";
import { triggerTap, playTapSound } from "@/lib/haptics";
import { toast } from "sonner";

export function AddPartnerModal({ onClose, onAdded }: { onClose: () => void; onAdded: (p: CustomPartner) => void }) {
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
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="eyebrow block text-ink/60 mb-1">Company / Brand Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Mayfair Floral Atelier"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="eyebrow block text-ink/60 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full rounded-xl border hairline bg-canvas px-3 py-2.5 text-xs font-semibold text-ink outline-none focus:border-primary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="eyebrow block text-ink/60 mb-1">Agreed Rate / Base</label>
              <input
                type="text"
                placeholder="e.g. £45/guest or £1,200 flat"
                value={rateLabel}
                onChange={(e) => setRateLabel(e.target.value)}
                className="w-full rounded-xl border hairline bg-canvas px-3 py-2.5 text-xs text-ink outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="eyebrow block text-ink/60 mb-1">Primary Contact</label>
              <input
                type="text"
                placeholder="Lead director or manager"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-xs text-ink outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="eyebrow block text-ink/60 mb-1">Operating Capacity</label>
              <input
                type="text"
                placeholder="e.g. 20 - 250 guests"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-xs text-ink outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="eyebrow block text-ink/60 mb-1">Direct Phone</label>
              <input
                type="tel"
                placeholder="+44 20 7946 0912"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-xs text-ink outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="eyebrow block text-ink/60 mb-1">Dispatch Email</label>
              <input
                type="email"
                placeholder="bookings@partner.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border hairline bg-canvas px-3.5 py-2.5 text-xs text-ink outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t hairline">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border hairline px-5 py-2.5 text-xs font-bold text-ink/75 hover:bg-canvas transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-primary-foreground hover:brightness-110 active:scale-95 transition shadow-sm cursor-pointer"
            >
              Confirm &amp; Sync Partner →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
