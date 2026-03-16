# JY CLEAN Website Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (KO/EN) single-page website for JY CLEAN air conditioner cleaning company with an admin dashboard for quote management.

**Architecture:** Next.js 16 App Router with `[locale]` dynamic segment for i18n via next-intl. Public homepage is a single scrollable page with 8 sections. Admin dashboard at `/admin` with Supabase Auth protection. API routes handle form submission, Google Calendar/Sheets integration, and email notifications.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, shadcn UI, Lucide icons, next-intl, Supabase (Auth + DB), Google Calendar API, Google Sheets API, Cloudflare Turnstile, Resend (email)

**Spec:** `docs/superpowers/specs/2026-03-17-jyclean-website-design.md`

---

## File Structure

```
ACCLEAN/
├── app/
│   ├── globals.css                    # Tailwind + theme variables
│   ├── layout.tsx                     # Root layout (html, body, font)
│   ├── [locale]/
│   │   ├── layout.tsx                 # Locale layout (NextIntlClientProvider, Header, Footer)
│   │   └── page.tsx                   # Homepage (all sections composed)
│   ├── admin/
│   │   ├── layout.tsx                 # Admin layout (sidebar, auth guard)
│   │   ├── page.tsx                   # Dashboard (stats + quote table)
│   │   ├── login/
│   │   │   └── page.tsx               # Admin login page
│   │   └── reviews/
│   │       └── page.tsx               # Review management page
│   └── api/
│       ├── quotes/
│       │   ├── route.ts               # POST: create quote, GET: list quotes
│       │   └── [id]/
│       │       └── route.ts           # PATCH: update status, DELETE: delete quote
│       ├── reviews/
│       │   ├── route.ts               # POST: create, GET: list reviews
│       │   └── [id]/
│       │       └── route.ts           # PATCH: update, DELETE: delete review
│       ├── calendar/
│       │   └── route.ts               # POST: create Google Calendar event
│       ├── sheets/
│       │   └── route.ts               # POST: export to Google Sheets
│       └── auth/
│           └── route.ts               # POST: admin login
├── components/
│   ├── Header.tsx                     # Sticky header with nav + lang toggle
│   ├── Footer.tsx                     # Footer with company info
│   ├── HeroSection.tsx                # Hero with copy + CTA
│   ├── ServicesSection.tsx            # 4 service cards
│   ├── ProcessSection.tsx             # 4-step process
│   ├── ReviewsSection.tsx             # Customer reviews display
│   ├── FAQSection.tsx                 # Accordion FAQ
│   ├── QuoteForm.tsx                  # Quote request form with Turnstile
│   ├── admin/
│   │   ├── Sidebar.tsx                # Admin sidebar navigation
│   │   ├── StatsCards.tsx             # Dashboard stat cards
│   │   ├── QuoteTable.tsx             # Quote list table with tabs/search
│   │   ├── QuoteDetailModal.tsx       # Quote detail modal
│   │   └── ReviewManager.tsx          # Review CRUD component
│   └── ui/                            # shadcn components (auto-generated)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # Browser Supabase client
│   │   └── server.ts                  # Server Supabase client
│   ├── google/
│   │   ├── calendar.ts                # Google Calendar helper
│   │   └── sheets.ts                  # Google Sheets helper
│   └── utils.ts                       # Utility functions (cn, etc.)
├── i18n/
│   ├── routing.ts                     # Locale routing config
│   ├── navigation.ts                  # Navigation helpers
│   └── request.ts                     # Server request config
├── messages/
│   ├── ko.json                        # Korean translations
│   └── en.json                        # English translations
├── middleware.ts                       # next-intl middleware
├── public/
│   └── images/                        # Static images (reviews screenshots, etc.)
├── next.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── components.json                    # shadcn config
└── .env.local                         # Environment variables (not committed)
```

---

## Chunk 1: Project Setup & Homepage

### Task 1: Initialize Next.js Project

**Files:**
- Create: `ACCLEAN/` (entire project scaffold)
- Create: `ACCLEAN/.env.local`
- Create: `ACCLEAN/.gitignore`

- [ ] **Step 1: Create Next.js project**

```bash
cd /Users/jaewoonglee/Projects/JWLeee
npx create-next-app@latest ACCLEAN --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
```

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/jaewoonglee/Projects/JWLeee/ACCLEAN
npm install next-intl @supabase/supabase-js @supabase/ssr lucide-react class-variance-authority clsx tailwind-merge tw-animate-css
```

- [ ] **Step 3: Initialize shadcn**

```bash
npx shadcn@latest init -y
```

Select: base-nova style, neutral base color, CSS variables yes.

- [ ] **Step 4: Create .env.local with placeholder values**

```bash
# Create .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_SERVICE_ACCOUNT_KEY=
GOOGLE_CALENDAR_ID=
GOOGLE_SHEET_ID=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
RESEND_API_KEY=
```

- [ ] **Step 5: Initialize git and commit**

```bash
cd /Users/jaewoonglee/Projects/JWLeee/ACCLEAN
git init
git add -A
git commit -m "chore: initialize Next.js project with dependencies"
```

---

### Task 2: Configure i18n (next-intl)

**Files:**
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Create: `i18n/navigation.ts`
- Create: `messages/ko.json`
- Create: `messages/en.json`
- Modify: `middleware.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Create i18n routing config**

