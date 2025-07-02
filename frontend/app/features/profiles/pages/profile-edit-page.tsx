import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/common/components/ui/alert";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import type { UserProfileWithEmail } from "~/features/profiles/type";
import { useOutletContext, useNavigate, Form, redirect } from "react-router";
import { ArrowLeft, Upload } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import type { Route } from "./+types/profile-edit-page";
import { updateUserProfile } from "../api";
import {
  containsHangulJamo,
  containsProfanity,
  containsAdmin,
} from "../utils/name-filter";
import { makeSSRClient } from "~/supa-client";
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const formSchema = z.object({
  name: z
    .string()
    .min(3, "최소 3자 이상 15자 이하로 입력해주세요.")
    .max(15, "최소 3자 이상 15자 이하로 입력해주세요.")
    .regex(/^[\p{L}0-9]+$/u, "문자, 숫자만 사용할 수 있습니다.")
    .refine((val) => !containsHangulJamo(val), {
      message: "한글 (초성)만으로 이루어진 닉네임은 사용할 수 없습니다.",
    })
    .refine((val) => !containsProfanity(val), {
      message: "비속어를 포함할 수 없습니다.",
    })
    .refine((val) => !containsAdmin(val), {
      message: "관리자 닉네임은 사용할 수 없습니다.",
    }),
  avatar: z.preprocess(
    (file) => {
      if (
        file instanceof File &&
        file.size === 0 &&
        file.name === "" &&
        file.type === "application/octet-stream"
      ) {
        return undefined; // 빈 파일은 무시
      }
      return file;
    },
    z
      .any()
      .refine(
        (file) =>
          file === undefined || file instanceof File || file instanceof Blob,
        { message: "유효한 파일이 아닙니다." }
      )
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
        message: "파일 크기는 3MB 이하여야 합니다.",
      })
      .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "PNG, JPEG, JPG, WEBP 형식만 허용됩니다.",
      })
      .optional()
  ),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData);
  if (!formValues?.avatar && !formValues?.name) {
    return null;
  }
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return { formErrors: error.flatten().fieldErrors };
  }
  const { name, avatar } = data;
  const { client } = makeSSRClient(request);
  const token = await client.auth
    .getSession()
    .then((r) => r.data.session?.access_token);
  if (!token) {
    return { globalError: "로그인이 필요합니다." };
  }
  const status = await updateUserProfile(token, avatar ?? null, name);
  if (status == 200) {
    return redirect("/wisp/profile");
  } else {
    return { globalError: "프로필 수정에 실패했습니다." };
  }
};

export default function ProfileEditPage({ actionData }: Route.ComponentProps) {
  const { profile } = useOutletContext<{ profile: UserProfileWithEmail }>();
  const [avatar, setAvatar] = useState<string | null>(profile.avatar);

  const navigate = useNavigate();
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setAvatar(URL.createObjectURL(file));
    }
  };
  return (
    <div className="py-8 px-14 max-w-2xl mx-auto space-y-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/wisp/profile")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">프로필 수정</h1>
      </div>

      <Form method="post" encType="multipart/form-data" className="space-y-8">
        {/* 프로필 이미지 섹션 */}
        <div className="flex flex-col items-center gap-6 bg-card rounded-lg">
          <div className="flex flex-col items-center gap-2">
            {/* ✅ label 클릭 → input[type=file] 클릭 효과 */}
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="size-40 rounded-full shadow-xl overflow-hidden">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center"></div>
                )}
              </div>
            </label>

            {/* ✅ 실제 input은 숨김 */}
            <input
              id="avatar-upload"
              type="file"
              name="avatar"
              className="hidden"
              onChange={onChange}
            />

            <div className="flex flex-col text-xs">
              <span className="text-muted-foreground">
                Recommended size: 128x128px
              </span>
              <span className="text-muted-foreground">
                Allowed formats: PNG, JPEG, JPG, WEBP
              </span>
              <span className="text-muted-foreground">Max file size: 3MB</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            프로필 이미지를 변경하려면 클릭하세요
          </p>
          {actionData?.formErrors?.avatar ? (
            <div className="w-full">
              <Alert variant="default">
                <AlertTitle>이미지 업로드 오류</AlertTitle>
                <AlertDescription className="text-sm">
                  {actionData.formErrors.avatar.join(", ")}
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="w-full h-2"></div>
          )}
        </div>

        {/* 프로필 정보 폼 */}
        <div className="space-y-6 bg-card rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg">
              닉네임
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={profile.name}
              className="text-lg h-12"
            />
          </div>
          {actionData?.formErrors?.name && (
            <div className="w-full mt-2">
              <Alert variant="destructive">
                <AlertTitle>{actionData.formErrors.name.join(", ")}</AlertTitle>
              </Alert>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              className="text-lg h-12 bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              이메일은 변경할 수 없습니다
            </p>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => navigate("/wisp/profile")}
          >
            취소
          </Button>
          <Button type="submit" variant="default" size="lg" className="flex-1">
            변경사항 저장
          </Button>
        </div>
      </Form>
    </div>
  );
}
