import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/common/components/ui/tabs";

import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";
import { Form } from "react-router";
import type { Route } from "./+types/explore-page";
import { NoteCard } from "~/common/components/note-card";
import { getNoteList } from "../api";
import type { NoteList } from "~/features/notes/type";
import type { JSONContent } from "@tiptap/react";
// mock loader
export const loader = async ({ request }: Route.LoaderArgs) => {
  const notes = (await getNoteList()) as NoteList[];
  if (notes.length === 0) {
    return { notes: [] };
  } else {
    const parsed: JSONContent =
      typeof notes[0].content === "string"
        ? JSON.parse(notes[0].content)
        : notes[0].content;
  }

  return { notes };
};

export default function ExploreNotePage({ loaderData }: Route.ComponentProps) {
  const { notes } = loaderData;
  return (
    <div className="flex flex-col w-full py-4">
      <Tabs defaultValue="popular" className="w-full">
        <div className="flex flex-row justify-between items-center w-full">
          <TabsList className="gap-x-2 items-start">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="newest">Newest</TabsTrigger>
          </TabsList>
          <Form className="flex justify-center items-center gap-2 max-w-screen-sm">
            <Input
              name="query"
              placeholder="Search for public notes"
              className="text-lg"
            />
            <Button type="submit">Search</Button>
          </Form>
        </div>
        {notes.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-2xl font-bold">No notes found</p>
          </div>
        ) : (
          <>
            <TabsContent value="popular">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-6">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    postId={note.id}
                    title={note.title}
                    date={note.updated_at}
                    expires_at={note.expires_at}
                    description={note.content.content!}
                    author={note.author}
                    views={note.seen_count}
                    comments={note.comments_count}
                    likes={note.likes_count}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="newest">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-6">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    postId={note.id}
                    title={note.title}
                    date={note.updated_at}
                    expires_at={note.expires_at}
                    description={note.content.content!}
                    author={note.author}
                    views={note.seen_count}
                    comments={note.comments_count}
                    likes={note.likes_count}
                  />
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
