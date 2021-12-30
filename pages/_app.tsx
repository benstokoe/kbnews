import { ReactElement } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import AppContainer from "../containers/AppContainer";

import "tailwindcss/tailwind.css";
import { AuthProvider } from "context/AuthContext";
import { UpvoteProvider } from "context/UpvoteContext";

const App = (props: AppProps): ReactElement => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    <AuthProvider>
      <UpvoteProvider>
        <AppContainer {...props} />
      </UpvoteProvider>
    </AuthProvider>
  </>
);

export default App;
