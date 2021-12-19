import { SecondaryButton } from "components/Button/Button";
import PageWidth from "components/PageWidth/PageWidth";
import { Title } from "components/Title/Title";
import { useAuth } from "context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "utils/supabaseClient";
import Post from "components/Post/Post";

const Account = () => {
  const { replace } = useRouter();
  const { user, profile, signOut, loading } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>();
  const [userKarma, setUserKarma] = useState<number | null>();

  useEffect(() => {
    if (!user) {
      return;
    }

    const getUserPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("inserted_at, title, karma, url, profiles ( username )")
        .eq("author", user.id);

      setUserPosts(data);
    };

    const getUserKarma = async () => {
      const { data } = await supabase.rpc("get-user-karma", {
        user_id: user.id,
      });

      setUserKarma(data);
    };

    getUserPosts();
    getUserKarma();
  }, [user]);

  // const updateProfile = async ({ username, website, avatar_url }) => {
  //   try {
  //     // setLoading(true);
  //     const user = supabase.auth.user();

  //     const updates = {
  //       id: user.id,
  //       username,
  //       updated_at: new Date(),
  //     };

  //     let { error } = await supabase.from("profiles").upsert(updates, {
  //       returning: "minimal", // Don't return the value after inserting
  //     });

  //     if (error) {
  //       throw error;
  //     }
  //   } catch (error) {
  //     alert(error.message);
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  if ((!user || !profile) && !loading) {
    replace("/account/login");
  }

  return (
    <PageWidth>
      {loading ? (
        <p>Loading</p>
      ) : (
        <>
          <p>Hello, {profile.username}</p>

          <div className="mt-2">
            <p>Karma: {userKarma}</p>
          </div>
          {userPosts && (
            <div className="my-3">
              <strong>Posts ({userPosts.length})</strong>

              {userPosts.map((post) => (
                <Post key={post.title} {...post} />
              ))}
            </div>
          )}

          <div>
            <SecondaryButton handleClick={signOut}>Sign Out</SecondaryButton>
          </div>
        </>
      )}
    </PageWidth>
  );
};

export default Account;
