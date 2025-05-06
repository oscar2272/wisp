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

interface NoteCardProps {
  postId: string;
  title: string;
  date: string;
  imageUrl: string;
  description: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  stats: {
    views: number;
    comments: number;
    likes: number;
  };
}

export function NoteCard({
  postId,
  title,
  date,
  imageUrl,
  description,
  author,
  stats,
}: NoteCardProps) {
  return (
    <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden">
      <Link to={`/wisp/explore/${postId}`} className="block">
        <div className="relative w-full h-48 bg-muted overflow-hidden -mt-6">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-2 text-sm text-muted-foreground">
          <p className="line-clamp-3 h-[4.5rem]">{description}</p>
        </CardContent>
      </Link>

      <Separator />

      <CardFooter className="px-4 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 ">
          <img
            src={author.avatarUrl}
            alt={author.name}
            className="w-5 h-5 rounded-full"
          />
          <span className="font-medium text-foreground">{author.name}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="flex items-center gap-1">
            <EyeIcon size={13} />
            <span>{stats.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircleIcon size={13} />
            <span>{stats.comments}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUpIcon size={13} />
            <span>{stats.likes}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
