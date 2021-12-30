import Comment from "components/Comment/Comment";

const Comments = ({
  comments,
  updateKarma,
  userCommentUpvotes,
}: CommentsProps) => (
  <div className="">
    {!comments.length && <p>No comments yet.</p>}
    {comments.map((comment) => (
      <Comment
        key={comment.id}
        comment={comment}
        updateKarma={updateKarma}
        upvoted={userCommentUpvotes.includes(comment.id)}
      />
    ))}
  </div>
);

type CommentsProps = {
  comments: CommentType[];
  updateKarma: (commentId: string) => void;
  userCommentUpvotes: string[];
};

export default Comments;
