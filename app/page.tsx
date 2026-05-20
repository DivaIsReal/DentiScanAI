import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import {
  TechnologySection,
  BenefitsSection,
} from "@/components/landing/technology-section";
import {
  FAQSection,
} from "@/components/landing/faq-cta-section";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.18),_transparent_46%),radial-gradient(ellipse_at_80%_20%,_rgba(14,165,233,0.12),_transparent_42%),linear-gradient(180deg,_hsl(var(--background))_0%,_hsl(var(--background))_100%)]">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TechnologySection />
      <BenefitsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
