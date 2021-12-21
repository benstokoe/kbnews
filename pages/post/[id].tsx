import PageWidth from "components/PageWidth/PageWidth";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { object, string } from "yup";
import { supabase } from "utils/supabaseClient";
import CommentsContainer from "components/Comments/Comments";
import Post from "components/Post/Post";
import InputField from "components/form-fields/InputField";
import { PrimaryButton } from "components/Button/Button";
import { useAuth } from "context/AuthContext";

const validationSchema = object().shape({
  comment: string().required("Please enter your comment"),
});

const Comments = () => {
  const { query } = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post>();
  const [postLoading, setPostLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);

  const getComments = useCallback(async () => {
    const { data } = await supabase
      .from("comments")
      .select("id, inserted_at, data, karma, profiles:author ( id, username )")
      .order("inserted_at", { ascending: false })
      .eq("post", query.id);

    setComments(data);
  }, [query.id]);

  useEffect(() => {
    const getPost = async () => {
      const { data } = await supabase
        .from("posts")
        .select(
          "inserted_at, title, karma, url, id, profiles:author ( id, username )"
        )
        .eq("id", query.id)
        .single();

      setPost(data);

      setPostLoading(false);
    };

    getPost();
    getComments();
  }, [query.id, getComments]);

  const onSubmit = async (values, { resetForm }) => {
    const { data } = await supabase
      .from("comments")
      .insert({ data: values.comment, author: user.id, post: query.id });

    if (data) {
      resetForm();
      getComments();
    }
  };

  return (
    <PageWidth>
      {postLoading && <p>Loading</p>}
      {!postLoading && (
        <div>
          <div className="mb-2">
            <Post {...post} hideComments />

            <div className="mt-2 md:w-1/2">
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
                      label="Leave Comment"
                      type="textarea"
                      error={touched.comment && errors.comment}
                    />

                    <div className="mt-3">
                      <PrimaryButton type="submit">Submit</PrimaryButton>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          <CommentsContainer comments={comments} />
        </div>
      )}
    </PageWidth>
  );
};

export default Comments;
