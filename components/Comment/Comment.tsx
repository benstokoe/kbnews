import Detail from "components/Detail/Detail";

const Comment = ({ comment, updateKarma, upvoted }: CommentProps) => (
  <div className="flex flex-col w-full mb-2">
    <Detail
      {...comment}
      hideComments
      updateKarma={updateKarma}
      upvoted={upvoted}
    />
    <div>{comment.data}</div>
  </div>
);

type CommentProps = {
  comment: CommentType;
  updateKarma: (commentId: string) => void;
  upvoted: boolean;
};

export default Comment;
