import { z } from "zod";

export const zodImageSchema = z.object({
  url: z.string(),
  dimensions: z.object({
    height: z.number(),
    width: z.number(),
    aspectRatio: z.number(),
  }),
});