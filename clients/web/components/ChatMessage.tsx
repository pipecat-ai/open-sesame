import ErrorBoundary from "@/components/ErrorBoundary";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  extractMessageImages,
  Message,
  normalizeMessageText,
} from "@/lib/messages";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  AlertTriangleIcon,
  Check,
  Copy,
  LoaderCircleIcon,
  TriangleAlertIcon,
} from "lucide-react";
import Markdown from "markdown-to-jsx";
import { Children, Fragment, useEffect, useState } from "react";
import { VoiceVisualizer } from "realtime-ai-react";
import CodeBlock from "./CodeBlock";
import Logo from "./svg/Logo";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Props {
  isSpeaking?: boolean;
  message: Message;
}

type CopyState = "idle" | "copied" | "error";

const contentForErrorBoundary = (content: unknown): React.ReactNode => {
  if (Array.isArray(content)) {
    return Children.map(content, contentForErrorBoundary);
  }
  if (typeof content === "object") return JSON.stringify(content, null, 2);
  return content?.toString() ?? "undefined";
};

export default function ChatMessage({ isSpeaking = false, message }: Props) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const normalizedText = normalizeMessageText(message);
  const images = extractMessageImages(message);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(normalizedText);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    } finally {
      setTimeout(() => {
        setCopyState("idle");
      }, 2000);
    }
  };

  const [selectedImage, setSelectedImage] = useState<string>("");

  const openModal = (imgUrl: string) => {
    setSelectedImage(imgUrl);
  };

  const closeModal = () => {
    setSelectedImage("");
  };

  return (
    <div
      className={cn("relative w-auto max-w-full overflow-x-hidden", {
        "ps-12": message.content.role === "assistant",
        "ps-16": message.content.role === "user",
      })}
    >
      {message.content.role === "assistant" && (
        <Avatar className="rounded-full border border-border absolute top-0 left-0 flex items-center justify-center">
          {isSpeaking ? (
            <VoiceVisualizer
              participantType="bot"
              backgroundColor="transparent"
              barColor="black"
              barGap={1}
              barMaxHeight={24}
              barWidth={3}
            />
          ) : (
            <Logo className="text-primary h-6 w-6 rotate-12" />
          )}
        </Avatar>
      )}
      <div
        className={cn("px-4 py-2 space-y-2", {
          "bg-secondary rounded-3xl": message.content.role === "user",
        })}
      >
        <ErrorBoundary
          fallback={
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center font-semibold">
                <AlertTriangleIcon size={16} />
                <p className="m-0">Unable to parse chat message</p>
              </div>
              <details>
                <summary className="font-semibold">
                  View original message
                </summary>
                <div className="whitespace-pre-wrap">
                  {contentForErrorBoundary(normalizedText)}
                </div>
              </details>
            </div>
          }
        >
          {normalizedText ? (
            <Markdown
              options={{
                wrapper: Fragment,
                overrides: {
                  h1: {
                    component: "h1",
                    props: {
                      className: "text-2xl font-bold",
                    },
                  },
                  h2: {
                    component: "h2",
                    props: {
                      className: "text-xl font-bold",
                    },
                  },
                  h3: {
                    component: "h3",
                    props: {
                      className: "text-lg font-bold",
                    },
                  },
                  h4: {
                    component: "h4",
                    props: {
                      className: "text-md font-bold",
                    },
                  },
                  ul: {
                    component: "ul",
                    props: {
                      className: "list-outside list-disc space-y-1 pl-6",
                    },
                  },
                  ol: {
                    component: "ol",
                    props: {
                      className: "list-outside list-decimal space-y-1 pl-6",
                    },
                  },
                  p: {
                    component: ({ className, children, ...props }) => {
                      return (
                        // It's possible there's a <div> inside <p>, due to the way Markdown is rendered, e.g. codeblock inside p
                        <p
                          className={className}
                          {...props}
                          suppressHydrationWarning
                        >
                          {Children.map(children, (child) =>
                            typeof child === "string"
                              ? child.split("\n").map((line, i) => (
                                  <Fragment key={i}>
                                    {i > 0 && <br />}
                                    {line}
                                  </Fragment>
                                ))
                              : child,
                          )}
                        </p>
                      );
                    },
                  },
                  code: {
                    component: ({ className, children, ...props }) => {
                      const match = /lang-(\w+)/.exec(className || "");
                      const isCodeBlock = /\n/.test(String(children));
                      return match || isCodeBlock ? (
                        <CodeBlock language={match?.[1]}>
                          {String(children)}
                        </CodeBlock>
                      ) : (
                        <code
                          className={cn(
                            className,
                            "px-1 rounded-lg bg-accent text-accent-foreground break-words",
                          )}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  },
                  img: {
                    component: ImageComponent,
                  },
                },
              }}
            >
              {normalizedText}
            </Markdown>
          ) : (
            <div className="flex gap-2">
              <span className="animate-pulseGrow w-4 h-4 rounded-full bg-foreground/40" />
            </div>
          )}
          {images.length > 0 && (
            <ScrollArea className="w-full whitespace-nowrap rounded-md mt-2">
              <div className="flex w-max gap-1">
                {images.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt=""
                    className="object-cover h-32 rounded-md cursor-zoom-in"
                    onClick={() => openModal(imgUrl)}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
          {selectedImage && (
            <Dialog open={true} onOpenChange={closeModal}>
              <DialogContent className="h-auto max-h-full w-auto max-w-full">
                <DialogTitle className="sr-only">Zoomed image view</DialogTitle>
                <img
                  src={selectedImage}
                  alt=""
                  className="w-full h-auto rounded-md"
                />
              </DialogContent>
            </Dialog>
          )}
        </ErrorBoundary>
      </div>
      {message.content.role === "assistant" && (
        <div className="flex gap-2 items-center px-4">
          <TooltipProvider>
            <Tooltip open={copyState !== "idle" || undefined}>
              <TooltipTrigger asChild>
                <Button onClick={handleCopy} size="icon" variant="ghost">
                  {copyState === "idle" ? (
                    <Copy size={16} />
                  ) : copyState === "copied" ? (
                    <Check size={16} />
                  ) : (
                    <AlertTriangle size={16} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="bg-secondary text-secondary-foreground"
                side="top"
              >
                {copyState === "idle"
                  ? "Copy"
                  : copyState === "copied"
                    ? "Copied!"
                    : "Error while copying!"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

function ImageComponent(props: ImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setLoaded(true);
    };
    img.onerror = () => {
      setError(true);
    };
    img.src = props.src;
  }, [props.src]);

  if (error) {
    return (
      <div className="border border-border p-2 rounded-lg">
        <div className="flex gap-2 items-center">
          <TriangleAlertIcon size={16} />
          <strong>Failed to load image &quot;{props.alt}&quot;.</strong>
        </div>
        <p>
          You can view the original image{" "}
          <a
            href={props.src}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </p>
      </div>
    );
  }

  if (!loaded) {
    return <LoaderCircleIcon className="animate-spin" />;
  }

  return <img {...props} />;
}
