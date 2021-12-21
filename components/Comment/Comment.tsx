import Detail from "components/Detail/Detail";

const Comment = ({ comment }: CommentProps) => {
  return (
    <div className="flex flex-col w-full mb-2">
      <Detail {...comment} hideComments />
      <div>{comment.data}</div>
    </div>
  );
};

type CommentProps = {
  comment: CommentType;
};

export default Comment;
