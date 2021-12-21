import Detail from "components/Detail/Detail";
import Link from "next/link";

const Post = ({ title, url, ...detail }: PostProps) => {
  return (
    <div className="flex flex-col">
      {url && (
        <span>
          <a
            href={url}
            rel="noreferrer"
            target="_blank"
            className="hover:underline"
          >
            {title}
          </a>
          {url && <span className="text-sm text-grey-600"> ({url})</span>}
        </span>
      )}
      {!url && (
        <Link href={`/post/${detail.id}`}>
          <a className="hover:underline">{title}</a>
        </Link>
      )}

      <Detail {...detail} />
    </div>
  );
};

type PostProps = Post & {
  isComments?: boolean;
};

export default Post;
