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
  public.new_asset_or_collection_request (
    request_id serial,
    user_address text null,
    asset_or_collection_name text not null,
    asset_or_collection text not null,
    constraint new_asset_or_collection_request_pkey primary key (request_id),
    constraint public_new_asset_or_collection_request_user_address_fkey foreign key (user_address) references users (user_address)
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
    borrowing_collateralization_assets text null,
    borrowing_duration text null,
    borrowing_interest_rate text null,
    borrowing_status text not null,
    borrowing_due_by timestamp with time zone null,
    borrowing_total text null,
    transaction_signature text null,
    constraint defi_borrowing_pkey primary key (borrow_id),
    constraint defi_borrowing_borrow_id_key unique (borrow_id),
    constraint defi_borrowing_transaction_signature_key unique (transaction_signature),
    constraint public_defi_borrowing_user_address_fkey foreign key (user_address) references users (user_address)
  ) tablespace pg_default;

create table
  public.asset_details (
    asset_name text not null,
    asset_symbol text null,
    asset_logo text null,
    asset_price text null,
    asset_total_supply text null,
    asset_yield text null,
    asset_total_borrow text null,
    asset_ltv text null,
    constraint asset_details_pkey primary key (asset_name)
  ) tablespace pg_default;

create table
  public.nft_collection_details (
    nft_name text not null,
    nft_logo text null,
    nft_pool text null,
    nft_best_offer text null,
    nft_intrest text null,
    nft_duration text null,
    nft_apy text null,
    nft_floor_price text null,
    constraint nft_collection_details_pkey primary key (nft_name)
  ) tablespace pg_default;