`i18n/routing.ts`:
```typescript
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en"],
  defaultLocale: "ko",
});
```

- [ ] **Step 2: Create i18n request config**

`i18n/request.ts`:
```typescript
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: Create navigation helpers**

`i18n/navigation.ts`:
```typescript
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

- [ ] **Step 4: Create message files**

`messages/ko.json`:
```json
{
  "header": {
    "services": "서비스",
    "process": "작업 공정",
    "reviews": "고객 후기",
    "faq": "FAQ",
    "quote": "견적 신청",
    "langToggle": "EN"
  },
  "hero": {
    "title": "고객님이 숨쉬는 공기,",
    "titleHighlight": "우리가 책임집니다",
    "subtitle": "보이지 않는 곳까지, 깨끗하게",
    "cta": "무료 견적 받기"
  },
  "services": {
    "title": "서비스 안내",
    "subtitle": "에어컨 종류별 전문 청소 서비스를 제공합니다",
    "wall": {
      "name": "벽걸이 에어컨",
      "desc": "가정용 벽걸이형 에어컨\n분해 세척 전문",
      "price": "50,000원~"
    },
    "stand": {
      "name": "스탠드 에어컨",
      "desc": "대형 스탠드형 에어컨\n완전 분해 청소",
      "price": "80,000원~"
    },
    "ceiling": {
      "name": "천장형 에어컨",
      "desc": "시스템 천장형 에어컨\n4방향 카세트 청소",
      "price": "120,000원~"
    },
    "window": {
      "name": "창문형 에어컨",
      "desc": "창문 설치형 에어컨\n내부 세척 전문",
      "price": "40,000원~"
    },
    "detail": "자세히 보기"
  },
  "process": {
    "title": "작업 공정",
    "subtitle": "체계적인 4단계 프로세스로 깨끗함을 보장합니다",
    "step1": { "name": "사전 점검", "desc": "에어컨 상태 확인 및\n고객 상담을 진행합니다" },
    "step2": { "name": "분해 세척", "desc": "전문 장비로 내부 부품을\n완전 분해하여 세척합니다" },
    "step3": { "name": "살균 처리", "desc": "항균 코팅 및 살균 처리로\n세균을 완벽히 제거합니다" },
    "step4": { "name": "조립 및 시운전", "desc": "재조립 후 정상 작동을\n확인하고 마무리합니다" }
  },
  "reviews": {
    "title": "고객 후기",
    "subtitle": "실제 고객님들의 생생한 후기를 확인하세요"
  },
  "faq": {
    "title": "자주 묻는 질문",
    "subtitle": "궁금한 점이 있으시면 확인해보세요",
    "q1": "청소 소요 시간은 얼마나 걸리나요?",
    "a1": "에어컨 종류에 따라 다르지만, 벽걸이형 기준 약 1~1.5시간, 스탠드형은 약 2시간, 천장형은 약 2~3시간 정도 소요됩니다.",
    "q2": "에어컨 청소 주기는 어떻게 되나요?",
    "a2": "일반적으로 1년에 1~2회 청소를 권장합니다. 여름 시즌 전 청소가 가장 효과적입니다.",
    "q3": "출장비가 별도로 있나요?",
    "a3": "서비스 지역 내에서는 별도 출장비가 없습니다. 지역에 따라 추가 비용이 발생할 수 있습니다.",
    "q4": "청소 후 보증 기간이 있나요?",
    "a4": "청소 후 문제가 발생할 경우 A/S를 제공해드립니다. 자세한 내용은 견적 상담 시 안내드립니다.",
    "q5": "예약 변경/취소는 어떻게 하나요?",
    "a5": "예약 변경 및 취소는 방문 예정일 하루 전까지 가능합니다. 전화 또는 카카오톡으로 연락주세요."
  },
  "quoteForm": {
    "title": "무료 견적 신청",
    "subtitle": "빠르고 정확한 견적을 받아보세요",
    "name": "이름",
    "namePlaceholder": "홍길동",
    "phone": "연락처",
    "phonePlaceholder": "010-0000-0000",
    "address": "주소",
    "addressPlaceholder": "서울시 강남구...",
    "acType": "에어컨 종류",
    "wall": "벽걸이",
    "stand": "스탠드",
    "ceiling": "천장형",
    "window": "창문형",
    "acCount": "에어컨 대수",
    "acCountPlaceholder": "1",
    "preferredDate": "희망 날짜",
    "note": "기타 요청사항",
    "notePlaceholder": "추가 요청사항을 입력해주세요",
    "submit": "견적 신청하기",
    "success": "견적 신청이 완료되었습니다! 빠른 시일 내에 연락드리겠습니다.",
    "error": "견적 신청 중 오류가 발생했습니다. 다시 시도해주세요."
  },
  "footer": {
    "company": "JY CLEAN",
    "ceo": "대표: OOO",
    "bizNumber": "사업자등록번호: 000-00-00000",
    "address": "주소: 서울특별시 OO구 OO로 000",
    "phone": "전화: 010-0000-0000",
    "email": "이메일: info@jyclean.com",
    "copyright": "© 2026 JY CLEAN. All rights reserved."
  }
}
```

