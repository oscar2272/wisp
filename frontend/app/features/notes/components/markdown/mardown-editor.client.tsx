// app/components/markdown/mardown-editor.client.tsx

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Markdown } from "tiptap-markdown";
import TiptapMenuBar from "./mardown-toolbar";

import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node";
import { Image } from "@tiptap/extension-image";
import { ResizableImage } from "../../utils/resizable-image";
import type { JSONContent } from "@tiptap/core";
import { createMarkdownPastePlugin } from "../../utils/markdown-paste-plugin";
import { TableKit } from "@tiptap/extension-table";
const lowlight = createLowlight(common);

export const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      order: {
        default: 1,
        parseHTML: (el) => parseInt(el.getAttribute("start") || "1", 10),
        renderHTML: (attrs) =>
          attrs.order && attrs.order !== 1
            ? { start: attrs.order.toString() }
            : {},
      },
    };
  },
});
export const CustomBulletList = BulletList.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-l": () => this.editor.commands.toggleBulletList(),
    };
  },
});
export default function TiptapMarkdownEditor({
  onChange,
  initialContent,
}: {
  onChange?: (data: {
    html: string;
    markdown: string;
    json: JSONContent;
  }) => void;
  initialContent?: JSONContent | string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: false,
        code: false,
      }),
      TableKit.configure({
        table: { resizable: true },
      }),
      ResizableImage,
      Image,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: 1024 * 1024 * 5, // 5MB
        limit: 3,
        upload: async () => {
          return URL.createObjectURL(
            new Blob(["https://github.com/shadcn.png"])
          ); // 임시 blob URL
        },
      }),

      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
      // ListItem,
      // OrderedList,
      CodeBlockLowlight.configure({ lowlight }),
      TaskList,
      TaskItem,
      Underline,
      Highlight,
      Markdown,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "ProseMirror dark:prose-invert max-w-none py-4 focus:outline-none",
      },
    },
    onCreate({ editor }) {
      editor.registerPlugin(createMarkdownPastePlugin());
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const markdown = (editor.storage as any).markdown?.getMarkdown?.() || "";
      const json = editor.getJSON();
      onChange?.({ html, markdown, json });
    },
  });

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
      <TiptapMenuBar editor={editor} />
      <div className="relative h-[calc(100vh-17rem)] overflow-y-auto custom-scrollbar">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
