import { useEffect, useState } from "react";
import { LinkIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/common/components/ui/select";
import { Calendar } from "~/common/components/ui/calendar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "~/common/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "~/common/components/ui/radio-group";
import { Label } from "~/common/components/ui/label";
import { useFetcher, useParams } from "react-router";
import { DateTime } from "luxon";
import { Button } from "~/common/components/ui/button";

interface ShareDialogProps {
  onSave?: (data: {
    shareType: "private" | "public" | "shared" | "expired";
    expiryDate?: Date;
    expiryOption?: "무기한" | "1일" | "7일" | "30일";
  }) => void;
}

export function ShareDialog({ onSave }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [shareType, setShareType] = useState<
    "private" | "public" | "shared" | "expired"
  >("private");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    DateTime.now().plus({ days: 1 }).toJSDate()
  );
  const [expiryOption, setExpiryOption] = useState<
    "무기한" | "1일" | "7일" | "30일"
  >("무기한");
  const [expiryTabValue, setExpiryTabValue] = useState<"calendar" | "options">(
    "options"
  );
  const params = useParams();
  const fetcher = useFetcher();
  useEffect(() => {
    // 혹시 다른 컴포넌트가 이 값을 건드렸다면 복원
    if (!open) {
      document.body.style.pointerEvents = "auto";
    }

    return () => {
      // ESC로 닫히는 경우 포함하여 항상 복원
      document.body.style.pointerEvents = "auto";
    };
  }, [open]);
  const handleSave = () => {
    const formData = new FormData();
    formData.append("shareType", shareType);
    formData.append("id", params.id!);
    let expiryDateToSend: string | null = null;

    if (expiryTabValue === "calendar" && expiryDate) {
      const targetDate = DateTime.fromJSDate(expiryDate).startOf("day");
      expiryDateToSend = targetDate.toISO();
    } else if (expiryTabValue === "options") {
      const now = DateTime.now();

      const optionMap: Record<string, number | null> = {
        무기한: null,
        "1일": 1,
        "7일": 7,
        "30일": 30,
      };

      const days = optionMap[expiryOption];
      if (days) {
        expiryDateToSend = now.plus({ days }).toISO(); // 현재 시간 기준으로 덧셈
      }
    }

    if (shareType !== "private" && expiryDateToSend) {
      formData.append("expiryDate", expiryDateToSend);
    }
    // 만료처리 일경우 현재날짜로 추가
    if (shareType === "expired") {
      formData.append("expiryDate", DateTime.now().toISO());
    }
    fetcher.submit(formData, {
      action: `/wisp/notes/${params.id}`,
      method: "PATCH",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          type="button"
          className="flex flex-row justify-start w-full items-center  gap-2"
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          공유 설정
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>공유 설정</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">공유 유형</label>
            <Select
              value={shareType}
              onValueChange={(value: "private" | "public" | "shared") =>
                setShareType(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="공유 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">비공개</SelectItem>
                <SelectItem value="public">공개</SelectItem>
                <SelectItem value="shared">링크 공유</SelectItem>
                <SelectItem value="expired">만료 처리</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(shareType === "public" || shareType === "shared") && (
            <div className="grid gap-2">
              <label className="text-sm font-medium">만료 기간</label>
              <Tabs
                value={expiryTabValue}
                onValueChange={(value: string) => {
                  setExpiryTabValue(value as "calendar" | "options");
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="options">기간 선택</TabsTrigger>
                  <TabsTrigger value="calendar">날짜 선택</TabsTrigger>
                </TabsList>
                <TabsContent value="options" className="pt-4 min-h-[300px]">
                  <RadioGroup
                    value={expiryOption}
                    onValueChange={(v: "무기한" | "1일" | "7일" | "30일") =>
                      setExpiryOption(v)
                    }
                    className="flex flex-col space-y-12"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="무기한" id="r1" />
                      <Label htmlFor="r1">무기한</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1일" id="r2" />
                      <Label htmlFor="r2">1일</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="7일" id="r3" />
                      <Label htmlFor="r3">7일</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30일" id="r4" />
                      <Label htmlFor="r4">30일</Label>
                    </div>
                  </RadioGroup>
                </TabsContent>
                <TabsContent
                  value="calendar"
                  className="pt-4 mx-auto min-h-[300px] "
                >
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    disabled={(date) =>
                      DateTime.fromJSDate(date).startOf("day") <=
                      DateTime.now().startOf("day")
                    }
                    initialFocus
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button
            onClick={() => {
              handleSave();
            }}
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
