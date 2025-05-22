// extensions/ResizableImage.ts
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableImageComponent } from "../components/markdown/resizable-image-component";

export const ResizableImage = Node.create({
  name: "resizableImage",

  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: "300px",
      },
      height: {
        default: "auto",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "resizable-image",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["image", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});
