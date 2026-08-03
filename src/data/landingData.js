import {
  faBrain,
  faBuildingColumns,
  faClipboardCheck,
  faFileLines,
  faGavel,
  faHeadset,
  faLanguage,
  faLock,
  faShieldHalved,
  faUpload,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";

export const navLinks = [
  { href: "#hero", labelKey: "navigation.home" },
  { href: "#how-it-works", labelKey: "navigation.howItWorks" },
  { href: "#why-haqqi", labelKey: "navigation.whyHaqqi" },
  { href: "#workflow", labelKey: "navigation.workflow" },
  { href: "#faq", labelKey: "navigation.faq" },
];

export const trustItems = [
  "trustStrip.aiPowered",
  "trustStrip.legalSources",
  "trustStrip.secureUpload",
  "trustStrip.pdfExport",
];

export const howItWorksSteps = [
  { icon: faUserPen, titleKey: "howItWorks.steps.describe.title" },
  { icon: faUpload, titleKey: "howItWorks.steps.upload.title" },
  { icon: faBrain, titleKey: "howItWorks.steps.extract.title" },
  { icon: faGavel, titleKey: "howItWorks.steps.review.title" },
  { icon: faClipboardCheck, titleKey: "howItWorks.steps.track.title" },
];

export const features = [
  { icon: faBrain, titleKey: "features.items.aiAnalysis.title" },
  { icon: faGavel, titleKey: "features.items.legalGuidance.title" },
  { icon: faBuildingColumns, titleKey: "features.items.references.title" },
  { icon: faClipboardCheck, titleKey: "features.items.tracking.title" },
  { icon: faFileLines, titleKey: "features.items.pdfExport.title" },
  { icon: faLanguage, titleKey: "features.items.bilingual.title" },
  { icon: faLock, titleKey: "features.items.secure.title" },
  { icon: faHeadset, titleKey: "features.items.notifications.title" },
];

export const workflowSteps = [
  { icon: faUserPen, titleKey: "workflow.steps.input" },
  { icon: faBrain, titleKey: "workflow.steps.analysis" },
  { icon: faFileLines, titleKey: "workflow.steps.sources" },
  { icon: faClipboardCheck, titleKey: "workflow.steps.complaint" },
  { icon: faBuildingColumns, titleKey: "workflow.steps.authority" },
];

export const problems = [
  "problems.items.telecom",
  "problems.items.banking",
  "problems.items.consumerService",
];

export const faqs = [
  {
    questionKey: "faq.items.lawyer.question",
    answerKey: "faq.items.lawyer.answer",
  },
  {
    questionKey: "faq.items.sources.question",
    answerKey: "faq.items.sources.answer",
  },
  {
    questionKey: "faq.items.evidence.question",
    answerKey: "faq.items.evidence.answer",
  },
];

export const whyHaqqiItems = [
  { icon: faShieldHalved, titleKey: "whyHaqqi.items.understand.title" },
  { icon: faGavel, titleKey: "whyHaqqi.items.rights.title" },
  { icon: faBuildingColumns, titleKey: "whyHaqqi.items.nextStep.title" },
];
