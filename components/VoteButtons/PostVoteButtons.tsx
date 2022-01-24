import { useComments } from "hooks/use-comments";
import { useUser } from "hooks/use-user";
import { supabase } from "utils/supabaseClient";

import React from "react";
import VoteButtons from "./VoteButtons";
import resolveStatus from "utils/resolve-vote-status";
import { usePosts } from "hooks/use-posts";

export const invokeVote = async (
  submissionId: number,
  userId: string,
  value: number
): Promise<any> =>
  supabase
    .from("user_submissions_votes")
    .upsert([{ submissionId, userId, value }], {
      onConflict: "submissionId, userId",
    })
    .then(({ data, error }) => {
      if (error) {
        console.log(error);
        throw error;
      }

      return data;
    });

export const mutatePosts = (
  mutate: any,
  submissionId: number,
  incrementBy: number,
  userVoteValue: number
): Promise<any> =>
  mutate(
    (pages: Post[][]) =>
      pages.map((posts) =>
        posts.map((post) => {
          if (post.id === submissionId) {
            const newPost = {
              ...post,
              votes: post.votes + incrementBy,
              userVoteValue,
            };

            return newPost;
          }
          return post;
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
  const { mutatePosts } = usePosts();
  const status = resolveStatus(userVoteValue);
  // const { open } = useModal();

  const handleUpvote = (): void => {
    // if (!user || !user.id) return open("signInModal");

    if (status === "unvoted") {
      invokeVote(id, user.id, 1);
      mutatePosts(mutatePosts, id, 1, 1);
    } else if (status === "upvoted") {
      invokeVote(id, user.id, 0);
      mutatePosts(mutatePosts, id, -1, 0);
    } else if (status === "downvoted") {
      invokeVote(id, user.id, 1);
      mutatePosts(mutatePosts, id, 2, 1);
    }
  };

  const handleDownvote = (): void => {
    // if (!user || !user.id) return open("signInModal");

    if (status === "unvoted") {
      invokeVote(id, user.id, -1);
      mutatePosts(mutatePosts, id, -1, -1);
    } else if (status === "upvoted") {
      invokeVote(id, user.id, -1);
      mutatePosts(mutatePosts, id, -2, -1);
    } else if (status === "downvoted") {
      invokeVote(id, user.id, 0);
      mutatePosts(mutatePosts, id, 1, 0);
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
