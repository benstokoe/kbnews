import { useRouter } from "next/router";
import { CommentsContextProvider } from "hooks/use-comments";
import { PostsContextProvider } from "hooks/use-posts";
import PostContainer from "containers/PostContainer";

const Comments = () => {
  const { query } = useRouter();

  return (
    <PostsContextProvider perPage={1} postId={parseInt(query.id as string, 10)}>
      <CommentsContextProvider postId={parseInt(query.id as string, 10)}>
        <PostContainer />
      </CommentsContextProvider>
    </PostsContextProvider>
  );
};

export default Comments;
