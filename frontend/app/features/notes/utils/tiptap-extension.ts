import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";

const lowlight = createLowlight(common);

export function getTipTapExtensions() {
  return [
    StarterKit.configure({
      codeBlock: false,
      heading: false,
      code: false,
      //bulletList: false,
      orderedList: false,
      listItem: false,
    }),
    Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
    BulletList,
    OrderedList,
    ListItem,
    TaskList,
    TaskItem,
    CodeBlockLowlight.configure({ lowlight }),
    Highlight,
    Underline,
    Link,
  ];
}
