import { ReactElement, ReactNode } from "react";

const H1 = ({ children, ...props }: { children: ReactNode }): ReactElement => (
  <h1 {...props}>{children}</h1>
);
const H2 = ({ children, ...props }: { children: ReactNode }): ReactElement => (
  <h2 {...props}>{children}</h2>
);
const H3 = ({ children, ...props }: { children: ReactNode }): ReactElement => (
  <h3 {...props}>{children}</h3>
);
const H4 = ({ children, ...props }: { children: ReactNode }): ReactElement => (
  <h4 {...props}>{children}</h4>
);

const map = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
};

export const PageTitle = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}): ReactElement => (
  <div
    className={`text-2xl sm:text-3xl md:text-4xl dark:text-white my-6 ${className}`}
  >
    {children}
  </div>
);

export const Title = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}): ReactElement => (
  <h3 className={`text-md sm:text-2xl md:text-3xl mb-4 ${className}`}>
    {children}
  </h3>
);
