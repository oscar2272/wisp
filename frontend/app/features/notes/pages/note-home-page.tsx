import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "~/common/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "~/common/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/common/components/ui/select";
import { Input } from "~/common/components/ui/input";
import { useSearchParams } from "react-router";
import { Checkbox } from "~/common/components/ui/checkbox";
import type { Route } from "./+types/note-home-page";
import { getToken } from "~/features/profiles/api";
import { getNoteHome } from "../api";
import { DateTime } from "luxon";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from "~/common/components/ui/pagination";

export async function loader({ request }: Route.LoaderArgs) {
  const token = await getToken(request);
  if (!token) {
    return { error: "Unauthorized" };
  }
  const url = new URL(request.url);
  const searchParams = url.search;
  const notes = await getNoteHome(token, searchParams);
  return { notes };
}
export default function NoteHomePage({ loaderData }: Route.ComponentProps) {
  const {
    results: notes = [],
    count = 0,
    next,
    previous,
  } = loaderData.notes || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 13;
  const totalPages = Math.ceil(count / pageSize);
  const mainTab = searchParams.get("type") || "all";
  const sort = searchParams.get("sort") || "recent";
  const keyword = searchParams.get("q") || "";
  const status = searchParams.get("status") || "all";

  const [tempKeyword, setTempKeyword] = useState(keyword);

  const handleParamChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    if (key !== "q") {
      setTempKeyword("");
    }
    params.set(key, value);
    setSearchParams(params);
  };

  const handleSearch = () => {
    handleParamChange("q", tempKeyword);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };
  return (
    <div className="flex flex-col w-full py-4 space-y-6">
      <h1 className="text-2xl font-bold">내 메모 홈</h1>

      {/* 메인 탭 */}
      <Tabs
        value={mainTab}
        onValueChange={(val) => handleParamChange("type", val)}
        className="flex flex-row items-start"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="shared">Share</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="private">Private</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 필터 UI */}
      <div className="mt-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="파일명 검색"
            value={tempKeyword}
            onChange={(e) => setTempKeyword(e.target.value)}
            className="w-full sm:w-48"
          />
          <button
            onClick={handleSearch}
            className="bg-gray-800 text-white px-4 py-2 rounded text-sm"
          >
            검색
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={status}
            onValueChange={(value) => handleParamChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="만료 여부" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 메모</SelectItem>
              <SelectItem value="is_expired">만료된 메모</SelectItem>
              <SelectItem value="is_not_expired">만료되지 않은 메모</SelectItem>
              <SelectItem value="null">무기한</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => handleParamChange("sort", value)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
              <SelectItem value="likes">추천순</SelectItem>
              <SelectItem value="comments">댓글순</SelectItem>
              <SelectItem value="views">조회순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="text-sm text-gray-600 mt-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>파일명</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>공개</TableHead>
              <TableHead className="text-right">추천</TableHead>
              <TableHead className="text-right">댓글</TableHead>
              <TableHead className="text-right">조회</TableHead>
              <TableHead className="text-right">수정일</TableHead>
              <TableHead className="text-right">만료일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  메모가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              notes.map((note: any) => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">
                    {note.file_name}
                  </TableCell>
                  <TableCell>{note.title}</TableCell>
                  <TableCell>{note.type}</TableCell>
                  <TableCell className="text-right">
                    {note.likes_count}
                  </TableCell>
                  <TableCell className="text-right">
                    {note.comments_count}
                  </TableCell>
                  <TableCell className="text-right">
                    {note.seen_count}
                  </TableCell>
                  <TableCell className="text-right">
                    {DateTime.fromISO(note.updated_at).toFormat("yyyy.MM.dd")}
                  </TableCell>
                  <TableCell className="text-right">
                    {note.expires_at
                      ? DateTime.fromISO(note.expires_at).toFormat("yyyy.MM.dd")
                      : "무기한"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) goToPage(currentPage - 1);
              }}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, idx) => {
            const page = idx + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault(); // 브라우저 기본 이동 방지
                    goToPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) goToPage(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
