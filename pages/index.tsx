import type { NextPage } from "next";
import Head from "next/head";
import { PostsContextProvider } from "hooks/use-posts";
import Posts from "containers/PostsContainer";

export const perPage = 20;

const Home: NextPage = () => (
  <>
    <Head>
      <title>KbNews.</title>
    </Head>

    <PostsContextProvider perPage={perPage}>
      <Posts />
    </PostsContextProvider>
  </>
);

export default Home;
