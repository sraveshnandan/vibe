import { inngest } from "./client";

const TestInngestFn = inngest.createFunction(
  { id: "test-fn" },
  { event: "test" },
  async ({ event, step }) => {
    await step.sleep("wait a moment", "5s");
    return {
      message: `Hello`,
    };
  }
);

export { TestInngestFn };
