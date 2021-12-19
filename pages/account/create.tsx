import { useRouter } from "next/router";
import { ReactElement } from "react";
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";
import { useAuth } from "context/AuthContext";
import InputField from "components/form-fields/InputField";
import { PrimaryButton, SecondaryButton } from "components/Button/Button";
import PageWidth from "components/PageWidth/PageWidth";
import { Title } from "components/Title/Title";
// import { supabase } from "utils/supabaseClient";

const validationSchema = object().shape({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
  password: string().required("Please enter your password"),
});

const Create = (): ReactElement => {
  const { signUp } = useAuth();
  const { push } = useRouter();

  const onSubmit = async (values: CreateForm) => {
    console.log(values);

    const { user, error } = await signUp(values);

    // TODO:

    // await supabase.from("profiles").upsert(
    //   { id: user.id, username: values.username },
    //   {
    //     returning: "minimal",
    //   }
    // );

    if (error) {
      alert("error signing up");
    } else {
      push("/");
    }
  };

  return (
    <PageWidth>
      <div className="w-1/2 mx-auto">
        <Title>Create account</Title>

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, touched, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Field
                component={InputField}
                name="username"
                label="Username"
                error={touched.username && errors.username}
              />

              <Field
                component={InputField}
                name="email"
                label="Email"
                error={touched.email && errors.email}
              />

              <Field
                component={InputField}
                className="mt-2"
                name="password"
                label="Password"
                error={touched.password && errors.password}
                type="password"
              />

              <div className="mt-3">
                <PrimaryButton type="submit">Submit</PrimaryButton>
                <Link href="/account/create" passHref>
                  <SecondaryButton>Create account</SecondaryButton>
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </PageWidth>
  );
};

type CreateForm = {
  username: string;
  email: string;
  password: string;
};

export default Create;
