import { TSanityMarket } from "@/sanity/queries/admin/markets/zods";

export const exploreSorts: { [key: string]: (markets: TSanityMarket[]) => void } = {
  date_upcoming: (markets: TSanityMarket[]) => {
    markets.sort((a, b) => {
      const nextADate = a.dates.find((date) => new Date(date) >= new Date());
      const nextBDate = b.dates.find((date) => new Date(date) >= new Date());
      if (!nextADate || !nextBDate) {
        return 0;
      }

      return new Date(nextADate).getTime() - new Date(nextBDate).getTime();
    });
  },
  price_highest: (markets: TSanityMarket[]) => {
    markets.sort((a, b) => {
      const pricesA =
        a.daysWithTables?.flatMap((day) =>
          day.tables.map((t) => t.table.price)
        ) || [];
      const pricesB =
        b.daysWithTables?.flatMap((day) =>
          day.tables.map((t) => t.table.price)
        ) || [];

      const maxPriceA = Math.max(...pricesA);
      const maxPriceB = Math.max(...pricesB);

      return maxPriceB - maxPriceA;
    });
  },
  price_lowest: (markets: TSanityMarket[]) => {
    markets.sort((a, b) => {
      const pricesA =
        a.daysWithTables?.flatMap((day) =>
          day.tables.map((t) => t.table.price)
        ) || [];
      const pricesB =
        b.daysWithTables?.flatMap((day) =>
          day.tables.map((t) => t.table.price)
        ) || [];

      const minPriceA = Math.min(...pricesA);
      const minPriceB = Math.min(...pricesB);
      return minPriceA - minPriceB;
    });
  },
  venue_az: (markets: TSanityMarket[]) => {
    markets.sort((a, b) => {
      if (a.venue.title < b.venue.title) {
        return -1;
      }
      if (a.venue.title > b.venue.title) {
        return 1;
      }
      return 0;
    });
  },
  venue_za: (markets: TSanityMarket[]) => {
    markets.sort((a, b) => {
      if (a.venue.title > b.venue.title) {
        return -1;
      }
      if (a.venue.title < b.venue.title) {
        return 1;
      }
      return 0;
    });
  },
};
