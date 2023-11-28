export const camelCaseToTitleCase = function(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between lowercase and uppercase letters
    .replace(/([a-zA-Z])(\d)/g, "$1 $2") // Add space before a number
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


export const dateArrayToDisplayableText = function(dates: string[]): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZoneName: "short",
  };

  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[dates.length - 1]);

  const formattedStartDate = startDate.toLocaleString("en-US", options);
  const formattedEndDate = endDate.toLocaleString("en-US", options);

  return `${formattedStartDate} - ${formattedEndDate}`;
}

export const formatMarketDate = function(date: string): string {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };

  const dateObject = new Date(date);
  const formattedDate = dateObject.toLocaleString('en-US', options);

  return formattedDate;
}

