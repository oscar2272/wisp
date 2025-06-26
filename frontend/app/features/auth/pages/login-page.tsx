import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";
import AuthButtons from "../components/auth-button";
import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/login-page";
import { useFetcher } from "react-router";
import { z } from "zod";
import { makeSSRClient } from "~/supa-client";
import { redirect } from "react-router";
const formSchema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요."),
  password: z.string().min(6, "비밀번호는 최소 6자리 이상이어야 합니다."),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const parsed = formSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { formErrors: parsed.error.flatten().fieldErrors };
  }
  const { client, headers } = makeSSRClient(request); // Supabase client 생성
  const { email, password } = parsed.data;
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { formErrors: { general: `로그인 실패: ${error.message}` } };
  }
  return redirect("/", {
    headers,
  });
};
export default function LoginPage({ actionData }: Route.ComponentProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fetcher = useFetcher();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px] p-6">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>
            이메일 또는 Github 계정으로 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 이메일/비밀번호 입력폼 */}
          <div className="space-y-2">
            <fetcher.Form method="post">
              <Input
                type="email"
                name="email"
                placeholder="이메일"
                className="
              mb-1"
              />
              {fetcher.data?.formErrors?.email && (
                <div className="text-red-500 text-sm">
                  {fetcher.data.formErrors.email}
                </div>
              )}
              <Input
                type="password"
                name="password"
                placeholder="비밀번호"
                className="mb-1"
              />
              {fetcher.data?.formErrors?.password && (
                <div className="text-red-500 text-sm">
                  {fetcher.data.formErrors.password}
                </div>
              )}
              {fetcher.data?.formErrors?.general && (
                <div className="text-red-500 text-sm">
                  {fetcher.data.formErrors.general}
                </div>
              )}
              <Button className="w-full">이메일 로그인</Button>
            </fetcher.Form>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/auth/signup">회원가입</Link>
            </Button>
          </div>

          {/* 기존 소셜 로그인 */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                또는
              </span>
            </div>
          </div>

          <AuthButtons />
        </CardContent>
      </Card>
    </div>
  );
}
