"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EMAIL_COOKIE_KEY, LOGIN_COOKIE_KEY } from "@/lib/constants";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Gravatar from "react-gravatar";

interface UserMenuProps {
  className?: string;
  email?: string;
}

const UserMenu = ({ className, email = "My account" }: UserMenuProps) => {
  const { push } = useRouter();

  const handleSignout = () => {
    document.cookie = `${LOGIN_COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${EMAIL_COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    push("/sign-in");
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger className="group rounded-full flex gap-2 items-center w-full overflow-hidden hover:bg-secondary-foreground/[.05] focus-visible:bg-secondary-foreground/[.05] transition-colors">
          <Gravatar email={email} size={32} className="rounded-full" />
          <span className="flex-grow overflow-hidden text-ellipsis text-start">
            {email}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuItem
            onClick={handleSignout}
            className="flex items-center justify-between gap-4 w-full"
          >
            Sign out
            <LogOutIcon size={16} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
