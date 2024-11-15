import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { applyOCR } from "~/server/utils/ocr";

export const applyOCRRouter = createTRPCRouter({
  applyOCR: publicProcedure
    .input(z.object({ image: z.string() }))
    .mutation(async ({ input }) => {
      const mathProblems = await applyOCR(input.image);
      return { mathProblems };
    }),
});
