import { ChevronsUpDown, LogOut, User } from "lucide-react";
import { Link } from "react-router";
import {
  AvatarImage,
  AvatarFallback,
  Avatar,
} from "~/common/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/common/components/ui/popover";
import {
  SidebarMenuButton,
  SidebarSeparator,
} from "~/common/components/ui/sidebar";

export default function UserPopOverMenu({
  email,
  username,
  avatar,
}: {
  email: string;
  username: string;
  avatar: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar>
            {avatar ? (
              <AvatarImage
                src={avatar}
                alt="avatar"
                className="object-cover w-full h-full"
              />
            ) : (
              <AvatarFallback>{username?.[0]}</AvatarFallback>
            )}
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{username}</span>
            <span className="truncate text-xs">{email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent
        className="w-56"
        align="start"
        side="right"
        sideOffset={0}
      >
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 p-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{username}</span>
              <span className="text-xs text-muted-foreground">{email}</span>
            </div>
          </div>
          <SidebarSeparator className="my-1" />
          <Link
            to="/wisp/profile"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          >
            <User className="h-4 w-4" />
            Account
          </Link>
          <Link
            to="/auth/logout"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
