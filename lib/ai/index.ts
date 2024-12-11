import Anthropic from "@anthropic-ai/sdk";
import {
  LanguageModelV1,
  experimental_wrapLanguageModel as wrapLanguageModel,
} from "ai";

import { customMiddleware } from "./custom-middleware";
import { Message } from "@prisma/client";

const claude = (apiKey: string): LanguageModelV1 => {
  const client = new Anthropic({ apiKey });

  return {
    specificationVersion: "v1" as const,
    provider: "anthropic" as const,
    modelId: "claude-3-sonnet-20240229",
    defaultObjectGenerationMode: "json" as const,

    async complete(options: { messages: Message[] }) {
      const response = await client.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        messages: options.messages,
      });

      return {
        content: response.content[0].text,
        role: "assistant",
      };
    },
  };
};

export const claudeModel = () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set in environment variables");
  }

  return wrapLanguageModel({
    model: claude(process.env.ANTHROPIC_API_KEY),
    middleware: customMiddleware,
  });
};

// export const customModel = (apiIdentifier: string) => {
//   return wrapLanguageModel({
//     // model: openai(apiIdentifier),
//     model: Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
//     middleware: customMiddleware,
//   });
// };
