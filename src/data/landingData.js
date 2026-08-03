import {
  faBrain,
  faBuildingColumns,
  faChartLine,
  faClipboardCheck,
  faBell,
  faFilePdf,
  faFileLines,
  faLanguage,
  faLock,
  faScaleBalanced,
  faShieldHalved,
  faUpload,
  faUserPen,
  faGavel,
} from "@fortawesome/free-solid-svg-icons";

export const navLinks = [
  { href: "#home", labelKey: "navigation.home" },
  { href: "#how-it-works", labelKey: "navigation.howItWorks" },
  { href: "#features", labelKey: "navigation.features" },
  { href: "#why-haqqi", labelKey: "navigation.whyHaqqi" },
];

export const trustItems = [
  { icon: faLanguage, labelKey: "trustStrip.bilingualSupport" },
  { icon: faBuildingColumns, labelKey: "trustStrip.legalSources" },
  { icon: faLock, labelKey: "trustStrip.secureUpload" },
  { icon: faFilePdf, labelKey: "trustStrip.pdfExport" },
];

export const howItWorksSteps = [
  {
    icon: faUserPen,
    titleKey: "howItWorks.steps.describe.title",
    descriptionKey: "howItWorks.steps.describe.description",
  },
  {
    icon: faUpload,
    titleKey: "howItWorks.steps.upload.title",
    descriptionKey: "howItWorks.steps.upload.description",
  },
  {
    icon: faBrain,
    titleKey: "howItWorks.steps.extract.title",
    descriptionKey: "howItWorks.steps.extract.description",
  },
  {
    icon: faGavel,
    titleKey: "howItWorks.steps.review.title",
    descriptionKey: "howItWorks.steps.review.description",
  },
  {
    icon: faClipboardCheck,
    titleKey: "howItWorks.steps.track.title",
    descriptionKey: "howItWorks.steps.track.description",
  },
];

export const features = [
  {
    icon: faBrain,
    titleKey: "features.items.aiAnalysis.title",
    descriptionKey: "features.items.aiAnalysis.description",
  },
  {
    icon: faScaleBalanced,
    titleKey: "features.items.legalGuidance.title",
    descriptionKey: "features.items.legalGuidance.description",
  },
  {
    icon: faBuildingColumns,
    titleKey: "features.items.references.title",
    descriptionKey: "features.items.references.description",
  },
  {
    icon: faChartLine,
    titleKey: "features.items.tracking.title",
    descriptionKey: "features.items.tracking.description",
  },
  {
    icon: faFilePdf,
    titleKey: "features.items.pdfExport.title",
    descriptionKey: "features.items.pdfExport.description",
  },
  {
    icon: faLanguage,
    titleKey: "features.items.bilingual.title",
    descriptionKey: "features.items.bilingual.description",
  },
  {
    icon: faShieldHalved,
    titleKey: "features.items.secure.title",
    descriptionKey: "features.items.secure.description",
  },
  {
    icon: faBell,
    titleKey: "features.items.notifications.title",
    descriptionKey: "features.items.notifications.description",
  },
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
  {
    icon: faBrain,
    titleKey: "whyHaqqi.items.understand.title",
    descriptionKey: "whyHaqqi.items.understand.description",
  },
  {
    icon: faScaleBalanced,
    titleKey: "whyHaqqi.items.rights.title",
    descriptionKey: "whyHaqqi.items.rights.description",
  },
  {
    icon: faClipboardCheck,
    titleKey: "whyHaqqi.items.nextStep.title",
    descriptionKey: "whyHaqqi.items.nextStep.description",
  },
];
