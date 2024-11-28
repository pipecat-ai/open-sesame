"use server";

import { getApiClient } from "@/lib/sesameApiClient";
import { Message } from "./messages";
import { ConversationModel, MessageWithConversationModel } from "./sesameApi";

const PAGE_SIZE = 20;

export async function getConversations(
  workspaceId: string,
  offset: number = 0,
) {
  if (!workspaceId) return [];
  try {
    const apiClient = await getApiClient();
    const response =
      await apiClient.api.getConversationsByWorkspaceApiConversationsWorkspaceIdGet(
        workspaceId,
        {
          limit: PAGE_SIZE,
          offset: offset * PAGE_SIZE,
        },
      );
    if (response.ok) {
      const json = await response.json();
      return json as ConversationModel[];
    } else if (response.status === 404) {
      return [];
    } else {
      throw new Error(
        `Error fetching conversations: ${response.status} ${response.statusText}`,
      );
    }
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function searchConversations(
  workspaceId: string,
  query: string,
  offset: number = 0,
) {
  try {
    const apiClient = await getApiClient();
    const response =
      await apiClient.api.searchMessagesApiConversationsWorkspaceIdSearchGet(
        workspaceId,
        {
          search_term: query,
          limit: PAGE_SIZE,
          offset: offset * PAGE_SIZE,
        },
      );
    if (response.ok) {
      const json = await response.json();
      return (json as MessageWithConversationModel[])
        .map(({ conversation }) => conversation)
        .filter(
          (conversation, idx, arr) =>
            arr.findIndex(
              (c) => c.conversation_id === conversation.conversation_id,
            ) === idx,
        );
    } else if (response.status === 404) {
      return [];
    } else {
      throw new Error(
        `Error fetching conversations: ${response.status} ${response.statusText}`,
      );
    }
  } catch (e) {
    console.error(e);
    return [];
  }
}

export interface ConversationAndMessages {
  conversation: ConversationModel;
  messages: Message[];
}

export async function getConversation(conversationId: string) {
  try {
    const apiClient = await getApiClient();
    const response =
      await apiClient.api.getConversationAndMessagesApiConversationsConversationIdMessagesGet(
        conversationId,
      );
    if (response.ok) {
      const json = await response.json();
      return json as ConversationAndMessages;
    } else if (response.status === 404) {
      return null;
    } else {
      throw new Error(
        `Error fetching conversation: ${response.status} ${response.statusText}`,
      );
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
