// app/routes/signup/page.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";
import { Link, redirect, useFetcher, useActionData } from "react-router";
import { makeSSRClient } from "~/supa-client";
import { z } from "zod";
import { Alert, AlertTitle } from "~/common/components/ui/alert";
import { signupWithPassword } from "~/features/profiles/api";
import type { Route } from "./+types/email-signup-page";
import { useState } from "react";
import { toast } from "sonner";
import {
  containsAdmin,
  containsHangulJamo,
  containsProfanity,
} from "~/features/profiles/utils/name-filter";

const formSchema = z
  .object({
    email: z
      .string({ required_error: "이메일을 입력하세요." })
      .email("유효한 이메일을 입력하세요."),
    password: z.string().min(6, "비밀번호는 최소 6자리 이상이어야 합니다."),
    confirmPassword: z.string(),
    nickname: z
      .string()
      .min(3, "닉네임을 입력하세요.")
      .refine((val) => !containsHangulJamo(val), {
        message: "한글 (초성)만으로 이루어진 닉네임은 사용할 수 없습니다.",
      })
      .refine((val) => !containsProfanity(val), {
        message: "비속어를 포함할 수 없습니다.",
      })
      .refine((val) => !containsAdmin(val), {
        message: "관리자 닉네임은 사용할 수 없습니다.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const parsed = formSchema.safeParse(Object.fromEntries(formData));

  if (parsed.success === false) {
    const formErrors: Record<string, string> = {};

    const passwordError = parsed.error.errors.find(
      (err) => err.path[0] === "password"
    );
    if (passwordError) {
      formErrors["password"] = passwordError.message;
    }

    const confirmError = parsed.error.errors.find(
      (err) => err.path[0] === "confirmPassword"
    );
    if (confirmError) {
      formErrors["confirmPassword"] = confirmError.message;
    }

    parsed.error.errors.forEach((err) => {
      const field = err.path[0];
      if (!formErrors[field]) {
        formErrors[field] = err.message;
      }
    });

    return { formErrors }; // ✅ 항상 이 형태로 반환
  }

  const { email, password, nickname } = parsed.data;
  const { client, headers } = makeSSRClient(request);

  // Supabase 회원가입
  const { error } = await client.auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  });
  if (error?.status === 422 && error?.code === "user_already_exists") {
    return { formErrors: { email: "이미 가입된 이메일입니다." } };
  } else {
    const { data: loginData, error: loginError } =
      await client.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      return { formErrors: { general: "회원가입은 되었으나 로그인 실패" } };
    }

    const freshToken = loginData.session?.access_token;
    if (!freshToken) {
      return { formErrors: { general: "로그인 후 토큰 획득 실패" } };
    }

    await signupWithPassword(email, nickname, freshToken);

    return redirect("/", {
      headers,
    });
  }
};

export default function SignupPage({ actionData }: Route.ComponentProps) {
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [nickname, setNickname] = useState("");
  const fetcher = useFetcher();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px] p-6">
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>이메일로 회원가입을 진행하세요</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <fetcher.Form method="post" className="space-y-2">
            <Input type="email" name="email" placeholder="이메일" />
            {fetcher.data?.formErrors?.email && (
              <Alert variant="destructive">
                <AlertTitle>{fetcher.data.formErrors.email}</AlertTitle>
              </Alert>
            )}

            <div className="flex gap-2">
              <Input
                type="text"
                name="nickname"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setIsNicknameChecked(false); // ✅ 입력값 바뀌면 중복검사 상태 초기화
                }}
              />
              <Button
                type="button"
                onClick={async () => {
                  const nickname = (
                    document.querySelector(
                      "input[name='nickname']"
                    ) as HTMLInputElement
                  )?.value;
                  if (!nickname) return;
                  if (nickname.length < 2) {
                    toast.error("닉네임은 최소 2자리 이상이어야 합니다.");
                    return;
                  }

                  if (nickname.length > 16) {
                    toast.error("닉네임은 최대 16자리까지 가능합니다.");
                    return;
                  }
                  if (containsHangulJamo(nickname)) {
                    toast.error(
                      "한글 초성만으로 이루어진 닉네임은 사용할 수 없습니다."
                    );
                    return;
                  }

                  if (containsProfanity(nickname)) {
                    toast.error("비속어를 포함할 수 없습니다.");
                    return;
                  }

                  if (containsAdmin(nickname)) {
                    toast.error("관리자 닉네임은 사용할 수 없습니다.");
                    return;
                  }
                  const res = await fetch(
                    `/auth/verify-nickname?nickname=${nickname}`
                  );
                  const data = await res.json();

                  if (data.exists) {
                    toast.error("이미 사용 중인 닉네임입니다.");
                    setIsNicknameChecked(false);
                  } else {
                    toast.info("사용 가능한 닉네임입니다.");
                    setIsNicknameChecked(true);
                  }
                }}
              >
                중복 확인
              </Button>
            </div>

            {fetcher.data?.formErrors?.nickname && (
              <Alert variant="destructive">
                <AlertTitle>{fetcher.data.formErrors.nickname}</AlertTitle>
              </Alert>
            )}

            <Input type="password" name="password" placeholder="비밀번호" />
            {fetcher.data?.formErrors?.password && (
              <Alert variant="destructive">
                <AlertTitle>{fetcher.data.formErrors.password}</AlertTitle>
              </Alert>
            )}
            <Input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
            />
            {fetcher.data?.formErrors?.confirmPassword && (
              <Alert variant="destructive">
                <AlertTitle>
                  {fetcher.data.formErrors.confirmPassword}
                </AlertTitle>
              </Alert>
            )}

            {fetcher.data?.formErrors?.general && (
              <Alert variant="destructive">
                <AlertTitle>{fetcher.data.formErrors.general}</AlertTitle>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!isNicknameChecked}
            >
              회원가입
            </Button>
          </fetcher.Form>

          <Button className="w-full" variant="outline" asChild>
            <Link to="/auth/login">이미 계정이 있으신가요? 로그인</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
