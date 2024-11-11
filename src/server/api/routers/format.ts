import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { formatSolution } from "~/server/utils/formatSolution";

export const formatSolutionRouter = createTRPCRouter({
  formatSolution: publicProcedure
    .input(z.object({ solution: z.string() }))
    .mutation(async ({ input }) => {
      const formattedSolution = await formatSolution(input.solution);
      return { formattedSolution };
    }),
});
