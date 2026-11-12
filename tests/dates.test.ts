import { describe, expect, it } from "vitest";
import {
  ATLAS_MAX_YEAR,
  ATLAS_MIN_YEAR,
  centuryOf,
  clampYear,
  compareYears,
  formatCentury,
  formatDated,
  formatDatedRange,
  formatNumber,
  formatRange,
  formatYear,
  fromEra,
  isYearInRange,
  parseYearParam,
  toEra,
  yearsBetween,
} from "@/lib/dates";

/** The six years the project brief requires us to test, with their internal value. */
const REQUIRED_CASES = [
  { label: "550 BCE", value: 550, era: "BCE", internal: -549, en: "550 BCE", fa: "۵۵۰ پ.م" },
  { label: "330 BCE", value: 330, era: "BCE", internal: -329, en: "330 BCE", fa: "۳۳۰ پ.م" },
  { label: "1 BCE", value: 1, era: "BCE", internal: 0, en: "1 BCE", fa: "۱ پ.م" },
  { label: "1 CE", value: 1, era: "CE", internal: 1, en: "1 CE", fa: "۱ م" },
  { label: "117 CE", value: 117, era: "CE", internal: 117, en: "117 CE", fa: "۱۱۷ م" },
  { label: "651 CE", value: 651, era: "CE", internal: 651, en: "651 CE", fa: "۶۵۱ م" },
] as const;

describe("astronomical year numbering", () => {
  it.each(REQUIRED_CASES)("$label is stored as $internal", ({ value, era, internal }) => {
    expect(fromEra(value, era)).toBe(internal);
  });

  it.each(REQUIRED_CASES)("$internal converts back to $label", ({ value, era, internal }) => {
    expect(toEra(internal)).toEqual({ value, era });
  });

  it("round-trips every year the atlas covers", () => {
    for (let year = ATLAS_MIN_YEAR; year <= ATLAS_MAX_YEAR; year++) {
      const { value, era } = toEra(year);
      expect(fromEra(value, era)).toBe(year);
    }
  });

  it("rejects a historical year 0 and non-integers", () => {
    expect(() => fromEra(0, "BCE")).toThrow(RangeError);
    expect(() => fromEra(0, "CE")).toThrow(RangeError);
    expect(() => fromEra(-5, "CE")).toThrow(RangeError);
    expect(() => fromEra(1.5, "CE")).toThrow(RangeError);
    expect(() => toEra(0.5)).toThrow(RangeError);
  });

  it("covers 3500 BCE to 700 CE", () => {
    expect(ATLAS_MIN_YEAR).toBe(-3499);
    expect(ATLAS_MAX_YEAR).toBe(700);
  });
});

describe("formatYear", () => {
  it.each(REQUIRED_CASES)("formats $label in English", ({ internal, en }) => {
    expect(formatYear(internal, "en")).toBe(en);
  });

  it.each(REQUIRED_CASES)("formats $label in Persian", ({ internal, fa }) => {
    expect(formatYear(internal, "fa")).toBe(fa);
  });

  it("never displays a year zero anywhere in the atlas' range", () => {
    for (let year = ATLAS_MIN_YEAR; year <= ATLAS_MAX_YEAR; year++) {
      const english = formatYear(year, "en");
      const persian = formatYear(year, "fa");
      expect(english).not.toMatch(/^0\b/);
      expect(persian.startsWith("۰")).toBe(false);
      expect(toEra(year).value).toBeGreaterThanOrEqual(1);
    }
  });

  it("shows internal year 0 as 1 BCE, not as 0", () => {
    expect(formatYear(0, "en")).toBe("1 BCE");
    expect(formatYear(0, "fa")).toBe("۱ پ.م");
  });

  it("marks approximate dates", () => {
    expect(formatYear(-549, "en", { approximate: true })).toBe("c. 550 BCE");
    expect(formatYear(-549, "fa", { approximate: true })).toBe("حدود ۵۵۰ پ.م");
    expect(formatDated({ year: -3099, precision: "approximate" }, "en")).toBe("c. 3100 BCE");
    expect(formatDated({ year: 635, precision: "disputed" }, "en")).toBe("c. 635 CE");
    expect(formatDated({ year: 224, precision: "exact" }, "en")).toBe("224 CE");
  });

  it("uses Persian digits only for Persian", () => {
    expect(formatNumber(1234567890, "fa")).toBe("۱۲۳۴۵۶۷۸۹۰");
    expect(formatNumber(1234567890, "en")).toBe("1234567890");
  });
});

