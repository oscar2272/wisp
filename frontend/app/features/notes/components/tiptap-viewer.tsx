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
import Link from "@tiptap/extension-link";
import { Markdown } from "tiptap-markdown";
import { CustomMarkdownInputRules } from "../utils/custom-markdown-input-rules";

const lowlight = createLowlight(common);

export default function TiptapReadOnlyViewer({ content }: { content: string }) {
  const editor = useEditor({
    editable: false,
    content,
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
        class:
          "ProseMirror prose prose-slate dark:prose-invert min-h-[200px] p-4",
      },
    },
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
