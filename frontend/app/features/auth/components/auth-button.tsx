import { GithubIcon, LockIcon, UserIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";

export default function AuthButtons() {
  return (
    <div className="w-full flex flex-col items-center gap-10">
      <div className="w-full flex flex-col gap-2">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/auth/social/github/start">
            <GithubIcon className="w-4 h-4" />
            Github
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/auth/otp/start">
            <LockIcon className="w-4 h-4" />
            Lock
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/wisp">
            <UserIcon className="h-4 w-4" />
            Guest
          </Link>
        </Button>
      </div>
    </div>
  );
}
