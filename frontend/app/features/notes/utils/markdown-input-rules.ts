// utils/markdown-input-rules.ts
import { InputRule } from "prosemirror-inputrules";
import { NodeType, MarkType } from "prosemirror-model";
// export function orderedListInputRuleWithIndent(
//   orderedListNode: NodeType,
//   listItemNode: NodeType
// ) {
//   return new InputRule(/^(\s*)(\d+)\.\s$/, (state, match, start, end) => {
//     const [_, spaces, orderStr] = match;
//     const order = parseInt(orderStr, 10);
//     if (isNaN(order)) return null;

//     const level = Math.floor(spaces.length / 2); // 공백 2칸마다 한 단계

//     const tr = state.tr.delete(start, end);

//     // 가장 안쪽 listItem
//     let nestedItem = listItemNode.create();

//     // level만큼 감싸기: listItem > orderedList > listItem ...
//     for (let i = 0; i < level; i++) {
//       nestedItem = listItemNode.create(
//         {},
//         orderedListNode.create({}, [nestedItem])
//       );
//     }

//     const topList = orderedListNode.create({ order }, [nestedItem]);

//     tr.insert(start, topList);
//     return tr;
//   });
// }

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
