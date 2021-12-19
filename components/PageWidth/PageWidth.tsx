import { ReactElement, ReactNode } from "react";

const PageWidth = ({ children }: { children: ReactNode }): ReactElement => (
  <div className="max-w-6xl mx-auto w-full px-3 md:px-5">{children}</div>
);
export default PageWidth;
