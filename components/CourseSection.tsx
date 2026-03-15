"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

const courseIds = ["open-water", "advanced", "rescue", "fun-dive"] as const;
const courseImages: Record<string, string> = {
  "open-water":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
  advanced:
    "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop",
  rescue:
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
  "fun-dive":
    "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop",
};

const courseDetailKeys: Record<string, string[][]> = {
  "open-water": [
    ["fee", "feeValue"],
    ["theory", "theoryValue"],
    ["pool", "poolValue"],
    ["openWater", "openWaterValue"],
  ],
  advanced: [
    ["fee", "feeValue"],
    ["theory", "theoryValue"],
    ["openWater", "openWaterValue"],
    ["includes", "includesValue"],
  ],
  rescue: [
    ["fee", "feeValue"],
    ["theory", "theoryValue"],
    ["pool", "poolValue"],
    ["openWater", "openWaterValue"],
    ["prerequisite", "prerequisiteValue"],
  ],
  "fun-dive": [
    ["fee", "feeValue"],
    ["duration", "durationValue"],
    ["includes", "includesValue"],
    ["prerequisite", "prerequisiteValue"],
  ],
};

export default function CourseSection() {
  const t = useTranslations("Courses");

  return (
    <section id="courses" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#111111] mb-3">
            {t("sectionTitle")}
          </h2>
          <div className="w-16 h-1 bg-ocean mx-auto rounded-full mb-4" />
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            {t("sectionDescription")}
          </p>
        </div>

        {/* Accordion */}
        <Accordion className="space-y-3">
          {courseIds.map((courseId) => (
            <AccordionItem
              key={courseId}
              value={courseId}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-ocean-light/50 transition-colors aria-expanded:bg-ocean-light/50">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-1.5 h-10 bg-ocean rounded-full shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-[#111111]">
                      {t(`items.${courseId}.title`)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {t(`items.${courseId}.subtitle`)} ·{" "}
                      <span className="text-sunset font-semibold">
                        {t(`items.${courseId}.price`)}
                      </span>
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Image */}
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={courseImages[courseId]}
                      alt={t(`items.${courseId}.title`)}
                      className="w-full h-56 object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                      {t(`items.${courseId}.description`)}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-bold text-sm text-ocean mb-3">
                        {t("infoTitle")}
                      </h4>
                      <div className="space-y-2">
                        {courseDetailKeys[courseId].map(
                          ([labelKey, valueKey]) => (
                            <div
                              key={labelKey}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-gray-500">
                                {t(
                                  `items.${courseId}.details.${labelKey}`
                                )}
                              </span>
                              <span className="font-semibold text-[#111111]">
                                {t(
                                  `items.${courseId}.details.${valueKey}`
                                )}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
