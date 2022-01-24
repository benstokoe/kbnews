type StatusType = "upvoted" | "unvoted" | "downvoted";

const resolveStatus = (
  userVoteValue: number | undefined | null
): StatusType => {
  if (userVoteValue === 1) return "upvoted";
  if (userVoteValue === -1) return "downvoted";
  return "unvoted";
};

export default resolveStatus;
