import { useState } from "react";
import { Editor } from "@tiptap/react";
import { Link as LinkIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/common/components/ui/dialog";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";

export function LinkDialog({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");

  const isActive = editor.isActive("link");
  const previousUrl = editor.getAttributes("link").href;

  const handleOpen = () => {
    const selection = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );

    setText(selection || ""); // 기존 선택된 텍스트가 있다면 미리 채워줌
    setUrl(previousUrl || "");
    setOpen(true);
  };

  const handleApply = () => {
    setOpen(false);

    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const href = url.startsWith("http") ? url : `https://${url}`;
    if (text) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${href}">${text}</a>`)
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={isActive ? "text-blue-600 dark:text-blue-400" : ""}
          onClick={handleOpen}
          size="icon"
          title="링크 삽입"
        >
          <LinkIcon size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle>링크 삽입</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            placeholder="링크 텍스트"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleApply}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
