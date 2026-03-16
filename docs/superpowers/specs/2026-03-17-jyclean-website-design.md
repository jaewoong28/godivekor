# JY CLEAN 에어컨 청소 회사 홈페이지 설계

## 개요

에어컨 청소 전문 회사 "JY CLEAN"의 홈페이지를 새로 제작한다. 깨끗한 화이트 톤 + 파란색 포인트의 신뢰감 있는 디자인으로, 한/영 전환을 지원하는 원페이지 스크롤 구조이다.

- **프로젝트 경로**: `/Users/jaewoonglee/Projects/JWLeee/ACCLEAN`
- **도메인**: www.jyclean.com
- **참고 사이트**: https://www.csfsystem.co.kr
- **별도 레포**: godivekor와 완전히 분리된 새 프로젝트
- **Supabase**: 동일 계정, 별도 프로젝트 (godivekor와 DB 분리)

## 기술 스택

- **프레임워크**: Next.js 16 + React 19
- **스타일링**: Tailwind CSS 4 (`@theme` CSS 기반 설정)
- **UI 컴포넌트**: shadcn UI + Lucide icons
- **폰트**: Noto Sans KR (`next/font/google`)
- **다국어**: next-intl (한국어/영어)
- **DB**: Supabase (별도 프로젝트)
- **배포**: Vercel + 커스텀 도메인 (www.jyclean.com)
- **연동**: Google Calendar API (서비스 계정), Google Sheets API
- **스팸 방지**: Cloudflare Turnstile (견적 폼)

### 알림 (Phase 구분)
- **Phase 1**: 이메일 알림 (Supabase Edge Function + Resend)
- **Phase 2**: 카카오톡 알림톡 (카카오 비즈니스 채널 등록 + 템플릿 승인 후)

### 환경 변수
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_SERVICE_ACCOUNT_KEY=   # Calendar + Sheets
GOOGLE_CALENDAR_ID=
GOOGLE_SHEET_ID=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
RESEND_API_KEY=
```

## 디자인 시스템

### 색상
- Primary: `#3b82f6` (파란색), `#1a56db` (다크 블루)
- Background: `#ffffff`, `#f0f7ff` (섹션 교차)
- Text: `#111827` (제목), `#6b7280` (본문)
- Border: `#e5e8eb`

### 타이포그래피
- 폰트: Noto Sans KR (`next/font/google`)
- 제목: 32-42px, weight 800
- 본문: 14-16px, weight 400-500

### 호버/인터랙션
- 버튼: translateY(-2px) + box-shadow 강화
- 카드: translateY(-4px) + border-color 파란색 변경 + shadow
- 아이콘: 배경색 파란색 전환 (아이콘 흰색)
- 링크: color 파란색 전환
- FAQ 아코디언: + 아이콘 45도 회전

## 홈페이지 구조 (원페이지 스크롤)

