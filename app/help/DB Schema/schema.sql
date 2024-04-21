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
  
create table
  public.new_asset_lending_request (
    user_address text null,
    asset_name text not null,
    constraint public_new_asset_lending_request_user_address_fkey foreign key (user_address) references users (user_address)
  ) tablespace pg_default;
  
create table
  public.defi_lending (
    user_address text null,
    lending_amount text null,
    lending_submitted_at timestamp with time zone null,
    lending_id text not null,
    lending_token text not null,
    transaction_signature text not null,
    constraint defi_lending_pkey primary key (lending_id),
    constraint defi_lending_lending_id_key unique (lending_id),
    constraint defi_lending_transaction_signature_key unique (transaction_signature),
    constraint public_defi_lending_user_address_fkey foreign key (user_address) references users (user_address)
  ) tablespace pg_default;

create table
  public.defi_borrowing (
    borrow_id text not null,
    user_address text not null,
    borrowing_amount text null,
    borrowing_submitted_at timestamp with time zone null,
    borrowing_token text null,
    borrowing_collateralization_assets text[] null,
    borrowing_duration integer null,
    borrowing_interest_rate text null,
    constraint defi_borrowing_pkey primary key (borrow_id),
    constraint defi_borrowing_borrow_id_key unique (borrow_id),
    constraint public_defi_borrowing_user_address_fkey foreign key (user_address) references users (user_address)
  ) tablespace pg_default;