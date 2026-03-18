"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { getCountryGroups } from "@/data/divePoints";
import TourCardList from "./TourCardList";

export default function TourPage() {
  const t = useTranslations("Tours");
  const countryGroups = useMemo(() => getCountryGroups(), []);

  return (
    <main className="pt-16">
      {/* Page header */}
      <div className="text-center py-12 bg-white">
        <h1 className="text-3xl sm:text-4xl font-black text-[#111111] mb-3">
          {t("pageTitle")}
        </h1>
        <div className="w-16 h-1 bg-ocean mx-auto rounded-full mb-4" />
        <p className="text-gray-500 text-base">{t("pageSubtitle")}</p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <TourCardList countryGroups={countryGroups} />
      </div>
    </main>
  );
}
