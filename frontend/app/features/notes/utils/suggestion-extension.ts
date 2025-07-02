// suggestion-extension.ts
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

export const SuggestionExtension = Extension.create<{
  getSuggestion: () => string;
}>({
  name: "suggestion-extension",

  addOptions() {
    return {
      getSuggestion: () => "",
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("suggestion"),
        props: {
          decorations: (state) => {
            const text = this.options.getSuggestion(); // ✅ React의 최신 값
            if (!text) return null;

            const { to, empty } = state.selection;
            if (!empty) return null;

            const deco = Decoration.widget(to, () => {
              const span = document.createElement("span");
              span.textContent = text;
              span.style.opacity = "0.5";
              span.style.color = "#999";
              span.style.pointerEvents = "none";
              span.style.whiteSpace = "pre-wrap";
              return span;
            });

            return DecorationSet.create(state.doc, [deco]);
          },
        },
      }),
    ];
  },
});
