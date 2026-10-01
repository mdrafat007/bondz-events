import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  type PortalRole,
  getStoredRole,
  getStoredPartnerId,
  clearStoredRole,
  setStoredRole,
  setStoredPartnerId,
} from "@/lib/portal-store";
import { PortalLoginModal } from "@/components/portal/PortalLoginModal";
import { OwnerDashboard } from "@/components/portal/OwnerDashboard";
import { PartnerDashboard } from "@/components/portal/PartnerDashboard";
import { playTapSound } from "@/lib/haptics";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Partner & Owner Portal - Bondz Events" },
      {
        name: "description",
        content: "Authenticated production command center and partner dispatch hub for Bondz Events.",
      },
      { property: "og:title", content: "Portal - Bondz Events" },
      { property: "og:description", content: "Synchronized event schedules and partner availability." },
    ],
  }),
  component: PortalPage,
});

function PortalPage() {
  const [role, setRole] = useState<PortalRole | null>(null);
  const [partnerId, setPartnerId] = useState<string>("ember");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedRole = getStoredRole();
    const savedPartner = getStoredPartnerId();
    if (savedRole) {
      setRole(savedRole);
    }
    if (savedPartner) {
      setPartnerId(savedPartner);
    }
    setIsReady(true);
  }, []);

  const handleSelectRole = (newRole: PortalRole, selectedPartnerId?: string) => {
    setRole(newRole);
    setStoredRole(newRole);
    if (selectedPartnerId) {
      setPartnerId(selectedPartnerId);
      setStoredPartnerId(selectedPartnerId);
    }
  };

  const handleLogout = () => {
    playTapSound();
    clearStoredRole();
    setRole(null);
  };

  if (!isReady) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <span className="eyebrow text-xs text-ink/50 animate-pulse">Loading authenticated portal...</span>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 md:px-8">
      {!role && <PortalLoginModal onSelectRole={handleSelectRole} />}

      {role === "owner" && <OwnerDashboard onLogout={handleLogout} />}

      {role === "partner" && <PartnerDashboard currentPartnerId={partnerId} onLogout={handleLogout} />}
    </main>
  );
}
