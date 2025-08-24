import { inngest } from "@/inngest/client";

const invoke = async (name: string, data: Record<string, any>) => {
  await inngest.send({ name: "test-fn", data });
};

export { invoke };
