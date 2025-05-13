"use client";
// app/components/tiptap-editor.tsx
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
import { createMarkdownPastePlugin } from "../utils/markdown-paste-plugin";
import { CustomMarkdownInputRules } from "../utils/custom-markdown-input-rules";
import Link from "@tiptap/extension-link";
import TiptapMenuBar from "./mardown-toolbar";
const lowlight = createLowlight(common);

export default function TiptapMarkdownEditor({
  onChange,
  initialContent,
}: {
  onChange?: (data: { html: string; markdown: string }) => void;
  initialContent?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: false,
        code: false,
      }),
      Link.configure({
        openOnClick: true,
        autolink: false,
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
      ListItem,
      OrderedList,
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: null }),
      TaskList,
      TaskItem,
      Underline,
      Highlight,
      Markdown,
      CustomMarkdownInputRules,
    ],
    editorProps: {
      attributes: {
        class: "prose prose-slate dark:prose-invert py-4 focus:outline-none",
      },
      handleKeyDown(view, event) {
        if (event.key === "Tab") {
          event.preventDefault(); // 기본 포커스 이동 막기

          const { state, dispatch } = view;
          const { from, to } = state.selection;

          // ✅ '\t' 삽입 (혹은 '    ' 4칸 공백으로 대체 가능)
          dispatch(state.tr.insertText("    ", from, to)); // 4칸 공백
          return true;
        }

        return false;
      },
    },
    onCreate({ editor }) {
      editor.registerPlugin(
        createMarkdownPastePlugin() // 🔥 새로 만든 붙여넣기 전용 plugin
      );
    },
    content: initialContent,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const markdown = editor.storage.markdown?.getMarkdown?.() || "";
      onChange?.({ html, markdown });
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
