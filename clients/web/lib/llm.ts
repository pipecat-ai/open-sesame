export type LLMProvider =
  | "anthropic"
  | "together"
  | "groq"
  | "openai"
  | "google";

export type LLMMessageRole = "system" | "user" | "assistant";

export interface LLMModel {
  service: LLMProvider;
  model: string;
  label: string;
}

const llmModels: LLMModel[] = [
  // Anthropic
  {
    service: "anthropic",
    model: "claude-3-5-sonnet-20241022",
    label: "Claude 3.5 Sonnet (2024-10-22)",
  },
  {
    service: "anthropic",
    model: "claude-3-5-sonnet-20240620",
    label: "Claude 3.5 Sonnet (2024-06-20)",
  },
  {
    service: "anthropic",
    model: "claude-3-5-sonnet-latest",
    label: "Claude 3.5 Sonnet (Latest)",
  },
  {
    service: "anthropic",
    model: "claude-3-5-haiku-20241022",
    label: "Claude 3.5 Haiku (2024-10-22)",
  },
  {
    service: "anthropic",
    model: "claude-3-5-haiku-latest",
    label: "Claude 3.5 Haiku (Latest)",
  },
  // Together AI
  {
    service: "together",
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    label: "Llama 3.1 8B",
  },
  {
    service: "together",
    model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    label: "Llama 3.1 70B",
  },
  {
    service: "together",
    model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
    label: "Llama 3.1 405B",
  },
  {
    service: "together",
    model: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
    label: "Llama 3.2 3B",
  },
  {
    service: "together",
    model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
    label: "Llama 3.2 11B",
  },
  {
    service: "together",
    model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
    label: "Llama 3.2 90B",
  },
  // Groq
  {
    service: "groq",
    model: "llama-3.1-8b-instant",
    label: "Llama 3.1 8B",
  },
  {
    service: "groq",
    model: "llama-3.1-70b-versatile",
    label: "Llama 3.1 70B",
  },
  // OpenAI
  {
    service: "openai",
    model: "gpt-4o",
    label: "gpt-4o",
  },
  {
    service: "openai",
    model: "gpt-4o-mini",
    label: "gpt-4o mini",
  },
  // Google
  {
    service: "google",
    model: "gemini-1.5-flash",
    label: "Gemini 1.5 Flash",
  },
  {
    service: "google",
    model: "gemini-1.5-pro",
    label: "Gemini 1.5 Pro",
  },
];

export const defaultModel = llmModels[0];

export function getLLMModel(model: string) {
  return llmModels.find((m) => m.model === model);
}

export function getLLMModelsByService(service: string) {
  return llmModels.filter((m) => m.service === service);
}
