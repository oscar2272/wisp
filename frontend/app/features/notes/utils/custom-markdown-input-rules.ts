// extensions/CustomMarkdownInputRules.ts
import { Extension } from "@tiptap/core";
import { InputRule, inputRules } from "prosemirror-inputrules";
import {
  headingInputRule,
  bulletListInputRule,
  orderedListInputRule,
  inlineMarkInputRule,
} from "../utils/markdown-input-rules";

export const CustomMarkdownInputRules = Extension.create({
  name: "customMarkdownInputRules",
  addProseMirrorPlugins() {
    return [
      inputRules({
        rules: [
          headingInputRule(this.editor.schema.nodes.heading),
          bulletListInputRule(
            this.editor.schema.nodes.bulletList,
            this.editor.schema.nodes.listItem
          ),
          orderedListInputRule(
            this.editor.schema.nodes.orderedList,
            this.editor.schema.nodes.listItem
          ),
          inlineMarkInputRule(
            this.editor.schema.marks.highlight,
            /==([^=]+)==$/
          ),

          inlineMarkInputRule(this.editor.schema.marks.strike, /~~([^~]+)~~$/),
          new InputRule(
            /^\[(.+?)\]\((https?:\/\/[^\s)]+|www\.[^\s)]+)\)$/,
            (state, match, start, end) => {
              const [, text, rawHref] = match;
              const { schema, tr } = state;
              const markType = schema.marks.link;
              if (!markType) return null;

              const href = rawHref.startsWith("http")
                ? rawHref
                : `https://${rawHref}`;

              const linkText = schema.text(text.trim(), [
                markType.create({ href }),
              ]);
              return tr.replaceWith(start, end, linkText);
            }
          ),
        ],
      }),
    ];
  },
});
