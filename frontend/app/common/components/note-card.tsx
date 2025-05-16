import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import {
  EyeIcon,
  MessageCircleIcon,
  HeartIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Link } from "react-router";
import { Separator } from "~/common/components/ui/separator";
import { DateTime } from "luxon";
import { Badge } from "~/common/components/ui/badge";

interface NoteCardProps {
  postId: string;
  title: string;
  date: string;
  expires_at: string | null;
  description: any[];
  author: {
    name: string;
    avatar: string;
  };

  views: number;
  comments: number;
  likes: number;
}
function extractFirstImage(content: any[]): string | null {
  for (const node of content) {
    if (node.type === "image" && node.attrs?.src) {
      return node.attrs.src;
    }
  }
  return null;
}
function extractFirstText(content: any[]): string {
  for (const node of content) {
    if (node.type === "paragraph" && node.content) {
      for (const inner of node.content) {
        if (inner.type === "text") {
          return inner.text;
        }
      }
    }
  }
  return "";
}
export function NoteCard({
  postId,
  title,
  date,
  expires_at,
  description,
  author,
  views,
  comments,
  likes,
}: NoteCardProps) {
  const formattedDate = DateTime.fromISO(date).toFormat("yyyy.MM.dd");

  const getExpiryBadge = () => {
    if (!expires_at) return null;

    const now = DateTime.now();
    const expiryDate = DateTime.fromISO(expires_at);
    const remainingDays = Math.floor(expiryDate.diff(now, "days").days);

    if (remainingDays < 0) {
      return (
        <Badge variant="destructive" className="text-[10px] h-5">
          만료됨
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="text-[10px] h-5">
        {remainingDays}일 남음
      </Badge>
    );
  };

  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden">
      <Link to={`/wisp/explore/${postId}`} className="block">
        <div className="relative w-full h-48 bg-muted overflow-hidden -mt-6">
          {extractFirstImage(description) ? (
            <img
              src={extractFirstImage(description)!}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No image</p>
            </div>
          )}
        </div>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px] h-5">
                {formattedDate}
              </Badge>
            </div>
            {getExpiryBadge()}
          </div>
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 h-full text-sm text-muted-foreground">
          <p className="line-clamp-4 h-19">{extractFirstText(description)}</p>
        </CardContent>
      </Link>

      <Separator />

      <CardFooter className="px-4 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          <img
            // src={author.avatar}
            src="http://127.0.0.1:8000/static/media/uploads/profiles/profile-dc56ef06-9d04-47f4-b234-841e60006338.png"
            alt={author.name}
            className="w-7 h-7 rounded-full object-cover"
          />

          <span className="font-medium text-xs text-foreground">
            {author.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <div className="flex items-center gap-0.5">
            <EyeIcon size={12} />
            <span>{views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <MessageCircleIcon size={12} />
            <span>{comments.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <ThumbsUpIcon size={12} />
            <span>{likes.toString()}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
