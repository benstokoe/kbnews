import Comment from "components/Comment/Comment";
import CommentSkeleton from "components/CommentSkeleton/CommentSkeleton";
import { useComments } from "hooks/use-comments";
import cn from "classnames";
import React, { useRef, useState } from "react";
import SortCommentsSelect from "components/SortCommentsSelect/SortCommentsSelect";

const SCROLL_OFFSET_PX = 10;

interface Props {
  initialData?: CommentType | null;
  useInfiniteScroll: boolean;
}

const CommentsList = ({
  initialData = null,
  useInfiniteScroll = false,
}: Props): JSX.Element => {
  const {
    comments,
    remainingCount,
    isLoadingInitialData,
    isLoadingMore,
    isEmpty,
    isReachingEnd,
    loadMore,
    error,
    commentsError,
  } = useComments();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const handleScroll = (): void => {
    if (wrapperRef.current && wrapperRef.current.scrollTop === 0) {
      setIsScrolled(false);
    } else {
      setIsScrolled(true);
    }

    if (!useInfiniteScroll) return;

    if (
      wrapperRef.current &&
      contentRef.current &&
      wrapperRef.current.scrollTop +
        wrapperRef.current.offsetHeight +
        SCROLL_OFFSET_PX >
        contentRef.current.offsetHeight
    ) {
      loadMore();
    }
  };

  if (error || commentsError) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 px-3 sm:px-6">
        An error occurred.
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "flex-grow overflow-y-auto overflow-x-hidden overscroll-contain transition-shadow px-3 sm:px-6 pb-6",
        {
          "shadow-inner": isScrolled,
        }
      )}
      onScroll={handleScroll}
    >
      <div ref={contentRef}>
        {/* {!isEmpty && <SortCommentsSelect />} */}

        {isLoadingInitialData &&
          Array.from(new Array(3)).map((_, index) => (
            <CommentSkeleton key={`comments_skeleton_${index}`} />
          ))}
        {!isLoadingInitialData && (
          <>
            {comments.map((comment: CommentType) => (
              <div
                className="py-3"
                key={`${comment.slug}${useInfiniteScroll ? "-s" : ""}`}
              >
                <Comment comment={comment} highlight={comment.highlight} />
              </div>
            ))}
            {error && (
              <div className="text-center text-gray-600 dark:text-gray-400 px-3 sm:px-6">
                Couldn&apos;t load comments. Please refresh the page.
              </div>
            )}
            {isLoadingMore && <CommentSkeleton />}

            {!isReachingEnd && (
              <button
                onClick={() => loadMore()}
                className="text-sm border-none hover:underline focus:underline focus-ring font-semibold text-gray-600 dark:text-gray-400"
                disabled={isLoadingMore}
                aria-label={`Load ${remainingCount} more replies`}
              >
                {remainingCount} more replies
              </button>
            )}

            {isEmpty && (
              <div className="my-6 text-gray-700 dark:text-gray-200">
                There are no comments. Be the first.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentsList;
