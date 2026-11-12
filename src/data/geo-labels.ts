/**
 * Names of seas shown on the map for orientation.
 * These are modern conventional names of physical features, not historical claims.
 */
import type { LocalizedText } from "@/i18n/config";

export interface GeoLabel {
  id: string;
  name: LocalizedText;
  coordinates: [number, number];
}

export const geoLabels: GeoLabel[] = [
  { id: "mediterranean", name: { fa: "دریای مدیترانه", en: "Mediterranean Sea" }, coordinates: [18.5, 34.6] },
  { id: "black-sea", name: { fa: "دریای سیاه", en: "Black Sea" }, coordinates: [34.5, 43.3] },
  { id: "caspian", name: { fa: "دریای خزر", en: "Caspian Sea" }, coordinates: [50.8, 41.6] },
  { id: "persian-gulf", name: { fa: "خلیج فارس", en: "Persian Gulf" }, coordinates: [51.6, 26.9] },
  { id: "red-sea", name: { fa: "دریای سرخ", en: "Red Sea" }, coordinates: [38.2, 20.6] },
  { id: "arabian-sea", name: { fa: "دریای عرب", en: "Arabian Sea" }, coordinates: [63.5, 16.5] },
  { id: "bay-of-bengal", name: { fa: "خلیج بنگال", en: "Bay of Bengal" }, coordinates: [89, 14.5] },
  { id: "south-china-sea", name: { fa: "دریای جنوبی چین", en: "South China Sea" }, coordinates: [114.5, 14] },
];
