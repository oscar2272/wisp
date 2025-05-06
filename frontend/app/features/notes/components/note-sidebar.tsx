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
import { Link } from "react-router";
import { Home, Trash2, Settings, Archive } from "lucide-react";
import UserPopOverMenu from "./user-popover";
import { useState } from "react";
import type { TreeItem } from "../type";
import { SidebarTreeMenu } from "./sidebar-tree-menu";
import { RenameDialog } from "./rename-dialog";
import { CreateDialog } from "./create-dialog";
import { DeleteDialog } from "./delete-dialog";
import { NotePopover } from "./note-popover";
export default function NoteSidebar({
  email,
  username,
  avatar,
  initialItems,
}: {
  email: string;
  username: string;
  avatar: string;
  initialItems: TreeItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [renameDialogState, setRenameDialogState] = useState<TreeItem | null>(
    null
  );
  const [deleteDialogState, setDeleteDialogState] = useState<TreeItem | null>(
    null
  );
  const [createDialogState, setCreateDialogState] = useState<{
    type: "file" | "folder";
    parentId: string | null;
    open: boolean;
  }>({
    type: "file",
    parentId: null,
    open: false,
  });

  const openRenameDialog = (item: TreeItem) => {
    setRenameDialogState(item);
  };

  const handleRenameSubmit = (item: TreeItem, newName: string) => {
    setItems((prevItems) =>
      prevItems.map((i) => (i.id === item.id ? { ...i, name: newName } : i))
    );
  };

  const openDeleteDialog = (item: TreeItem) => {
    setDeleteDialogState(item);
  };

  const handleDeleteSubmit = (item: TreeItem) => {
    setItems((prevItems) => {
      const itemsToDelete = new Set([item.id]);

      // 폴더인 경우 하위 항목도 모두 삭제
      if (item.type === "folder") {
        const findChildren = (parentId: string) => {
          prevItems.forEach((i) => {
            if (i.parentId === parentId) {
              itemsToDelete.add(i.id);
              if (i.type === "folder") {
                findChildren(i.id);
              }
            }
          });
        };
        findChildren(item.id);
      }

      return prevItems.filter((i) => !itemsToDelete.has(i.id));
    });
  };

  const openCreateFileDialog = (parentId: string | null) => {
    setCreateDialogState({
      type: "file",
      parentId,
      open: true,
    });
  };

  const openCreateFolderDialog = (parentId: string | null) => {
    setCreateDialogState({
      type: "folder",
      parentId,
      open: true,
    });
  };

  const handleCreate = (
    type: "file" | "folder",
    name: string,
    parentId: string | null
  ) => {
    const now = new Date().toISOString();
    const newItem: TreeItem = {
      id: crypto.randomUUID(),
      name,
      type: type === "file" ? "note" : "folder",
      parentId,
      created_at: now,
      updated_at: now,
      ...(type === "file" ? { content: "" } : {}),
    };

    setItems((prevItems) => [...prevItems, newItem]);
  };

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
              </SidebarMenu>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/wisp/notes">
                      <Archive className="size-4" />
                      <span>Archive</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <NotePopover
                items={items}
                onCreateFileDialog={openCreateFileDialog}
                onCreateFolderDialog={openCreateFolderDialog}
              />
            </div>

            <SidebarGroupContent className="h-[calc(100vh-16rem)] custom-scrollbar">
              <SidebarTreeMenu
                items={items}
                onRename={openRenameDialog}
                onDelete={openDeleteDialog}
                onCreateFileDialog={openCreateFileDialog}
                onCreateFolderDialog={openCreateFolderDialog}
              />
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
              <UserPopOverMenu
                email={email}
                username={username}
                avatar={avatar}
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <RenameDialog
        item={renameDialogState}
        open={renameDialogState !== null}
        onOpenChange={(open) => !open && setRenameDialogState(null)}
        onRename={handleRenameSubmit}
      />

      <CreateDialog
        type={createDialogState.type}
        parentId={createDialogState.parentId}
        open={createDialogState.open}
        onOpenChange={(open) =>
          setCreateDialogState((prev) => ({ ...prev, open }))
        }
        onCreate={handleCreate}
      />

      <DeleteDialog
        item={deleteDialogState}
        open={deleteDialogState !== null}
        onOpenChange={(open) => !open && setDeleteDialogState(null)}
        onDelete={handleDeleteSubmit}
      />
    </div>
  );
}
