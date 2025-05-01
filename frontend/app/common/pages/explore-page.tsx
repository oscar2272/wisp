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

// mock loader
export const loader = async ({ request }: Route.LoaderArgs) => {
  const notes = [
    {
      id: "n1",
      title: "공유된 메모 예시",
      content: "이건 다른 사용자가 공유한 메모입니다.",
      createdAt: "2025-05-01",
      author: {
        name: "hyeongyu",
        avatarUrl: "https://i.pravatar.cc/150?u=user1",
      },
      stats: {
        views: 128,
        comments: 3,
      },
    },
    {
      id: "n2",
      title: "비밀번호 전달 링크",
      content: "이 메모는 보안이 중요한 내용을 담고 있습니다.",
      createdAt: "2025-04-25",
      author: {
        name: "alice",
        avatarUrl: "https://i.pravatar.cc/150?u=user2",
      },
      stats: {
        views: 300,
        comments: 5,
      },
    },
    {
      id: "n3",
      title: "공유된 메모 예시",
      content: "이건 다른 사용자가 공유한 메모입니다.",
      createdAt: "2025-05-01",
      author: {
        name: "hyeongyu",
        avatarUrl: "https://i.pravatar.cc/150?u=user1",
      },
      stats: {
        views: 128,
        comments: 3,
      },
    },
    {
      id: "n4",
      title: "공유된 메모 예시",
      content: "이건 다른 사용자가 공유한 메모입니다.",
      createdAt: "2025-05-01",
      author: {
        name: "hyeongyu",
        avatarUrl: "https://i.pravatar.cc/150?u=user1",
      },
      stats: {
        views: 128,
        comments: 3,
      },
    },
  ];

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

        <TabsContent value="popular">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                postId={note.id}
                title={note.title}
                date={note.createdAt}
                imageUrl="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4"
                description={note.content}
                author={note.author}
                stats={note.stats}
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
                date={note.createdAt}
                imageUrl="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4"
                description={note.content}
                author={note.author}
                stats={note.stats}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
