create or replace view posts_with_counts as
    select
        p.id,
        p.url,
        p."ownerId",
        p.title,
        p."inserted_at",
        coalesce (
            (
                select
                    count (*)
                from
                    posts v
                where
                    p.id = v."submissionId"
            ),
            0
        ) as "commentsCount",
        coalesce(
            (
                select
                    v."value"
                from
                    user_submissions_votes v
                where
                    auth.uid() = v."userId" and v."submissionId" = p.id
            ),
            0
        ) as "userVoteValue",
        coalesce (
            (
                select
                    sum (value)
                from
                    user_submissions_votes v
                where
                    p.id = v."submissionId"
            ),
            0
        ) as "votes"
    from
        submissions p