`messages/en.json`:
```json
{
  "header": {
    "services": "Services",
    "process": "Process",
    "reviews": "Reviews",
    "faq": "FAQ",
    "quote": "Get Quote",
    "langToggle": "KO"
  },
  "hero": {
    "title": "The Air You Breathe,",
    "titleHighlight": "We Take Responsibility",
    "subtitle": "Even the unseen, spotlessly clean",
    "cta": "Get Free Quote"
  },
  "services": {
    "title": "Our Services",
    "subtitle": "Professional cleaning services for every type of air conditioner",
    "wall": {
      "name": "Wall-Mounted AC",
      "desc": "Residential wall-mounted\nair conditioner deep cleaning",
      "price": "From ₩50,000"
    },
    "stand": {
      "name": "Standing AC",
      "desc": "Large standing air conditioner\ncomplete disassembly cleaning",
      "price": "From ₩80,000"
    },
    "ceiling": {
      "name": "Ceiling AC",
      "desc": "System ceiling-mounted\n4-way cassette cleaning",
      "price": "From ₩120,000"
    },
    "window": {
      "name": "Window AC",
      "desc": "Window-mounted air conditioner\ninternal cleaning",
      "price": "From ₩40,000"
    },
    "detail": "Learn More"
  },
  "process": {
    "title": "Our Process",
    "subtitle": "A systematic 4-step process guarantees cleanliness",
    "step1": { "name": "Inspection", "desc": "Check AC condition and\nconsult with customer" },
    "step2": { "name": "Deep Cleaning", "desc": "Fully disassemble and clean\ninternal parts with pro equipment" },
    "step3": { "name": "Sterilization", "desc": "Anti-bacterial coating and\nsterilization treatment" },
    "step4": { "name": "Assembly & Test", "desc": "Reassemble and verify\nproper operation" }
  },
  "reviews": {
    "title": "Customer Reviews",
    "subtitle": "See what our customers have to say"
  },
  "faq": {
    "title": "FAQ",
    "subtitle": "Find answers to commonly asked questions",
    "q1": "How long does the cleaning take?",
    "a1": "It depends on the AC type. Wall-mounted takes about 1-1.5 hours, standing about 2 hours, and ceiling-mounted about 2-3 hours.",
    "q2": "How often should I clean my AC?",
    "a2": "We recommend cleaning 1-2 times per year. Cleaning before summer is the most effective timing.",
    "q3": "Are there any extra service charges?",
    "a3": "There are no extra charges within our service area. Additional fees may apply depending on location.",
    "q4": "Is there a warranty after cleaning?",
    "a4": "We provide after-service if any issues occur after cleaning. Details will be explained during consultation.",
    "q5": "How can I reschedule or cancel?",
    "a5": "Changes and cancellations are possible up to one day before the scheduled visit. Contact us by phone or KakaoTalk."
  },
  "quoteForm": {
    "title": "Free Quote Request",
    "subtitle": "Get a quick and accurate quote",
    "name": "Name",
    "namePlaceholder": "John Doe",
    "phone": "Phone",
    "phonePlaceholder": "010-0000-0000",
    "address": "Address",
    "addressPlaceholder": "Seoul, Gangnam-gu...",
    "acType": "AC Type",
    "wall": "Wall-Mounted",
    "stand": "Standing",
    "ceiling": "Ceiling",
    "window": "Window",
    "acCount": "Number of ACs",
    "acCountPlaceholder": "1",
    "preferredDate": "Preferred Date",
    "note": "Additional Notes",
    "notePlaceholder": "Enter any additional requests",
    "submit": "Submit Quote Request",
    "success": "Your quote request has been submitted! We will contact you shortly.",
    "error": "An error occurred. Please try again."
  },
  "footer": {
    "company": "JY CLEAN",
    "ceo": "CEO: OOO",
    "bizNumber": "Business Reg: 000-00-00000",
    "address": "Address: Seoul, OO-gu, OO-ro 000",
    "phone": "Phone: 010-0000-0000",
    "email": "Email: info@jyclean.com",
    "copyright": "© 2026 JY CLEAN. All rights reserved."
  }
}
```

