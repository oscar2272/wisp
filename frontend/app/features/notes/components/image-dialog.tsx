// components/ImageUrlDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";
import { ImageIcon } from "lucide-react";
export function ImageUrlDialog({
  onSubmit,
}: {
  onSubmit: (url: string) => void;
}) {
  const [url, setUrl] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ImageIcon
          size={18}
          onClick={() => {}}
          className="hover:bg-accent hover:text-accent-foreground size-[34px] p-2"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이미지 URL 입력</DialogTitle>
        </DialogHeader>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => {
                if (url) onSubmit(url);
              }}
            >
              삽입
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
