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
    return null;
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
  const suggestionRef = useRef("");
  const suggestionPosRef = useRef<number | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [suggestionLine, setSuggestionLine] = useState<number | null>(null);

  useEffect(() => {
    suggestionRef.current = suggestion;
  }, [suggestion]);

  function getCurrentLineNumber(doc: any, pos: number): number {
    let line = 0;
    doc.descendants((node: { isBlock: boolean }, posInDoc: number) => {
      if (node.isBlock) {
        if (posInDoc <= pos) line++;
        else return false;
      }
      return true;
    });
    return line;
  }

  const sendToAI = useRef(
    debounce((text: string, pos: number, doc: any) => {
      if (
        socketRef.current?.readyState === WebSocket.OPEN &&
        text.trim() !== "" &&
        text !== lastText.current &&
        suggestionPosRef.current === null
      ) {
        lastText.current = text;
        setSuggestion("");
        suggestionPosRef.current = pos;
        setSuggestionLine(getCurrentLineNumber(doc, pos));
        socketRef.current.send(text);
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
        getSuggestion: () => suggestionRef.current,
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
        const pos = view.state.selection.from;

        if (key === "Tab" && suggestion && suggestionPosRef.current !== null) {
          event.preventDefault();
          editor
            ?.chain()
            .focus()
            .insertContentAt(
              {
                from: suggestionPosRef.current,
                to: pos,
              },
              suggestion
            )
            .run();
          setSuggestion("");
          setSuggestionLine(null);
          suggestionPosRef.current = null;
          return true;
        }

        if (key === "Escape") {
          setSuggestion("");
          setSuggestionLine(null);
          suggestionPosRef.current = null;
          return true;
        }

        if (
          key === "Enter" ||
          ["-", "*", "#", "1."].some((token) => text.endsWith(token))
        ) {
          sendToAI(text, pos, view.state.doc);
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
      onChange?.({ html, markdown, json });

      if (suggestion && suggestionPosRef.current !== null) {
        const from = editor.state.selection.from;
        const typed = editor.state.doc.textBetween(
          suggestionPosRef.current,
          from
        );

        if (!suggestion.startsWith(typed)) {
          setSuggestion("");
          setSuggestionLine(null);
          suggestionPosRef.current = null;
        }
      }

      sendToAI(
        JSON.stringify(filteredJson),
        editor.state.selection.from,
        editor.state.doc
      );
    },
  });

  useEffect(() => {
    socketRef.current = createWebSocketClient((msg) => {
      setSuggestion((prev) => prev + msg);
    });

    socketRef.current.onclose = (e) => {
      console.warn("WebSocket closed", e.code, e.reason);
    };
    socketRef.current.onerror = (e) => {
      console.error("WebSocket error", e);
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionChange = () => {
      if (!suggestion) return;
      const { from } = editor.state.selection;
      const currentLine = getCurrentLineNumber(editor.state.doc, from);

      if (suggestionLine !== null && currentLine !== suggestionLine) {
        setSuggestion("");
        setSuggestionLine(null);
        suggestionPosRef.current = null;
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [editor, suggestion, suggestionLine]);

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
      <TiptapMenuBar editor={editor} />
      <div className="relative h-[calc(100vh-17rem)] overflow-y-auto custom-scrollbar">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
