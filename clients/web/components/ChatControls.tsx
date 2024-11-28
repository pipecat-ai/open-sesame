"use client";

import ExpiryCountdown from "@/components/ExpiryCountdown";
import { useToast } from "@/hooks/use-toast";
import emitter from "@/lib/eventEmitter";
import { ImageContent, Message } from "@/lib/messages";
import { cn } from "@/lib/utils";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ArrowUpIcon,
  Keyboard,
  LoaderCircle,
  LoaderCircleIcon,
  Maximize2Icon,
  MicIcon,
  MicOffIcon,
  Minimize2Icon,
  PaperclipIcon,
  Speech,
  TriangleAlertIcon,
  VideoIcon,
  VideoOffIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { RTVIClient, RTVIEvent, RTVIMessage } from "realtime-ai";
import {
  RTVIClientVideo,
  useRTVIClient,
  useRTVIClientEvent,
  useRTVIClientMediaTrack,
  useRTVIClientTransportState,
  VoiceVisualizer,
} from "realtime-ai-react";
import BotReadyAudio from "./BotReadyAudio";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const MAX_TOTAL_FILE_SIZE = 0.9 * 1e6; // 0.9 MB

function getHumanReadableFilesize(size: number) {
  if (size < 1e3) {
    return `${size} bytes`;
  } else if (size >= 1e3 && size < 1e6) {
    return `${(size / 1e3).toFixed(1)} KB`;
  } else {
    return `${(size / 1e6).toFixed(1)} MB`;
  }
}

interface Props {
  conversationId: string;
  onChangeMode?: (isVoiceMode: boolean) => void;
  vision?: boolean;
  workspaceId: string;
}

type VideoSize = "small" | "large";
type VideoPlacement = "left" | "right";

