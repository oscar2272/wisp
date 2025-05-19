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
import { Link, useNavigate, useParams } from "react-router";
import { Home, Trash2, Settings, Archive } from "lucide-react";
import UserPopOverMenu from "./user-popover";
import { useEffect, useState } from "react";
import type { TreeItem } from "../../type";
import { SidebarTreeMenu } from "./sidebar-tree-menu";
import { RenameDialog } from "./rename-dialog";
import { CreateDialog } from "./create-dialog";
import { DeleteDialog } from "./delete-dialog";
import { NotePopover } from "./note-popover";
import { toast } from "sonner";
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
  const notes = initialItems;
  const params = useParams();
  const navigate = useNavigate();
  const currentNoteId = params.id;
  const [items, setItems] = useState(notes);

  const [deleteDialogState, setDeleteDialogState] = useState<TreeItem | null>(
    null
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createDialogMeta, setCreateDialogMeta] = useState<{
    type: "note" | "folder";
    parentId: string | null;
  }>({
    type: "note",
    parentId: null,
  });
  const [renameDialogItem, setRenameDialogItem] = useState<TreeItem | null>(
    null
  );
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  const openRenameDialog = (item: TreeItem) => {
    setRenameDialogItem(item);
    setRenameDialogOpen(true);
  };

  const closeRenameDialog = () => {
    setRenameDialogOpen(false);
    setRenameDialogItem(null);
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
    let isCurrentNoteDeleted = false;
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
      if (currentNoteId) {
        isCurrentNoteDeleted =
          itemsToDelete.has(currentNoteId) ||
          itemsToDelete.has(`note-${currentNoteId}`);
      }

      return prevItems.filter((i) => !itemsToDelete.has(i.id));
    });
    if (isCurrentNoteDeleted) {
      toast.info("현재 보고 있는 노트가 삭제되어 목록 페이지로 이동합니다.");
      navigate("/wisp/notes", { replace: true });
    }
  };

  const openCreateFileDialog = (parentId: string | null) => {
    setCreateDialogMeta({ type: "note", parentId });
    setCreateDialogOpen(true);
  };

  const openCreateFolderDialog = (parentId: string | null) => {
    setCreateDialogMeta({ type: "folder", parentId });
    setCreateDialogOpen(true);
  };
  const handleCreate = (
    type: "note" | "folder",
    name: string,
    parentId: string | null,
    id: string
  ) => {
    const newItem: TreeItem = {
      id: id, // optimistic update 용
      name,
      type,
      parentId,
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };
  useEffect(() => {
    console.log("[Dialog open 상태]", createDialogOpen);
  }, [createDialogOpen]);
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
                    <Link to="/">
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
                items={notes}
                onCreateFileDialog={openCreateFileDialog}
                onCreateFolderDialog={openCreateFolderDialog}
              />
            </div>

            <SidebarGroupContent className="h-[calc(100vh-16rem)] custom-scrollbar overflow-x-scroll">
              <SidebarTreeMenu
                items={notes}
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
                    <Link to="/wisp/notes/trash">
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
        item={renameDialogItem}
        open={renameDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeRenameDialog();
        }}
        onRename={(item, newName) => {
          handleRenameSubmit(item, newName);
          closeRenameDialog();
        }}
      />
      <CreateDialog
        type={createDialogMeta.type}
        parentId={createDialogMeta.parentId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
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
