/**
 * Preset years offered by the timeline controls.
 *
 * `milestones` are the four demonstration moments required by the brief; their
 * titles and descriptions live in the dictionaries under `milestones.<key>`.
 * `jumpYears` are further years for which the map has outlines worth seeing.
 */
import { fromEra } from "@/lib/dates";

export type MilestoneKey = "y550bce" | "y330bce" | "y117ce" | "y651ce";

export interface Milestone {
  key: MilestoneKey;
  year: number;
  /** Entity to highlight when the milestone is opened in the atlas. */
  entityId: string;
}

export const milestones: Milestone[] = [
  { key: "y550bce", year: fromEra(550, "BCE"), entityId: "achaemenid-empire" },
  { key: "y330bce", year: fromEra(330, "BCE"), entityId: "achaemenid-empire" },
  { key: "y117ce", year: fromEra(117, "CE"), entityId: "roman-empire" },
  { key: "y651ce", year: fromEra(651, "CE"), entityId: "sasanian-empire" },
];

export const jumpYears: number[] = [
  fromEra(2550, "BCE"),
  fromEra(1274, "BCE"),
  fromEra(700, "BCE"),
  fromEra(500, "BCE"),
  fromEra(323, "BCE"),
  fromEra(250, "BCE"),
  fromEra(1, "CE"),
  fromEra(260, "CE"),
  fromEra(400, "CE"),
  fromEra(565, "CE"),
];

/** Position of a year on a 0–100 scale across the atlas' time span. */
export function yearToPercent(year: number, min: number, max: number): number {
  return Math.min(100, Math.max(0, ((year - min) / (max - min)) * 100));
}
