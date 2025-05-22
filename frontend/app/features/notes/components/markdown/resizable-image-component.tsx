// extensions/ResizableImageComponent.tsx
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Resizable } from "re-resizable";

export function ResizableImageComponent({
  node,
  updateAttributes,
}: NodeViewProps) {
  const { src, width, height } = node.attrs;

  return (
    <NodeViewWrapper className="relative inline-block my-4">
      <Resizable
        defaultSize={{
          width: width || "auto",
          height: height || "auto",
        }}
        onResizeStop={(e, direction, ref) => {
          updateAttributes({
            width: ref.style.width,
            height: ref.style.height,
          });
        }}
        style={{
          border: "1px solid #ccc",
          padding: "4px",
          display: "inline-block",
          background: "white",
        }}
      >
        <img
          src={src}
          alt="resizable"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Resizable>
    </NodeViewWrapper>
  );
}
