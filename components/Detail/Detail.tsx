import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { BiMessageDetail } from "react-icons/bi";
import { FiThumbsUp } from "react-icons/fi";
import cn from "classnames";

const domain_from_url = (url: string): string => {
  if (!url) {
    return "";
  }

  const match = url.match(
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
  );

  return match[1];
};

const Detail = ({
  id,
  url,
  username,
  inserted_at,
  hideComments,
  upvoted,
  commentsCount,
  votes,
}: DetailProps) => (
  <div className="flex mt-2 text-primary opacity-75">
    <p className="hidden lg:inline-block text-xs mr-4">
      by <span className="font-medium">{username}</span>
    </p>
    <p className="text-xs mr-4">
      {formatDistanceToNow(new Date(inserted_at), { addSuffix: true })}
    </p>
    <p className="text-xs hidden lg:inline-block mr-4">
      {domain_from_url(url)}
    </p>
    {!hideComments && (
      <Link href={`/post/${id}`}>
        <a className="flex items-start mr-4">
          <BiMessageDetail className="mr-1" />
          <figcaption className="text-xs">{commentsCount} Comments</figcaption>
        </a>
      </Link>
    )}

    <div
      className={cn("lg:hidden flex items-start", { "text-tertiary": upvoted })}
    >
      <FiThumbsUp className="mr-1" />
      <p className="text-xs">{votes}</p>
    </div>
  </div>
);

interface DetailProps {
  id?: number;
  url: string;
  username: string;
  inserted_at: string;
  hideUpvote?: boolean;
  hideComments?: boolean;
  upvoted: boolean;
  commentsCount: number;
  votes: number;
}

export default Detail;
