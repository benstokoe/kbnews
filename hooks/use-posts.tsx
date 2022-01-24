import { useUser } from "./use-user";
import { supabase } from "utils/supabaseClient";
import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

type User = {};

export type SortingBehavior =
  | "pathVotesRecent"
  | "pathLeastRecent"
  | "pathMostRecent";

interface PostsContextInterface {
  user: User | null;
  posts: Post[];
  count: number | null | undefined;
  currentPage: number;
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

const PostsContext = createContext<PostsContextInterface>({
  user: null,
  posts: [],
  count: null,
  currentPage: null,
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

interface PostsContextProviderProps {
  perPage: number;
  postId?: number;
  [propName: string]: any;
}

export const PostsContextProvider = (
  props: PostsContextProviderProps
): JSX.Element => {
  const { user } = useUser();
  const { perPage, postId } = props;
  const [sortingBehavior, setSortingBehavior] =
    useState<SortingBehavior>("pathVotesRecent");

  const {
    data: count,
    mutate: mutateGlobalCount,
    error: commentsError,
  } = useSWR<number | null, any>(`globalCount_posts`, {
    fetcher: () => null,
    revalidateOnFocus: false,
    revalidateOnMount: false,
  });

  const getKey = (
    pageIndex: number,
    previousPageData: CommentType[],
    sortingBehavior: SortingBehavior,
    user: User | null
  ): [string, number, SortingBehavior, User | null] | null => {
    if (previousPageData && !previousPageData.length) return null;

    return ["posts_with_counts", pageIndex, sortingBehavior, user];
  };

  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateComments,
  } = useSWRInfinite(
    (pageIndex, previousPageData) =>
      getKey(pageIndex, previousPageData, sortingBehavior, user), // Include user to revalidate when auth changes
    async (_name, pageIndex, _sortingBehavior, _user) => {
      const page = pageIndex + 1;
      const startIndex = page * perPage - perPage;
      const endIndex = page * perPage - 1;

      const query = supabase
        .from("posts_with_counts")
        .select(
          "inserted_at, title, url, id, profiles:ownerId ( id, username ), commentsCount, userVoteValue, votes",
          { count: "exact" }
        )
        .range(startIndex, endIndex)
        .order("inserted_at", { ascending: false });

      if (postId) {
        query.eq("id", postId);
      }

      return query.then(({ data, error, count: tableCount }) => {
        if (error) throw error;
        if (!data) return null;
        mutateGlobalCount((count) => {
          if (count) return count;
          return tableCount;
        }, false);

        return data;
      });
    },
    {
      revalidateOnFocus: false,
      // revalidateOnMount: !cache.has(['comments_thread_with_user_vote', postgresArray([postId])]),
    }
  );

  const posts: Post[] = data ? data.flat() : [];

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    !!(size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = !data || data?.[0]?.length === 0;
  const remainingCount = !count || isEmpty ? 0 : count - posts.length;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < perPage);

  const loadMore = (): void => {
    if (isLoadingMore || isReachingEnd) return;
    setSize(size + 1);
  };

  const value = {
    user,
    posts,
    commentsError,
    count,
    currentPage: size,
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
    size,
    setSize,
  };

  return <PostsContext.Provider value={value} {...props} />;
};

export const usePosts = (): PostsContextInterface => {
  const context = useContext(PostsContext);

  if (context === undefined) {
    throw new Error(`useComments must be used within a PostsContextProvider.`);
  }

  return context;
};
