import { pgTable, unique, pgEnum, text, timestamp, serial, varchar, primaryKey, doublePrecision } from 'drizzle-orm/pg-core'

export const aal_level = pgEnum('aal_level', ['aal1', 'aal2', 'aal3'])
export const code_challenge_method = pgEnum('code_challenge_method', ['s256', 'plain'])
export const factor_status = pgEnum('factor_status', ['unverified', 'verified'])
export const factor_type = pgEnum('factor_type', ['totp', 'webauthn'])
export const key_status = pgEnum('key_status', ['default', 'valid', 'invalid', 'expired'])
export const key_type = pgEnum('key_type', ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const action = pgEnum('action', ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const equality_op = pgEnum('equality_op', ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])


export const asset_details = pgTable('asset_details', {
	asset_name: text('asset_name').primaryKey().notNull(),
	asset_symbol: text('asset_symbol').notNull(),
	asset_logo: text('asset_logo').notNull(),
	asset_price: text('asset_price').notNull(),
	asset_total_supply: text('asset_total_supply').notNull(),
	asset_yield: text('asset_yield').notNull(),
	asset_total_borrow: text('asset_total_borrow').notNull(),
	asset_ltv: text('asset_ltv').notNull(),
},
	(table) => {
		return {
			asset_details_asset_name_key: unique('asset_details_asset_name_key').on(table.asset_name),
			asset_details_asset_symbol_key: unique('asset_details_asset_symbol_key').on(table.asset_symbol),
		}
	});

export const defi_lending = pgTable('defi_lending', {
	user_address: text('user_address').notNull().references(() => users.user_address),
	lending_amount: text('lending_amount').notNull(),
	lending_submitted_at: timestamp('lending_submitted_at', { withTimezone: true, mode: 'string' }).notNull(),
	lending_id: text('lending_id').primaryKey().notNull(),
	lending_token: text('lending_token').notNull().references(() => asset_details.asset_symbol),
	transaction_signature: text('transaction_signature').notNull(),
},
	(table) => {
		return {
			defi_lending_lending_id_key: unique('defi_lending_lending_id_key').on(table.lending_id),
			defi_lending_transaction_signature_key: unique('defi_lending_transaction_signature_key').on(table.transaction_signature),
		}
	});

export const nft_collection_details = pgTable('nft_collection_details', {
	nft_name: text('nft_name').primaryKey().notNull(),
	nft_logo: text('nft_logo').notNull(),
	nft_pool: text('nft_pool').notNull(),
	nft_best_offer: text('nft_best_offer').notNull(),
	nft_intrest: text('nft_intrest').notNull(),
	nft_duration: text('nft_duration').notNull(),
	nft_apy: text('nft_apy').notNull(),
	nft_floor_price: text('nft_floor_price').notNull(),
},
	(table) => {
		return {
			nft_collection_details_nft_name_key: unique('nft_collection_details_nft_name_key').on(table.nft_name),
		}
	});

export const defi_borrowing = pgTable('defi_borrowing', {
	borrow_id: text('borrow_id').primaryKey().notNull(),
	user_address: text('user_address').notNull().references(() => users.user_address),
	borrowing_amount: text('borrowing_amount').notNull(),
	borrowing_submitted_at: timestamp('borrowing_submitted_at', { withTimezone: true, mode: 'string' }).notNull(),
	borrowing_token: text('borrowing_token').notNull().references(() => asset_details.asset_symbol),
	borrowing_collateralization_assets: text('borrowing_collateralization_assets').notNull(),
	borrowing_duration: text('borrowing_duration').notNull(),
	borrowing_interest_rate: text('borrowing_interest_rate').notNull(),
	borrowing_status: text('borrowing_status').notNull(),
	borrowing_due_by: timestamp('borrowing_due_by', { withTimezone: true, mode: 'string' }).notNull(),
	borrowing_total: text('borrowing_total').notNull(),
	transaction_signature: text('transaction_signature'),
},
	(table) => {
		return {
			defi_borrowing_borrow_id_key: unique('defi_borrowing_borrow_id_key').on(table.borrow_id),
			defi_borrowing_transaction_signature_key: unique('defi_borrowing_transaction_signature_key').on(table.transaction_signature),
		}
	});

export const new_asset_or_collection_request = pgTable('new_asset_or_collection_request', {
	request_id: serial('request_id').primaryKey().notNull(),
	user_address: text('user_address').notNull().references(() => users.user_address),
	asset_or_collection_name: text('asset_or_collection_name').notNull(),
	asset_or_collection: text('asset_or_collection').notNull(),
},
	(table) => {
		return {
			new_asset_or_collection_request_request_id_key: unique('new_asset_or_collection_request_request_id_key').on(table.request_id),
		}
	});

export const te_user_stats = pgTable('te_user_stats', {
	user_address: text('user_address').primaryKey().notNull().references(() => users.user_address),
	interestearned: varchar('interestearned', { length: 255 }),
	interestearnedlastmonth: varchar('interestearnedlastmonth', { length: 255 }),
	completedloans: varchar('completedloans', { length: 225 }),
	completedloanslastmonth: varchar('completedloanslastmonth', { length: 225 }),
	activeloans: varchar('activeloans', { length: 225 }),
	activeloanslastmonth: varchar('activeloanslastmonth', { length: 225 }),
	activeborrowingsvalue: varchar('activeborrowingsvalue', { length: 225 }),
	activeborrowingsvaluelastmonth: varchar('activeborrowingsvaluelastmonth', { length: 225 }),
	activelendingvalue: varchar('activelendingvalue', { length: 225 }),
	activelendingvaluelastmonth: varchar('activelendingvaluelastmonth', { length: 225 }),
});

export const waitlist = pgTable('waitlist', {
	waitlist_id: serial('waitlist_id').primaryKey().notNull(),
	email: varchar('email', { length: 255 }).notNull(),
},
	(table) => {
		return {
			waitlist_waitlist_id_key: unique('waitlist_waitlist_id_key').on(table.waitlist_id),
			waitlist_email_key: unique('waitlist_email_key').on(table.email),
		}
	});

export const users = pgTable('users', {
	user_id: text('user_id').notNull(),
	email: text('email'),
	user_address: text('user_address').notNull(),
	name: text('name'),
	created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull(),
	on_chain_credit_score: doublePrecision('on_chain_credit_score'),
},
	(table) => {
		return {
			users_pkey: primaryKey({ columns: [table.user_id, table.user_address], name: 'users_pkey' }),
			users_user_id_key: unique('users_user_id_key').on(table.user_id),
			users_user_address_key: unique('users_user_address_key').on(table.user_address),
		}
	});
