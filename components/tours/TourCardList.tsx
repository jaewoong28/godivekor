"use client";

import { useTranslations } from "next-intl";
import type { CountryGroup } from "@/data/divePoints";
import TourPointCard from "./TourPointCard";

interface TourCardListProps {
  countryGroups: CountryGroup[];
}

export default function TourCardList({ countryGroups }: TourCardListProps) {
  const t = useTranslations("Tours");

  return (
    <div className="divide-y divide-gray-200 [&>*]:pt-16 [&>*:first-child]:pt-0">
      {countryGroups.map((group) => (
        <div key={group.country}>
          {/* Country header */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">{group.flag}</span>
            <div>
              <h2 className="text-xl font-extrabold text-[#111111]">
                {t(`countries.${group.country}`)}
              </h2>
              <p className="text-xs text-sunset font-semibold">
                {t("pointCount", { count: group.points.length })}
              </p>
            </div>
            <div className="flex-1 h-px bg-gray-200 ml-4" />
          </div>

          {/* Point cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.points.map((point) => (
              <TourPointCard key={point.id} point={point} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
