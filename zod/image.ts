import { z } from "zod";

export const zodImageSchema = z.object({
  _id: z.string(),
  url: z.string(),
  dimensions: z.object({
    height: z.number(),
    width: z.number(),
    aspectRatio: z.number(),
  }),
});