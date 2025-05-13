import { Button } from "~/common/components/ui/button";
import type { Route } from "./+types/note-edit-page";
import { useState } from "react";
import { Form, Link, redirect, useFetcher, useNavigate } from "react-router";
import { ClientOnly } from "remix-utils/client-only";
import TiptapMarkdownEditor from "../components/mardown-editor.client";
import { getToken } from "~/features/profiles/api";
import { getEditNote, updateNote } from "../api";
import { z } from "zod";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const token = await getToken(request);
  if (!token) {
    return { error: "Unauthorized" };
  }
  const rawId = params.id.replace("note-", "");
  const { note } = await getEditNote(rawId, token as string);

  return { note, id: params.id };
};
const formSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
});
export const action = async ({ request, params }: Route.ActionArgs) => {
  const formData = await request.formData();
  const result = formSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
  if (!result.success) {
    return result.error.flatten().fieldErrors;
  }
  const title = result.data.title;
  const content = result.data.content;
  const rawId = params.id.replace("note-", "");
  const token = await getToken(request);
  if (!token) {
    return { error: "Unauthorized" };
  }
  await updateNote(
    rawId as string,
    title as string,
    content as string,
    token as string
  );

  return redirect(`/wisp/notes/note-${rawId}`);
};

export default function NoteNewPage({ loaderData }: Route.ComponentProps) {
  const { note, id } = loaderData;

  const [title, setTitle] = useState(note!.title);
  const [content, setContent] = useState(note!.content);

  return (
    <main className="max-w-7xl pt-10 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      {/* 제목 입력 */}
      <Form method="post">
        <div className="flex-1">
          <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="px-4">
              <input
                type="text"
                value={title}
                name="title"
                required
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full px-2 text-3xl font-bold py-6 border-none bg-transparent focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* 입력 + 미리보기 */}
          <div className="px-4">
            <input type="hidden" name="content" value={content} />
            <ClientOnly fallback={<p>에디터 로딩 중...</p>}>
              {() => (
                <TiptapMarkdownEditor
                  initialContent={content}
                  onChange={({ markdown }) => setContent(markdown)}
                />
              )}
            </ClientOnly>
          </div>
        </div>

        {/* 버튼 */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-2">
          <div className="max-w-7xl mx-auto flex flex-row justify-end gap-3 px-8">
            <Button type="submit">저장</Button>
            <Button variant="outline" type="button" asChild>
              <Link to={`/wisp/notes/${id}`}>취소</Link>
            </Button>
          </div>
        </div>
      </Form>
    </main>
  );
}
