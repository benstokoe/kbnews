import Link from "next/link";
import Detail from "components/Detail/Detail";
import classNames from "classnames";
import PostVoteButtons from "components/VoteButtons/PostVoteButtons";
import resolveStatus from "utils/resolve-vote-status";

const Post = ({
  title,
  url,
  id,
  karma,
  profiles: { username },
  updateKarma,
  hideUpvotes,
  userVoteValue,
  votes,
  ...detail
}: PostProps) => {
  const status = resolveStatus(userVoteValue);
  const upvoted = status === "upvoted";

  return (
    <div className="w-full flex">
      <div
        className={classNames(
          "px-5 mb-5 hidden lg:flex flex-col justify-center items-center text-center w-20",
          { "pl-0 w-10": hideUpvotes }
        )}
      >
        <PostVoteButtons id={id} userVoteValue={userVoteValue} votes={votes} />
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
          upvoted={upvoted}
          votes={votes}
        />
      </div>
    </div>
  );
};

interface PostProps extends Post {
  hideComments?: boolean;
  updateKarma?: (postId: string) => void;
  hideUpvotes?: boolean;
  userVoteValue: number;
  votes: number;
  commentsCount: number;
}

export default Post;
