import { useAuth } from "context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";

const Detail = ({
  id,
  karma,
  profiles: { id: userId, username },
  inserted_at,
  hideUpvote,
  hideComments,
  updateKarma,
  upvoted,
}: DetailProps) => {
  const { user } = useAuth();

  const isUsers = useMemo(() => user && user.id === userId, [user, userId]);

  const handleUpvoteClick = () => {
    if (upvoted) {
      return;
    }

    updateKarma(id);
  };

  return (
    <div className="text-sm flex items-center text-tertiary flex-wrap">
      {!hideUpvote && !isUsers && (
        <button
          onClick={handleUpvoteClick}
          className={`mr-1 ${upvoted && "pointer-events-none"}`}
        >
          <AiOutlineArrowUp color={upvoted && "salmon"} />
        </button>
      )}
      <span className="">
        <span className="bg-secondary px-2 rounded-lg text-secondary">
          {karma}
        </span>{" "}
        by <span className={isUsers && "text-yellow-600"}>{username}</span>{" "}
        {formatDistanceToNow(new Date(inserted_at), { addSuffix: true })}
      </span>
      {/* &nbsp;| report */}
      {!hideComments && (
        <>
          &nbsp;|&nbsp;
          <Link href={`/post/${id}`}>comments</Link>
        </>
      )}
    </div>
  );
};

type DetailProps = {
  id?: string;
  karma: number;
  profiles: {
    id: string;
    username: string;
  };
  inserted_at: string;
  hideUpvote?: boolean;
  hideComments?: boolean;
  updateKarma?: (postId: string) => void;
  upvoted: boolean;
};

export default Detail;
