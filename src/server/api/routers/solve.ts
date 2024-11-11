import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateSolution } from "~/server/utils/generateSolution";

export const solveRouter = createTRPCRouter({
  solveRouter: publicProcedure
    .input(z.object({ mathProblems: z.string() }))
    .mutation(async ({ input }) => {
      const solution = await generateSolution(input.mathProblems);
      return { solution };
    }),
});