- [ ] **Step 5: Configure middleware**

`middleware.ts`:
```typescript
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
```

- [ ] **Step 6: Configure next.config.ts**

`next.config.ts`:
```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
export default withNextIntl(nextConfig);
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Visit `http://localhost:3000/ko` — should load without error.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: configure next-intl i18n with KO/EN messages"
```

---

### Task 3: Global Styles & Root Layout

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `lib/utils.ts`

- [ ] **Step 1: Set up Tailwind theme in globals.css**

`app/globals.css`:
```css
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  --color-primary: #3b82f6;
  --color-primary-dark: #1a56db;
  --color-bg-alt: #f0f7ff;
  --color-text-title: #111827;
  --color-text-body: #6b7280;
  --color-border: #e5e8eb;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-white text-text-body antialiased;
  }
}
```

- [ ] **Step 2: Create utility function**

`lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Set up root layout with Noto Sans KR**

`app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "JY CLEAN - 에어컨 청소 전문",
  description: "고객님이 숨쉬는 공기, 우리가 책임집니다. 벽걸이, 스탠드, 천장형, 창문형 에어컨 전문 청소 서비스.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={notoSansKR.variable}>
      <body className="font-[family-name:var(--font-noto-sans-kr)]">
        {children}
      </body>
    </html>
  );
}
```

Note: The `lang` attribute is NOT set here. It will be set dynamically in the locale layout.


```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: global styles with theme variables and root layout"
```

---

### Task 4: Locale Layout + Header Component

**Files:**
- Create: `app/[locale]/layout.tsx`
- Create: `components/Header.tsx`

- [ ] **Step 1: Create locale layout**

`app/[locale]/layout.tsx` — sets `lang` attribute dynamically on `<html>`:
```typescript
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider>
      <div lang={locale}>
        <Header />
        {children}
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
```

Note: The root layout's `<html>` tag does not set `lang`. We set `lang` on the wrapper div here so screen readers and search engines detect the correct language. Alternatively, use Next.js `generateMetadata` to set the lang attribute on `<html>` dynamically via the `htmlAttributes` approach.
```

- [ ] **Step 2: Create Header component**

`components/Header.tsx` — sticky header with navigation, language toggle, mobile hamburger menu, and CTA button. All text from translations. Scroll-based backdrop blur. Smooth scroll to section anchors.

```typescript
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";

const navItems = ["services", "process", "reviews", "faq", "quote"] as const;

