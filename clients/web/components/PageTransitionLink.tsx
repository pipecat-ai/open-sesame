import emitter from "@/lib/eventEmitter";
import Link from "next/link";
import { forwardRef } from "react";

type Props = React.ComponentProps<typeof Link>;

const PageTransitionLink = forwardRef<HTMLAnchorElement, Props>(
  ({ onClick, ...props }, forwardedRef) => {
    const handleClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
      emitter.emit("showPageTransitionLoader");
      onClick?.(ev);
    };

    return <Link ref={forwardedRef} onClick={handleClick} {...props} />;
  },
);
PageTransitionLink.displayName = "PageTransitionLink";

export default PageTransitionLink;
