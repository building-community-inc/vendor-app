import { z } from "zod";

const zodDaySchema = z.string();

export const zodMarketFormSchema = z.object({
  name: z.string().min(1, "Name of the Market is required"),
  description: z.string().min(1, "Description of the Market is required"),
  price: z.string().min(1, "Price per day is required"),
  dates: z.array(zodDaySchema).min(1, "At least one day is required"),
  marketCover: z
    .string()
    .optional()
    .transform((refId) => ({ _type: "image", asset: { _ref: refId } })),
  venue: z
    .object({
      _ref: z.string(),
    })
    .optional(),
});

export const sanityZodMarketFormSchema = zodMarketFormSchema.merge(
  z.object({
    _type: z.literal("market"),
    _id: z.string().optional(),
  })
);

export type TMarketFormSchema = z.infer<typeof zodMarketFormSchema>;