const ChatControls: React.FC<Props> = ({
  conversationId,
  onChangeMode,
  vision = false,
  workspaceId,
}) => {
  const { push, replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isVoiceMode, setIsVoiceMode] = useState(
    Boolean(searchParams.get("v")),
  ); // Track whether we're in voice mode
  const [isCamMuted, setIsCamMuted] = useState(!vision);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [videoSize, setVideoSize] = useState<VideoSize>("small");
  const [videoPlacement, setVideoPlacement] = useState<VideoPlacement>("right");
  const [, setSelectedImages] = useState<File[]>([]); // Track selected image files
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // Track preview URLs
  const [imageZoom, setImageZoom] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const [text, setText] = useState("");

  const rtviClient = useRTVIClient();
  const transportState = useRTVIClientTransportState();

  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState("");
  const [processingAction, setProcessingAction] = useState(false);

  const { toast } = useToast();

  const formRef = useRef<HTMLFormElement>(null);

  const handleTextKeyDown = (ev: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!formRef.current) return;
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();
      formRef.current.requestSubmit();
    }
  };

  const newConversationIdRef = useRef<string>("");

  const sendTextMessage = async (client: RTVIClient, message: string) => {
    const content: Message["content"]["content"] = [
      {
        type: "text",
        text: message,
      },
    ];
    if (previewUrls.length) {
      content.push(
        ...previewUrls.map<ImageContent>((url) => ({
          type: "image_url",
          image_url: {
            url,
          },
        })),
      );
      setPreviewUrls([]);
    }

    emitter.emit("userTextMessage", content);
    setText("");

    try {
      await client?.action({
        service: "llm",
        action: "append_to_messages",
        arguments: [
          {
            name: "messages",
            value: [
              {
                role: "user",
                content,
              },
            ],
          },
        ],
      });
    } catch (e) {
      if (e instanceof RTVIMessage) {
        console.error(e.data);
      }
    } finally {
      setProcessingAction(false);
    }
  };

  const createConversation = useCallback(
    async (voice: boolean) => {
      if (!rtviClient) return;

      emitter.emit("showChatMessages");

      const response = await fetch(`/api/create-conversation`, {
        method: "POST",
        body: JSON.stringify({
          workspace_id: workspaceId,
        }),
      });
      if (response.ok) {
        const json = await response.json();
        const newConversationId = json.conversation_id;

        newConversationIdRef.current = newConversationId;

        rtviClient.params.requestData = {
          ...(rtviClient.params.requestData ?? {}),
          conversation_id: newConversationId,
        };

        emitter.emit("updateSidebar");
        if (voice) {
          emitter.emit("showPageTransitionLoader");
          push(`/${workspaceId}/c/${newConversationId}?v=1`);
        }

        return newConversationId;
      }
      return null;
    },
    [push, rtviClient, workspaceId],
  );

  const invalidateAndRedirect = async (redirect: string) => {
    emitter.emit("updateSidebar");
    emitter.emit("showPageTransitionLoader");
    push(redirect);
  };

  const handleTextSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (processingAction || !rtviClient) return;

    setProcessingAction(true);

    const message = text.trim();

    if (conversationId === "new") {
      const newConversationId = await createConversation(false);
      const redirectPath = `/${workspaceId}/c/${newConversationId}?a=0`;
      rtviClient.addListener("botLlmStopped", () => {
        invalidateAndRedirect(redirectPath);
      });
    }
    sendTextMessage(rtviClient, message);
  };

  const handleConnect = useCallback(async () => {
    setIsVoiceMode(true);
    setIsMicMuted(false);
    rtviClient?.enableMic(true);
    if (vision) rtviClient?.enableCam(true);
    onChangeMode?.(true);
    setEndDate(new Date(Number(rtviClient?.transportExpiry) * 1000));
  }, [onChangeMode, rtviClient, vision]);

  const handleDisconnect = useCallback(() => {
    setIsVoiceMode(false);
    setIsMicMuted(false);
    rtviClient?.enableCam(false);
    rtviClient?.enableMic(false);
    onChangeMode?.(false);
    setEndDate(null);
  }, [onChangeMode, rtviClient]);

  useRTVIClientEvent(RTVIEvent.Connected, handleConnect);
  useRTVIClientEvent(RTVIEvent.Disconnected, handleDisconnect);

  const handleSwitchToTextMode = useCallback(() => {
    setIsVoiceMode(false);
    rtviClient?.disconnect();
  }, [rtviClient]);
  const handleSwitchToVoiceMode = useCallback(
    async (createIfNew = true) => {
      setIsVoiceMode(true);
      setError("");
      if (conversationId === "new" && createIfNew) {
        await createConversation(true);
        return;
      }
      try {
        await rtviClient?.connect();
      } catch (e) {
        console.error(e);
        setError("An error occurred while trying to start voice mode.");
        handleSwitchToTextMode();
      }
    },
    [conversationId, createConversation, handleSwitchToTextMode, rtviClient],
  );

  useEffect(() => {
    if (searchParams.get("v")) {
      handleSwitchToVoiceMode(false);
      replace(pathname);
    }
  }, [handleSwitchToVoiceMode, pathname, replace, searchParams]);

  useRTVIClientEvent(
    RTVIEvent.Error,
    useCallback(
      (message: RTVIMessage) => {
        console.error(message);
        setError("An error occurred during the voice session.");
        handleSwitchToTextMode();
      },
      [handleSwitchToTextMode],
    ),
  );

  // Toggle between cam mute and unmute in voice mode
  const handleCamToggle = useCallback(() => {
    setIsCamMuted((muted) => {
      rtviClient?.enableCam(muted);
      return !muted;
    });
  }, [rtviClient]);

  // Toggle between mic mute and unmute in voice mode
  const handleMicToggle = useCallback(() => {
    setIsMicMuted((muted) => {
      rtviClient?.enableMic(muted);
      return !muted;
    });
  }, [rtviClient]);

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length) {
      const allowedFiles: File[] = [];
      let total = 0;
      let notifyUser = false;
      files.forEach((file) => {
        if (total + file.size < MAX_TOTAL_FILE_SIZE) {
          allowedFiles.push(file);
          total += file.size;
        } else {
          notifyUser = true;
        }
      });
      setSelectedImages((images) => [...images, ...allowedFiles]);
      allowedFiles.forEach((f) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result?.toString();
          if (base64String) {
            setPreviewUrls((urls) => [...urls, base64String]);
          }
        };
        reader.readAsDataURL(f);
      });
      if (notifyUser) {
        toast({
          title: `Exceeded maximum allowed attachment size of ${getHumanReadableFilesize(
            MAX_TOTAL_FILE_SIZE,
          )}`,
        });
      }
    }
    event.target.value = "";
  };

  // Remove the selected image
  const handleRemoveImage = (idx: number) => {
    setSelectedImages((images) => {
      const newImages = [...images];
      newImages.splice(idx, 1);
      return newImages;
    });
    setPreviewUrls((urls) => {
      const newUrls = [...urls];
      newUrls.splice(idx, 1);
      return newUrls;
    });
  };

  useEffect(() => {
    if (previewUrls.length) return;
    setImageZoom(false);
    setStartIndex(0);
  }, [previewUrls.length]);

  const isReadyToSpeak = transportState === "ready";

  const feedbackClassName =
    "bg-gradient-to-t from-background absolute w-full bottom-full pt-4 pb-2 flex gap-2 items-center justify-center z-10";

  const ToggledCamIcon = isCamMuted ? VideoOffIcon : VideoIcon;
  const ToggledMicIcon = isMicMuted ? MicOffIcon : MicIcon;

  const camTrack = useRTVIClientMediaTrack("video", "local");

  return (
    <div className="relative w-full px-4">
      <BotReadyAudio active={isVoiceMode} />
      <Dialog open={imageZoom} onOpenChange={setImageZoom}>
        <DialogContent
          noCloseButton
          className="border-none bg-transparent shadow-none p-12 max-w-none w-[100dvw] max-h-[100dvh]"
        >
          <DialogTitle className="sr-only">Image preview</DialogTitle>
          <DialogClose className="top-4 right-2 absolute">
            <X className="text-white" />
          </DialogClose>
          <Carousel
            className={cn("relative h-[calc(100dvh-6rem)] w-100", {
              "mx-8": previewUrls.length > 1,
            })}
            opts={{
              loop: true,
              startIndex,
            }}
          >
            <CarouselContent className="items-center">
              {previewUrls.map((url, idx) => (
                <CarouselItem
                  key={idx}
                  className="relative h-[calc(100dvh-6rem)] overflow-hidden"
                >
                  <img
                    src={url}
                    alt="Selected Preview"
                    className="object-contain h-full w-full"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {previewUrls.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </DialogContent>
      </Dialog>

      {error ? (
        <div className={feedbackClassName}>
          <TriangleAlertIcon />
          <span>{error}</span>
        </div>
      ) : transportState === "authenticating" ||
        transportState === "connecting" ||
        transportState === "connected" ? (
        <div className={feedbackClassName}>
          <LoaderCircle className="animate-spin" />
          <span>Connecting…</span>
        </div>
      ) : transportState === "ready" ? (
        <div className={feedbackClassName}>
          <span>
            {isMicMuted
              ? "Tap to unmute"
              : processingAction
                ? "Thinking…"
                : "Listening"}
          </span>
        </div>
      ) : processingAction ? (
        <div className={feedbackClassName}>
          <LoaderCircle className="animate-spin" />
        </div>
      ) : null}

      <div className="bg-secondary rounded-3xl flex flex-col gap-1 p-1">
        {/* Image Preview (if an image is selected) */}
        {previewUrls.length > 0 && (
          <div className="relative w-full flex justify-start gap-2 mt-2 px-2">
            {previewUrls.map((url, idx) => (
              <div key={idx + url} className="relative inline-block">
                <Image
                  src={url}
                  alt="Selected Preview"
                  className="bg-muted cursor-zoom-in h-12 w-12 object-cover rounded-lg"
                  onClick={() => {
                    setStartIndex(idx);
                    setImageZoom(true);
                  }}
                  height={80}
                  width={80}
                />
                {/* Remove button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute -top-2 -right-2 bg-foreground text-background p-1 rounded-full focus:outline-none border-4 border-secondary"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground">
                      Remove image
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        )}

        <form
          ref={formRef}
          className="relative w-full rounded-3xl ps-4 pe-10"
          id="text-chat-form"
          onSubmit={handleTextSubmit}
        >
          <Textarea
            autoFocus
            className="!border-0 !border-none !shadow-none !outline-none !ring-0 text-base min-h-0 h-auto max-h-32 p-0 py-2 resize-none"
            onChange={(ev) => setText(ev.currentTarget.value)}
            onKeyDown={handleTextKeyDown}
            required
            placeholder="Type message here"
            value={text}
            rows={text.split("\n").length}
          />
          <Button
            className="absolute bg-background h-8 w-8 p-0 right-1 top-1/2 -translate-y-1/2 rounded-full"
            size="icon"
            variant="secondary"
            type="submit"
          >
            <ArrowUpIcon size={16} />
          </Button>
        </form>

        {/* Chat Controls */}
        <div className="flex items-end gap-3 w-full">
          {/* Image Button (File picker with camera support on mobile) */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full relative p-2 h-10 w-10 bg-transparent shadow-none"
                  size="icon"
                  variant="secondary"
                >
                  <PaperclipIcon />
                  {/* File input (visually hidden) */}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 opacity-0 file:cursor-pointer file:inset-0 file:absolute"
                    onChange={handleImageChange}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary text-secondary-foreground">
                Attach images
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {vision && isVoiceMode && !isCamMuted && (
            <div
              className={cn(
                "absolute z-20 bottom-full -translate-y-2 max-w-40 bg-secondary rounded-md aspect-video overflow-hidden transition-all",
                {
                  "max-w-80": videoSize === "large",
                  "left-0": videoPlacement === "left",
                  "right-0": videoPlacement === "right",
                },
              )}
            >
              <RTVIClientVideo
                participant="local"
                fit="cover"
                className="w-full h-full"
              />
              {!camTrack && (
                <div className="absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center">
                  <LoaderCircleIcon className="animate-spin" size={16} />
                </div>
              )}
              <Button
                className="absolute top-1 right-1"
                size="icon"
                variant="ghost"
                onClick={() =>
                  setVideoSize((vs) => (vs === "small" ? "large" : "small"))
                }
              >
                {videoSize === "small" ? (
                  <Maximize2Icon size={16} />
                ) : (
                  <Minimize2Icon size={16} />
                )}
              </Button>
              <Button
                className={cn("absolute bottom-1", {
                  "right-1": videoPlacement === "left",
                  "left-1": videoPlacement === "right",
                })}
                size="icon"
                variant="ghost"
                onClick={() =>
                  setVideoPlacement((vp) => (vp === "left" ? "right" : "left"))
                }
              >
                {videoPlacement === "left" ? (
                  <ArrowRightToLineIcon size={16} />
                ) : (
                  <ArrowLeftToLineIcon size={16} />
                )}
              </Button>
            </div>
          )}

          <div className="flex-grow flex items-end gap-3 relative">
            {isVoiceMode && (
              <div className="w-full flex items-center gap-2 p-1 pe-4">
                {/* Cam button for mute/unmute */}
                {vision && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={handleCamToggle}
                          className={cn(
                            "p-1 rounded-full focus:outline-none hover:bg-secondary",
                            {
                              "bg-destructive hover:bg-destructive text-destructive-foreground":
                                isCamMuted,
                            },
                          )}
                        >
                          <ToggledCamIcon className="w-6 h-6 m-auto" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-secondary text-secondary-foreground">
                        {isCamMuted ? "Turn on camera" : "Turn off camera"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {/* Mic button for mute/unmute */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={handleMicToggle}
                        className={cn(
                          "p-1 rounded-full focus:outline-none hover:bg-secondary",
                          {
                            "bg-destructive hover:bg-destructive text-destructive-foreground":
                              isMicMuted,
                          },
                        )}
                      >
                        <ToggledMicIcon className="w-6 h-6 m-auto" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary text-secondary-foreground">
                      {isMicMuted ? "Unmute microphone" : "Mute microphone"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Voice Indicator when microphone is active and not muted */}
                {isReadyToSpeak && !isMicMuted ? (
                  <VoiceVisualizer
                    backgroundColor="transparent"
                    barColor={isMicMuted ? "gray" : "black"}
                    barGap={4}
                    barWidth={8}
                    barMaxHeight={20}
                    participantType="local"
                  />
                ) : isMicMuted ? null : (
                  <div className="w-5 h-5 animate-spin">
                    <LoaderCircle size={20} />
                  </div>
                )}

                {endDate && (
                  <div className="ml-auto justify-self-end">
                    <span className="select-none tabular-nums font-mono">
                      <ExpiryCountdown endDate={endDate} />
                    </span>
                  </div>
                )}
              </div>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={
                      isVoiceMode
                        ? handleSwitchToTextMode
                        : () => handleSwitchToVoiceMode()
                    }
                    type="button"
                    className="bg-background relative flex gap-2 p-2 rounded-full border border-secondary focus:outline-none ml-auto"
                  >
                    <span
                      className={cn(
                        "rounded-full bg-foreground w-8 h-8 absolute left-1 top-1 transition-transform",
                        {
                          "translate-x-8": isVoiceMode,
                        },
                      )}
                    />
                    <Keyboard
                      className={cn(
                        "w-6 h-6 z-10 text-background transition-colors",
                        {
                          "text-muted-foreground": isVoiceMode,
                        },
                      )}
                    />
                    <Speech
                      className={cn(
                        "w-6 h-6 z-10 text-background transition-colors",
                        {
                          "text-muted-foreground": !isVoiceMode,
                        },
                      )}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  className="bg-secondary text-secondary-foreground"
                >
                  Toggle conversation mode
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatControls;
