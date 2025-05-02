import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import type { UserProfileWithEmail } from "~/features/profiles/type";
import { useOutletContext, useNavigate } from "react-router";
import { Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/common/components/ui/tooltip";

export default function ProfilePage() {
  const { profile } = useOutletContext<{ profile: UserProfileWithEmail }>();
  const navigate = useNavigate();
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      {/* 프로필 정보 */}
      <div className="flex items-center justify-between p-6 bg-card rounded-lg">
        <div className="flex items-center gap-6">
          <Avatar className="w-32 h-32 rounded-full">
            {profile.avatar ? (
              <AvatarImage
                src={profile.avatar}
                alt={profile.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <AvatarFallback className="text-2xl">
                {profile.name?.[0]}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-2">
            <p className="text-2xl font-semibold">{profile.name}</p>
            <p className="text-lg text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        {/* 아이콘 버튼 그룹 */}
        <div className="flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/wisp/profile/edit")}
                className="hover:bg-primary/10"
              >
                <Pencil className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>프로필 수정</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/10 text-destructive"
                onClick={() => {
                  // if (
                  //   confirm("정말 계정을 삭제하시겠습니까?")) {
                  // }
                }}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>계정 삭제</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
