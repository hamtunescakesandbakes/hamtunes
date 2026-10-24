/**
 * Dynamic Date & Business Time Management for Hamtunes Cakes & Bakes
 * Enforces Africa/Lagos timezone for all date calculations.
 */

export const LAGOS_TIMEZONE = "Africa/Lagos";

/**
 * Confirmed Business Start Date: October 2010.
 * In October 2026, Hamtunes completes 16 full years of baking mastery.
 * On October 1, 2027, this automatically advances to 17 years without redeployment.
 */
export const DEFAULT_BUSINESS_START_DATE = "2010-10-01";

export interface BakingExperience {
  years: number;
  yearsPlus: string;
  badge: string;
  short: string;
  tagline: string;
  description: string;
  experienceLabel: string;
  anniversaryDate: string;
}

/**
 * Calculates completed years of baking experience dynamically using Lagos time.
 * Automatically increments on the business anniversary each year.
 */
export function getBakingExperience(
  currentDate?: Date,
  startDateStr: string = DEFAULT_BUSINESS_START_DATE
): BakingExperience {
  const now = currentDate || new Date();

  // Extract year, month, day in Africa/Lagos timezone
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: LAGOS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [nowYear, nowMonth, nowDay] = formatter
    .format(now)
    .split("-")
    .map(Number);

  const [startYear, startMonth, startDay] = startDateStr
    .split("-")
    .map(Number);

  let years = nowYear - startYear;

  // If anniversary date has not yet been reached in current year, subtract 1
  if (
    nowMonth < startMonth ||
    (nowMonth === startMonth && nowDay < startDay)
  ) {
    years--;
  }

  const safeYears = Math.max(1, years);

  return {
    years: safeYears,
    yearsPlus: `${safeYears}+`,
    badge: `${safeYears} Years of Nigerian Baking Mastery`,
    short: `${safeYears} Yrs Craft`,
    tagline: `${safeYears} Years of Baking Excellence`,
    description: `${safeYears} years of baking mastery`,
    experienceLabel: `${safeYears}+ Years of Baking Experience`,
    anniversaryDate: startDateStr,
  };
}

/**
 * Returns the current calendar year in the Africa/Lagos timezone.
 * Updates dynamically on January 1 every year.
 */
export function getCurrentLagosYear(date?: Date): number {
  const now = date || new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: LAGOS_TIMEZONE,
    year: "numeric",
  });
  return parseInt(formatter.format(now), 10);
}

/**
 * Returns formatted copyright string: "© [YEAR] Hamtunes Cakes & Bakes. All rights reserved."
 */
export function getCopyrightNotice(date?: Date): string {
  const year = getCurrentLagosYear(date);
  return `© ${year} Hamtunes Cakes & Bakes. All rights reserved.`;
}

/**
 * Returns current date string in YYYY-MM-DD for Lagos.
 */
export function getLagosDateString(date?: Date): string {
  const now = date || new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: LAGOS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

/**
 * Returns human-readable Month & Year in Lagos (e.g., "October 2026").
 */
export function formatLagosMonthYear(date?: Date): string {
  const now = date || new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: LAGOS_TIMEZONE,
    month: "long",
    year: "numeric",
  });
  return formatter.format(now);
}

/**
 * Returns the minimum selectable order date (e.g. at least 2 days notice for custom cakes).
 */
export function getMinOrderDate(daysInAdvance: number = 2): string {
  const now = new Date();
  now.setDate(now.getDate() + daysInAdvance);
  return getLagosDateString(now);
}
