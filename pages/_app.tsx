import { ReactElement } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import AppContainer from "containers/AppContainer";
import { AuthProvider } from "context/AuthContext";
import { UpvoteProvider } from "context/UpvoteContext";

import "@fontsource/inter";
import "tailwindcss/tailwind.css";
import "styles/globals.css";
import { ThemeProvider } from "context/ThemeContext";
import { UserContextProvider } from "hooks/use-user";
import { ModalProvider } from "hooks/use-modal";

const App = (props: AppProps): ReactElement => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    <ModalProvider>
      <AuthProvider>
        <UserContextProvider>
          <UpvoteProvider>
            <ThemeProvider>
              <AppContainer {...props} />
            </ThemeProvider>
          </UpvoteProvider>
        </UserContextProvider>
      </AuthProvider>
    </ModalProvider>
  </>
);

export default App;
