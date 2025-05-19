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
    return { notes };
  }
};

export default function ExploreNotePage({ loaderData }: Route.ComponentProps) {
  const { notes } = loaderData;
  return (
    <div className="flex flex-col w-full py-4">
      <Tabs defaultValue="popular" className="w-full">
        <div className="flex flex-row justify-between items-center w-full">
          <TabsList className="h-9 bg-transparent p-0 gap-x-6">
            <TabsTrigger
              value="popular"
              className="relative px-0 pb-2 h-9 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-primary text-base font-medium"
              onClick={() => {}}
            >
              Popular
            </TabsTrigger>
            <TabsTrigger
              value="newest"
              className="relative px-0 pb-2 h-9 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-primary text-base font-medium"
            >
              Newest
            </TabsTrigger>
          </TabsList>
          <Form className="flex justify-center items-center gap-2 max-w-screen-sm">
            <Input
              name="query"
              placeholder="Search for public notes"
              className="text-lg"
              disabled
            />
            <Button type="submit">Search</Button>
          </Form>
        </div>
        {notes.length === 0 ? (
          <div className="flex my-auto mx-auto justify-center items-center h-full">
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
