import type { AppProps } from "next/app";
import Header from "../components/Header/Header";

const AppContainer = ({ Component }: AppProps) => (
  <div className="relative flex flex-col min-h-screen font-display text-primary z-10 bg-primary">
    <Header />

    <Component />
  </div>
);

export default AppContainer;
