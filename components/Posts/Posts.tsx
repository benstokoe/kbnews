import { useEffect, useMemo, useState } from "react";
import PageWidth from "components/PageWidth/PageWidth";
import { supabase } from "utils/supabaseClient";
import Post from "components/Post/Post";
import Pagination from "components/Pagination/Pagination";
import { useRouter } from "next/router";
import { useAuth } from "context/AuthContext";
import { NEW, TOP } from "constants/sorting";
import { useUpvote } from "context/UpvoteContext";

const perPage = 15;

const Posts = ({ sort = TOP }: PostsProps) => {
  const { query } = useRouter();
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt((query?.page as string) ?? "1")
  );
  const [error, setError] = useState(false);
  const { user } = useAuth();
  const { getUserPostUpvotes, userPostUpvotes } = useUpvote();

  const startIndex = useMemo(
    () => currentPage * perPage - perPage,
    [currentPage]
  );
  const endIndex = useMemo(() => currentPage * perPage - 1, [currentPage]);

  useEffect(() => {
    if (!query?.page) {
      return;
    }

    setCurrentPage(parseInt(query?.page as string, 10));
  }, [query.page]);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);

      const query = supabase
        .from("posts")
        .select(
          "inserted_at, title, karma, url, id, profiles:author ( id, username )"
        )
        .range(startIndex, endIndex);

      if (sort === NEW) {
        query.order("inserted_at", { ascending: false });
      }

      if (sort === TOP) {
        query.order("inserted_at", {
          ascending: false,
        });
      }

      const { data, error } = await query;

      await getUserPostUpvotes(data);

      setError(!!error);

      setPosts(data);
      setLoading(false);
    };

    const fetchCount = async () => {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact" });

      return setCount(count);
    };

    fetchCount();
    getPosts();
  }, [currentPage, startIndex, endIndex, sort]);

  const updateKarma = async (postId: string) => {
    const { error } = await supabase.rpc("increment-post-karma", {
      post_id: postId,
    });

    if (!error) {
      await supabase
        .from("user_posts_upvotes")
        .insert({ user: user.id, post: postId });
    }
  };

  if (error) {
    return (
      <PageWidth>
        <p>Sorry, something went wrong</p>
      </PageWidth>
    );
  }

  if (loading) {
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
          <div key={post.title} className="flex mb-3">
            <Post
              {...post}
              updateKarma={updateKarma}
              upvoted={userPostUpvotes.includes(post.id)}
            />
          </div>
        ))}

        <Pagination count={count} perPage={perPage} currentPage={currentPage} />
      </div>
    </PageWidth>
  );
};

type PostsProps = {
  sort?: string;
};
export default Posts;
