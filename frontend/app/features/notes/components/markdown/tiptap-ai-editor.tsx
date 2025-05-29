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
import { useEffect, useState, useRef } from "react";
import throttle from "lodash.throttle";

const lowlight = createLowlight(common);

export default function TiptapAIEditor({
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
  const [suggestion, setSuggestion] = useState("");
  const [prefix, setPrefix] = useState("");
  const [cursorCoords, setCursorCoords] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerOffset, setContainerOffset] = useState({ top: 0, left: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false, heading: false, code: false }),
      TableKit.configure({ table: { resizable: true } }),
      ResizableImage,
      Image,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: 1024 * 1024 * 5,
        limit: 3,
        upload: async () =>
          URL.createObjectURL(new Blob(["https://github.com/shadcn.png"])),
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
      OrderedList,
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

  function getCurrentPrefix(): string {
    if (!editor) return "";
    const { from } = editor.state.selection;
    const text = editor.state.doc.textBetween(0, from, "\n", "\n");
    const match = text.match(/(\S+)$/);
    return match?.[1] ?? "";
  }

  async function fetchSuggestion(text: string) {
    console.log("fetchSuggestion", text);
    try {
      const res = await fetch("http://127.0.0.1:8001/fast-api/autocomplete/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setSuggestion(data.suggestion);
    } catch (err) {
      console.error("Suggestion fetch failed", err);
    }
  }

  // 🚀 suggestion fetch with throttle
  useEffect(() => {
    if (!editor) return;

    const handler = throttle(() => {
      const markdown = (editor.storage as any).markdown?.getMarkdown?.() || "";
      const newPrefix = getCurrentPrefix();
      setPrefix(newPrefix);
      if (newPrefix.length > 0) fetchSuggestion(markdown);
      else setSuggestion("");
    }, 500); // 실행 주기: 500ms

    editor.on("update", handler);

    return () => {
      editor.off("update", handler);
    };
  }, [editor]);

  // ⌨️ Tab/Enter 키 처리
  useEffect(() => {
    if (!editor || !suggestion) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const insertText = suggestion.replace(prefix, "");
        editor.commands.insertContent(insertText);
        setSuggestion("");
      } else if (e.key === "Enter") {
        setSuggestion("");
      }
    };

    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("keydown", keyHandler);
    };
  }, [editor, suggestion, prefix]);

  // 🧹 한글 입력/커서 이동 → suggestion 제거
  useEffect(() => {
    if (!editor) return;

    editor.view.setProps({
      handleDOMEvents: {
        compositionstart: () => {
          setSuggestion("");
          return false;
        },
        input: () => {
          setSuggestion("");
          return false;
        },
        keydown: (_, e) => {
          if (
            [
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Escape",
            ].includes(e.key)
          ) {
            setSuggestion("");
          }
          return false;
        },
      },
    });

    return () => {
      editor.view.setProps({ handleDOMEvents: {} });
    };
  }, [editor]);

  // ⛔ suggestion이 현재 입력과 다르면 제거
  useEffect(() => {
    if (!editor || !suggestion || !prefix) return;

    const handler = () => {
      const { from } = editor.state.selection;
      const currentLine = editor.state.doc.textBetween(0, from, "\n", "\n");
      if (!suggestion.startsWith(prefix) || suggestion === currentLine) {
        setSuggestion("");
      }
    };

    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, suggestion, prefix]);

  // 📍 suggestion 위치 계산
  useEffect(() => {
    if (!editor || !suggestion) return;

    const pos = editor.state.selection.to;
    const coords = editor.view.coordsAtPos(pos);
    setCursorCoords({
      top: coords.top + window.scrollY,
      left: coords.left + window.scrollX + 1,
    });
  }, [editor, suggestion]);

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setContainerOffset({ top: rect.top, left: rect.left });
  }, []);

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
      <TiptapMenuBar editor={editor} />
      <div
        ref={containerRef}
        className="relative h-[calc(100vh-17rem)] overflow-y-auto custom-scrollbar"
      >
        <EditorContent editor={editor} />
        {suggestion && cursorCoords && (
          <div
            className="absolute pointer-events-none z-50"
            style={{
              top: cursorCoords.top - containerOffset.top - 2,
              left: cursorCoords.left - containerOffset.left,
              fontFamily:
                'Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              whiteSpace: "pre",
              opacity: 0.6,
              transition: "opacity 0.15s ease-in",
              color: "oklch(0.141 0.005 285.823)",
            }}
          >
            {suggestion.replace(prefix, "")}
          </div>
        )}
      </div>
    </div>
  );
}
