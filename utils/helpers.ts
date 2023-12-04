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
  // console.log({dates})
  const offset = 5; // Offset for EST timezone
const startDate = new Date(
  Date.UTC(
    +dates[0].slice(0, 4),
    +dates[0].slice(5, 7) - 1,
    +dates[0].slice(8, 10),
    offset
  )
);
const endDate = new Date(
  Date.UTC(
    +dates[dates.length - 1].slice(0, 4),
    +dates[dates.length - 1].slice(5, 7) - 1,
    +dates[dates.length - 1].slice(8, 10),
    offset
  )
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

  const dateObject = new Date(date);
  const formattedDate = dateObject.toLocaleString("en-US", options);

  return formattedDate;
};

export const createDateString = (date: Date): string => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
