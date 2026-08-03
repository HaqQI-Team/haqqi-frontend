import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import CTASection from "../sections/CTASection";
import FAQSection from "../sections/FAQSection";
import FeaturesSection from "../sections/FeaturesSection";
import HeroSection from "../sections/HeroSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import ProblemsSection from "../sections/ProblemsSection";
import TrustStrip from "../sections/TrustStrip";
import WhyHaqqiSection from "../sections/WhyHaqqiSection";
import WorkflowSection from "../sections/WorkflowSection";

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustStrip />
        <HowItWorksSection />
        <FeaturesSection />
        <WhyHaqqiSection />
        <WorkflowSection />
        <ProblemsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

export default LandingPage;
