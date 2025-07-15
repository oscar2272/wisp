import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Markdown } from "tiptap-markdown";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

import TiptapMenuBar from "./mardown-toolbar";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node";
import { Image } from "@tiptap/extension-image";
import { ResizableImage } from "../../utils/resizable-image";
import type { JSONContent } from "@tiptap/core";
import { createMarkdownPastePlugin } from "../../utils/markdown-paste-plugin";
import { TableKit } from "@tiptap/extension-table";
import { createWebSocketClient } from "../../utils/websocket-client";
import { SuggestionExtension } from "../../utils/suggestion-extension";

const lowlight = createLowlight(common);
function removeImagesFromJSON(node: any): any {
  if (node.type === "image" || node.type === "resizableImage") {
    return null; // 이미지 및 resizableImage 노드 제거
  }

  if (!node.content) return node;

  const filteredContent = node.content
    .map((child: any) => removeImagesFromJSON(child))
    .filter((child: any) => child !== null);

  return { ...node, content: filteredContent };
}

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
  const socketRef = useRef<WebSocket | null>(null);
  const lastText = useRef("");
  const [suggestion, setSuggestion] = useState("");
  const suggestionRef = useRef("");
  useEffect(() => {
    suggestionRef.current = suggestion;
  }, [suggestion]);
  const sendToAI = useRef(
    debounce((text: string) => {
      if (
        socketRef.current?.readyState === WebSocket.OPEN &&
        text.trim() !== "" &&
        text !== lastText.current
      ) {
        lastText.current = text;

        setSuggestion(""); //  기존 제안 제거 (입력 중이므로 무효화)
        socketRef.current.send(text); // 새로운 요청
      }
    }, 800)
  ).current;

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
        upload: async () => URL.createObjectURL(new Blob(["https://..."])),
      }),
      SuggestionExtension.configure({
        getSuggestion: () => suggestionRef.current, // ✅ ref로 연결
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
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
      handleKeyDown(view, event) {
        const { key } = event;
        const text = view.state.doc.textContent;

        if (key === "Tab" && suggestion) {
          event.preventDefault();
          editor?.commands.insertContent(suggestion);
          setSuggestion("");
          return true;
        }

        if (key === "Escape") {
          setSuggestion("");
          return true;
        }

        if (
          key === "Enter" ||
          ["-", "*", "#", "1."].some((token) => text.endsWith(token))
        ) {
          sendToAI(text);
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
      const filteredJson = removeImagesFromJSON(
        JSON.parse(JSON.stringify(json))
      );
      onChange?.({ html, markdown, json: filteredJson });
      sendToAI(JSON.stringify(filteredJson));
    },
  });

  useEffect(() => {
    if (!editor) return;

    socketRef.current = createWebSocketClient((msg) => {
      setSuggestion((prev) => prev + msg); // 스트리밍 응답 누적
    });

    return () => {
      socketRef.current?.close();
    };
  }, [editor]);

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
      <TiptapMenuBar editor={editor} />
      <div className="relative h-[calc(100vh-17rem)] overflow-y-auto custom-scrollbar">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
