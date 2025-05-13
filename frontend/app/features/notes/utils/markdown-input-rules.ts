// utils/markdown-input-rules.ts
import { InputRule } from "prosemirror-inputrules";
import { NodeType, MarkType } from "prosemirror-model";

export function headingInputRule(headingNode: NodeType) {
  return new InputRule(/^(#{1,6})\s$/, (state, match, start, end) => {
    const level = match[1].length;
    const tr = state.tr.replaceWith(start, end, headingNode.create({ level }));
    return tr;
  });
}

export function bulletListInputRule(
  bulletListNode: NodeType,
  listItemNode: NodeType
) {
  return new InputRule(/^([-*])\s$/, (state, _match, start, end) => {
    const tr = state.tr.replaceWith(
      start,
      end,
      bulletListNode.create({}, [listItemNode.create()])
    );
    return tr;
  });
}

export function orderedListInputRule(
  orderedListNode: NodeType,
  listItemNode: NodeType
) {
  return new InputRule(/^(\d+)\.\s$/, (state, match, start, end) => {
    const [, orderStr] = match;
    const order = parseInt(orderStr, 10);

    if (isNaN(order)) return null;

    const tr = state.tr;

    // 기존 텍스트 지우고 orderedList 생성
    const list = orderedListNode.create(
      { order }, // 중요: 시작 번호를 여기에 명시
      [listItemNode.create()]
    );

    tr.replaceWith(start, end, list);
    return tr;
  });
}

export function inlineMarkInputRule(mark: MarkType, pattern: RegExp) {
  return new InputRule(pattern, (state, match, start, end) => {
    const [okay, innerText] = match;
    if (!okay) return null;
    const tr = state.tr;
    if (innerText) {
      tr.insertText(innerText, start, end);
      tr.addMark(start, start + innerText.length, mark.create());
    }
    return tr;
  });
}
