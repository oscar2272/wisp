import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "~/common/components/ui/sidebar";
import { Link, useLocation } from "react-router";
import {
  Home,
  User,
  Trash2,
  Settings,
  FolderIcon,
  ChevronDown,
  FolderClockIcon,
  FolderLockIcon,
  FolderOpenIcon,
  FileText,
  FileEditIcon,
  FolderLock,
  FolderKeyIcon,
  FolderPenIcon,
} from "lucide-react";
import UserPopOverMenu from "./user-popover";
import { useState } from "react";
import { Button } from "~/common/components/ui/button";

export default function NoteSidebar() {
  const location = useLocation();
  const [isUnSharedNotesOpen, setIsUnSharedNotesOpen] = useState(false);
  const [isSharedNotesOpen, setIsSharedNotesOpen] = useState(false);
  const [isPublicNotesOpen, setIsPublicNotesOpen] = useState(false);
  const [isPrivateNotesOpen, setIsPrivateNotesOpen] = useState(false);
  const [isExpiredNotesOpen, setIsExpiredNotesOpen] = useState(false);
  return (
    <div>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>WISP</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/wisp">
                      <Home className="size-4" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === `/oscar2272`}
                    >
                      <Link to="/oscar2272">
                        <User className="size-4" />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between pr-1">
              <SidebarGroupLabel>Archive</SidebarGroupLabel>
              <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                <Link to="/wisp/notes/new">
                  <FileEditIcon className="size-4" />
                </Link>
              </Button>
            </div>

            <SidebarGroupContent className="h-[calc(100vh-16rem)] custom-scrollbar">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/wisp/notes">
                      <FolderIcon className="size-4" />
                      <span>All Notes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarMenu className="group-data-[collapsible=icon]:hidden">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setIsUnSharedNotesOpen(!isUnSharedNotesOpen)}
                  >
                    <FolderIcon className="size-4" />
                    <span>작성한 메모</span>
                    <ChevronDown
                      className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isUnSharedNotesOpen ? "rotate-180" : ""
                      } group-data-[collapsible=icon]:hidden`}
                    />
                  </SidebarMenuButton>
                  {isUnSharedNotesOpen && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <Link to="/oscar2272/notes">
                            <FileText className="size-4" />
                            <span>All Notes</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarMenu className="group-data-[collapsible=icon]:hidden">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setIsSharedNotesOpen(!isSharedNotesOpen)}
                  >
                    <FolderClockIcon className="size-4" />
                    <span>공유한 메모</span>
                    <ChevronDown
                      className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isSharedNotesOpen ? "rotate-180" : ""
                      } group-data-[collapsible=icon]:hidden`}
                    />
                  </SidebarMenuButton>
                  {isSharedNotesOpen && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              onClick={() =>
                                setIsPrivateNotesOpen(!isPrivateNotesOpen)
                              }
                            >
                              <FolderKeyIcon className="size-4" />
                              <span>링크용 메모</span>
                              <ChevronDown
                                className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${
                                  isPrivateNotesOpen ? "rotate-180" : ""
                                } group-data-[collapsible=icon]:hidden`}
                              />
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              onClick={() =>
                                setIsPublicNotesOpen(!isPublicNotesOpen)
                              }
                            >
                              <FolderIcon className="size-4" />
                              <span>공개된 메모</span>
                              <ChevronDown
                                className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${
                                  isPublicNotesOpen ? "rotate-180" : ""
                                } group-data-[collapsible=icon]:hidden`}
                              />
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarMenu className="group-data-[collapsible=icon]:hidden">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setIsExpiredNotesOpen(!isExpiredNotesOpen)}
                  >
                    <FolderLockIcon className="size-4" />
                    <span>Expired Notes</span>
                    <ChevronDown
                      className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isExpiredNotesOpen ? "rotate-180" : ""
                      } group-data-[collapsible=icon]:hidden`}
                    />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/oscar2272/trash">
                      <Trash2 className="size-4" />
                      <span>Trash</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/trash">
                      <Settings className="size-4" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <UserPopOverMenu />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  );
}
