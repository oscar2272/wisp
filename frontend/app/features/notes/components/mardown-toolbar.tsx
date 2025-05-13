// components/TiptapMenuBar.tsx
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Highlighter,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code2,
  CheckSquare,
  LinkIcon,
  Unlink,
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { Level } from "@tiptap/extension-heading";
import { LinkDialog } from "./link-dialog";

type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  tooltip?: string;
};

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  tooltip,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "p-2 rounded-md transition-all duration-200",
      "hover:bg-slate-100 dark:hover:bg-slate-800",
      "focus:outline-none focus:ring-2 focus:ring-slate-500/20",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      isActive &&
        "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
    )}
    title={tooltip}
  >
    {children}
  </button>
);

const Divider = () => (
  <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
);

export default function TiptapMenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const headingButtons = [
    { level: 1 as Level, icon: Heading1, label: "제목 1" },
    { level: 2 as Level, icon: Heading2, label: "제목 2" },
    { level: 3 as Level, icon: Heading3, label: "제목 3" },
  ];

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 bg-white dark:bg-slate-900 sticky top-0 z-10 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_2px_0_rgba(0,0,0,0.15)]">
      <div className="flex items-center">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          tooltip="굵게 (Ctrl+B)"
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          tooltip="기울임 (Ctrl+I)"
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          tooltip="취소선 (Ctrl+Shift+X)"
        >
          <Strikethrough size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          tooltip="밑줄 (Ctrl+U)"
        >
          <Underline size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
          tooltip="형광펜 (Ctrl+Shift+H)"
        >
          <Highlighter size={18} />
        </ToolbarButton>
      </div>

      <Divider />

      <div className="flex items-center">
        {headingButtons.map(({ level, icon: Icon, label }) => (
          <ToolbarButton
            key={level}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
            isActive={editor.isActive("heading", { level })}
            tooltip={label}
          >
            <Icon size={18} />
          </ToolbarButton>
        ))}
      </div>

      <Divider />

      <div className="flex items-center">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          tooltip="글머리 기호"
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          tooltip="번호 매기기"
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive("taskList")}
          tooltip="체크리스트"
        >
          <CheckSquare size={18} />
        </ToolbarButton>
      </div>

      <Divider />

      <div className="flex items-center">
        <ToolbarButton
          onClick={() => {
            const { state, dispatch } = editor.view;
            const { from, to } = state.selection;

            // 코드블럭 확장을 토글 → 전체 선택 영역을 코드블럭으로 감싸기
            editor
              .chain()
              .focus()
              .setCodeBlock() // 항상 code block으로
              .deleteRange({ from, to }) // 선택 삭제
              .insertContentAt(from, {
                type: "codeBlock",
                content: [
                  {
                    type: "text",
                    text: state.doc.textBetween(from, to, "\n"),
                  },
                ],
              })
              .run();
          }}
          isActive={editor.isActive("codeBlock")}
          tooltip="코드 블록"
        >
          <Code2 size={18} />
        </ToolbarButton>
        <LinkDialog editor={editor} />
      </div>
    </div>
  );
}
