import { MailIcon, GithubIcon, Code2, Layers, Terminal } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "~/common/components/ui/card";

export default function CreatorPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">About This Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <section>
            <h2 className="text-base font-semibold mb-2">👨‍💻 Creator</h2>
            <p>1인 프로젝트입니다.</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li className="flex items-center gap-2">
                <MailIcon className="w-4 h-4" />
                oscar2272@naver.com
              </li>
              <li className="flex items-center gap-2">
                <GithubIcon className="w-4 h-4" />
                <a
                  href="https://github.com/oscar2272"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  github.com/oscar2272
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">🛠️ Tech Stack</h2>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Django (REST API)
              </li>
              <li className="flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Remix (React + SSR)
              </li>
              <li className="flex items-center gap-2">
                <Layers className="w-4 h-4" /> PostgreSQL + Supabase Auth
              </li>
              <li className="flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Docker + Docker Compose
              </li>
              <li className="flex items-center gap-2">
                <Terminal className="w-4 h-4" /> AWS EC2 + Vercel (배포)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2">📌 프로젝트 소개</h2>
            <p className="text-muted-foreground leading-relaxed">
              이 프로젝트는 노트 작성, 마크다운 에디터, 공유 기능 등을 포함한
              개인용 또는 협업용 플랫폼입니다. 실시간 편집, 공유 링크, 비공개
              컨텐츠 보호 등을 직접 설계하고 구현했습니다.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
