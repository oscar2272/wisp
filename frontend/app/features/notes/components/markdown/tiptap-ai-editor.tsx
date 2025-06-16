// ✅ TipTap AI Editor (WebSocket + OpenAI 기반 자동완성 적용)
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
import { createMarkdownPastePlugin } from "../../utils/markdown-paste-plugin";
import { TableKit } from "@tiptap/extension-table";
import { useEffect, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/core";

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
  const [containerOffset, setContainerOffset] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

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
      handleKeyDown: (view, event) => {
        if (!editor) return false;

        const markdown =
          (editor.storage as any).markdown?.getMarkdown?.() || "";
        const currentPrefix = getCurrentPrefix();
        setPrefix(currentPrefix);

        if (["Tab", "Enter"].includes(event.key) && suggestion && prefix) {
          event.preventDefault();
          const insertText = suggestion.replace(prefix, "");
          editor.commands.insertContent(insertText);
          setSuggestion("");
          return true;
        }

        if (["ArrowLeft", "ArrowRight", "Escape"].includes(event.key)) {
          setSuggestion("");
        }

        if ([" ", "Enter"].includes(event.key)) {
          setTimeout(() => {
            const updatedMarkdown =
              (editor.storage as any).markdown?.getMarkdown?.() || "";
            const updatedPrefix = getCurrentPrefix();
            setPrefix(updatedPrefix);
            if (updatedPrefix.length > 0) {
              setSuggestion("");
              wsRef.current?.send(updatedMarkdown);
            }
          }, 50);
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

  const getCurrentPrefix = (): string => {
    if (!editor) return "";
    const { from } = editor.state.selection;
    const text = editor.state.doc.textBetween(0, from, "\n", "\n");
    const match = text.match(/((^[-*+])|(\d+\.)|(\S+))\s*$/);
    return match?.[0] ?? "";
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/autocomplete");
    wsRef.current = ws;
    ws.onmessage = (event) => {
      setSuggestion((prev) => prev + event.data);
    };
    ws.onclose = () => console.log("WebSocket closed");
    return () => ws.close();
  }, []);

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
            className="absolute pointer-events-none z-50 text-gray-500"
            style={{
              top: cursorCoords.top - containerOffset.top - 2,
              left: cursorCoords.left - containerOffset.left,
              fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              whiteSpace: "pre",
              opacity: 0.6,
              transition: "opacity 0.15s ease-in",
            }}
          >
            {suggestion.replace(prefix, "")}
          </div>
        )}
      </div>
    </div>
  );
}
