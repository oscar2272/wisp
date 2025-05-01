import { Form, Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Textarea } from "~/common/components/ui/textarea";
import { Label } from "~/common/components/ui/label";
import { FileTextIcon } from "lucide-react";

export default function NoteNewPage() {
  return (
    <div className="mx-auto max-w-3xl py-10 px-4">
      <div className="mb-8 flex items-center gap-2">
        <FileTextIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">새 메모 작성</h1>
      </div>

      <Form method="post" className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="file_name">File Name</Label>
          <Input
            id="file_name"
            name="file_name"
            placeholder="File Name"
            className="text-lg"
            required
          />
        </div>
        <Label htmlFor="content">Content</Label>
        <div className="space-y-2 h-[calc(100vh-300px)] custom-scrollbar overflow-hidden">
          <Textarea
            id="content"
            name="content"
            placeholder="Content"
            className="h-full resize-none font-mono overflow-y-auto custom-scrollbar"
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" asChild>
            <Link to="/wisp/notes">취소</Link>
          </Button>
          <Button type="submit">저장하기</Button>
        </div>
      </Form>
    </div>
  );
}
