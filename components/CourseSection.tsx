"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { courses } from "@/data/courses";

export default function CourseSection() {
  return (
    <section id="courses" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#111111] mb-3">
            교육과정
          </h2>
          <div className="w-16 h-1 bg-ocean mx-auto rounded-full mb-4" />
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            초보자부터 전문가까지, 단계별 스쿠버 다이빙 교육 프로그램
          </p>
        </div>

        {/* Accordion */}
        <Accordion className="space-y-3">
          {courses.map((course) => (
            <AccordionItem
              key={course.id}
              value={course.id}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-ocean-light/50 transition-colors aria-expanded:bg-ocean-light/50">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-1.5 h-10 bg-ocean rounded-full shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-[#111111]">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {course.subtitle} ·{" "}
                      <span className="text-sunset font-semibold">
                        {course.price}
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
                      src={course.image}
                      alt={course.title}
                      className="w-full h-56 object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                      {course.description}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-bold text-sm text-ocean mb-3">
                        교육 정보
                      </h4>
                      <div className="space-y-2">
                        {course.details.map((detail) => (
                          <div
                            key={detail.label}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-500">
                              {detail.label}
                            </span>
                            <span className="font-semibold text-[#111111]">
                              {detail.value}
                            </span>
                          </div>
                        ))}
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
