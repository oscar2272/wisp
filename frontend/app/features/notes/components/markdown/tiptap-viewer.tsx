import { renderToHTMLString } from "@tiptap/static-renderer";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import HardBreak from "@tiptap/extension-hard-break";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node";
import { ResizableImage } from "../../utils/resizable-image";
import { TableKit } from "@tiptap/extension-table";
const lowlight = createLowlight(common);

export function TiptapReadOnlyViewer({
  content,
}: {
  content: JSONContent | string;
}) {
  let html = "";

  try {
    const parsed: JSONContent =
      typeof content === "string" ? JSON.parse(content) : content;

    html = renderToHTMLString({
      content: parsed,
      extensions: [
        StarterKit.configure({
          codeBlock: false,
          heading: false,
          bulletList: false,
          orderedList: false,
          listItem: false,
          link: false, // ✅ 중복 방지
          underline: false, // ✅ 중복 방지
        }),
        TableKit.configure({
          table: { resizable: true },
        }),
        ResizableImage,
        HardBreak.configure({ keepMarks: false }),
        Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
        BulletList,
        OrderedList,
        ListItem,
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        CodeBlockLowlight.configure({ lowlight }),
        Highlight,
        Underline,
        Link.configure({ openOnClick: false }),
      ],
    });
  } catch (err) {
    html = `<p class="text-red-600">⚠️ 렌더링 실패: ${
      err instanceof Error ? err.message : "알 수 없는 오류"
    }</p>`;
  }

  return (
    <div
      className="ProseMirror prose dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
