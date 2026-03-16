"use client";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* 시파단 투어 버튼 */}
      <a
        href="https://fringe-sardine-3af.notion.site/2026-11c876ca68e880668605c4546bed213c"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-ocean text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm font-bold animate-pulse"
        style={{ animationDuration: "1s" }}
      >
        <span className="text-lg leading-none">🤿</span>
        <span className="hidden sm:inline">2026 고다이브 말레이시아 🇲🇾 시파단 투어</span>
        <span className="sm:hidden">🇲🇾 시파단 투어</span>
      </a>

      {/* 카카오톡 버튼 */}
      <a
        href="http://pf.kakao.com/_qAQtb/chat"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#FEE500] rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
        aria-label="카카오톡 상담"
      >
        <svg
          className="w-8 h-8"
          viewBox="0 0 256 256"
          fill="none"
        >
          <path
            d="M128 36C70.562 36 24 72.713 24 118c0 29.279 19.466 54.97 48.748 69.477l-10.202 37.34a3.2 3.2 0 004.96 3.574l43.252-28.874C117.145 201.146 122.488 201.6 128 201.6c57.438 0 104-36.313 104-81.6S185.438 36 128 36z"
            fill="#3C1E1E"
          />
        </svg>
      </a>
    </div>
  );
}
