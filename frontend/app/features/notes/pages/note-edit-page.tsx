import { Button } from "~/common/components/ui/button";
import type { Route } from "./+types/note-edit-page";
import { useState } from "react";
import { Form, Link } from "react-router";
import { ClientOnly } from "remix-utils/client-only";
import TiptapMarkdownEditor from "../components/mardown-editor.client";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const note = {
    title: "테스트 메모",
    content: "content",
  };
  return { note };
};
export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  console.log("제목:", title);
  console.log("내용:", content);

  return null;
};

export default function NoteNewPage({ loaderData }: Route.ComponentProps) {
  const { note } = loaderData;
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  return (
    <main className="max-w-5xl mx-auto pb-4 pt-10 px-4 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      {/* 제목 입력 */}
      <Form method="post">
        <div className="flex-1">
          <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 shadow-sm">
            <div className="max-w-5xl mx-auto px-4">
              <input
                type="text"
                value={title}
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full text-2xl font-bold py-4 border-none bg-transparent focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* 입력 + 미리보기 */}
          <div className="">
            <input type="hidden" name="content" value={content} />
            <ClientOnly fallback={<p>에디터 로딩 중...</p>}>
              {() => (
                <TiptapMarkdownEditor
                  onChange={({ markdown }) => setContent(markdown)}
                />
              )}
            </ClientOnly>
          </div>
        </div>

        {/* 버튼 */}
        <div className="bg-white dark:bg-slate-900 py-4 px-4">
          <div className="max-w-5xl mx-auto flex flex-row justify-end gap-3">
            <Button type="submit">저장</Button>
            <Button variant="outline" type="button" asChild>
              <Link to="/wisp/notes">취소</Link>
            </Button>
          </div>
        </div>
      </Form>
    </main>
  );
}
