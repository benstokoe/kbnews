import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import cn from "classnames";
interface Props {
  config?: {
    type?: "heart" | "thumbs";
    canDownvote?: boolean;
  };
  votes: number;
  status: string;
  handleUpvote: () => void;
  handleDownvote: () => void;
}

const VoteButtons = ({
  config,
  votes,
  status,
  handleUpvote,
  handleDownvote,
}: Props) => {
  return (
    <div className="flex items-center">
      {config.type === "heart" ? (
        <button
          className="text-xs flex items-center focus-ring p-1"
          onClick={handleUpvote}
          aria-label="Like this comment"
        >
          <AiOutlineHeart
            className={cn("w-4 h-4", {
              "text-red-600 fill-current": status === "upvoted",
              "stroke-1.5": status !== "upvoted",
            })}
          />
          <span className="ml-1 text-gray-600 dark:text-gray-400 tabular-nums">
            {votes}
          </span>
        </button>
      ) : (
        <>
          <button
            className="text-xs flex items-center focus-ring p-1.5"
            onClick={handleUpvote}
            aria-label="Like this comment"
          >
            {status === "upvoted" && (
              <BsHandThumbsUpFill className="w-4 h-4 text-secondary" />
            )}
            {status !== "upvoted" && (
              <BsHandThumbsUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          <span className="text-xs tabular-nums min-w-[12px] text-center mx-1">
            {votes}
          </span>
          {config.canDownvote && (
            <button
              className="text-sm flex items-center focus-ring p-1.5"
              onClick={handleDownvote}
              aria-label="Dislike this comment"
            >
              {status === "downvoted" && (
                <BsHandThumbsUpFill className="w-4 h-4 text-secondary transform rotate-180" />
              )}
              {status !== "downvoted" && (
                <BsHandThumbsUp className="w-4 h-4 text-gray-500 dark:text-gray-400 transform rotate-180" />
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default VoteButtons;
