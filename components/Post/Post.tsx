import Detail from "components/Detail/Detail";

const Post = ({ title, url, ...detail }: PostProps) => {
  return (
    <div className="flex flex-col">
      <a
        href={url}
        rel="noreferrer"
        target="_blank"
        className="hover:underline"
      >
        {title}
      </a>

      <Detail {...detail} />
    </div>
  );
};

type PostProps = Post & {
  isComments?: boolean;
};

export default Post;
