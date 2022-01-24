import PageWidth from "components/PageWidth/PageWidth";
import Post from "components/Post/Post";
import Pagination from "components/Pagination/Pagination";
import { usePosts } from "hooks/use-posts";

const PostsContainer = () => {
  const { posts, isLoadingInitialData, error } = usePosts();

  if (error) {
    return (
      <PageWidth>
        <p>Sorry, something went wrong</p>
      </PageWidth>
    );
  }

  if (isLoadingInitialData) {
    return (
      <PageWidth>
        <p>Loading</p>
      </PageWidth>
    );
  }

  return (
    <PageWidth>
      <div className="md:max-w-2xl">
        {posts.map((post) => (
          <div key={post.title} className="flex mb-5 w-full">
            <Post {...post} />
          </div>
        ))}

        <Pagination />
      </div>
    </PageWidth>
  );
};

export default PostsContainer;
