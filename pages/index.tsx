import Posts from "components/Posts/Posts";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>KbNews.</title>
      </Head>

      <Posts />
    </div>
  );
};

export default Home;