describe("formatRange", () => {
  it("writes the era once when both ends share it", () => {
    expect(formatRange(-549, -329, "en")).toBe("550–330 BCE");
    expect(formatRange(224, 651, "en")).toBe("224–651 CE");
    expect(formatRange(-549, -329, "fa")).toBe("۵۵۰ تا ۳۳۰ پ.م");
  });

  it("writes both eras across the BCE/CE boundary", () => {
    expect(formatRange(-26, 476, "en")).toBe("27 BCE – 476 CE");
    expect(formatRange(-205, 220, "fa")).toBe("۲۰۶ پ.م تا ۲۲۰ م");
  });

  it("collapses a one-year range", () => {
    expect(formatRange(117, 117, "en")).toBe("117 CE");
  });

  it("carries precision from both ends", () => {
    expect(
      formatDatedRange({ year: -3099, precision: "approximate" }, { year: -29, precision: "exact" }, "en"),
    ).toBe("c. 3100–30 BCE");
    expect(
      formatDatedRange({ year: -320, precision: "approximate" }, { year: -184, precision: "approximate" }, "en"),
    ).toBe("c. 321 BCE – c. 185 BCE");
  });
});

describe("centuries", () => {
  it("assigns years to the correct century", () => {
    expect(centuryOf(-549)).toEqual({ century: 6, era: "BCE" });
    expect(centuryOf(-329)).toEqual({ century: 4, era: "BCE" });
    expect(centuryOf(0)).toEqual({ century: 1, era: "BCE" }); // 1 BCE
    expect(centuryOf(1)).toEqual({ century: 1, era: "CE" });
    expect(centuryOf(100)).toEqual({ century: 1, era: "CE" });
    expect(centuryOf(101)).toEqual({ century: 2, era: "CE" });
    expect(centuryOf(117)).toEqual({ century: 2, era: "CE" });
    expect(centuryOf(651)).toEqual({ century: 7, era: "CE" });
  });

  it("formats centuries", () => {
    expect(formatCentury(-549, "en")).toBe("6th century BCE");
    expect(formatCentury(117, "en")).toBe("2nd century CE");
    expect(formatCentury(224, "en")).toBe("3rd century CE");
    expect(formatCentury(1, "en")).toBe("1st century CE");
    expect(formatCentury(-1100, "en")).toBe("12th century BCE");
    expect(formatCentury(651, "fa")).toBe("سدهٔ ۷ م");
  });
});

describe("arithmetic and ordering across the BCE/CE boundary", () => {
  it("counts one year from 1 BCE to 1 CE", () => {
    expect(yearsBetween(fromEra(1, "BCE"), fromEra(1, "CE"))).toBe(1);
  });

  it("measures spans that cross the boundary", () => {
    // Augustus: 27 BCE – 14 CE = 40 years
    expect(yearsBetween(fromEra(27, "BCE"), fromEra(14, "CE"))).toBe(40);
    // Han: 206 BCE – 220 CE = 425 years
    expect(yearsBetween(fromEra(206, "BCE"), fromEra(220, "CE"))).toBe(425);
  });

  it("sorts BCE before CE, and larger BCE numbers first", () => {
    const shuffled = [fromEra(117, "CE"), fromEra(330, "BCE"), fromEra(1, "CE"), fromEra(550, "BCE"), fromEra(1, "BCE"), fromEra(651, "CE")];
    const sorted = [...shuffled].sort(compareYears).map((year) => formatYear(year, "en"));
    expect(sorted).toEqual(["550 BCE", "330 BCE", "1 BCE", "1 CE", "117 CE", "651 CE"]);
  });

  it("checks inclusive ranges", () => {
    expect(isYearInRange(-549, -549, -329)).toBe(true);
    expect(isYearInRange(-329, -549, -329)).toBe(true);
    expect(isYearInRange(-328, -549, -329)).toBe(false);
  });
});

describe("clampYear and parseYearParam", () => {
  it("keeps years inside the atlas", () => {
    expect(clampYear(-9000)).toBe(ATLAS_MIN_YEAR);
    expect(clampYear(2024)).toBe(ATLAS_MAX_YEAR);
    expect(clampYear(117.9)).toBe(117);
    expect(clampYear(Number.NaN)).toBe(ATLAS_MIN_YEAR);
  });

  it("reads a year from a URL parameter, falling back on bad input", () => {
    expect(parseYearParam("-549", 1)).toBe(-549);
    expect(parseYearParam("0", 1)).toBe(0);
    expect(parseYearParam("651", 1)).toBe(651);
    expect(parseYearParam(null, -329)).toBe(-329);
    expect(parseYearParam("", -329)).toBe(-329);
    expect(parseYearParam("abc", -329)).toBe(-329);
    expect(parseYearParam("12.5", -329)).toBe(-329);
    expect(parseYearParam("999999", -329)).toBe(-329);
    expect(parseYearParam("5000", 1)).toBe(ATLAS_MAX_YEAR);
  });
});
