import Comment from "components/Comment/Comment";

const Comments = ({ comments }: CommentsProps) => {
  console.log(comments);

  return (
    <div className="">
      {!comments.length && <p>No comments yet.</p>}
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

type CommentsProps = {
  comments: CommentType[];
};

export default Comments;
