import { useTranslation } from "react-i18next";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faGithub,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const footerColumns = [
  {
    titleKey: "footer.columns.platform.title",
    links: [
      "footer.columns.platform.links.howItWorks",
      "footer.columns.platform.links.features",
      "footer.columns.platform.links.workflow",
    ],
  },
  {
    titleKey: "footer.columns.legal.title",
    links: [
      "footer.columns.legal.links.sources",
      "footer.columns.legal.links.disclaimer",
      "footer.columns.legal.links.privacy",
    ],
  },
  {
    titleKey: "footer.columns.support.title",
    links: [
      "footer.columns.support.links.help",
      "footer.columns.support.links.contact",
      "footer.columns.support.links.status",
    ],
  },
];

const socialLinks = [
  { icon: faFacebookF, labelKey: "footer.social.facebook" },
  { icon: faXTwitter, labelKey: "footer.social.x" },
  { icon: faLinkedinIn, labelKey: "footer.social.linkedin" },
  { icon: faGithub, labelKey: "footer.social.github" },
];

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#160d0f] px-4 py-12 text-white dark:bg-[#0c0809] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="inline-flex items-center gap-2 text-lg font-extrabold">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-red-800 text-white">
                <FontAwesomeIcon icon={faScaleBalanced} />
              </span>
              <span>{t("brand.name")}</span>
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-red-50/75">
              {t("footer.description")}
            </p>

            <div className="mt-5 flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.labelKey}
                  href="#social"
                  aria-label={t(social.labelKey)}
                  className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-red-50/80 transition duration-200 hover:-translate-y-0.5 hover:border-red-200/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200"
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.titleKey}>
                <h2 className="text-sm font-extrabold text-white">
                  {t(column.titleKey)}
                </h2>

                <ul className="mt-4 space-y-3">
                  {column.links.map((linkKey) => (
                    <li key={linkKey}>
                      <a
                        href="#footer"
                        className="text-sm text-red-50/70 transition duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200"
                      >
                        {t(linkKey)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-red-50/65 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.copyright", { year })}</p>
          <p>{t("footer.location")}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
