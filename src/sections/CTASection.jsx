import { useTranslation } from "react-i18next";

function CTASection() {
  const { t } = useTranslation();

  return (
    <section id="cta" className="bg-red-950 px-4 py-16 text-center text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold md:text-3xl">{t("cta.title")}</h2>
        <p className="mt-4 text-sm leading-6 text-red-100 md:text-base">{t("cta.description")}</p>
      </div>
    </section>
  );
}

export default CTASection;
