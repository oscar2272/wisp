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

// export function orderedListInputRule(
//   orderedListNode: NodeType,
//   listItemNode: NodeType
// ) {
//   return new InputRule(/^(\d+)\.\s$/, (state, match, start, end) => {
//     console.log("🔥 OrderedList input rule matched!", match); // ✅ 확인용 로그
//     const [, orderStr] = match;
//     const order = parseInt(orderStr, 10);
//     if (isNaN(order)) return null;

//     const { tr, schema } = state;

//     // 새로운 리스트 생성
//     const listItem = listItemNode.create();
//     const orderedList = orderedListNode.create({ order }, [listItem]);

//     tr.replaceWith(start, end, orderedList);
//     return tr;
//   });
// }

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
// export function taskListInputRule(
//   taskListNode: NodeType,
//   taskItemNode: NodeType
// ) {
//   return new InputRule(/^-\s\[( |x|X)\]\s$/, (state, match, start, end) => {
//     console.log("🔥 Rule matched:", match);
//     const checked = match[1].toLowerCase() === "x";

//     const { tr, schema } = state;
//     const paragraph = schema.nodes.paragraph.create();
//     const taskItem = taskItemNode.create({ checked }, paragraph);
//     const taskList = taskListNode.create({}, [taskItem]);

//     return tr.replaceWith(start, end, taskList);
//   });
// }

// export function orderedListInputRuleWithIndent(
//   orderedListNode: NodeType,
//   listItemNode: NodeType
// ) {
//   return new InputRule(/^(\s*)(\d+)\.\s$/, (state, match, start, end) => {
//     const [_, spaces, orderStr] = match;
//     const order = parseInt(orderStr, 10);
//     if (isNaN(order)) return null;

//     const level = Math.floor(spaces.length / 2); // 2칸마다 한 단계 들여쓰기
//     const tr = state.tr.delete(start, end);

//     let nested = listItemNode.create(); // 가장 안쪽 listItem

//     // 중첩 구조 생성: listItem > orderedList > listItem ...
//     for (let i = 0; i < level; i++) {
//       nested = listItemNode.create({}, orderedListNode.create({}, [nested]));
//     }

//     const topList = orderedListNode.create({ order }, [nested]);
//     tr.insert(start, topList);
//     return tr;
//   });
// }
