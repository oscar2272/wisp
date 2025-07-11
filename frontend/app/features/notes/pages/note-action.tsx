// app/routes/wisp/notes.tsx (또는 _layout.tsx)
import {
  createFolder,
  createNote,
  deleteFolder,
  deleteFolderAndNote,
  deleteNote,
  renameFolder,
  renameNote,
} from "~/features/notes/api";
import type { Route } from "./+types/note-action";
import { z } from "zod";
import {
  containsHangulJamo,
  containsProfanity,
} from "~/features/profiles/utils/name-filter";
import { makeSSRClient } from "~/supa-client";
const formSchema = z.object({
  name: z
    .string()
    .min(1, "파일 이름은 최소 1글자 이상 최대 15글자 이하여야 합니다.")
    .max(15, "파일 이름은 최소 1글자 이상 최대 15글자 이하여야 합니다.")
    .regex(/^[\p{L}0-9]+$/u, "문자, 숫자만 사용할 수 있습니다.")
    .refine((val) => !containsHangulJamo(val), {
      message: "한글 (초성)만으로 이루어진 닉네임은 사용할 수 없습니다.",
    })
    .refine((val) => !containsProfanity(val), {
      message: "비속어를 포함할 수 없습니다.",
    })
    .optional(),
  parentId: z.string().optional(),
  type: z.enum(["folder", "note"]).optional(),
});

export async function action({ request }: Route.ActionArgs) {
  const { client } = makeSSRClient(request);
  const actionToken = await client.auth
    .getSession()
    .then((r) => r.data.session?.access_token);
  const formData = await request.formData();
  const { data, success, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return { fieldErrors: error.flatten().fieldErrors };
  }
  if (request.method === "DELETE") {
    const ids = formData.get("ids")?.toString();
    const idsArray: string[] = JSON.parse(ids!);
    if (idsArray && idsArray.length > 1) {
      await deleteFolderAndNote(idsArray, actionToken!);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (idsArray && idsArray.length == 1) {
      const id = idsArray[0];
      // 단일 삭제
      const rawId = id?.replace("folder-", "").replace("note-", "");
      if (id?.startsWith("folder-")) {
        await deleteFolder(Number(rawId), actionToken!);
      } else if (id?.startsWith("note-")) {
        await deleteNote(Number(rawId), actionToken!);
      }

      return new Response(JSON.stringify({ success: true, id }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (request.method === "POST") {
    const name = formData.get("name");
    const parentId = formData.get("parentId");
    const type = formData.get("type");

    if (type === "folder") {
      const response = await createFolder(
        name as string,
        actionToken!,
        parentId as string
      );
      return new Response(
        JSON.stringify({
          success: true,
          id: response.id,
          name: response.name,
          type: "folder",
          parentId,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else if (type === "note") {
      const response = await createNote(
        name as string,
        actionToken!,
        parentId as string
      );
      return new Response(
        JSON.stringify({
          success: true,
          id: response.id,
          name: response.name,
          type: "note",
          parentId,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
  if (request.method === "PATCH") {
    const name = formData.get("name");
    const id = formData.get("id");
    const rawId = id?.toString().replace("folder-", "").replace("note-", "");
    if (id?.toString().startsWith("folder-")) {
      const response = await renameFolder(
        rawId as string,
        name as string,
        actionToken!
      );
      return new Response(
        JSON.stringify({
          success: true,
          id: response.id,
          name: response.name,
          type: "folder",
          parentId: response.parentId,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else if (id?.toString().startsWith("note-")) {
      const response = await renameNote(
        rawId as string,
        name as string,
        actionToken!
      );
      return new Response(
        JSON.stringify({
          success: true,
          id: response.id,
          name: response.name,
          type: "note",
          parentId: response.parentId,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  return null;
}

export function HydrateFallback() {
  return <p>Loading Game...</p>;
}
