import { inngest } from "./client";
import {
  createAgent,
  createNetwork,
  createTool,
  gemini,
  openai,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantMessageContent } from "./utils";
import { z } from "zod";
import { PROMPT } from "@/constants";

const TestInngestFn = inngest.createFunction(
  { id: "test-fn" },
  { event: "test" },
  async ({ event, step }) => {
    const sandboxId = await step.run("getting sandbox id ", async () => {
      const sandbox = await Sandbox.create("vibe_next_js_01");
      return sandbox.sandboxId;
    });
    step.sleep("creating ai agent", "1s");
    const codeAgent = createAgent({
      name: "code agent",
      system: PROMPT,
      description: "An expert coding agent",
      model: gemini({
        model: "gemini-2.0-flash",
        apiKey: process.env.GEMNI_API_KEY,
      }),
      tools: [
        // Terminal tool
        createTool({
          name: "terminal",
          description: "Run shell commands in the sandbox terminal.",
          parameters: z.object({
            command: z.string().describe("The shell command to run"),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffer = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffer.stdout += data;
                  },
                  onStderr: (data) => {
                    buffer.stderr += data;
                  },
                });
                return { stdout: result.stdout, stderr: buffer.stderr };
              } catch (error) {
                return {
                  error: String(error),
                  stdout: buffer.stdout,
                  stderr: buffer.stderr,
                };
              }
            });
          },
        }),

        // File create/update
        createTool({
          name: "create_or_update_file",
          description: "Create or update files in the sandbox.",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string().describe("Path of the file"),
                content: z.string().describe("Content to write"),
              })
            ),
          }),
          handler: async ({ files }, { step, network }) => {
            return await step?.run("create_or_update_file", async () => {
              try {
                const updatedFiles: Record<string, string> = {};
                const sandbox = await getSandbox(sandboxId);

                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }

                // update state
                network.state.data.files = {
                  ...(network.state.data.files || {}),
                  ...updatedFiles,
                };

                return { updated: Object.keys(updatedFiles) };
              } catch (error) {
                return { error: String(error) };
              }
            });
          },
        }),

        // File read (FIXED ✅)
        createTool({
          name: "read_files",
          description: "Read one or more files from the sandbox.",
          parameters: z.object({
            files: z.array(
              z.string().describe("Path(s) of the file(s) to read")
            ),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("read_files", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents: Record<string, string> = {};
                for (const file of files) {
                  contents[file] = await sandbox.files.read(file);
                }
                return contents;
              } catch (error) {
                return { error: String(error) };
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText = lastAssistantMessageContent(
            result
          ) as string;
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      },
    });
    
    // creating the agent network
    const network = createNetwork({
      name: "code-agent-network",
      maxIter: 15,
      agents: [codeAgent],
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    step.sleep("generating the codes", "1s");
    const result = await network.run(event.data.value);

    const sandBoxUrl = await step.run("creating sandbox url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);

      return `https://${host}`;
    });

    return {
      url: sandBoxUrl,
      title: "Fragment",
      summary: result.state.data.summary,
      files: result.state.data.files,
    };
  }
);

export { TestInngestFn };
