"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import ChatMessage from "@/components/ChatMessage";
import emitter from "@/lib/eventEmitter";
import { LLMMessageRole } from "@/lib/llm";
import {
  addNewLinesBeforeCodeblocks,
  ImageContent,
  normalizeMessageText,
  TextContent,
  type Message,
} from "@/lib/messages";
import { WorkspaceStructuredData } from "@/lib/workspaces";
import { useRouter } from "next/navigation";
import {
  BotLLMTextData,
  BotTTSTextData,
  RTVIEvent,
  StorageItemStoredData,
  TranscriptData,
} from "realtime-ai";
import { useRTVIClient, useRTVIClientEvent } from "realtime-ai-react";
import { v4 as uuidv4 } from "uuid";

interface LiveMessage extends Message {
  final?: boolean;
}

interface Props {
  autoscroll: boolean;
  conversationId: string;
  isBotSpeaking?: boolean;
  messages: Message[];
  structuredWorkspace: WorkspaceStructuredData;
}

interface MessageChunk {
  createdAt?: Date;
  final: boolean;
  replace?: boolean;
  role: LLMMessageRole;
  text: string;
  updatedAt?: Date;
}

function getScrollableParent(element: HTMLElement | null) {
  while (element) {
    const style = window.getComputedStyle(element);
    if (
      (style.overflowY === "auto" || style.overflowY === "scroll") &&
      element.scrollHeight > element.clientHeight
    ) {
      return element;
    }
    element = element.parentElement;
  }
  return null; // or document as a fallback
}

