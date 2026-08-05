import { AISection } from "@/features/landing/components/AI/AISection";
import { GlobalBackground } from "@/features/landing/components/Background/GlobalBackground";
import { FAQ } from "@/features/landing/components/FAQ/FAQ";
import { Features } from "@/features/landing/components/Features/Features";
import { FinalCTA } from "@/features/landing/components/FinalCTA/FinalCTA";
import { Footer } from "@/features/landing/components/Footer/Footer";
import { Hero } from "@/features/landing/components/Hero/Hero";
import { MemoryShowcase } from "@/features/landing/components/MemoryShowcase/MemoryShowcase";
import { Navigation } from "@/features/landing/components/Navigation/Navigation";
import { Pricing } from "@/features/landing/components/Pricing/Pricing";
import { Privacy } from "@/features/landing/components/Privacy/Privacy";
import { Story } from "@/features/landing/components/Story/Story";
import { Timeline } from "@/features/landing/components/Timeline/Timeline";
import { Trust } from "@/features/landing/components/Trust/Trust";

export function LandingPage() {
  return (
    <div className="relative isolate overflow-clip">
      <GlobalBackground />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <Trust />
        <Story />
        <Features />
        <AISection />
        <Timeline />
        <MemoryShowcase />
        <Privacy />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
