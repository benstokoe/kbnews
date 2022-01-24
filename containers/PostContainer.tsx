import { usePosts } from "hooks/use-posts";
import PageWidth from "components/PageWidth/PageWidth";
import Post from "components/Post/Post";
import CommentsSection from "components/CommentsSection/CommentsSection";

const PostContainer = () => {
  const { posts, isLoadingInitialData } = usePosts();

  const post = posts[0];

  return (
    <PageWidth>
      {isLoadingInitialData && <p>Loading</p>}
      {!isLoadingInitialData && (
        <div>
          <div className="mb-5">
            <Post {...post} hideComments hideUpvotes />
          </div>

          <CommentsSection />
        </div>
      )}
    </PageWidth>
  );
};

export default PostContainer;
