import { useUser } from "./use-user";
import { supabase } from "utils/supabaseClient";
import { arrayToTree } from "performant-array-to-tree";
import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

const PAGE_SIZE = 15;

type User = {};

export type SortingBehavior =
  | "pathVotesRecent"
  | "pathLeastRecent"
  | "pathMostRecent";

interface CommentsContextInterface {
  postId: number | null;
  user: User | null;
  comments: CommentType[];
  count: number | null | undefined;
  remainingCount: number | null;
  error: any;
  commentsError: any;
  isLoadingInitialData: boolean;
  isLoadingMore: boolean;
  isEmpty: boolean;
  isReachingEnd: boolean | undefined;
  loadMore: () => void;
  mutateComments: any;
  mutateGlobalCount: any;
  sortingBehavior: SortingBehavior;
  setSortingBehavior: (behavior: SortingBehavior) => void;
  setSize: (
    size: number | ((size: number) => number)
  ) => Promise<any[] | undefined | null> | null;
}

const CommentsContext = createContext<CommentsContextInterface>({
  postId: null,
  user: null,
  comments: [],
  count: null,
  remainingCount: null,
  error: null,
  commentsError: null,
  isLoadingInitialData: false,
  isLoadingMore: false,
  isEmpty: true,
  isReachingEnd: true,
  loadMore: () => {
    return;
  },
  mutateComments: null,
  mutateGlobalCount: null,
  sortingBehavior: "pathVotesRecent",
  setSortingBehavior: () => {
    return;
  },
  setSize: () => {
    return null;
  },
});

interface CommentsContextProviderProps {
  postId: number | null;
  [propName: string]: any;
}

const postgresArray = (arr: any[]): string => `{${arr.join(",")}}`;

export const CommentsContextProvider = (
  props: CommentsContextProviderProps
): JSX.Element => {
  const { postId } = props;
  const { user } = useUser();
  const [sortingBehavior, setSortingBehavior] =
    useState<SortingBehavior>("pathVotesRecent");

  const {
    data: count,
    mutate: mutateGlobalCount,
    error: commentsError,
  } = useSWR<number | null, any>(`globalCount_${postId}`, {
    fetcher: () => null,
    revalidateOnFocus: false,
    revalidateOnMount: false,
  });

  const getKey = (
    pageIndex: number,
    previousPageData: CommentType[],
    postId: number | null,
    sortingBehavior: SortingBehavior,
    user: User | null
  ): [string, number, string, SortingBehavior, User | null] | null => {
    if (!postId) return null;
    if (previousPageData && !previousPageData.length) return null;

    if (pageIndex === 0) {
      return [
        "comments_thread_with_user_vote",
        pageIndex,
        postgresArray([postId]),
        sortingBehavior,
        user,
      ];
    }

    return [
      "comments_thread_with_user_vote",
      pageIndex,
      postgresArray(
        previousPageData[previousPageData.length - 1][sortingBehavior]
      ),
      sortingBehavior,
      user,
    ];
  };

  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateComments,
  } = useSWRInfinite(
    (pageIndex, previousPageData) =>
      getKey(pageIndex, previousPageData, postId, sortingBehavior, user), // Include user to revalidate when auth changes
    async (_name, pageIndex, path, sortingBehavior, _user) => {
      const page = pageIndex + 1;
      const startIndex = page * PAGE_SIZE - PAGE_SIZE;
      const endIndex = page * PAGE_SIZE - 1;

      return (
        supabase
          .from("comments_thread_with_user_vote")
          .select("*", { count: "exact" })
          .eq("submissionId", postId)
          // .lt('depth', MAX_DEPTH)
          // .gt(sortingBehavior, path)
          .order(sortingBehavior as any)
          .range(startIndex, endIndex)
          .then(({ data, error, count: tableCount }) => {
            if (error) throw error;
            if (!data) return null;
            mutateGlobalCount((count) => {
              if (count) return count;
              return tableCount;
            }, false);

            return data;
          })
      );
    },
    {
      revalidateOnFocus: false,
      // revalidateOnMount: !cache.has(['comments_thread_with_user_vote', postgresArray([postId])]),
    }
  );

  const flattenedComments: CommentType[] = data ? data.flat() : [];

  const comments: CommentType[] = data
    ? (arrayToTree(flattenedComments, {
        dataField: null,
        childrenField: "responses",
      }) as CommentType[])
    : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    !!(size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = !data || data?.[0]?.length === 0;
  const remainingCount =
    !count || isEmpty ? 0 : count - flattenedComments.length;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  const loadMore = (): void => {
    if (isLoadingMore || isReachingEnd) return;
    setSize(size + 1);
  };

  const value = {
    postId,
    user,
    comments,
    commentsError,
    count,
    remainingCount,
    error,
    isLoadingInitialData,
    isLoadingMore,
    isEmpty,
    isReachingEnd,
    loadMore,
    mutateComments,
    mutateGlobalCount,
    sortingBehavior,
    setSortingBehavior,
    setSize,
  };

  return <CommentsContext.Provider value={value} {...props} />;
};

export const useComments = (): CommentsContextInterface => {
  const context = useContext(CommentsContext);

  if (context === undefined) {
    throw new Error(
      `useComments must be used within a CommentsContextProvider.`
    );
  }

  return context;
};
