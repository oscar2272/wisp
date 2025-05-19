import MarkdownIt from "markdown-it";
import { Plugin, PluginKey } from "prosemirror-state";
import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";

export function createMarkdownPastePlugin() {
  return new Plugin({
    key: new PluginKey("markdownPastePlugin"),
    props: {
      handlePaste(view, event) {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        const plainText = clipboardData.getData("text/plain");

        const containsMarkdown = /(^|\n)\s*(#{1,6}|[-*]|\d+\.)\s+/.test(
          plainText
        );

        if (containsMarkdown) {
          event.preventDefault();

          const { state, dispatch } = view;
          const { schema } = state;

          // markdown-it으로 마크다운 -> HTML 파싱
          const md = new MarkdownIt();
          const html = md.render(plainText);

          // HTML -> ProseMirror Node
          const parser = ProseMirrorDOMParser.fromSchema(schema);
          const element = document.createElement("div");
          element.innerHTML = html;
          const docFragment = parser.parse(element);

          const tr = state.tr
            .replaceSelectionWith(docFragment)
            .scrollIntoView();
          dispatch(tr);
          return true;
        }

        return false;
      },
    },
  });
}
