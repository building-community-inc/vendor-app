import { z } from "zod";

export type FormState =
  | {
      success: boolean;
      errors: z.ZodError<string> | string[] | null;
    }
  | {
      success: true;
      errors?: null;
    };

