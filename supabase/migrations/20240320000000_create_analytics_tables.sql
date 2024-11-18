-- Create page_views table
create table if not exists public.page_views (
    id uuid default gen_random_uuid() primary key,
    article_id uuid references public.articles(id) on delete cascade,
    visitor_id text not null,
    duration integer not null default 0,
    org_id uuid references public.organizations(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.page_views enable row level security;

create policy "Organizations can view their own page views"
    on public.page_views for select
    using (auth.uid() in (
        select profiles.id
        from profiles
        where profiles.org_id = page_views.org_id
    ));

create policy "Organizations can insert their own page views"
    on public.page_views for insert
    with check (auth.uid() in (
        select profiles.id
        from profiles
        where profiles.org_id = page_views.org_id
    ));

-- Create function to increment article views
create or replace function public.increment_article_views(article_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update articles
  set views = coalesce(views, 0) + 1,
      updated_at = now()
  where id = article_id;
end;
$$;