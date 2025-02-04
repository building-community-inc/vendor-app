import {
  SortOption,
  SortOptionKey,
} from "@/app/dashboard/explore/_components/SortBy";
import { DateTime } from "luxon";
import { ReadonlyURLSearchParams } from "next/navigation";

export function areDatesSame(date1: string, date2: string): boolean {
  // Ensure dates are in the format "YYYY-MM-DD"
  if (!date1 || !date2 || date1.length < 1 || date2.length < 1) return false;
  const [year1, month1, day1] = date1.split('-');
  const formattedDate1 = `${year1}-${month1.padStart(2, '0')}-${day1.padStart(2, '0')}`;

  const [year2, month2, day2] = date2.split('-');
  const formattedDate2 = `${year2}-${month2.padStart(2, '0')}-${day2.padStart(2, '0')}`;

  const dateTime1 = DateTime.fromISO(formattedDate1).setZone('utc');
  const dateTime2 = DateTime.fromISO(formattedDate2).setZone('utc');

  return dateTime1.hasSame(dateTime2, 'day');
}

export const tablePriceTodisplay = (minPrice: number, maxPrice: number) =>
  minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;

export const camelCaseToTitleCase = function (input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between lowercase and uppercase letters
    .replace(/([a-zA-Z])(\d)/g, "$1 $2") // Add space before a number
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const dateArrayToDisplayableText = function (dates: string[]): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  const offset = 5; // Offset for EST timezone
  const startParts = dates[0].split("-").map((part) => +part);
  const endParts = dates[dates.length - 1].split("-").map((part) => +part);

  const startDate = new Date(
    Date.UTC(startParts[0], startParts[1] - 1, startParts[2], offset)
  );
  const endDate = new Date(
    Date.UTC(endParts[0], endParts[1] - 1, endParts[2], offset)
  );

  const formattedStartDate = startDate.toLocaleString("en-US", {
    ...options,
    timeZone: "America/New_York",
  });
  const formattedEndDate = endDate.toLocaleString("en-US", {
    ...options,
    timeZone: "America/New_York",
  });

  return `${formattedStartDate} - ${formattedEndDate}`;
};


export const createDateString = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};
type SortOptionsType = { [K in SortOptionKey]: SortOption };

export const getKeyByValue = (
  value: SortOption,
  sortOptions: SortOptionsType
): SortOptionKey | undefined => {
  for (const [key, val] of Object.entries(sortOptions)) {
    if (val === value) {
      return key as SortOptionKey;
    }
  }
};


export function formatDateStringToMMMDDYYYY(dateStr: string): string {
  // Create a Date object from the date string
  const date = new Date(dateStr);

  // Format the date
  const formattedDate = date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return formattedDate;
}


export const buildOrderUrl = (localUrl: string, paymentIntentId: string) => {
  return `${localUrl}/dashboard/checkout/success?payment_intent=${paymentIntentId}`
};


export const formatDateWLuxon = function (dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const newDate = DateTime.fromISO(formattedDate, { zone: 'America/Toronto' }).startOf('day');
  return newDate.toFormat('EEE, MMM d, yyyy');
}



export function formatDateString(dateString: string, timeZone: string = 'America/Toronto'): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const date = DateTime.fromISO(formattedDate, { zone: timeZone }).startOf('day');
  return date.toFormat('EEE, MMM d, yyyy');
}

export function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
  let timeout: NodeJS.Timeout | null;
  return (...args: Parameters<F>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  }
}


export const isMarketOpen = (lastDayToBook: string | null | undefined): boolean => {
  const today = DateTime.now().toISODate();
  if (!lastDayToBook) return true;

  const [year, month, day] = lastDayToBook.split('-').map(Number);
  const formattedDate = year && month && day && `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const lastBookingDate = formattedDate && DateTime.fromISO(formattedDate).toISODate();

  return lastBookingDate ? lastBookingDate >= today : true;
};

export const lessThan7DaysToBook = (lastDayToBook: string | null | undefined): boolean => {
  
  if (!lastDayToBook) return false;

  const [year, month, day] = lastDayToBook.split('-').map(Number);
  const formattedDate = year && month && day && `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const lastBookingDate = formattedDate && DateTime.fromISO(formattedDate).toISODate();
  const today = DateTime.now().toISODate();
  const sevenDaysFromNow = DateTime.now().plus({ days: 7 }).toISODate();

  return lastBookingDate ? lastBookingDate >= today && lastBookingDate <= sevenDaysFromNow : false;
};