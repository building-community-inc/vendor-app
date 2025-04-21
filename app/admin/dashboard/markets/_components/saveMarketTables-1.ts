"use server"
import { FormState } from "@/app/types";
import { sanityClient } from "@/sanity/lib/client";
import { defineQuery, Mutation } from "next-sanity";
import { z } from "zod";

const MARKET_UPDATE_QUERY =
  defineQuery(`*[_type == "market" && _id == $marketId] [0] {
  vendors,
  daysWithTables
}`);


export const saveMarketTablesUpdateAction = async (
  formState: FormState,
  formData: FormData
): Promise<FormState> => {
  console.log("Saving market tables update action");

  const marketId = formData.get("marketId") as string;
  const vendorIds = formData.getAll("vendorId") as string[];
  const dates = formData.getAll("date") as string[];
  const oldTableIds = formData.getAll("oldTableId") as string[];
  const types = formData.getAll("type") as string[];
  const newTableIds = formData.getAll("newTableId") as string[];

  const changesToValidate = vendorIds.map((vendorId, index) => ({
    vendorId: vendorId,
    date: dates[index],
    oldTableId: oldTableIds[index],
    type: types[index],
    newTableId: types[index] === "update" ? newTableIds[index] : undefined, // Only include if type is update
  }));

  if (!marketId || marketId.length === 0) {
    return {
      errors: ["Market ID is required"],
      success: false,
    };
  }

  const {
    success,
    error,
    data: changes,
  } = changesSchema.safeParse(changesToValidate);
  if (!success) {
    console.log("Form validation failed", { error });
    return {
      errors: error.errors.map((err) => err.message),
      success: false,
    };
  }

  console.log({changes})
  try {
    const market = await sanityClient.fetch(MARKET_UPDATE_QUERY, { marketId });
    // const originalMarket = JSON.parse(JSON.stringify(market))
    console.log({market})
    const patches: Mutation<Record<string, unknown>>[] &
      Mutation<Record<string, unknown>>[] = [];
    if (!market) {
      return {
        errors: ["Market not found"],
        success: false,
      };
    }


    for (const change of changes) {
      if (change.type === "update") {
        // find the day to update

        const day = market.daysWithTables?.find(day => day.date === change.date)

        console.log({day})

        if (!day || !day.tables) {
          return {
            success: false,
            errors: ["date not found in market"]
          }
        }

        const oldTable = day.tables.find(table => table.table?.id === change.oldTableId);

        const newTable = day.tables.find(table => table.table?.id === change.newTableId);

        const bookingRef = oldTable?.booked;

        if (!oldTable || !bookingRef || !newTable) {
          console.log({oldTable, bookingRef, newTable})
          return {
            success: false,
            errors: ["table not found"]
          }
        }

        console.log("before: ", {oldTable, newTable})
        
        oldTable.booked = undefined;

        newTable.booked = bookingRef;

        day.tables = day.tables.map(table => {
          if (table._key === oldTable._key) {
            return oldTable;
          }
          if (table._key === newTable._key) {
            return newTable;
          }
          return table;
        })

        const updatedDaysWithTables = market.daysWithTables?.map(dayItem => {
          if (dayItem.date === change.date) {
            const updatedTables = dayItem.tables?.map(table => {
              if (table._key === oldTable._key) {
                return oldTable;
              }
              if (table._key === newTable._key) {
                return newTable;
              }
              return table;
            });
            return { ...dayItem, tables: updatedTables };
          }
          return dayItem;
        });
        
        const updatedMarket = { ...market, daysWithTables: updatedDaysWithTables };
        console.log({ updatedMarket });
        
        // const areEqual = areMarketsEqual(originalMarket, updatedMarket);
        // console.log({ areEqual });
        
        
        console.log("after: ", { oldTable, newTable})

      }
      if (change.type === "delete") {

      }
    }
    return {
      success: false,
      errors: ["not implemented"]
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      errors: ["something went wrong"]
    }
  }
}


    const updateChangeSchema = z.object({
      type: z.literal("update"),
      vendorId: z.string().min(1, "Vendor ID is required"),
      date: z.string().min(1, "Date is required"),
      oldTableId: z.string().min(1, "Old Table ID is required"),
      newTableId: z.string().min(1, "New Table ID is required"),
    });
    
    const deleteChangeSchema = z.object({
      type: z.literal("delete"),
      vendorId: z.string().min(1, "Vendor ID is required"),
      date: z.string().min(1, "Date is required"),
      oldTableId: z.string().min(1, "Old Table ID is required"),
    });
    
    const changeSchema = z.discriminatedUnion("type", [
      updateChangeSchema,
      deleteChangeSchema,
    ]);
    
    const changesSchema = z
      .array(changeSchema)
      .min(1, "At least one change is required");
    

      function areMarketsEqual(market1: any, market2: any): boolean {
        // Helper function to deeply compare two values
        function deepCompare(val1: any, val2: any): boolean {
          if (val1 === val2) {
            return true;
          }
      
          if (
            typeof val1 !== 'object' ||
            val1 === null ||
            typeof val2 !== 'object' ||
            val2 === null
          ) {
            return false;
          }
      
          const keys1 = Object.keys(val1);
          const keys2 = Object.keys(val2);
      
          if (keys1.length !== keys2.length) {
            return false;
          }
      
          for (const key of keys1) {
            if (!keys2.includes(key) || !deepCompare(val1[key], val2[key])) {
              return false;
            }
          }
      
          return true;
        }
      
        // Compare top-level keys of the markets
        const keys1 = Object.keys(market1);
        const keys2 = Object.keys(market2);
      
        if (keys1.length !== keys2.length) {
          return false;
        }
      
        for (const key of keys1) {
          if (!keys2.includes(key) || !deepCompare(market1[key], market2[key])) {
            return false;
          }
        }
      
        return true;
      }