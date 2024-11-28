"use client";

import emitter from "@/lib/eventEmitter";
import { LoaderCircleIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function NavigationState() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    loaderRef.current?.classList.remove("opacity-100");
    const handleShowLoader = () => {
      loaderRef.current?.classList.add("opacity-100");
    };
    emitter.on("showPageTransitionLoader", handleShowLoader);
    return () => {
      emitter.off("showPageTransitionLoader", handleShowLoader);
    };
  }, [pathname]);

  return (
    <div
      ref={loaderRef}
      className="fixed bottom-1 right-0 z-30 p-2 transition-opacity opacity-0 pointer-events-none"
    >
      <LoaderCircleIcon className="animate-spin" size={16} />
    </div>
  );
}
