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
  CTASection,
} from "@/components/landing/faq-cta-section";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TechnologySection />
      <BenefitsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
