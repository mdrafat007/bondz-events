import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useBookingTransition } from "@/lib/booking-transition";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Bondz Events - Turn “can we book you?” into “you're booked.”" },
      { name: "description", content: "A self-serve booking engine for Mr. Bondz: pick your event, and only dates that work for every venue and vendor ever appear." },
      { property: "og:title", content: "Bondz Events - Turn “can we book you?” into “you're booked.”" },
      { property: "og:description", content: "No phone calls. Every date shown already works for every partner." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#f6f1e7" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&display=swap" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.classList.toggle('dark',localStorage.getItem('bondz-theme')==='dark')}catch(e){document.documentElement.classList.remove('dark')}" }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function BookingCurtain() {
  const phase = useBookingTransition();
  if (phase === "idle") return null;

  const isClosed = phase === "closing";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] flex overflow-hidden">
      {/* Left Curtain */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isClosed ? "0%" : "-100%" }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-1/2 bg-[#130f16] border-r border-primary/40 shadow-[0_0_40px_rgba(241,69,59,0.3)]"
      />
      {/* Right Curtain */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isClosed ? "0%" : "100%" }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-1/2 bg-[#130f16] border-l border-primary/40 shadow-[0_0_40px_rgba(241,69,59,0.3)]"
      />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPreview = pathname.startsWith("/__component") || pathname.startsWith("/__mockup");
  const takeover = pathname.startsWith("/book");

  if (isPreview) {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster position="bottom-center" toastOptions={{ className: "font-sans" }} />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="grain flex h-dvh flex-col overflow-hidden bg-canvas text-ink transition-colors duration-300">
        {!takeover && <SiteNav />}
        <main className="relative min-h-0 flex-1">
          <Outlet />
        </main>
        {!takeover && <SiteFooter />}
      </div>
      <BookingCurtain />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
