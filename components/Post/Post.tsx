import { useMemo } from "react";
import Link from "next/link";
import { FaArrowUp } from "react-icons/fa";
import { SecondaryButton } from "components/Button/Button";
import Detail from "components/Detail/Detail";
import classNames from "classnames";
import { useUser } from "hooks/use-user";

const Post = ({
  title,
  url,
  id,
  karma,
  profiles: { id: userId, username },
  updateKarma,
  upvoted,
  hideUpvotes,
  ...detail
}: PostProps) => {
  const { user } = useUser();

  const isUsers = useMemo(() => user && user.id === userId, [user, userId]);

  const handleUpvoteClick = () => {
    if (upvoted) {
      return;
    }

    updateKarma(id);
  };

  return (
    <div className="w-full flex">
      <div
        className={classNames(
          "px-5 mb-5 hidden lg:flex flex-col justify-center items-center text-center w-20",
          { "pl-0 w-10": hideUpvotes }
        )}
      >
        <SecondaryButton
          handleClick={handleUpvoteClick}
          className={classNames({
            "pointer-events-none text-tertiary": upvoted,
          })}
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

        <Detail
          {...detail}
          id={id}
          url={url}
          username={username}
          karma={karma}
          upvoted={upvoted}
        />
      </div>
    </div>
  );
};

type PostProps = Post & {
  hideComments?: boolean;
  updateKarma?: (postId: string) => void;
  upvoted: boolean;
  hideUpvotes: boolean;
};

export default Post;
