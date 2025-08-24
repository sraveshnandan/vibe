import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { inngest } from "@/inngest/client";
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string().optional(),
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
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const res = await inngest.send({
        name: "test-fn",
        data: {
          email: "sravesh@email.com",
        },
      });
      console.log(res);
      return { message: `Hi ${input.name}` };
    }),
});
export type AppRouter = typeof appRouter;
