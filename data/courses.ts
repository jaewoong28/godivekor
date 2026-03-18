export interface Course {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  details: { label: string; value: string }[];
  description: string;
  image: string;
}

export const courses: Course[] = [
  {
    id: "open-water",
    title: "오픈워터다이버 코스",
    subtitle: "SDI Open Water Diver",
    price: "55만원",
    details: [
      { label: "교육비", value: "55만원" },
      { label: "이론 교육", value: "3~4시간" },
      { label: "수영장 교육 (제한 수역)", value: "2회" },
      { label: "해양 실습 (개방 수역)", value: "4회" },
      { label: "다이빙 후 로그북 작성", value: "포함" },
      { label: "필기 시험", value: "포함" },
      { label: "불포함 사항", value: "수영장 입장료·탱크·장비 렌탈 / 해양 실습 제반 비용 (해외 약 $150/일, 최소 2일)" },
    ],
    description:
      "바다 속, 새로운 세계가 당신을 기다리고 있어요. 이 과정을 통해 수심 18m까지 안전하게 다이빙할 수 있는 공식 자격을 얻게 됩니다. 이론부터 수영장 실습, 그리고 드디어 마주하는 진짜 바다까지 — 단계마다 쌓이는 자신감과 함께, 어느새 당신도 당당한 다이버로 성장해 있을 거예요.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
  },
  {
    id: "advanced",
    title: "어드밴스드 오픈워터 코스",
    subtitle: "SDI Advanced Open Water Diver",
    price: "40만원",
    details: [
      { label: "교육비", value: "40만원" },
      { label: "이론", value: "자율 학습" },
      { label: "개방수역", value: "5번" },
      { label: "포함 과정", value: "딥다이빙, 수중항법 포함" },
    ],
    description:
      "오픈워터 자격 취득 후 다음 단계! 수심 30미터까지 다이빙이 가능해지며, 딥다이빙, 수중항법, 야간다이빙 등 5가지 어드벤처 다이브를 경험합니다. 더 넓은 바다를 탐험할 준비를 하세요.",
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop",
  },
  {
    id: "rescue",
    title: "레스큐다이버 코스",
    subtitle: "SDI Rescue Diver",
    price: "45만원",
    details: [
      { label: "교육비", value: "45만원" },
      { label: "이론", value: "6시간" },
      { label: "수영장 교육", value: "1일" },
      { label: "개방수역", value: "2일" },
      { label: "선수 조건", value: "어드밴스드 + EFR" },
    ],
    description:
      "다이빙 중 발생할 수 있는 긴급 상황에 대처하는 능력을 기릅니다. 자기 구조, 다른 다이버 구조, 응급 관리 등을 배우며, 이 과정을 통해 진정한 다이버로 성장할 수 있습니다.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
  },
  {
    id: "fun-dive",
    title: "펀다이빙 (체험 다이빙)",
    subtitle: "Discover Scuba Diving",
    price: "15만원",
    details: [
      { label: "교육비", value: "15만원" },
      { label: "소요 시간", value: "약 2~3시간" },
      { label: "포함 사항", value: "장비 전체, 강사 동반" },
      { label: "자격 조건", value: "없음 (누구나 가능)" },
    ],
    description:
      "자격증 없이도 바다 속 세계를 경험할 수 있는 체험 프로그램입니다. 전문 강사가 1:1로 동반하며 안전하게 수중 세계를 안내합니다. 다이빙이 처음이신 분들께 추천드립니다.",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop",
  },
];
