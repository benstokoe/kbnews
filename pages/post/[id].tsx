import PageWidth from "components/PageWidth/PageWidth";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "utils/supabaseClient";
import Post from "components/Post/Post";
import { useUpvote } from "context/UpvoteContext";
import { CommentsContextProvider } from "hooks/use-comments";
import CommentsSection from "components/CommentsSection/CommentsSection";
import { useUser } from "hooks/use-user";

const Comments = () => {
  const { query } = useRouter();
  const { user } = useUser();
  const [post, setPost] = useState<Post>();
  const [postLoading, setPostLoading] = useState(true);
  const { getUserPostUpvotes, userPostUpvotes } = useUpvote();

  const getPost = useCallback(async () => {
    const { data } = await supabase
      .from("submissions")
      .select("inserted_at, title, url, id, profiles:ownerId ( id, username )")
      .eq("id", query.id)
      .single();

    await getUserPostUpvotes([data]);

    setPost(data);

    setPostLoading(false);
  }, [query.id]);

  useEffect(() => {
    if (!query.id) {
      return;
    }

    getPost();
  }, [query.id]);

  // TODO: centralize
  const updatePostKarma = async (postId: string) => {
    const { error } = await supabase.rpc("increment-post-karma", {
      post_id: postId,
    });

    if (!error) {
      await supabase
        .from("user_posts_upvotes")
        .insert({ user: user.id, post: postId });
    }
  };

  return (
    <CommentsContextProvider postId={parseInt(query.id as string, 10)}>
      <PageWidth>
        {postLoading && <p>Loading</p>}
        {!postLoading && (
          <div>
            <div className="mb-5">
              <Post
                {...post}
                hideComments
                hideUpvotes
                upvoted={userPostUpvotes.includes(post?.id.toString())}
                updateKarma={updatePostKarma}
              />
            </div>

            <CommentsSection />
          </div>
        )}
      </PageWidth>
    </CommentsContextProvider>
  );
};

export default Comments;
