import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { AiOutlineArrowUp } from "react-icons/ai";

const Detail = ({
  id,
  karma,
  profiles: { username },
  inserted_at,
  hideUpvote,
  hideComments,
}: DetailProps) => (
  <div className="text-sm flex items-center">
    {!hideUpvote && (
      <div className="mr-1 hover:pointer">
        <AiOutlineArrowUp className="hover:fill-red" />
      </div>
    )}
    <span className="">
      {karma} points by {username}{" "}
      {formatDistanceToNow(new Date(inserted_at), { addSuffix: true })}&nbsp;
    </span>
    | report
    {!hideComments && (
      <>
        &nbsp;|&nbsp;
        <Link href={`/post/${id}`}>comments</Link>
      </>
    )}
  </div>
);

type DetailProps = {
  id?: string;
  karma: number;
  profiles: {
    username: string;
  };
  inserted_at: string;
  hideUpvote?: boolean;
  hideComments?: boolean;
};

export default Detail;
