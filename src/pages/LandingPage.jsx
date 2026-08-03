import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import FeaturesSection from "../sections/FeaturesSection";
import HeroSection from "../sections/HeroSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import TrustStrip from "../sections/TrustStrip";
import WhyHaqqiSection from "../sections/WhyHaqqiSection";

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
      </main>
      <Footer />
    </>
  );
}

export default LandingPage;
