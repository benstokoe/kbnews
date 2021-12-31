import { ReactElement } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import AppContainer from "containers/AppContainer";
import { AuthProvider } from "context/AuthContext";
import { UpvoteProvider } from "context/UpvoteContext";

import "@fontsource/open-sans";
import "tailwindcss/tailwind.css";
import "styles/globals.css";

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
