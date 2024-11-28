import { useCallback, useRef } from "react";
import { RTVIEvent } from "realtime-ai";
import { useRTVIClientEvent } from "realtime-ai-react";

interface Props {
  active?: boolean;
}

export default function BotReadyAudio({ active }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useRTVIClientEvent(
    RTVIEvent.BotReady,
    useCallback(() => {
      if (!active) return;
      audioRef.current?.play();
    }, [active]),
  );

  return (
    <audio ref={audioRef} src="/ready.mp3" playsInline className="hidden" />
  );
}
