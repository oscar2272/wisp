// app/components/markdown/mardown-editor.client.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Markdown } from "tiptap-markdown";
import TiptapMenuBar from "./mardown-toolbar";

import type { JSONContent } from "@tiptap/core";
import { CustomMarkdownInputRules } from "../../utils/custom-markdown-input-rules";
import { createMarkdownPastePlugin } from "../../utils/markdown-paste-plugin";

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
    console.log("🔥 CustomBulletList addKeyboardShortcuts");
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
      CustomMarkdownInputRules,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "ProseMirror dark:prose-invert max-w-none py-4 focus:outline-none",
      },
      // handleKeyDown(view, event) {
      //   const { state } = view;

      //   // 코드블럭일 경우에만 직접 탭 입력 처리
      //   const { $from } = state.selection;
      //   const parentNode = $from.node(-1);

      //   if (event.key === "Tab" && parentNode.type.name === "codeBlock") {
      //     event.preventDefault();
      //     const { from, to } = state.selection;
      //     view.dispatch(state.tr.insertText("    ", from, to));
      //     return true;
      //   }

      //   // 그 외에는 TipTap/ProseMirror 기본 처리
      //   return false;
      // },
    },
    onCreate({ editor }) {
      editor.registerPlugin(createMarkdownPastePlugin());
      console.log("📦 Nodes in schema:", editor.schema.nodes);
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
