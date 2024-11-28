import { cn } from "@/lib/utils";

interface Props {
  align?: "start" | "center" | "end";
  border?: boolean;
  children: React.ReactNode;
}

export default function ConfigurationItem({
  align = "center",
  border = false,
  children,
}: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-0 sm:gap-2",
        `items-${align}`,
        border ? "border border-transparent border-t-border" : "",
        "[&>*]:p-2",
      )}
    >
      {children}
    </div>
  );
}
