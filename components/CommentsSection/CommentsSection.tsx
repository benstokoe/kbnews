import CommentsList from "components/Comments/Comments";
import NewCommentForm from "components/NewCommentForm/NewCommentForm";
import { useComments } from "hooks/use-comments";

interface Props {
  initialData?: CommentType | null;
}

const CommentSection = ({ initialData = null }: Props): JSX.Element => {
  const { count } = useComments();

  return (
    <>
      <div className="flex-none flex flex-row items-center justify-between py-3 sm:py-4 px-3 sm:px-6 order-first">
        <h2 className="font-semibold">
          Responses <span>({count})</span>
        </h2>
      </div>

      <div className="flex border-t border-gray-200 dark:border-gray-600 px-3 sm:px-6 py-3">
        <NewCommentForm />
      </div>

      <div className="flex-grow flex flex-col overflow-hidden">
        <CommentsList initialData={initialData} useInfiniteScroll={false} />
      </div>
    </>
  );
};

export default CommentSection;
