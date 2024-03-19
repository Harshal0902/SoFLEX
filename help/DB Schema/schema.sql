create table
  public.waitlist (
    waitlist_id serial,
    email character varying(255) not null,
    constraint waitlist_pkey primary key (waitlist_id),
    constraint waitlist_email_key unique (email)
  ) tablespace pg_default;