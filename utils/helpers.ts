import {
  SortOption,
  SortOptionKey,
} from "@/app/dashboard/explore/_components/SortBy";
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

export const formatMarketDate = function (date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "short",
    day: "numeric",
  };

  const offset = 5; // Offset for EST timezone
  const dateParts = date.split("-").map((part) => +part);
  const dateObject = new Date(
    Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], offset)
  );
  
  const formattedDate = dateObject.toLocaleString("en-US", options);

  if (formattedDate === "Invalid Date") {
    return date;
  }

  return formattedDate;
};

export const formatMarketWithDateTime = function (date: string): string {
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric"
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  };

  const dateObject = new Date(date);

  const formattedDate = dateObject.toLocaleString("en-US", dateOptions);
  const formattedTime = dateObject.toLocaleString("en-US", timeOptions);

  if (formattedDate === "Invalid Date" || formattedTime === "Invalid Date") {
    return date;
  }

  return `${formattedDate} at ${formattedTime}`;
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