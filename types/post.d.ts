interface Post {
  title: string;
  karma: number;
  profiles: {
    id: string;
    username: string;
  };
  inserted_at: string;
  url: string;
  id: number;
  votes: number;
  userVoteValue: number;
  commentsCount: number;
}
