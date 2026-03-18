"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { label: t("home"), href: `/${locale}` },
    { label: t("courses"), href: `/${locale}#courses` },
    { label: t("tours"), href: `/${locale}/tours` },
    { label: t("schedule"), href: `/${locale}#schedule` },
    { label: t("logbook"), href: `/${locale}/logbook` },
    { label: t("contact"), href: `/${locale}#contact` },
  ];

  const switchLocale = () => {
    const newLocale = locale === "ko" ? "en" : "ko";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ocean shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              GoDiveKor
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/90 hover:text-white font-medium text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}

            {/* Language Switcher */}
            <button
              onClick={switchLocale}
              className="flex items-center gap-1.5 text-white/90 hover:text-white text-sm font-medium transition-colors ml-2 px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40"
            >
              <span className="text-base leading-none">
                {locale === "ko" ? "🇺🇸" : "🇰🇷"}
              </span>
              <span>{locale === "ko" ? "English" : "한국어"}</span>
            </button>
          </nav>

          {/* Mobile: Language + Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={switchLocale}
              className="text-white/90 hover:text-white text-sm px-2 py-1 rounded-full border border-white/20"
            >
              {locale === "ko" ? "🇺🇸 EN" : "🇰🇷 KR"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden bg-ocean-dark border-t border-white/10">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-white/90 hover:text-white font-medium text-sm py-2 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
