import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { BiMessageDetail } from "react-icons/bi";
import { FiThumbsUp } from "react-icons/fi";
import { SecondaryButton } from "components/Button/Button";

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
  karma,
  username,
  inserted_at,
  hideUpvote,
  hideComments,
  updateKarma,
  upvoted,
}: DetailProps) => {
  const handleUpvoteClick = () => {
    if (upvoted) {
      return;
    }

    updateKarma(id);
  };

  return (
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
            <figcaption className="text-xs">Comments</figcaption>
          </a>
        </Link>
      )}

      <SecondaryButton
        handleClick={handleUpvoteClick}
        className={upvoted && "pointer-events-none text-tertiary"}
      >
        <div className="lg:hidden flex items-start">
          <FiThumbsUp className="mr-1" />
          <p className="text-xs">{karma}</p>
        </div>
      </SecondaryButton>
    </div>
  );
};

type DetailProps = {
  id?: string;
  url: string;
  username: string;
  karma: number;
  inserted_at: string;
  hideUpvote?: boolean;
  hideComments?: boolean;
  updateKarma?: (postId: string) => void;
  upvoted: boolean;
};

export default Detail;
