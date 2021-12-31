import { ReactElement, ReactNode } from "react";

const StyledButton = ({
  children,
  ...props
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled: boolean;
}): ReactElement => (
  <button
    className="disabled:opacity-50 disabled:cursor-default bg-black h-12 text-white font-bold capitalize hover:scale-up w-full p-2"
    type="button"
    {...props}
  >
    {children}
  </button>
);

export const Secondary = ({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}): ReactElement => (
  <a
    className={`text-main cursor-pointer w-full text-center block my-2 ${className}`}
    {...props}
  >
    {children}
  </a>
);

export const PrimaryButton = ({
  handleClick,
  children,
  disabled = false,
  ...props
}: PrimaryButtonProps): ReactElement => (
  <StyledButton disabled={disabled} onClick={handleClick} {...props}>
    {children}
  </StyledButton>
);

export const SecondaryButton = ({
  handleClick,
  children,
  ...props
}: SecondaryButtonProps): ReactElement => (
  <button onClick={handleClick} {...props}>
    {children}
  </button>
);

type ButtonType = "button" | "submit" | "reset";

type PrimaryButtonProps = {
  handleClick?: () => void;
  children: ReactNode;
  type?: ButtonType;
  disabled?: boolean;
  isLoading?: boolean;
};

type SecondaryButtonProps = {
  handleClick?: () => void;
  children: ReactNode;
  type?: ButtonType;
  className?: string;
};
