import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { inngest } from "@/inngest/client";
export const appRouter = createTRPCRouter({
  createAi: baseProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .query(({ input }) => {
      console.log("trpc input", input);
      return {
        message: `You sent: ${input.value}`,
        raw: input, // optional, for debugging
      };
    }),
  invoke: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("mutation  log", input);

      const res = await inngest.send({
        name: "test",
        data: { value: input.text },
      });

      console.log("inngest res", res);
      return {
        message: `You are done.`,
        res,
      };
    }),
});
export type AppRouter = typeof appRouter;
