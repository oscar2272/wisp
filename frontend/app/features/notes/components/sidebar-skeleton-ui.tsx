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
} from "~/common/components/ui/sidebar";
import { Skeleton } from "~/common/components/ui/skeleton";

export default function SidebarSkeletonUI() {
  return (
    <div>
      <Sidebar collapsible="icon">
        <SidebarContent>
          {/* WISP 그룹 */}
          <SidebarGroup>
            <SidebarGroupLabel>WISP</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Skeleton className="size-4" />
                    <Skeleton className="h-4 w-16 ml-2" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Skeleton className="size-4" />
                    <Skeleton className="h-4 w-16 ml-2" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Workspace 그룹 */}
          <SidebarGroup className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between px-2">
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <Skeleton className="size-6" />
            </div>
            <SidebarGroupContent className="h-[calc(100vh-16rem)] custom-scrollbar">
              {/* 트리 메뉴 스켈레톤 */}
              <div className="space-y-2 px-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2 pl-2">
                    <Skeleton className="size-4" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* System 그룹 */}
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Skeleton className="size-4" />
                    <Skeleton className="h-4 w-16 ml-2" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Skeleton className="size-4" />
                    <Skeleton className="h-4 w-16 ml-2" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer - 사용자 프로필 */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-3 px-3 py-2">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  );
}
