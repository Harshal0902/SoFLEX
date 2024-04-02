create table
  public.waitlist (
    waitlist_id serial,
    email character varying(255) not null,
    constraint waitlist_pkey primary key (waitlist_id),
    constraint waitlist_email_key unique (email)
  ) tablespace pg_default;

create table
  public.users (
    user_id text not null,
    email text null,
    user_address text not null,
    name text null,
    created_at timestamp with time zone not null,
    on_chain_credit_score double precision null,
    constraint users_pkey primary key (user_id, user_address),
    constraint users_user_address_key unique (user_address)
  ) tablespace pg_default;
  