export default function Header() {
  const t = useTranslations("header");
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const toggleLocale = () => {
    router.replace(pathname, { locale: t("langToggle") === "EN" ? "en" : "ko" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-xl font-extrabold tracking-tight">
          <span className="text-primary-dark">JY</span>{" "}
          <span className="text-primary">CLEAN</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className="text-sm font-medium text-text-body hover:text-primary transition-colors"
            >
              {t(item)}
            </button>
          ))}
          <button
            onClick={toggleLocale}
            className="px-3.5 py-1.5 text-xs font-semibold text-primary bg-bg-alt border border-primary/20 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            {t("langToggle")}
          </button>
          <button
            onClick={() => scrollTo("quote")}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            {t("quote")}
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-6 py-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className="block w-full text-left text-sm font-medium text-text-body hover:text-primary"
            >
              {t(item)}
            </button>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              onClick={toggleLocale}
              className="px-3.5 py-1.5 text-xs font-semibold text-primary bg-bg-alt border border-primary/20 rounded-full"
            >
              {t("langToggle")}
            </button>
            <button
              onClick={() => scrollTo("quote")}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark rounded-lg"
            >
              {t("quote")}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 3: Create placeholder Footer**

`components/Footer.tsx`:
```typescript
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-gray-900 text-gray-400 py-10 px-6 text-center text-sm leading-8">
      <p className="font-bold text-white">{t("company")}</p>
      <p>{t("ceo")} | {t("bizNumber")}</p>
      <p>{t("address")}</p>
      <p>{t("phone")} | {t("email")}</p>
      <p className="mt-4">{t("copyright")}</p>
    </footer>
  );
}
```

- [ ] **Step 4: Verify header renders at /ko**

```bash
npm run dev
```

Visit `http://localhost:3000/ko` — header should render with Korean text, `/en` with English.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: locale layout, Header with nav/lang toggle, Footer"
```

---

### Task 5: Hero + Services + Process Sections

**Files:**
- Create: `components/HeroSection.tsx`
- Create: `components/ServicesSection.tsx`
- Create: `components/ProcessSection.tsx`
- Create: `app/[locale]/page.tsx`

- [ ] **Step 1: Create HeroSection**

`components/HeroSection.tsx`:
```typescript
"use client";

import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("hero");

  const scrollToQuote = () => {
    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 pt-32 pb-20 px-6 text-center overflow-hidden">
      <div className="absolute -top-1/2 -right-1/5 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)] rounded-full" />
      <div className="relative max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-title leading-tight mb-4">
          {t("title")}
          <br />
          <em className="not-italic text-primary-dark">{t("titleHighlight")}</em>
        </h1>
        <p className="text-lg text-text-body mb-10">{t("subtitle")}</p>
        <button
          onClick={scrollToQuote}
          className="px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary to-primary-dark rounded-xl hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 transition-all"
        >
          {t("cta")} →
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create ServicesSection**

`components/ServicesSection.tsx`:
```typescript
import { useTranslations } from "next-intl";
import { AirVent, Fan, LayoutGrid, AppWindow } from "lucide-react";

const services = [
  { key: "wall", icon: AirVent },
  { key: "stand", icon: Fan },
  { key: "ceiling", icon: LayoutGrid },
  { key: "window", icon: AppWindow },
] as const;

export default function ServicesSection() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-text-title mb-3">{t("title")}</h2>
          <p className="text-text-body">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="group bg-white border border-border rounded-2xl p-8 text-center transition-all hover:border-primary hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
            >
              <div className="w-[72px] h-[72px] bg-bg-alt rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors group-hover:bg-primary-dark">
                <Icon size={32} className="text-primary transition-colors group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold text-text-title mb-2">{t(`${key}.name`)}</h3>
              <p className="text-sm text-text-body whitespace-pre-line leading-relaxed">{t(`${key}.desc`)}</p>
              <p className="mt-3 text-base font-bold text-primary">{t(`${key}.price`)}</p>
              <a href="#" className="inline-block mt-3 text-xs font-semibold text-primary hover:underline">
                {t("detail")} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create ProcessSection**

`components/ProcessSection.tsx`:
```typescript
import { useTranslations } from "next-intl";
import { ClipboardCheck, Wrench, ShieldCheck, RotateCcw } from "lucide-react";

const steps = [
  { key: "step1", icon: ClipboardCheck },
  { key: "step2", icon: Wrench },
  { key: "step3", icon: ShieldCheck },
  { key: "step4", icon: RotateCcw },
] as const;

export default function ProcessSection() {
  const t = useTranslations("process");

  return (
    <section id="process" className="py-20 px-6 bg-bg-alt">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-text-title mb-3">{t("title")}</h2>
          <p className="text-text-body">{t("subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ key, icon: Icon }, index) => (
            <div key={key} className="relative text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center text-xl font-extrabold mx-auto mb-5 transition-transform group-hover:scale-110">
                {index + 1}
              </div>
              <Icon size={28} className="text-primary mx-auto mb-3" />
              <h3 className="text-lg font-bold text-text-title mb-2">{t(`${key}.name`)}</h3>
              <p className="text-sm text-text-body whitespace-pre-line leading-relaxed">{t(`${key}.desc`)}</p>
              {index < 3 && (
                <span className="hidden lg:block absolute top-6 -right-4 text-xl text-primary/30">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create homepage composing sections**

`app/[locale]/page.tsx`:
```typescript
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
    </main>
  );
}
```

- [ ] **Step 5: Verify all 3 sections render**

```bash
npm run dev
```

Visit `http://localhost:3000/ko`, scroll through Hero → Services → Process.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: Hero, Services, Process sections with i18n"
```

---

### Task 6: Reviews + FAQ + Quote Form Sections

**Files:**
- Create: `components/ReviewsSection.tsx`
- Create: `components/FAQSection.tsx`
- Create: `components/QuoteForm.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Create ReviewsSection**

`components/ReviewsSection.tsx` — placeholder for now, will show review images/screenshots when provided:
```typescript
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

export default function ReviewsSection() {
  const t = useTranslations("reviews");

  return (
    <section id="reviews" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-text-title mb-3">{t("title")}</h2>
          <p className="text-text-body">{t("subtitle")}</p>
        </div>
        <div className="bg-bg-alt border border-border rounded-2xl p-10 text-center">
          <Star size={48} className="text-primary mx-auto mb-4" />
          <p className="text-text-body text-sm">
            {t("subtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create FAQSection**

`components/FAQSection.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

const faqKeys = ["1", "2", "3", "4", "5"] as const;

export default function FAQSection() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-6 bg-bg-alt">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-text-title mb-3">{t("title")}</h2>
          <p className="text-text-body">{t("subtitle")}</p>
        </div>
        <div className="space-y-3">
          {faqKeys.map((key, index) => (
            <div
              key={key}
              className={`bg-white border rounded-xl overflow-hidden transition-colors ${
                openIndex === index ? "border-primary" : "border-border hover:border-primary"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-base font-semibold text-text-title">{t(`q${key}`)}</span>
                <Plus
                  size={20}
                  className={`text-primary flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-sm text-text-body leading-relaxed">
                  {t(`a${key}`)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create QuoteForm (without Turnstile for now)**

`components/QuoteForm.tsx`:
```typescript
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle } from "lucide-react";

const acTypes = ["wall", "stand", "ceiling", "window"] as const;

export default function QuoteForm() {
  const t = useTranslations("quoteForm");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      ac_types: selectedTypes,
      ac_count: Number(formData.get("ac_count")),
      preferred_date: formData.get("preferred_date") as string,
      note: formData.get("note") as string,
    };

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="quote" className="py-20 px-6 bg-gradient-to-br from-primary-dark to-[#0d47a1]">
        <div className="max-w-xl mx-auto text-center text-white">
          <CheckCircle size={64} className="mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">{t("success")}</h2>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="py-20 px-6 bg-gradient-to-br from-primary-dark to-[#0d47a1]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-3">{t("title")}</h2>
          <p className="text-white/70">{t("subtitle")}</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("name")}</label>
              <input
                name="name"
                required
                placeholder={t("namePlaceholder")}
                className="w-full px-4 py-3 border-[1.5px] border-border rounded-xl text-sm outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10"
              />
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("phone")}</label>
              <input
                name="phone"
                type="tel"
                required
                pattern="01[016789]-?\d{3,4}-?\d{4}"
                title="010-0000-0000"
                placeholder={t("phonePlaceholder")}
                className="w-full px-4 py-3 border-[1.5px] border-border rounded-xl text-sm outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10"
              />
            </div>
            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("address")}</label>
              <input
                name="address"
                required
                placeholder={t("addressPlaceholder")}
                className="w-full px-4 py-3 border-[1.5px] border-border rounded-xl text-sm outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10"
              />
            </div>
            {/* AC Type Chips */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("acType")}</label>
              <div className="flex flex-wrap gap-2">
                {acTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`px-4 py-2 border-[1.5px] rounded-full text-sm transition-all ${
                      selectedTypes.includes(type)
                        ? "border-primary bg-primary/8 text-primary-dark font-semibold"
                        : "border-border text-text-body hover:border-primary"
                    }`}
                  >
                    {t(type)}
                  </button>
                ))}
              </div>
            </div>
            {/* AC Count */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("acCount")}</label>
              <input
                name="ac_count"
                type="number"
                min={1}
                max={99}
                required
                placeholder={t("acCountPlaceholder")}
                className="w-full px-4 py-3 border-[1.5px] border-border rounded-xl text-sm outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10"
              />
            </div>
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("preferredDate")}</label>
              <input
                name="preferred_date"
                type="date"
                required
                className="w-full px-4 py-3 border-[1.5px] border-border rounded-xl text-sm outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10"
              />
            </div>
            {/* Note */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("note")}</label>
              <textarea
                name="note"
                rows={3}
                placeholder={t("notePlaceholder")}
                className="w-full px-4 py-3 border-[1.5px] border-border rounded-xl text-sm outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10 resize-y"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          <button
            type="submit"
            disabled={loading || selectedTypes.length === 0}
            className="w-full mt-6 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-xl text-base hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send size={18} />
            {loading ? "..." : t("submit")}
          </button>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add all sections to homepage**

`app/[locale]/page.tsx`:
```typescript
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import QuoteForm from "@/components/QuoteForm";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <ReviewsSection />
      <FAQSection />
      <QuoteForm />
    </main>
  );
}
```

- [ ] **Step 5: Verify complete homepage scrolls through all sections**

```bash
npm run dev
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: Reviews, FAQ, QuoteForm sections - complete homepage"
```

---

### Task 7: SEO (Metadata + JSON-LD + Sitemap)

**Files:**
- Modify: `app/layout.tsx` (metadata)
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Add comprehensive metadata to root layout**

Add to `app/layout.tsx` metadata export:
```typescript
export const metadata: Metadata = {
  title: "JY CLEAN - 에어컨 청소 전문",
  description: "고객님이 숨쉬는 공기, 우리가 책임집니다. 벽걸이, 스탠드, 천장형, 창문형 에어컨 전문 청소 서비스.",
  openGraph: {
    title: "JY CLEAN - 에어컨 청소 전문",
    description: "보이지 않는 곳까지, 깨끗하게. 전문 에어컨 청소 서비스.",
    url: "https://www.jyclean.com",
    siteName: "JY CLEAN",
    type: "website",
  },
};
```

- [ ] **Step 2: Create sitemap.ts**

`app/sitemap.ts`:
```typescript
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.jyclean.com/ko", lastModified: new Date(), priority: 1 },
    { url: "https://www.jyclean.com/en", lastModified: new Date(), priority: 0.8 },
  ];
}
```

- [ ] **Step 3: Create robots.ts**

`app/robots.ts`:
```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin/" },
    sitemap: "https://www.jyclean.com/sitemap.xml",
  };
}
```

- [ ] **Step 4: Add JSON-LD to locale layout**

Add a `<script type="application/ld+json">` block to `app/[locale]/layout.tsx` with LocalBusiness schema.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: SEO metadata, sitemap, robots.txt, JSON-LD"
```

---

## Chunk 2: Backend (API + Supabase) & Admin Dashboard

### Task 8: Supabase Client Setup

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

- [ ] **Step 1: Create browser client**

`lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 2: Create server client (cookie-based for auth + service role for admin)**

`lib/supabase/server.ts`:
```typescript
import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// Cookie-based server client for auth (reads user session from cookies)
export async function createServerClient() {
  const cookieStore = await cookies();
  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

// Service role client for backend operations (bypasses RLS)
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Supabase client setup (browser + server)"
```

---

### Task 9: Quotes API Routes

**Files:**
- Create: `app/api/quotes/route.ts`
- Create: `app/api/quotes/[id]/route.ts`

- [ ] **Step 1: Create POST + GET route for quotes**

`app/api/quotes/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";

// POST: public endpoint — anyone can submit a quote
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, address, ac_types, ac_count, preferred_date, note } = body;

  if (!name || !phone || !address || !ac_types?.length || !ac_count || !preferred_date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate phone format (Korean phone number)
  const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
  if (!phoneRegex.test(phone)) {
    return NextResponse.json({ error: "Invalid phone format" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("quotes")
    .insert({
      name,
      phone,
      address,
      ac_types,
      ac_count,
      preferred_date,
      note: note || null,
      status: "new",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO: Phase 1 - send email notification via Resend

  return NextResponse.json(data, { status: 201 });
}

// GET: admin-only endpoint — requires authenticated session
export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();
  const { data, error } = await service
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

- [ ] **Step 2: Create PATCH + DELETE route for individual quote**

`app/api/quotes/[id]/route.ts` — all endpoints require admin auth:
```typescript
import { NextRequest, NextResponse } from "next/server";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";

const ALLOWED_STATUS = ["new", "confirmed", "done", "cancelled"] as const;

async function requireAuth() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try { await requireAuth(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // Only allow status updates
  if (!body.status || !ALLOWED_STATUS.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("quotes")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try { await requireAuth(); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createServiceClient();

  const { error } = await supabase.from("quotes").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: quotes API routes (CRUD)"
```

---

### Task 10: Reviews API Routes

**Files:**
- Create: `app/api/reviews/route.ts`
- Create: `app/api/reviews/[id]/route.ts`

- [ ] **Step 1: Create POST + GET route for reviews**

`app/api/reviews/route.ts` — same pattern as quotes. GET supports `?visible=true` query param for public-facing display.

- [ ] **Step 2: Create PATCH + DELETE route**

`app/api/reviews/[id]/route.ts` — same pattern as quotes.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: reviews API routes (CRUD)"
```

---

### Task 11: Admin Login + Auth Guard

**Files:**
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/layout.tsx`
- Create: `app/api/auth/route.ts`
- Create: `components/admin/Sidebar.tsx`

- [ ] **Step 1: Create admin login page**

`app/admin/login/page.tsx` — email/password form, calls Supabase Auth `signInWithPassword`, redirects to `/admin` on success.

- [ ] **Step 2: Create auth API route**

`app/api/auth/route.ts` — validates session, returns user info.

- [ ] **Step 3: Create admin sidebar**

`components/admin/Sidebar.tsx` — sidebar with logo, nav links (대시보드, 전체 견적, 접수 완료, 고객 후기 관리), logout button.

- [ ] **Step 4: Create admin layout with auth guard**

`app/admin/layout.tsx` — checks Supabase auth session, redirects to `/admin/login` if not authenticated, renders sidebar + main content area.

- [ ] **Step 5: Verify login flow works**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: admin authentication and layout with sidebar"
```

---

### Task 12: Admin Dashboard (Stats + Quote Table)

**Files:**
- Create: `app/admin/page.tsx`
- Create: `components/admin/StatsCards.tsx`
- Create: `components/admin/QuoteTable.tsx`
- Create: `components/admin/QuoteDetailModal.tsx`

- [ ] **Step 1: Create StatsCards component**

`components/admin/StatsCards.tsx` — 4 cards showing total/new/confirmed/done counts. Fetches from `/api/quotes` and computes counts client-side.

- [ ] **Step 2: Create QuoteTable component**

`components/admin/QuoteTable.tsx` — table with tab filters (all/new/confirmed/done/cancelled), search input (client-side filter by name/phone/address), status badges with colors per mapping, action buttons (view detail, change status, delete).

- [ ] **Step 3: Create QuoteDetailModal**

`components/admin/QuoteDetailModal.tsx` — modal showing all quote fields, status change buttons ("접수 완료 → 캘린더 등록", "작업 완료").

- [ ] **Step 4: Create admin dashboard page**

`app/admin/page.tsx` — composes StatsCards + QuoteTable, includes "구글 스프레드시트 내보내기" button.

- [ ] **Step 5: Verify dashboard renders with mock/real data**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: admin dashboard with stats, quote table, detail modal"
```

---

### Task 13: Admin Review Management

**Files:**
- Create: `app/admin/reviews/page.tsx`
- Create: `components/admin/ReviewManager.tsx`

- [ ] **Step 1: Create ReviewManager component**

`components/admin/ReviewManager.tsx` — table of reviews with add/edit/delete, visibility toggle, star rating display.

- [ ] **Step 2: Create reviews admin page**

`app/admin/reviews/page.tsx` — renders ReviewManager.

- [ ] **Step 3: Update ReviewsSection to fetch visible reviews from API**

Modify `components/ReviewsSection.tsx` to fetch from `/api/reviews?visible=true` and display review cards instead of placeholder.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: admin review management + public review display"
```

---

## Chunk 3: External Integrations

### Task 14: Google Calendar Integration

**Files:**
- Create: `lib/google/calendar.ts`
- Create: `app/api/calendar/route.ts`

- [ ] **Step 1: Create Google Calendar helper**

`lib/google/calendar.ts`:
```typescript
import { google } from "googleapis";

export async function createCalendarEvent(quote: {
  name: string;
  phone: string;
  address: string;
  ac_types: string[];
  ac_count: number;
  preferred_date: string;
}) {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/calendar.events"],
  });

  const calendar = google.calendar({ version: "v3", auth });

  const event = {
    summary: `[JY CLEAN] ${quote.name} - ${quote.ac_types.join(", ")} ${quote.ac_count}대`,
    description: `고객: ${quote.name}\n연락처: ${quote.phone}\n주소: ${quote.address}\n에어컨: ${quote.ac_types.join(", ")} ${quote.ac_count}대`,
    start: { date: quote.preferred_date },
    end: { date: quote.preferred_date },
    reminders: { useDefault: true },
  };

  const result = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    requestBody: event,
  });

  return result.data;
}
```

- [ ] **Step 2: Install googleapis**

```bash
npm install googleapis
```

- [ ] **Step 3: Create calendar API route**

`app/api/calendar/route.ts` — POST endpoint that accepts a quote ID, fetches quote from Supabase, creates calendar event.

- [ ] **Step 4: Wire up "접수 완료" status change to also call calendar API**

Update QuoteDetailModal to call `/api/calendar` when changing status to `confirmed`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: Google Calendar integration on quote confirmation"
```

---

### Task 15: Google Sheets Export

**Files:**
- Create: `lib/google/sheets.ts`
- Create: `app/api/sheets/route.ts`

- [ ] **Step 1: Create Google Sheets helper**

`lib/google/sheets.ts` — function that takes an array of quotes and writes them to a Google Sheet (clear existing data, write headers + rows).

- [ ] **Step 2: Create sheets API route**

`app/api/sheets/route.ts` — POST endpoint that fetches all quotes from Supabase and exports to the configured Google Sheet.

- [ ] **Step 3: Wire up admin dashboard export button**

Update admin dashboard to call `/api/sheets` on button click, show loading state and success/error feedback.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Google Sheets export for quote list"
```

---

### Task 16: Cloudflare Turnstile Spam Protection

**Files:**
- Modify: `components/QuoteForm.tsx`
- Modify: `app/api/quotes/route.ts`

- [ ] **Step 1: Install Turnstile React component**

```bash
npm install @marsidev/react-turnstile
```

- [ ] **Step 2: Add Turnstile widget to QuoteForm**

Add `<Turnstile siteKey={...} onSuccess={setToken} />` before submit button.

- [ ] **Step 3: Validate Turnstile token in API route**

In `app/api/quotes/route.ts` POST handler, verify the token with Cloudflare's siteverify endpoint before inserting to DB.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Cloudflare Turnstile spam protection on quote form"
```

---

### Task 17: Email Notification (Phase 1)

**Files:**
- Modify: `app/api/quotes/route.ts`

- [ ] **Step 1: Install Resend**

```bash
npm install resend
```

- [ ] **Step 2: Add email notification to quote POST route**

After successful Supabase insert, send notification email via Resend to the business owner's email address.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: email notification on new quote submission (Phase 1)"
```

---

### Task 18: Final Build Verification & Deployment Prep

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Fix any build errors.

- [ ] **Step 2: Verify all routes work**

- Homepage: `/ko`, `/en` — all sections render
- Language toggle works
- Quote form submits (with Supabase credentials)
- Admin: `/admin/login` → `/admin` — dashboard loads
- Admin: quote table, status changes, review management

- [ ] **Step 3: Create GitHub repository**

```bash
gh repo create JWLeee/ACCLEAN --private --source=. --push
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final build verification and cleanup"
git push -u origin main
```
