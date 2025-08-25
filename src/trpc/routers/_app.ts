import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { inngest } from "@/inngest/client";
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        value: z.string().optional(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello `,
      };
    }),
  createAi: baseProcedure
    .input(
      z.object({
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log(input);
      const res = await inngest.send({
        name: "test",
        data: {
          value: input.name,
        },
      });
      return { message: `Hi ${input.name}` };
    }),
});
export type AppRouter = typeof appRouter;
