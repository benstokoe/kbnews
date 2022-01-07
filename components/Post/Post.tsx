import { useMemo } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FaArrowUp } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { FiThumbsUp } from "react-icons/fi";
import { AiOutlineArrowUp } from "react-icons/ai";
import { useAuth } from "context/AuthContext";
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

const Post = ({
  title,
  url,
  id,
  karma,
  profiles: { id: userId, username },
  inserted_at,
  updateKarma,
  upvoted,
}: PostProps) => {
  const { user } = useAuth();

  const isUsers = useMemo(() => user && user.id === userId, [user, userId]);

  const handleUpvoteClick = () => {
    if (upvoted) {
      return;
    }

    updateKarma(id);
  };

  return (
    <>
      <div className="px-5 hidden lg:flex flex-col justify-center items-center text-center w-20">
        <SecondaryButton
          handleClick={handleUpvoteClick}
          className={upvoted && "pointer-events-none text-tertiary"}
        >
          <FaArrowUp className="mb-1" />
        </SecondaryButton>

        <p className="text-sm font-medium text-tertiary">{karma}</p>
      </div>
      <div className="md:px-5 lg:border-l">
        {url && (
          <a
            href={url}
            rel="noreferrer"
            target="_blank"
            className="hover:underline text-md font-medium text-primary"
          >
            {title}
          </a>
        )}
        {!url && (
          <Link href={`/post/${id}`}>
            <a className="hover:underline text-md font-medium">{title}</a>
          </Link>
        )}

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
          <figure className="flex items-start mr-4">
            <BiMessageDetail className="mr-1" />
            <figcaption className="text-xs">133</figcaption>
          </figure>
          <div className="lg:hidden flex items-start">
            <FiThumbsUp className="mr-1" />
            <p className="text-xs">{karma}</p>
          </div>
        </div>
      </div>
    </>
  );
};

type PostProps = Post & {
  hideComments?: boolean;
  updateKarma?: (postId: string) => void;
  upvoted: boolean;
};

export default Post;
