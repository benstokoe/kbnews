import { useEffect, useState } from "react";
import PageWidth from "components/PageWidth/PageWidth";
import { supabase } from "utils/supabaseClient";
import Post from "components/Post/Post";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      const query = supabase
        .from("posts")
        .select(
          "inserted_at, title, karma, url, id, profiles:author ( id, username )"
        );

      query.order("inserted_at", { ascending: false });

      const { data, error } = await query;

      console.log(data);

      setError(!!error);

      setPosts(data);
    };

    getPosts();
  }, []);

  if (error) {
    return <p>Sorry, something went wrong</p>;
  }

  return (
    <PageWidth>
      {posts.map((post, index) => (
        <div key={post.title} className="flex mb-3">
          <p className="mr-2">{index + 1}</p>
          <Post {...post} />
        </div>
      ))}
    </PageWidth>
  );
};

export default Posts;
