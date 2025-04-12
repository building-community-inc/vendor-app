import { getMarketById } from "@/sanity/queries/admin/markets/markets";
import MarketCard from "../_components/MarketCard";
import { areDatesSame, dateArrayToDisplayableText } from "@/utils/helpers";
import Image from "next/image";
import MarketDays from "../_components/MarketDays";
import { unstable_noStore as noStore } from 'next/cache';
import AllVendors from "./_components/AllVendors";
import Accordion from "@/app/_components/Accordion";

export type TMarketVendor = {
  _type: string;
  _ref: string;
  businessName: string;
  businessCategory: string;
  email: string;
  firstName: string;
  lastName: string;
  instagram?: string | null | undefined;
};
const Page = async (
  props: {
    params: Promise<{
      id: string;
    }>;
    searchParams: Promise<{
      [key: string]: string | undefined;
    }>;
  }
) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  noStore();
  const market = await getMarketById(params.id);

  if (!market) return <div>loading...</div>;

  const dateToDisplay = dateArrayToDisplayableText(market.dates);
  const marketBookings = market.daysWithTables?.map((day) => {
    return {
      date: day.date,
      tables: day.tables.filter((table) => table.booked !== null)
    };
  });


  const uniqueVendors: {
    [vendorId: string]: {
      dates?: {
        [date: string]: {
          tables: {
            id: string;
            price: number;
          }[]
        }
      };
      vendorInfo?: TMarketVendor;
    };
  } = {};

  marketBookings?.forEach(day => {
    day.tables.forEach(table => {
      if (table.booked) {
        // Ensure uniqueVendors[table.booked._ref] exists
        if (!uniqueVendors[table.booked._ref]) {
          uniqueVendors[table.booked._ref] = {};
        }

        // Assign vendor info if it doesn't already exist
        if (!uniqueVendors[table.booked._ref].vendorInfo) {
          uniqueVendors[table.booked._ref].vendorInfo = table.booked; // Assuming table.booked holds the vendor info
        }

        // Ensure uniqueVendors[table.booked._ref].dates exists
        if (!uniqueVendors[table.booked._ref].dates) {
          uniqueVendors[table.booked._ref].dates = {};
        }

        // Ensure uniqueVendors[table.booked._ref].dates[day.date] exists
        if (uniqueVendors[table.booked._ref].dates?.[day.date] === undefined) {
          uniqueVendors[table.booked._ref].dates![day.date] = { tables: [] };
        }

        uniqueVendors[table.booked._ref].dates?.[day.date]?.tables?.push(table.table);
      }
    });
  });

  const uniqueVendorsArray: TMarketVendor[] = Object.values(uniqueVendors)
    .map(vendor => vendor.vendorInfo)
    .filter((vendor): vendor is TMarketVendor => vendor !== undefined);


  const selectedDay = searchParams.selectedDay || null;

  const newVendorsForSelectedDay: {
    vendor: TMarketVendor;
    datesBooked: {
      date: string; // Ensure we handle date correctly here
      tableId: string;
    }[];
  }[] = Object.values(uniqueVendors)
    .filter(vendor => {
      // Ensure selectedDay is not null and vendor has the selected day in their dates
      return selectedDay !== null && vendor.dates?.[selectedDay] !== undefined && vendor.vendorInfo !== undefined;
    })
    .map(vendor => {
      // Extract the tables for the selected day (if valid)
      const tablesForSelectedDay = vendor.dates?.[selectedDay as string]?.tables || [];

      return {
        vendor: vendor.vendorInfo!, // Non-null assertion since we already checked vendorInfo in filter
        datesBooked: tablesForSelectedDay
          .filter(table => selectedDay !== null && selectedDay !== undefined) // Ensure selectedDay is valid
          .map(table => ({
            date: selectedDay as string, // Safely assert selectedDay as string here
            tableId: table.id, // Assuming each table has an 'id' field
          }))
      };
    })
    .filter(vendor => {
      // Ensure datesBooked only contains valid date strings
      return vendor.datesBooked.every(item => item.date !== null && item.date !== undefined);
    });

  const dayInfo = market.daysWithTables?.find(day => areDatesSame(day.date, selectedDay || ""));

  const availableTablesForDay = dayInfo?.tables

  
  return (
    <main className="py-14 px-5 w-full flex flex-col gap-8 max-w-3xl mx-auto">
      <h1 className="font-bold text-xl">{market?.name}</h1>
      <MarketCard market={market} dateToDisplay={dateToDisplay} withOptions />
      {market.venue.venueMap && (
        <Accordion
          closedText="View Venue Map"
          openedText="Hide Venue Map"
          initialHeight={0}
        >
          <Image
            src={market.venue.venueMap.url}
            alt={market.venue.title}
            width={500}
            height={500}
            className="w-full mx-auto"
          />
        </Accordion>
      )}
      <MarketDays
        availableTablesForDay={availableTablesForDay}
        dates={market.dates}
        vendorsForSelectedDay={newVendorsForSelectedDay || []}
        marketId={market._id}
        selectedDay={selectedDay}
        marketName={market.name}
        cancelled={market.cancelled}
      />
      {/* {!market.cancelled && (
        <CancelMarketButton marketId={market._id} />
      )} */}
      <Accordion
        closedText="View Vendor List"
        openedText="Hide Vendor List"
        initialHeight={0}
      >
        <AllVendors vendors={uniqueVendorsArray} />
      </Accordion>
    </main>
  );
};

export default Page;

