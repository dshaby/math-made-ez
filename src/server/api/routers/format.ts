import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { formatSolution } from "~/server/utils/formatSolution";

export const formatSolutionRouter = createTRPCRouter({
  formatSolution: publicProcedure
    .input(z.object({ solution: z.string() }))
    .query(async function* ({ input }) {
      for await (const chunk of formatSolution(input.solution)) {
        yield { formattedSolution: chunk };
      }
    }),
});
