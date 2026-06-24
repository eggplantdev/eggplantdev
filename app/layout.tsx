import "@/styles/globals.css";
import { Metadata } from "next";
import { ReactNode } from "react";

import { poly, theinhardt, jetbrainsMono, ibmPlexMono, firaCode, geistMono } from "@/public/fonts/fonts";

import { TopNavigation } from "@/components/top-navigation/top-navigation";
import { DebugWrapper } from "@/components/debug-tools/debug-wrapper";
import { SkipToContent } from "@/components/accessibility/skip-to-content";
import { PreferencesHydrator } from "@/components/general/preferences-hydrator";
import { MotionProvider } from "@/components/general/motion-provider";
import { Footer } from "../components/footer/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DevTestNav } from "@/components/test/dev-test-nav";
import { FixedTravelingDots } from "@/components/animations/fixed-traveling-dots/fixed-traveling-dots";
import { GritPulseOverlay } from "../components/animations/grit-pulse-overlay/grit-pulse-overlay";

export const metadata: Metadata = {
  title: "Egggplants in space",
  description: "Websites and apps for taste seekers",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`overflow-x-hidden scroll-smooth ${poly.variable} ${theinhardt.variable} ${jetbrainsMono.variable} ${ibmPlexMono.variable} ${firaCode.variable} ${geistMono.variable} ${poly.className} ${theinhardt.className}`}
    >
      <body className="overflow-x-clip overscroll-none scroll-smooth antialiased" suppressHydrationWarning>
        <PreferencesHydrator />
        <MotionProvider>
          <DebugWrapper>
            <SkipToContent />
            {/* Fixed ambient traveling dots — behind grit */}
            <FixedTravelingDots />
            {/* Fixed grit overlay — always on, base texture for all pages */}
            <div className="grit pointer-events-none fixed inset-x-0 top-0 z-200 h-lvh will-change-transform" />
            <GritPulseOverlay />

            <DevTestNav />
            <TopNavigation />
            <main id="main-content" className="scroll-mt-32">
              {children}
            </main>
            <Footer />
          </DebugWrapper>
        </MotionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
