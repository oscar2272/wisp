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
import { useSearchParams, useNavigate } from "react-router";
const mockNotes = [
  { id: 1, title: "메모 제목 A", type: "작성한 메모", createdAt: "2024-12-01" },
  {
    id: 2,
    title: "비공개 공유 메모",
    type: "링크 공유",
    createdAt: "2025-01-03",
  },
];
export default function NoteHomePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const mainTab = searchParams.get("tab") || "created";
  const subFilter = searchParams.get("filter") || "all";

  const handleMainTab = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    if (tab === "created") {
      params.delete("filter");
    }
    navigate(`?${params.toString()}`);
  };

  const handleSubFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", "shared");
    params.set("filter", value);
    navigate(`?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">내 메모 홈</h1>

      {/* 메인 탭 */}
      <Tabs value={mainTab}>
        <TabsList>
          <TabsTrigger value="created" onClick={() => handleMainTab("created")}>
            작성한 메모
          </TabsTrigger>
          <TabsTrigger value="shared" onClick={() => handleMainTab("shared")}>
            공유한 메모
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 아래는 필터 상태 텍스트 */}
      <div className="mt-6 h-7 text-sm text-muted-foreground flex justify-between items-center">
        <div className="">
          현재 보기:{" "}
          <strong>
            {mainTab === "created"
              ? "작성한 메모 전체"
              : {
                  all: "모든 공유 메모",
                  public: "공개된 메모",
                  private: "비공개 링크 공유",
                  expired: "만료된 메모",
                }[subFilter]}
          </strong>
        </div>
        <div className="">
          {/* 공유한 메모의 하위 필터 */}
          {mainTab === "shared" && (
            <div className="">
              <Select value={subFilter} onValueChange={handleSubFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="공유 필터 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="public">공개된 메모</SelectItem>
                  <SelectItem value="private">비공개 링크 공유</SelectItem>
                  <SelectItem value="expired">만료된 메모</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>유형</TableHead>
              <TableHead className="text-right">작성일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockNotes.map((note) => (
              <TableRow key={note.id}>
                <TableCell className="font-medium">{note.title}</TableCell>
                <TableCell>{note.type}</TableCell>
                <TableCell className="text-right">{note.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
