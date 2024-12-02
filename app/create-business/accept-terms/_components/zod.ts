import { z } from "zod";

export const zodUserInTerms = z.object({
  firstName: z.string(),
  lastName: z.string(),
  id: z.string(),
});

export type TUserInTerms = z.infer<typeof zodUserInTerms>;
