/* eslint-disable jsx-a11y/label-has-for */
import { ReactElement } from "react";

const Input = ({
  label,
  name,
  type,
  error,
  className,
  ...props
}: InputProps): ReactElement => (
  <>
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={name} id={name} className="flex flex-col font-semibold">
        {label}

        {type === "textarea" ? (
          <textarea
            className="p-3 my-1 bg-white border border-gray-200 dark:text-black"
            id={name}
            {...props}
          />
        ) : (
          <input
            className="p-3 my-1 bg-white border border-gray-200 dark:text-black"
            id={name}
            type={type}
            {...props}
          />
        )}
      </label>
    </div>
    {error && <p className="text-main mb-2">{error}</p>}
  </>
);

type InputProps = {
  label: string;
  required: boolean;
  name: string;
  value: string;
  placeholder: string;
  type: string;
  onBlur: (event: any) => void;
  onChange?: (event: any) => void;
  className?: string;
  error: string;
};
export default Input;
