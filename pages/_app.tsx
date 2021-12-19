import { ReactElement } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import AppContainer from "../containers/AppContainer";

import "tailwindcss/tailwind.css";
import { AuthProvider } from "context/AuthContext";

const App = (props: AppProps): ReactElement => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    <AuthProvider>
      <AppContainer {...props} />
    </AuthProvider>
  </>
);

export default App;
