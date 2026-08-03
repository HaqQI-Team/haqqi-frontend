import { useCallback, useState } from "react";
import AuthRequiredModal from "../components/common/AuthRequiredModal";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import CTASection from "../sections/CTASection";
import FeaturesSection from "../sections/FeaturesSection";
import HeroSection from "../sections/HeroSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import FAQSection from "../sections/FAQSection";
import ProblemsSection from "../sections/ProblemsSection";
import TrustStrip from "../sections/TrustStrip";
import WhyHaqqiSection from "../sections/WhyHaqqiSection";
import WorkflowSection from "../sections/WorkflowSection";
import { useRouter } from "../router/useRouter";

const isAuthenticated = false;

function LandingPage() {
  const { navigate } = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  function handleProtectedAction(targetPath) {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    navigate(targetPath);
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection onProtectedAction={handleProtectedAction} />
        <TrustStrip />
        <HowItWorksSection />
        <FeaturesSection />
        <WhyHaqqiSection />
        <WorkflowSection />
        <ProblemsSection />
        <FAQSection />
        <CTASection onProtectedAction={handleProtectedAction} />
      </main>
      <Footer />
      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </>
  );
}

export default LandingPage;
