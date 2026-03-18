"use client";

import { useTranslations } from "next-intl";
import type { DivePoint } from "@/data/divePoints";

interface TourPointCardProps {
  point: DivePoint;
}

export default function TourPointCard({ point }: TourPointCardProps) {
  const t = useTranslations("Tours.points");
  const tags = t(`${point.id}.tags`).split(",");

  return (
    <a
      href={point.detailPage}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-gray-200 bg-white hover:border-ocean/40 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Color accent bar */}
      <div className="h-1" style={{ backgroundColor: point.markerColor }} />

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#111111]">
                {t(`${point.id}.name`)}
              </h3>
              <span className="text-ocean text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                상세보기 →
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {t(`${point.id}.region`)}
            </p>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {t(`${point.id}.description`)}
            </p>
          </div>
        </div>

        <div className="flex gap-1.5 mt-3 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-1 rounded-full bg-ocean-light text-ocean font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
