import { LLMMessageRole } from "./llm";
import { getApiClient } from "./sesameApiClient";

export interface TextContent {
  type: "text";
  text: string;
}

export interface ImageContent {
  type: "image_url";
  image_url: {
    url: string;
  };
}

export interface Message {
  created_at: string;
  content: {
    role: LLMMessageRole;
    content: string | Array<TextContent | ImageContent>;
  };
  conversation_id: string;
  extra_metadata: Record<string, unknown> | null;
  message_id: string;
  message_number: number;
  updated_at: string;
}

export const addNewLinesBeforeCodeblocks = (markdown: string) =>
  markdown.match(/([^\n])(\n```)/)
    ? markdown.replace(/([^\n])(\n```)/g, "$1\n$2")
    : markdown;

export function normalizeMessageText(message: Message) {
  return addNewLinesBeforeCodeblocks(
    Array.isArray(message.content.content)
      ? message.content.content
          .filter((tc) => tc.type === "text")
          .map((tc) => tc.text)
          .join(" ")
      : message.content.content,
  );
}

export function extractMessageImages(message: Message) {
  return Array.isArray(message.content.content)
    ? message.content.content
        .filter((t) => t.type === "image_url")
        .map((t) => t.image_url.url)
    : [];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    const apiClient = await getApiClient();
    const response =
      await apiClient.api.getConversationAndMessagesApiConversationsConversationIdMessagesGet(
        conversationId,
      );
    if (response.ok) {
      const json = await response.json();
      if (json.detail === "No messages found for this conversation") {
        return [];
      }
      return json.messages as Message[];
    } else {
      throw new Error(
        `Error fetching messages: ${response.status} ${response.statusText}`,
      );
    }
  } catch (e) {
    console.error(e);
    return [];
  }
}
