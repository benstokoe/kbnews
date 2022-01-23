import { useRouter } from "next/router";
import { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";
import PageWidth from "components/PageWidth/PageWidth";
import { Title } from "components/Title/Title";
import InputField from "components/form-fields/InputField";
import { PrimaryButton } from "components/Button/Button";
import { supabase } from "utils/supabaseClient";
import { useUser } from "hooks/use-user";

const validationSchema = object().shape({
  title: string().required("Please enter a title"),
  url: string().url("Please enter a valid url").required("Please enter a url"),
});

const New = () => {
  const { user, loading } = useUser();
  const { replace, push } = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      replace("/account/login");
    }
  }, [user, loading, replace]);

  const onSubmit = async (values) => {
    const { error } = await supabase.from("posts").insert({
      ...values,
      author: user.id,
    });

    if (!error) {
      push("/");

      // TODO: alert
    }
  };

  return (
    <PageWidth>
      <Title>Submit</Title>

      <Formik
        initialValues={{
          title: "",
          url: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, touched, errors }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              component={InputField}
              name="title"
              label="Title"
              error={touched.title && errors.title}
            />

            <Field
              component={InputField}
              name="url"
              label="Url"
              error={touched.url && errors.url}
            />

            <div className="mt-3">
              <PrimaryButton type="submit">Submit</PrimaryButton>
            </div>
          </Form>
        )}
      </Formik>
    </PageWidth>
  );
};

export default New;
