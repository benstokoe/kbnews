import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { AiOutlineArrowUp } from "react-icons/ai";

const Detail = ({
  id,
  karma,
  profiles: { username },
  inserted_at,
  isComments,
}: DetailProps) => (
  <div className="text-sm flex items-center">
    {!isComments && (
      <div className="mr-1">
        <AiOutlineArrowUp />
      </div>
    )}
    <span className="">
      {karma} points by {username}{" "}
      {formatDistanceToNow(new Date(inserted_at), { addSuffix: true })}&nbsp;
    </span>
    | report
    {!isComments && (
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
  isComments?: boolean;
};

export default Detail;
