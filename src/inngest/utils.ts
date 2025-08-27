import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";
const getSandbox = async (id: string) => {
  const sandbox = await Sandbox.connect(id);
  return sandbox;
};

const lastAssistantMessageContent = (result: AgentResult) => {
  const lastMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );

  const message = result.output[lastMessageIndex] as TextMessage | undefined;

  return message?.content;
  // ? message.content === "string"
  //   ? message.content
  //   : message.content.map((c) => c.text).join("")
  // : undefined;
};

export { getSandbox, lastAssistantMessageContent };
