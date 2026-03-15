export interface DiveEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: "education" | "tour";
  color: string;
  description?: string;
}

export const events: DiveEvent[] = [
  {
    id: "1",
    title: "오픈워터 교육",
    start: "2026-03-14",
    end: "2026-03-17",
    type: "education",
    color: "#006699",
    description: "PADI 오픈워터다이버 코스 (3일)",
  },
  {
    id: "2",
    title: "세부 투어",
    start: "2026-03-20",
    end: "2026-03-24",
    type: "tour",
    color: "#f09a3e",
    description: "필리핀 세부 다이빙 투어 (4박 5일)",
  },
  {
    id: "3",
    title: "어드밴스드 교육",
    start: "2026-03-28",
    end: "2026-03-30",
    type: "education",
    color: "#006699",
    description: "PADI 어드밴스드 오픈워터 코스 (2일)",
  },
  {
    id: "4",
    title: "제주 투어",
    start: "2026-04-03",
    end: "2026-04-06",
    type: "tour",
    color: "#f09a3e",
    description: "제주도 서귀포 다이빙 투어 (3박 4일)",
  },
  {
    id: "5",
    title: "레스큐 교육",
    start: "2026-04-11",
    end: "2026-04-14",
    type: "education",
    color: "#006699",
    description: "PADI 레스큐다이버 코스 (3일)",
  },
  {
    id: "6",
    title: "발리 투어",
    start: "2026-04-18",
    end: "2026-04-23",
    type: "tour",
    color: "#f09a3e",
    description: "인도네시아 발리 다이빙 투어 (5박 6일)",
  },
  {
    id: "7",
    title: "오픈워터 교육",
    start: "2026-04-25",
    end: "2026-04-28",
    type: "education",
    color: "#006699",
    description: "PADI 오픈워터다이버 코스 (3일)",
  },
  {
    id: "8",
    title: "체험 다이빙",
    start: "2026-03-08",
    end: "2026-03-09",
    type: "education",
    color: "#006699",
    description: "체험 다이빙 프로그램",
  },
];
