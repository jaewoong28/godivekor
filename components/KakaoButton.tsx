"use client";

export default function KakaoButton() {
  return (
    <a
      href="http://pf.kakao.com/_qAQtb/chat"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#FEE500] rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
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
  );
}
