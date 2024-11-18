-- Create invitations table
create table if not exists public.invitations (
    id uuid default gen_random_uuid() primary key,
    email text not null,
    role text not null check (role in ('owner', 'admin', 'member')),
    org_id uuid references public.organizations(id) on delete cascade,
    invited_by uuid references auth.users(id) on delete cascade,
    status text not null check (status in ('pending', 'accepted', 'expired')) default 'pending',
    token uuid not null unique,
    expires_at timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.invitations enable row level security;

create policy "Organizations can view their own invitations"
    on public.invitations for select
    using (auth.uid() in (
        select profiles.id
        from profiles
        where profiles.org_id = invitations.org_id
    ));

create policy "Organizations can create invitations"
    on public.invitations for insert
    with check (auth.uid() in (
        select profiles.id
        from profiles
        where profiles.org_id = invitations.org_id
        and profiles.role in ('owner', 'admin')
    ));

create policy "Organizations can update their own invitations"
    on public.invitations for update
    using (auth.uid() in (
        select profiles.id
        from profiles
        where profiles.org_id = invitations.org_id
        and profiles.role in ('owner', 'admin')
    ));