import { ReactElement, ReactNode } from "react";

const PageWidth = ({ children }: { children: ReactNode }): ReactElement => (
  <div className="flex flex-col flex-1 max-w-6xl m-auto w-full h-full px-3 md:px-5">
    {children}
  </div>
);
export default PageWidth;
