create table
  public.waitlist (
    waitlist_id serial,
    email character varying(255) not null,
    constraint waitlist_pkey primary key (waitlist_id),
    constraint waitlist_email_key unique (email)
  ) tablespace pg_default;

create table
  public.users (
    user_id text primary key not null,
    email text null,
    user_address text not null,
    name text null,
    created_at timestamp with time zone not null
  ) tablespace pg_default;
