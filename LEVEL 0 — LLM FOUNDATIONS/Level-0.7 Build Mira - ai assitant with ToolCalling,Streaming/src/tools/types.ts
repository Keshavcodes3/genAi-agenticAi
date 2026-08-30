import type { z } from "zod";

export interface MiraTool<TInput extends z.ZodTypeAny = z.ZodTypeAny> {
    name: string;
    description: string;
    schema: TInput;
    execute(input: z.infer<TInput>): Promise<unknown>;
}