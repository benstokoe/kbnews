import { useComments } from "hooks/use-comments";
import { useUser } from "hooks/use-user";
import { supabase } from "utils/supabaseClient";

import React from "react";
import VoteButtons from "./VoteButtons";
import resolveStatus from "utils/resolve-vote-status";

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

interface Props {
  id: number;
  userVoteValue: number;
  votes: number;
  config?: {
    type?: "heart" | "thumbs";
    canDownvote?: boolean;
  };
}

const PostVoteButtons = ({
  id,
  userVoteValue,
  votes,
  config = { type: "thumbs", canDownvote: true },
}: Props) => {
  const { user } = useUser();
  const { mutateComments } = useComments();
  const status = resolveStatus(userVoteValue);
  // const { open } = useModal();

  const handleUpvote = (): void => {
    // if (!user || !user.id) return open("signInModal");

    if (status === "unvoted") {
      invokeVote(id, user.id, 1);
      mutateVotes(mutateComments, id, 1, 1);
    } else if (status === "upvoted") {
      invokeVote(id, user.id, 0);
      mutateVotes(mutateComments, id, -1, 0);
    } else if (status === "downvoted") {
      invokeVote(id, user.id, 1);
      mutateVotes(mutateComments, id, 2, 1);
    }
  };

  const handleDownvote = (): void => {
    // if (!user || !user.id) return open("signInModal");

    if (status === "unvoted") {
      invokeVote(id, user.id, -1);
      mutateVotes(mutateComments, id, -1, -1);
    } else if (status === "upvoted") {
      invokeVote(id, user.id, -1);
      mutateVotes(mutateComments, id, -2, -1);
    } else if (status === "downvoted") {
      invokeVote(id, user.id, 0);
      mutateVotes(mutateComments, id, 1, 0);
    }
  };

  if (!id) return null;

  return (
    <VoteButtons
      config={config}
      votes={votes}
      status={status}
      handleUpvote={handleUpvote}
      handleDownvote={handleDownvote}
    />
  );
};

export default PostVoteButtons;
