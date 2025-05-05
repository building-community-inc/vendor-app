import { groq } from "next-sanity";
import { z } from "zod";

const tableSchema = z.object({
  booked: z
    .object({
      _type: z.string(),
      _ref: z.string(),
    })
    .optional()
    .nullable(),
  table: z.object({
    price: z.number(),
    id: z.string(),
  }),
  _key: z.string(),
});

const dayWithTablesSchema = z.object({
  date: z.string(),
  tables: z.array(tableSchema),
  _key: z.string(),
});

const bookedDateSchema = z.object({
  date: z.string(),
  _type: z.string().optional().nullable(),
  tableId: z.string(),
  _key: z.string(),
});

const ReferenceSchema = z.object({
  _ref: z.string(),
  _type: z.literal("reference"),
});

const vendorSchema = z.object({
  datesBooked: z.array(bookedDateSchema),
  vendor: ReferenceSchema,
  _key: z.string(),
});

export const updateMarketSchema = z.object({
  daysWithTables: z.array(dayWithTablesSchema),
  vendors: z.array(vendorSchema),
});

const PaymentRecordSchema = z.object({
  user: ReferenceSchema,
  market: ReferenceSchema,
  items: z.array(
    z.object({
      price: z.number(),
      tableId: z.string(),
      _key: z.string(),
      date: z.string(),
    })
  ),
  _id: z.string(),
});

export const PaymentRecordsSchema = z.array(PaymentRecordSchema);
export const updateMarketQuery = (
  marketId: string
) => groq`*[_type == "market" && _id == "${marketId}"] [0] {
  "daysWithTables": daysWithTables [] {
    date,
    "tables": tables [] {   
      "booked": booked {
        _type,
        _ref
      },
      "table": table {
        price,
        id
      },
      _key
    },
    _key 
  },   
  "vendors": vendors [] {   
    "datesBooked": datesBooked [] {
      date,
      _type,
      tableId,
      _key
    }, 
    "vendor": vendor {
      _ref,   
      _type
    },
    _key
  }
}`;

export const paymentRecordQuery = (
  vendorId: string,
  marketId: string
) => groq`*[_type == "paymentRecord" && user._ref == "${vendorId}" && market._ref == "${marketId}"] {
  "user": user {
    _ref,
    _type
  },
  "market": market {
    _ref,
    _type
  },
  "items": items [] {
    price,
    tableId,
    _key,
    date
  },
  _id
}`;
