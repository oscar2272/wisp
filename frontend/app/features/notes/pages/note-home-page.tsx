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

const mockNotes = [
  {
    id: 1,
    title: "메모 제목 A",
    type: "작성한 메모",
    createdAt: "2024-12-01",
    updatedAt: "2024-12-01",
    likesCount: 2,
    isShared: false,
    isPublic: false,
    isExpired: false,
  },
  {
    id: 2,
    title: "비공개 공유 메모",
    type: "링크 공유",
    createdAt: "2025-01-03",
    updatedAt: "2025-01-04",
    likesCount: 0,
    isShared: true,
    isPublic: false,
    isExpired: false,
  },
  {
    id: 3,
    title: "추천 메모",
    type: "추천 메모",
    createdAt: "2025-01-03",
    updatedAt: "2025-01-10",
    likesCount: 10,
    isShared: true,
    isPublic: true,
    isExpired: false,
  },
];

export default function NoteHomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const mainTab = searchParams.get("tab") || "created";
  const subFilter = searchParams.get("filter") || "all";
  const sort = searchParams.get("sort") || "recent";
  const keyword = searchParams.get("q") || "";

  const handleMainTab = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    if (tab === "created") {
      params.delete("filter");
    }
    setSearchParams(params);
  };

  const handleSubFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", "shared");
    params.set("filter", value);
    setSearchParams(params);
  };

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    setSearchParams(params);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set("q", e.target.value);
    setSearchParams(params);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">내 메모 홈</h1>

      {/* 메인 탭 */}
      <Tabs value={mainTab}>
        <TabsList>
          <TabsTrigger value="created" onClick={() => handleMainTab("created")}>
            개인용 메모
          </TabsTrigger>
          <TabsTrigger value="shared" onClick={() => handleMainTab("shared")}>
            공유한 메모
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 필터 UI */}
      <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
        <Input
          placeholder="제목 검색..."
          value={keyword}
          onChange={handleSearch}
          className="w-full sm:w-48"
        />
        <div className="flex items-center gap-2">
          {mainTab === "shared" && (
            <Select value={subFilter} onValueChange={handleSubFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="공유 필터 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="public">공개된 메모</SelectItem>
                <SelectItem value="private">링크 공유</SelectItem>
                <SelectItem value="expired">만료된 메모</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Select value={sort} onValueChange={handleSort}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
              <SelectItem value="likes">추천순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="text-sm text-gray-500 mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>유형</TableHead>
              <TableHead className="text-right">수정일</TableHead>
              <TableHead className="text-right">만료일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockNotes.map((note) => (
              <TableRow key={note.id}>
                <TableCell className="font-medium">{note.title}</TableCell>
                <TableCell>{note.type}</TableCell>
                <TableCell className="text-right">{note.updatedAt}</TableCell>
                <TableCell className="text-right">
                  {note.isShared ? note.updatedAt : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
