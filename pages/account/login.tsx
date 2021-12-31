import { useRouter } from "next/router";
import { ReactElement } from "react";
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";
import { useAuth } from "context/AuthContext";
import InputField from "components/form-fields/InputField";
import { PrimaryButton, Secondary } from "components/Button/Button";
import PageWidth from "components/PageWidth/PageWidth";
import { Title } from "components/Title/Title";

const validationSchema = object().shape({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
  password: string().required("Please enter your password"),
});

const Login = (): ReactElement => {
  const { signIn } = useAuth();
  const { push } = useRouter();

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     replace("/account");
  //   }
  // }, [isLoggedIn]);

  const onSubmit = async (values: LoginForm) => {
    const { error } = await signIn(values);

    if (error) {
      alert("error signing in");
    } else {
      push("/");
    }
  };

  return (
    <PageWidth>
      <div className="w-1/2 mx-auto">
        <Title>Login</Title>

        <Formik
          initialValues={{
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
                  <Secondary>Create account</Secondary>
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </PageWidth>
  );
};

type LoginForm = {
  email: string;
  password: string;
};

export default Login;
