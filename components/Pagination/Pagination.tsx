import { usePosts } from "hooks/use-posts";

const Pagination = () => {
  const { isLoadingMore, isReachingEnd, loadMore, remainingCount } = usePosts();

  return (
    !isReachingEnd &&
    !!remainingCount && (
      <button
        onClick={loadMore}
        className="text-sm border-none hover:underline focus:underline focus-ring font-semibold text-gray-600 dark:text-gray-400"
        disabled={isLoadingMore}
      >
        Load more
      </button>
    )
  );
};

export default Pagination;