### 1. Header (고정)
- 로고: "JY CLEAN" (JY: #1a56db, CLEAN: #60a5fa)
- 네비게이션: 서비스, 작업 공정, 고객 후기, FAQ, 견적 신청
- 한/영 토글 버튼
- CTA 버튼: "견적 신청"
- 스크롤 시 backdrop-filter blur 효과
- 모바일: 햄버거 메뉴 → 슬라이드 다운 드롭다운 오버레이

### 2. Hero Section
- 배경: 블루 그라데이션 (추후 전문 청소 이미지로 교체 가능 — `next/image` + gradient overlay 구조)
- 메인 카피: "고객님이 숨쉬는 공기, 우리가 책임집니다"
- 서브 카피: "보이지 않는 곳까지, 깨끗하게"
- CTA: "무료 견적 받기 →" 버튼

### 3. 서비스 섹션
4종 카드 그리드:
| 서비스 | 설명 |
|--------|------|
| 벽걸이 에어컨 | 가정용 벽걸이형 에어컨 분해 세척 |
| 스탠드 에어컨 | 대형 스탠드형 에어컨 완전 분해 청소 |
| 천장형 에어컨 | 시스템 천장형 4방향 카세트 청소 |
| 창문형 에어컨 | 창문 설치형 에어컨 내부 세척 |

- 각 카드에 아이콘 + 서비스명 + 설명 + 가격 표시
- 가격 표시 후 "자세히 보기" 버튼 → 네이버 스토어 링크 (링크 미정, 임시로 `#` placeholder)
- 호버 시: border 파란색, 아이콘 배경 파란색 전환

### 4. 작업 공정 섹션
4단계 프로세스:
1. **사전 점검** — 에어컨 상태 확인 및 고객 상담
2. **분해 세척** — 전문 장비로 내부 부품 완전 분해 세척
3. **살균 처리** — 항균 코팅 및 살균 처리
4. **조립 및 시운전** — 재조립 후 정상 작동 확인

- 번호 배지: 파란색 원형, 호버 시 scale(1.15)
- 단계 사이 화살표 연결

### 5. 고객 후기 섹션
- **직접 등록 방식**: 관리자가 고객 리뷰 텍스트 + 별점을 직접 등록
- 네이버 리뷰 공식 임베드 위젯이 존재하지 않으므로, 자체 리뷰 카드 UI로 구현
- Supabase `reviews` 테이블에 저장, 관리자 페이지에서 CRUD
- 카드 슬라이더 형태로 표시

### 6. FAQ 섹션
아코디언 형태, 5개 항목:
- 청소 소요 시간은 얼마나 걸리나요?
- 에어컨 청소 주기는 어떻게 되나요?
- 출장비가 별도로 있나요?
- 청소 후 보증 기간이 있나요?
- 예약 변경/취소는 어떻게 하나요?

(답변 내용은 messages 파일에서 한/영 관리)

### 7. 견적 신청 폼
- 배경: 파란색 그라데이션
- Cloudflare Turnstile 스팸 방지
- 폼 필드:
  - 이름 (text, 필수)
  - 연락처 (tel, 필수, 한국 전화번호 형식 검증)
  - 주소 (text, 필수)
  - 에어컨 종류 (chip 다중 선택: 벽걸이/스탠드/천장형/창문형, 필수 1개 이상)
  - 에어컨 대수 (number, 필수, 1~99)
  - 희망 날짜 (date, 필수, YYYY-MM-DD)
  - 기타 요청사항 (textarea, 선택)
- 제출 시: Supabase DB 저장 + 이메일 알림 발송 (Phase 1)
- 제출 완료 후: 성공 메시지 표시

### 8. Footer
- 회사명, 대표자, 사업자등록번호, 주소, 전화, 이메일
- (정보 미정 — placeholder, 법적 필수: 대표자명, 사업자등록번호)

## SEO

- Next.js Metadata API로 title, description, Open Graph 태그 설정
- JSON-LD 구조화 데이터 (LocalBusiness 스키마)
- sitemap.xml 자동 생성
- robots.txt

## 관리자 페이지 (`/admin`)

### 인증
- Supabase Auth로 관리자 로그인 보호
- 단일 관리자 계정 (이메일/비밀번호)

### 레이아웃
- 좌측 사이드바 + 우측 메인 콘텐츠
- 사이드바 메뉴: 대시보드, 전체 견적, 접수 완료(작업 대기), 고객 후기 관리

### 대시보드
- 통계 카드 4개: 전체 견적 / 신규 접수 / 접수 완료(작업 대기) / 작업 완료
- 탭 필터: 전체 / 신규 접수 / 접수 완료 / 작업 완료 / 취소
- 상단 액션: "구글 스프레드시트 내보내기" 버튼

### 견적 목록 테이블
- 컬럼: 번호, 이름, 연락처, 에어컨 종류, 대수, 희망일, 상태, 액션
- 검색 기능 (이름, 연락처, 주소 — 클라이언트 사이드 필터링)
- 상태 배지 매핑:

| DB 값 | 한국어 표시 | 영어 표시 | 색상 |
|--------|------------|-----------|------|
| `new` | 신규 접수 | New | 파란색 |
| `confirmed` | 접수 완료 | Confirmed | 주황색 |
| `done` | 작업 완료 | Done | 초록색 |
| `cancelled` | 취소 | Cancelled | 빨간색 |

### 견적 상세 모달
- 전체 필드 표시
- 상태 변경 버튼

### 고객 후기 관리
- 후기 CRUD (이름, 별점, 내용, 날짜)
- 홈페이지에 표시 여부 토글

### 워크플로우
```
신규 접수 → 접수 완료 (작업 대기) → 작업 완료 (완료 탭으로 이동)
                                   → 취소
```
- **삭제는 아님** — 작업 완료 시 "완료" 탭으로 이동하여 기록 보존
- 삭제는 취소 건이나 불필요한 건에만 사용

### 외부 연동
1. **Google Calendar**: "접수 완료" 상태 변경 시 Google Calendar에 이벤트 자동 생성 (서비스 계정 사용, 사업자 캘린더에 공유)
2. **Google Sheets**: "스프레드시트 내보내기" 버튼 클릭 시 전체 견적 리스트를 지정된 Google Sheet에 내보내기
3. **알림**: Phase 1 이메일 / Phase 2 카카오톡 알림톡

## 다국어 (i18n)

- next-intl 사용
- 기본 언어: 한국어 (`/ko`)
- 영어: `/en`
- Header에 한/영 토글 버튼
- 모든 텍스트를 messages 파일로 관리
- DB 저장 값은 영어 enum (`wall`, `stand`, `ceiling`, `window`), 표시는 로케일별 변환

## Supabase 테이블 구조

### `quotes` (견적 신청)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 자동 생성 |
| name | text | 고객 이름 |
| phone | text | 연락처 |
| address | text | 주소 |
| ac_types | text[] | 에어컨 종류 (배열, 값: wall/stand/ceiling/window) |
| ac_count | integer | 에어컨 대수 |
| preferred_date | date | 희망 날짜 |
| note | text | 기타 요청사항 |
| status | text | 상태 (new/confirmed/done/cancelled) |
| created_at | timestamptz | 생성일시 |
| updated_at | timestamptz | 수정일시 |

### `reviews` (고객 후기)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 자동 생성 |
| name | text | 고객 이름 |
| rating | integer | 별점 (1-5) |
| content | text | 후기 내용 |
| visible | boolean | 홈페이지 표시 여부 |
| created_at | timestamptz | 생성일시 |

## 반응형

- Desktop (1024px+): 4열 그리드, 풀 레이아웃
- Tablet (768px~1024px): 2열 그리드
- Mobile (~768px): 1열, 햄버거 메뉴 (슬라이드 다운), 패딩 축소
