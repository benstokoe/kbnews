import type { AppProps } from "next/app";
import Header from "../components/Header/Header";

const AppContainer = ({ Component }: AppProps) => {
  return (
    <div className="flex flex-col justify-between min-h-screen font-display">
      <Header />
      <Component />
    </div>
  );
};

export default AppContainer;
