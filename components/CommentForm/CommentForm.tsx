import { Formik, Form, Field } from "formik";
import { addMethod, object, string } from "yup";
import InputField from "components/form-fields/InputField";
import { PrimaryButton, SecondaryButton } from "components/Button/Button";

const validationSchema = object().shape({
  comment: string().required("Please enter your comment"),
});

const CommentForm = ({
  onSubmit,
  title = "Leave Comment",
  showCancel = false,
  handleCancelClick,
}: CommentFormProps) => {
  return (
    <Formik
      initialValues={{
        comment: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, touched, errors }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            component={InputField}
            name="comment"
            label={title}
            type="textarea"
            error={touched.comment && errors.comment}
          />

          <div className="mt-3">
            <PrimaryButton type="submit">{title}</PrimaryButton>
          </div>

          {showCancel && (
            <SecondaryButton
              handleClick={handleCancelClick}
              className="text-center w-full mt-1"
            >
              Cancel
            </SecondaryButton>
          )}
        </Form>
      )}
    </Formik>
  );
};

interface CommentFormProps {
  onSubmit: (values: Record<string, unknown>, { resetForm }) => void;
  title?: string;
  showCancel?: boolean;
  handleCancelClick?: () => void;
}

export default CommentForm;
