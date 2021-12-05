import { ReactElement } from "react";
import dynamic from "next/dynamic";
import type { AppProps } from "next/app";
import Head from "next/head";
import AppContainer from "../containers/AppContainer";

import "tailwindcss/tailwind.css";

const App = (props: AppProps): ReactElement => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    <AppContainer {...props} />
  </>
);

export default App;
