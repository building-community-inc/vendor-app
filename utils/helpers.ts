import {
  SortOption,
  SortOptionKey,
} from "@/app/dashboard/explore/_components/SortBy";
import { DateTime } from "luxon";
import { ReadonlyURLSearchParams } from "next/navigation";

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

export const formatMarketDate = function (date: string | Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Toronto"
  };

  const dateObject = new Date(date);
  const formattedDate = dateObject.toLocaleString("en-US", options);

  return formattedDate;
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