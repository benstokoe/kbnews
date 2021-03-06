import { useComments } from "hooks/use-comments";
import { useUser } from "hooks/use-user";
import { AiOutlineHeart } from "react-icons/ai";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";
import { supabase } from "utils/supabaseClient";
import cn from "classnames";
import React from "react";

type StatusType = "upvoted" | "unvoted" | "downvoted";

export const invokeVote = async (
  postId: number,
  userId: string,
  value: number
): Promise<any> =>
  supabase
    .from("votes")
    .upsert([{ postId, userId, value }], {
      onConflict: "postId, userId",
    })
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
        throw error;
      }

      return data;
    });

export const mutateVotes = (
  mutate: any,
  postId: number,
  incrementBy: number,
  userVoteValue: number
): Promise<any> =>
  mutate(
    (pages: CommentType[][]) =>
      pages.map((comments) =>
        comments.map((comment) => {
          if (comment.id === postId) {
            const newComment = {
              ...comment,
              votes: comment.votes + incrementBy,
              userVoteValue,
            };

            return newComment;
          }
          return comment;
        })
      ),
    false
  );

const resolveStatus = (
  userVoteValue: number | undefined | null
): StatusType => {
  if (userVoteValue === 1) return "upvoted";
  if (userVoteValue === -1) return "downvoted";
  return "unvoted";
};

interface Props {
  comment: CommentType;
  config?: {
    type?: "heart" | "thumbs";
    canDownvote?: boolean;
  };
}

const VoteButtons = ({
  comment,
  config = { type: "thumbs", canDownvote: true },
}: Props): JSX.Element | null => {
  const { user } = useUser();
  const { mutateComments } = useComments();
  const status = resolveStatus(comment.userVoteValue);
  // const { open } = useModal();

  const handleUpvote = (): void => {
    // if (!user || !user.id) return open("signInModal");

    if (status === "unvoted") {
      invokeVote(comment.id, user.id, 1);
      mutateVotes(mutateComments, comment.id, 1, 1);
    } else if (status === "upvoted") {
      invokeVote(comment.id, user.id, 0);
      mutateVotes(mutateComments, comment.id, -1, 0);
    } else if (status === "downvoted") {
      invokeVote(comment.id, user.id, 1);
      mutateVotes(mutateComments, comment.id, 2, 1);
    }
  };

  const handleDownvote = (): void => {
    // if (!user || !user.id) return open("signInModal");

    if (status === "unvoted") {
      invokeVote(comment.id, user.id, -1);
      mutateVotes(mutateComments, comment.id, -1, -1);
    } else if (status === "upvoted") {
      invokeVote(comment.id, user.id, -1);
      mutateVotes(mutateComments, comment.id, -2, -1);
    } else if (status === "downvoted") {
      invokeVote(comment.id, user.id, 0);
      mutateVotes(mutateComments, comment.id, 1, 0);
    }
  };

  if (!comment) return null;

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
            {comment.votes}
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
            {comment.votes}
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
