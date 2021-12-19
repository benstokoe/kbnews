import React, { ReactElement } from "react";
import Input from "components/Input/Input";

const InputField = ({
  form,
  field,
  error,
  ...props
}: InputFieldProps): ReactElement => (
  <Input
    name={field.name}
    value={field.value}
    onBlur={field.onBlur}
    error={error}
    onChange={(e) => form.setFieldValue(field.name, e.target.value)}
    {...props}
  />
);

type InputFieldProps = {
  field: {
    name: string;
    value: string;
    onBlur: () => void;
  };
  form: {
    setFieldValue: (name: string, value: string) => void;
  };
  label: string;
  required: boolean;
  placeholder: string;
  type: string;
  error: string;
};

export default InputField;
