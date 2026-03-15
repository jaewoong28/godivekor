"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const suitTypes = ["Skin", "Wet", "Semidry", "Dry", "Hood", "Vest", "Gloves", "Boots"];
const diveTypes = [
  "Shore", "Boat", "Liveaboard", "Night", "Drift", "Deep",
  "Wall", "Cave", "Wreck", "Altitude", "Ice",
  "Solo", "Sidemount", "Search & Recovery", "Photograph", "Videograph", "Training", "Other",
];
const weatherOptions = ["☀️", "🌤️", "⛅", "☁️", "🌧️", "⛈️"];
const waveOptions = ["🌊 Calm", "🌊 Moderate", "🌊 Rough"];
const currentOptions = ["Weak", "Moderate", "Strong"];

export default function LogbookForm() {
  const t = useTranslations("Logbook");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    log_number: "",
    name: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    dive_site: "",
    weather: "",
    wave: "",
    current: "",
    tank: "",
    air_type: "",
    weight: "",
    entry_time: "",
    exit_time: "",
    start_bar: "",
    end_bar: "",
    surface_temp: "",
    bottom_temp: "",
    visibility: "",
    surface_interval: "",
    dive_time: "",
    safety_stop: "",
    avg_depth: "",
    max_depth: "",
    suit_thickness: "",
    suit_type: [] as string[],
    dive_types: [] as string[],
    notes: "",
    dive_center: "",
    buddy: "",
    instructor: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArray = (field: "suit_type" | "dive_types", value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.date) return;
    setLoading(true);
    try {
      const res = await fetch("/api/logbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center w-full py-32">
            <div className="text-5xl mb-6">✅</div>
            <h2 className="text-2xl font-bold text-[#111111] mb-3">
              {t("successTitle")}
            </h2>
            <p className="text-gray-500 mb-6">{t("successMessage")}</p>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm((prev) => ({
                  ...prev,
                  name: "",
                  notes: "",
                  buddy: "",
                }));
              }}
              className="px-6 py-2.5 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean-dark transition-colors"
            >
              {t("writeAnother")}
            </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#111111] mb-3">
            {t("sectionTitle")}
          </h2>
          <div className="w-16 h-1 bg-ocean mx-auto rounded-full mb-4" />
          <p className="text-gray-500 text-base">
            {t("sectionDescription")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이름 + 날짜 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-ocean mb-4">{t("basicInfo")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("logNumber")}
                </label>
                <input
                  type="text"
                  value={form.log_number}
                  onChange={(e) => updateField("log_number", e.target.value)}
                  placeholder="#"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("name")} *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("date")} *
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("location")}
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("diveSite")}
                </label>
                <input
                  type="text"
                  value={form.dive_site}
                  onChange={(e) => updateField("dive_site", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("weather")}
                </label>
                <div className="flex gap-1 flex-wrap">
                  {weatherOptions.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => updateField("weather", w)}
                      className={`text-xl p-1.5 rounded-lg transition-colors ${form.weather === w ? "bg-ocean-light ring-2 ring-ocean" : "hover:bg-gray-100"}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("wave")} / {t("current")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={form.wave}
                    onChange={(e) => updateField("wave", e.target.value)}
                    className="px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ocean"
                  >
                    <option value="">{t("wave")}</option>
                    {waveOptions.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                  <select
                    value={form.current}
                    onChange={(e) => updateField("current", e.target.value)}
                    className="px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ocean"
                  >
                    <option value="">{t("current")}</option>
                    {currentOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 장비 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-ocean mb-4">{t("equipment")}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("tank")}
                </label>
                <div className="flex gap-2">
                  {["Steel", "Aluminium"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => updateField("tank", v)}
                      className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${form.tank === v ? "bg-ocean text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("airType")}
                </label>
                <div className="flex gap-2">
                  {["Air", "EAN"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => updateField("air_type", v)}
                      className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${form.air_type === v ? "bg-ocean text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("weight")} (kg)
                </label>
                <input
                  type="text"
                  value={form.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("suitThickness")} (mm)
                </label>
                <input
                  type="text"
                  value={form.suit_thickness}
                  onChange={(e) => updateField("suit_thickness", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-500 mb-2">
                {t("suitType")}
              </label>
              <div className="flex flex-wrap gap-2">
                {suitTypes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleArray("suit_type", s)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${form.suit_type.includes(s) ? "bg-ocean text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 다이빙 데이터 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-ocean mb-4">{t("diveData")}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("entryTime")}
                </label>
                <input
                  type="text"
                  value={form.entry_time}
                  onChange={(e) => updateField("entry_time", e.target.value)}
                  placeholder="09:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("exitTime")}
                </label>
                <input
                  type="text"
                  value={form.exit_time}
                  onChange={(e) => updateField("exit_time", e.target.value)}
                  placeholder="10:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("startBar")} (bar)
                </label>
                <input
                  type="text"
                  value={form.start_bar}
                  onChange={(e) => updateField("start_bar", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("endBar")} (bar)
                </label>
                <input
                  type="text"
                  value={form.end_bar}
                  onChange={(e) => updateField("end_bar", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("surfaceTemp")} (°C)
                </label>
                <input
                  type="text"
                  value={form.surface_temp}
                  onChange={(e) => updateField("surface_temp", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("bottomTemp")} (°C)
                </label>
                <input
                  type="text"
                  value={form.bottom_temp}
                  onChange={(e) => updateField("bottom_temp", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("visibility")} (m)
                </label>
                <input
                  type="text"
                  value={form.visibility}
                  onChange={(e) => updateField("visibility", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("diveTime")} (min)
                </label>
                <input
                  type="text"
                  value={form.dive_time}
                  onChange={(e) => updateField("dive_time", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("surfaceInterval")}
                </label>
                <input
                  type="text"
                  value={form.surface_interval}
                  onChange={(e) => updateField("surface_interval", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("safetyStop")}
                </label>
                <div className="flex gap-2">
                  {["3 min", "5 min"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => updateField("safety_stop", v)}
                      className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${form.safety_stop === v ? "bg-ocean text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("avgDepth")} (m)
                </label>
                <input
                  type="text"
                  value={form.avg_depth}
                  onChange={(e) => updateField("avg_depth", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("maxDepth")} (m)
                </label>
                <input
                  type="text"
                  value={form.max_depth}
                  onChange={(e) => updateField("max_depth", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 다이빙 유형 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-ocean mb-4">{t("diveType")}</h3>
            <div className="flex flex-wrap gap-2">
              {diveTypes.map((dt) => (
                <button
                  key={dt}
                  type="button"
                  onClick={() => toggleArray("dive_types", dt)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${form.dive_types.includes(dt) ? "bg-sunset text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {dt}
                </button>
              ))}
            </div>
          </div>

          {/* 메모 + 하단 정보 */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-ocean mb-4">{t("additional")}</h3>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t("notes")}
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("diveCenter")}
                </label>
                <input
                  type="text"
                  value={form.dive_center}
                  onChange={(e) => updateField("dive_center", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("buddy")}
                </label>
                <input
                  type="text"
                  value={form.buddy}
                  onChange={(e) => updateField("buddy", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t("instructor")}
                </label>
                <input
                  type="text"
                  value={form.instructor}
                  onChange={(e) => updateField("instructor", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-ocean text-white rounded-xl font-bold text-base hover:bg-ocean-dark transition-colors disabled:opacity-50"
          >
            {loading ? t("saving") : t("save")}
          </button>
        </form>
      </div>
    </section>
  );
}
