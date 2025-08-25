import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit";

const TestInngestFn = inngest.createFunction(
  { id: "test-fn" },
  { event: "test" },
  async ({ event, step }) => {
    step.sleep("starting ai agent", "1s");
    const summarizer = createAgent({
      name: "Summarizer",
      system: "You are an expert summarizer and summarize in two words.",
      model: gemini({
        model: "gemini-2.0-flash",
        apiKey: process.env.GEMNI_API_KEY,
      }),
    });

    step.sleep("summarizing the text", "10s");
    const { output } = await summarizer.run(
      `Summarize the following text ${event.data.value}`
    );
    console.log("ai res", output[0]);
    return {
      output,
    };
  }
);

export { TestInngestFn };
