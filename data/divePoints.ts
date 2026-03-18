export interface DivePoint {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  lat: number;
  lng: number;
  markerColor: string;
  detailPage: string;
}

export interface CountryGroup {
  country: string;
  countryCode: string;
  flag: string;
  points: DivePoint[];
}

export const divePoints: DivePoint[] = [
  // Philippines
  { id: "cebu", country: "philippines", countryCode: "PH", flag: "🇵🇭", lat: 10.3157, lng: 123.8854, markerColor: "#f09a3e", detailPage: "/tours/01_cebu.html" },
  { id: "moalboal", country: "philippines", countryCode: "PH", flag: "🇵🇭", lat: 9.9467, lng: 123.3955, markerColor: "#f09a3e", detailPage: "/tours/02_moalboal.html" },
  { id: "dumaguete", country: "philippines", countryCode: "PH", flag: "🇵🇭", lat: 9.3068, lng: 123.3054, markerColor: "#f09a3e", detailPage: "/tours/03_dumaguete.html" },
  { id: "sabang", country: "philippines", countryCode: "PH", flag: "🇵🇭", lat: 13.5134, lng: 120.9847, markerColor: "#f09a3e", detailPage: "/tours/04_sabang.html" },
  { id: "coron", country: "philippines", countryCode: "PH", flag: "🇵🇭", lat: 12.0, lng: 120.2, markerColor: "#f09a3e", detailPage: "/tours/05_coron.html" },
  { id: "malapascua", country: "philippines", countryCode: "PH", flag: "🇵🇭", lat: 11.3267, lng: 124.1167, markerColor: "#f09a3e", detailPage: "/tours/06_malapascua.html" },
  // Japan
  { id: "miyakejima", country: "japan", countryCode: "JP", flag: "🇯🇵", lat: 34.0794, lng: 139.5283, markerColor: "#4a9eff", detailPage: "/tours/07_miyakejima.html" },
  { id: "mikomoto", country: "japan", countryCode: "JP", flag: "🇯🇵", lat: 34.5833, lng: 138.9500, markerColor: "#4a9eff", detailPage: "/tours/08_mikimoto.html" },
  { id: "okinawa", country: "japan", countryCode: "JP", flag: "🇯🇵", lat: 26.3344, lng: 127.8056, markerColor: "#4a9eff", detailPage: "/tours/09_okinawa.html" },
  // Korea
  { id: "jeju", country: "korea", countryCode: "KR", flag: "🇰🇷", lat: 33.4890, lng: 126.4983, markerColor: "#22c55e", detailPage: "/tours/10_jeju.html" },
  { id: "ulleungdo", country: "korea", countryCode: "KR", flag: "🇰🇷", lat: 37.4841, lng: 130.9057, markerColor: "#22c55e", detailPage: "/tours/11_ulleungdo.html" },
  // Indonesia
  { id: "komodo", country: "indonesia", countryCode: "ID", flag: "🇮🇩", lat: -8.5500, lng: 119.4833, markerColor: "#a855f7", detailPage: "/tours/12_komodo.html" },
  { id: "raja-ampat", country: "indonesia", countryCode: "ID", flag: "🇮🇩", lat: -0.2333, lng: 130.5167, markerColor: "#a855f7", detailPage: "/tours/13_raja_ampat.html" },
  { id: "bali", country: "indonesia", countryCode: "ID", flag: "🇮🇩", lat: -8.3405, lng: 115.0920, markerColor: "#a855f7", detailPage: "/tours/14_bali.html" },
  // Palau
  { id: "palau", country: "palau", countryCode: "PW", flag: "🇵🇼", lat: 7.5150, lng: 134.5825, markerColor: "#ec4899", detailPage: "/tours/15_palau.html" },
  // Malaysia
  { id: "sipadan", country: "malaysia", countryCode: "MY", flag: "🇲🇾", lat: 4.1150, lng: 118.6292, markerColor: "#eab308", detailPage: "/tours/17_sipadan.html" },
  // Mexico
  { id: "cancun", country: "mexico", countryCode: "MX", flag: "🇲🇽", lat: 21.1619, lng: -86.8515, markerColor: "#ef4444", detailPage: "/tours/16_cancun.html" },
];

const countryOrder = ["philippines", "japan", "korea", "indonesia", "palau", "malaysia", "mexico"];

export function getCountryGroups(): CountryGroup[] {
  const grouped = new Map<string, DivePoint[]>();
  for (const point of divePoints) {
    const existing = grouped.get(point.country) || [];
    existing.push(point);
    grouped.set(point.country, existing);
  }
  return countryOrder
    .filter((c) => grouped.has(c))
    .map((c) => {
      const points = grouped.get(c)!;
      return {
        country: c,
        countryCode: points[0].countryCode,
        flag: points[0].flag,
        points,
      };
    });
}
