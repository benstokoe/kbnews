import React, { useContext, useState, useEffect } from "react";
import { supabase } from "utils/supabaseClient";
import { useAuth } from "./AuthContext";

type UpvoteContext = {
  loading?: boolean;
  getUserPostUpvotes?: (posts: Post[]) => Promise<void>;
  userPostUpvotes?: string[];
  getUserCommentUpvotes?: (comments: CommentType[]) => Promise<void>;
  userCommentUpvotes?: string[];
};

type UserPostUpvotesTable = {
  post: number;
  user: string;
};

type UserCommentUpvotesTable = {
  comment: string;
  user: string;
};

const UpvoteContext = React.createContext<UpvoteContext>({});

export const UpvoteProvider = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userPostUpvotes, setUserPostUpvotes] = useState<string[]>([]);
  const [userCommentUpvotes, setUserCommentUpvotes] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const userPostUpvoteSubscription = supabase
      .from(`user_posts_upvotes:user=eq.${user.id}`)
      .on("*", (payload) =>
        setUserPostUpvotes((current) => [...current, payload.new.post])
      )
      .subscribe();

    return () => {
      supabase.removeSubscription(userPostUpvoteSubscription);
    };
  }, [user?.id]);

  const getUserPostUpvotes = async (posts: Post[]) => {
    setLoading(true);

    if (!user) {
      return;
    }

    const { data } = await supabase
      .from("user_posts_upvotes")
      .select("post")
      .eq("user", user?.id)
      .or(posts.map((post) => `post.eq.${post.id}`).join());

    setLoading(false);

    const postUpvotes = data?.map((post: UserPostUpvotesTable) =>
      post.post.toString()
    );

    setUserPostUpvotes(postUpvotes);
  };

  const getUserCommentUpvotes = async (comments: CommentType[]) => {
    setLoading(true);

    if (!user) {
      return;
    }

    const { data } = await supabase
      .from("user_comments_upvotes")
      .select("comment")
      .eq("user", user?.id)
      .or(comments.map((comment) => `comment.eq.${comment.id}`).join());

    setLoading(false);

    const commentUpvotes = data?.map(
      (comment: UserCommentUpvotesTable) => comment.comment
    );

    setUserCommentUpvotes(commentUpvotes);
  };

  const value = {
    loading,
    getUserPostUpvotes,
    userPostUpvotes,
    getUserCommentUpvotes,
    userCommentUpvotes,
  };

  return (
    <UpvoteContext.Provider value={value}>{children}</UpvoteContext.Provider>
  );
};

export function useUpvote() {
  return useContext(UpvoteContext);
}
