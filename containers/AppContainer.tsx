import type { AppProps } from "next/app";
import Header from "../components/Header/Header";

const AppContainer = ({ Component }: AppProps) => (
  <div className="flex flex-col min-h-screen font-display">
    <Header />

    <Component />
  </div>
);

export default AppContainer;