export default function LiveMessages({
  autoscroll,
  conversationId,
  isBotSpeaking,
  messages,
  structuredWorkspace,
}: Props) {
  const { refresh } = useRouter();
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([]);

  const client = useRTVIClient();

  useEffect(() => {
    if (!client) return;
    client.params = {
      ...client.params,
      requestData: {
        conversation_id: conversationId,
      },
    };
  }, [client, conversationId]);

  const addMessageChunk = useCallback(
    ({
      createdAt = new Date(),
      final,
      replace = false,
      role,
      text,
      updatedAt = createdAt,
    }: MessageChunk) => {
      const createdAtIso = createdAt.toISOString();
      const updatedAtIso = updatedAt.toISOString();

      setLiveMessages((liveMessages) => {
        const matchingMessageIdx = liveMessages.findIndex(
          (m) => m.content.role === role && m.created_at === createdAtIso
        );
        const matchingMessage = liveMessages[matchingMessageIdx];

        const isSameMessage =
          matchingMessage?.final === final &&
          normalizeMessageText(matchingMessage) ===
            addNewLinesBeforeCodeblocks(text);

        if (isSameMessage) return liveMessages;

        if (!matchingMessage || matchingMessage?.final) {
          // Append new message
          const message: LiveMessage = {
            content: {
              content: text,
              role,
            },
            conversation_id: conversationId,
            created_at: createdAtIso,
            extra_metadata: {},
            final,
            message_id: uuidv4(),
            message_number: messages.length + liveMessages.length + 1,
            updated_at: updatedAtIso,
          };
          return [...liveMessages, message];
        }

        const updatedMessages = [...liveMessages];
        const prevText = normalizeMessageText(
          updatedMessages[matchingMessageIdx]
        );
        const updatedMessage: LiveMessage = {
          ...updatedMessages[matchingMessageIdx],
          content: {
            content: addNewLinesBeforeCodeblocks(
              replace ? text : prevText + text
            ),
            role,
          },
          final,
          updated_at: updatedAtIso,
        };

        return liveMessages
          .map((liveMessage, idx) =>
            idx === matchingMessageIdx ? updatedMessage : liveMessage
          )
          .filter((m, idx, arr) => {
            const normalizedText = normalizeMessageText(m);
            const isEmptyMessage =
              normalizedText.trim() === "" && idx < arr.length - 1;
            return !isEmptyMessage;
          });
      });
    },
    [conversationId, messages.length]
  );

  const firstBotResponseTime = useRef<Date>();
  const userStartedSpeakingTime = useRef<Date>();
  const userStoppedSpeakingTimeout = useRef<ReturnType<typeof setTimeout>>();

  const cleanupUserMessages = useCallback(() => {
    setLiveMessages((messages) => {
      return messages.filter((m) => {
        if (m.content.role !== "user") return true;
        const normalizedText = normalizeMessageText(m);
        return normalizedText.length > 0;
      });
    });
  }, []);

  const isTextResponse = useRef(false);

  const revalidateAndRefresh = useCallback(async () => {
    emitter.emit("updateSidebar");
    refresh();
  }, [refresh]);

  useRTVIClientEvent(
    RTVIEvent.BotLlmStarted,
    useCallback(() => {
      firstBotResponseTime.current = new Date();
      addMessageChunk({
        createdAt: firstBotResponseTime.current,
        final: false,
        role: "assistant",
        text: "",
      });
    }, [addMessageChunk])
  );

  useRTVIClientEvent(
    RTVIEvent.BotLlmText,
    useCallback(
      (text: BotLLMTextData) => {
        if (
          structuredWorkspace.tts.interactionMode !== "informational" &&
          !isTextResponse.current
        )
          return;
        if (firstBotResponseTime.current) {
          addMessageChunk({
            createdAt: firstBotResponseTime.current,
            final: false,
            role: "assistant",
            text: text.text,
            updatedAt: new Date(),
          });
        }
      },
      [addMessageChunk, structuredWorkspace.tts.interactionMode]
    )
  );

  useRTVIClientEvent(
    RTVIEvent.BotLlmStopped,
    useCallback(async () => {
      const textResponse = isTextResponse.current;
      isTextResponse.current = false;

      if (
        structuredWorkspace.tts.interactionMode !== "informational" &&
        !textResponse
      )
        return;

      if (firstBotResponseTime.current) {
        addMessageChunk({
          createdAt: firstBotResponseTime.current,
          final: true,
          role: "assistant",
          text: "",
          updatedAt: new Date(),
        });
        firstBotResponseTime.current = undefined;
        // TODO: Move to StorageItemStored handler, once that is emitted in text-mode
        setTimeout(revalidateAndRefresh, 2000);
      }
    }, [
      addMessageChunk,
      revalidateAndRefresh,
      structuredWorkspace.tts.interactionMode,
    ])
  );

  useRTVIClientEvent(
    RTVIEvent.BotStartedSpeaking,
    useCallback(() => {
      if (structuredWorkspace.tts.interactionMode !== "conversational") return;
      if (!firstBotResponseTime.current) {
        firstBotResponseTime.current = new Date();
      }
      addMessageChunk({
        createdAt: firstBotResponseTime.current,
        final: false,
        role: "assistant",
        text: "",
        updatedAt: new Date(),
      });
    }, [addMessageChunk, structuredWorkspace.tts.interactionMode])
  );

  useRTVIClientEvent(
    RTVIEvent.BotTtsText,
    useCallback(
      (text: BotTTSTextData) => {
        if (structuredWorkspace.tts.interactionMode !== "conversational")
          return;
        if (firstBotResponseTime.current) {
          addMessageChunk({
            createdAt: firstBotResponseTime.current,
            final: false,
            role: "assistant",
            text: " " + text.text,
            updatedAt: new Date(),
          });
        }
      },
      [addMessageChunk, structuredWorkspace.tts.interactionMode]
    )
  );

  useRTVIClientEvent(
    RTVIEvent.BotStoppedSpeaking,
    useCallback(() => {
      if (structuredWorkspace.tts.interactionMode !== "conversational") return;
      const createdAt = firstBotResponseTime.current;
      firstBotResponseTime.current = undefined;
      addMessageChunk({
        createdAt,
        final: true,
        role: "assistant",
        text: "",
        updatedAt: new Date(),
      });
    }, [addMessageChunk, structuredWorkspace.tts.interactionMode])
  );

  useRTVIClientEvent(
    RTVIEvent.UserStartedSpeaking,
    useCallback(() => {
      clearTimeout(userStoppedSpeakingTimeout.current);
      const now = userStartedSpeakingTime.current ?? new Date();
      userStartedSpeakingTime.current = now;
      addMessageChunk({
        createdAt: now,
        final: false,
        role: "user",
        text: "",
      });
    }, [addMessageChunk])
  );

  useRTVIClientEvent(
    RTVIEvent.UserStoppedSpeaking,
    useCallback(() => {
      userStoppedSpeakingTimeout.current = setTimeout(
        cleanupUserMessages,
        5000
      );
    }, [cleanupUserMessages])
  );

  useRTVIClientEvent(
    RTVIEvent.UserTranscript,
    useCallback(
      (data: TranscriptData) => {
        if (!userStartedSpeakingTime.current) {
          userStartedSpeakingTime.current = new Date();
        }
        addMessageChunk({
          createdAt: userStartedSpeakingTime.current,
          final: data.final,
          replace: true,
          role: "user" as LLMMessageRole,
          text: data.text,
          updatedAt: new Date(),
        });
        if (data.final) {
          userStartedSpeakingTime.current = undefined;
        }
      },
      [addMessageChunk]
    )
  );

  useRTVIClientEvent(RTVIEvent.Disconnected, revalidateAndRefresh);
  useRTVIClientEvent(
    RTVIEvent.StorageItemStored,
    useCallback(
      (data: StorageItemStoredData) => {
        const items = data.items as Array<Message["content"]>;
        if (items.some((i) => i.role === "assistant")) {
          revalidateAndRefresh();
        }
      },
      [revalidateAndRefresh]
    )
  );

  useEffect(() => {
    const handleUserTextMessage = (
      content: Array<TextContent | ImageContent>
    ) => {
      isTextResponse.current = true;
      const now = new Date();
      setLiveMessages((liveMessages) => {
        return [
          ...liveMessages,
          {
            content: {
              role: "user",
              content,
            },
            conversation_id: conversationId,
            created_at: now.toISOString(),
            extra_metadata: {},
            final: true,
            message_id: uuidv4(),
            message_number: messages.length + liveMessages.length + 1,
            updated_at: now.toISOString(),
          },
        ];
      });
    };
    emitter.on("userTextMessage", handleUserTextMessage);
    return () => {
      emitter.off("userTextMessage", handleUserTextMessage);
    };
  }, [addMessageChunk, conversationId, messages.length]);

  useLayoutEffect(() => {
    if (!autoscroll) return;
    const scroller = getScrollableParent(document.querySelector('main'));
    if (!scroller) return;
    scroller.scrollTo({
      behavior: "smooth",
      top: scroller.scrollHeight,
    });
  }, [autoscroll, liveMessages]);

  useEffect(() => {
    // Server-stored messages updated. Empty client state.
    setLiveMessages([]);
  }, [messages.length]);

  return liveMessages.map((m, i) => (
    <ChatMessage
      key={i}
      message={m}
      isSpeaking={
        i === liveMessages.length - 1 &&
        m.content.role === "assistant" &&
        isBotSpeaking &&
        !m.final
      }
    />
  ));
}
