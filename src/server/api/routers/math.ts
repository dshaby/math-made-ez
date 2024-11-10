import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { applyOCR } from "~/server/utils/ocr";
import { generateSolution } from "~/server/utils/generateSolution";

export const mathRouter = createTRPCRouter({
  analyzeImage: publicProcedure
    .input(z.object({ image: z.string() }))
    .mutation(async ({ input }) => {
      const mathProblems = await applyOCR(input.image);
      const solution = await generateSolution(mathProblems);

      return { mathProblems, solution };
    }),
});
