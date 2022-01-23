-- Create a table for Public Profiles
create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  primary key (id),
  unique (username),
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a trigger to sync profiles and auth.users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Create a table for posts
create table posts (
    id bigserial not null,
    slug text not null unique,
    "createdAt" timestamp with time zone default now() not null,
    "updatedAt" timestamp with time zone default now() null,
    title text null,
    content text null,
    "isPublished" boolean default false not null,
    "authorId" uuid not null references profiles (id),
    "parentId" bigint null references posts (id),
    live boolean default true null,
    "submissionId" bigint default '1' ::bigint not null,
    "isPinned" boolean default false not null,
    "isDeleted" boolean default false not null,
    "isApproved" boolean default false not null,

    primary key (id),
    unique (slug)
);

alter table posts enable row level security;

create policy "Posts are viewable by everyone."
    on posts for select
    using ( true );

create policy "Users can post as themselves."
    on posts for insert
    with check ( auth.uid() = "authorId" );

-- Create a table for submissions
create table submissions (
    id bigserial not null,
    "url" text not null,
    "ownerId" uuid not null,
    "title" text not null,

    primary key (id)
);

alter table submissions enable row level security;

create policy "Submissions are viewable by everyone."
    on submissions for select
    using ( true );

create policy "Users can create their own submissions."
    on submissions for insert
    with check ( auth.uid() = "ownerId" );

-- Create a table for votes
create table votes (
    "postId" bigint not null references posts (id),
    "userId" uuid not null references profiles (id),
    "value" int not null,

    primary key ("postId", "userId"),
    constraint vote_quantity check (value <= 1 and value >= -1)
);

alter table votes enable row level security;

create policy "Votes are viewable by everyone"
    on votes for select
    using ( true );

create policy "Users can vote as themselves"
    on votes for insert
    with check (auth.uid() = "userId");

create policy "Users can update their own votes"
    on votes for update
    using ( auth.uid() = "userId" );


-- Set up Realtime!
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table posts, submissions, votes, profiles;

-- Set up Storage!
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create view comment_with_author as
    select
        p.id,
        p.slug,
        p."createdAt",
        p."updatedAt",
        p.title,
        p.content,
        p."isPublished",
        p."authorId",
        p."parentId",
        p.live,
        p."submissionId",
        p."isPinned",
        p."isDeleted",
        p."isApproved",
        to_jsonb(u) as author
    from
        posts p
        inner join profiles u on p."authorId" = u.id;

create view comments_linear_view as
    select
        root_c.*,
        to_jsonb(parent_c) as parent,
        coalesce(json_agg(children_c) filter (where children_c.id is not null), '[]') as responses
    from
        comment_with_author root_c
        inner join comment_with_author parent_c on root_c."parentId" = parent_c.id
        inner join submissions s1 on s1.id = root_c."submissionId"
        left join comment_with_author children_c on children_c."parentId" = root_c.id
    group by
        root_c.id,
        root_c.slug,
        root_c."createdAt",
        root_c."updatedAt",
        root_c.title,
        root_c.content,
        root_c."isPublished",
        root_c."authorId",
        root_c."parentId",
        root_c.live,
        root_c."submissionId",
        root_c."isPinned",
        root_c."isDeleted",
        root_c."isApproved",
        root_c.author,
        parent_c.*;

create or replace view comments_with_author_votes as
    select
        p.id,
        p.slug,
        p."createdAt",
        p."updatedAt",
        p.title,
        p.content,
        p."isPublished",
        p."authorId",
        p."parentId",
        p.live,
        p."submissionId",
        p."isPinned",
        p."isDeleted",
        p."isApproved",
        p."author",
        coalesce (
            sum (v.value) over w,
            0
        ) as "votes",
        sum (case when v.value > 0 then 1 else 0 end) over w as "upvotes",
        sum (case when v.value < 0 then 1 else 0 end) over w as "downvotes"
        -- (select case when auth.uid() = v."userId" then v.value else 0 end) as "userVoteValue"
    from
        comment_with_author p
        left join votes v on p.id = v."postId"
    window w as (
        partition by v."postId"
    );

create recursive view comments_thread (
    id,
    slug,
    "createdAt",
    "updatedAt",
    title,
    content,
    "isPublished",
    "authorId",
    "parentId",
    live,
    "submissionId",
    "isPinned",
    "isDeleted",
    "isApproved",
    "author",
    "votes",
    "upvotes",
    "downvotes",
    "depth",
    "path",
    "pathVotesRecent",
    "pathLeastRecent",
    "pathMostRecent"
) as
    select
        id,
        slug,
        "createdAt",
        "updatedAt",
        title,
        content,
        "isPublished",
        "authorId",
        "parentId",
        live,
        "submissionId",
        "isPinned",
        "isDeleted",
        "isApproved",
        "author",
        "votes",
        "upvotes",
        "downvotes",
        0 as depth,
        array[submissionId] as "path",
        array[submissionId] as "pathVotesRecent",
        array[submissionId] as "pathLeastRecent",
        array[submissionId] as "pathMostRecent"
    from
        comments_with_author_votes
    where
        "parentId" is null
    union all
    select
        p1.id,
        p1.slug,
        p1."createdAt",
        p1."updatedAt",
        p1.title,
        p1.content,
        p1."isPublished",
        p1."authorId",
        p1."parentId",
        p1.live,
        p1."submissionId",
        p1."isPinned",
        p1."isDeleted",
        p1."isApproved",
        p1."author",
        p1."votes",
        p1."upvotes",
        p1."downvotes",
        p2.depth + 1 as depth,
        p2."path" || p1.submissionId::bigint as "path",
        p2."pathVotesRecent" || -p1."votes"::bigint || -extract(epoch from p1."createdAt")::bigint || p1.submissionId as "pathVotesRecent",
        p2."pathLeastRecent" || extract(epoch from p1."createdAt")::bigint || p1.submissionId as "pathLeastRecent",
        p2."pathMostRecent" || -extract(epoch from p1."createdAt")::bigint || p1.submissionId as "pathMostRecent"
    from
        comments_with_author_votes p1
        join comments_thread p2 on p1."parentId" = p2.id;

create or replace view comments_thread_with_user_vote as
    select distinct on (id)
        id,
        slug,
        "createdAt",
        "updatedAt",
        title,
        content,
        "isPublished",
        "authorId",
        "parentId",
        live,
        "submissionId",
        "isPinned",
        "isDeleted",
        "isApproved",
        "author",
        "votes",
        "upvotes",
        "downvotes",
        "depth",
        "path",
        "pathVotesRecent",
        "pathLeastRecent",
        "pathMostRecent",
        coalesce(
            (
                select
                    v."value"
                from
                    votes v
                where
                    auth.uid() = v."userId" and v."postId" = id
            ),
            0
        ) as "userVoteValue"
    from comments_thread