import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuItem,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
  NavigationMenuLink,
} from "~/common/components/ui/navigation-menu";
import { Link, useLocation } from "react-router";
import {
  BarChart3Icon,
  BellIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { cn } from "~/lib/utils";

const menus = [
  {
    name: "Note",
    to: "/wisp/notes",
  },
  {
    name: "Explore",
    to: "/wisp/explore",
  },
  {
    name: "About",
    to: "/wisp/about",
    items: [
      {
        name: "Creators",
        description: "만든 사람 소개",
        to: "/wisp/about/creators",
      },
      {
        name: "Contact us",
        description: "문의하기",
        to: "/wisp/about/contact",
      },
    ],
  },
];

export default function Navigation({
  isLoggedIn,
  hasNotifications,
  username,
  avatar,
}: {
  isLoggedIn: boolean;
  hasNotifications: boolean;
  username?: string;
  avatar?: string | null;
}) {
  const location = useLocation();

  return (
    <div className="xl:px-32 lg:px-24 md:px-16 px-8 flex flex-row h-16 justify-between">
      <div className=" items-center flex">
        <Link
          to="/"
          className="font-bold text-lg tracking-tighter md:block hidden mr-20"
        >
          Wisp
        </Link>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            {menus.map((menu) => (
              <NavigationMenuItem className="text-md" key={menu.name}>
                {menu.items ? (
                  <>
                    <NavigationMenuTrigger className="text-sm">
                      {menu.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="absolute top-full left-0 w-[220px]">
                      <ul className="grid gap-3 p-4 min-w-[220px]">
                        {menu.items?.map((item) => (
                          <NavigationMenuItem key={item.name}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.to}
                                className={cn(
                                  "flex flex-col gap-1 p-2 hover:bg-accent rounded-md",
                                  location.pathname === item.to && "bg-accent"
                                )}
                              >
                                <div className="text-sm font-medium">
                                  {item.name}
                                </div>
                                {item.description && (
                                  <div className="text-xs text-muted-foreground">
                                    {item.description}
                                  </div>
                                )}
                              </Link>
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === menu.to && "bg-accent"
                    )}
                    to={menu.to}
                  >
                    {menu.name}
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" asChild className="relative">
            <Link to="/my/notifications">
              <BellIcon className="size-4" />
              {hasNotifications && (
                <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
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
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  @{username}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/dashboard">
                    <BarChart3Icon className="size-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/wisp/profile">
                    <UserIcon className="size-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/settings">
                    <SettingsIcon className="size-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/auth/logout">
                  <LogOutIcon className="size-4 mr-2" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Button asChild variant="secondary">
            <Link to="/auth/login">Login</Link>
          </Button>
          {/* <Button asChild>
            <Link to="/auth/join">Join</Link>
          </Button> */}
        </div>
      )}
    </div>
  );
}
