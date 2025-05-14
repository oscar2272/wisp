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
import { createMarkdownPastePlugin } from "../../utils/markdown-paste-plugin";
import { CustomMarkdownInputRules } from "../../utils/custom-markdown-input-rules";
import Link from "@tiptap/extension-link";
import TiptapMenuBar from "./mardown-toolbar";

import type { JSONContent } from "@tiptap/core";

const lowlight = createLowlight(common);

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
      handleKeyDown(view, event) {
        if (event.key === "Tab") {
          event.preventDefault();
          const { state, dispatch } = view;
          const { from, to } = state.selection;
          dispatch(state.tr.insertText("    ", from, to));
          return true;
        }
        return false;
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
