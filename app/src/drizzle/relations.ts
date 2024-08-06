import { relations } from 'drizzle-orm/relations'
import { asset_details, defi_lending, users, defi_borrowing, new_asset_or_collection_request } from './schema'

export const defi_lendingRelations = relations(defi_lending, ({ one }) => ({
	asset_detail: one(asset_details, {
		fields: [defi_lending.lending_token],
		references: [asset_details.asset_symbol]
	}),
	user: one(users, {
		fields: [defi_lending.user_address],
		references: [users.user_address]
	}),
}));

export const asset_detailsRelations = relations(asset_details, ({ many }) => ({
	defi_lendings: many(defi_lending),
	defi_borrowings: many(defi_borrowing),
}));

export const usersRelations = relations(users, ({ many }) => ({
	defi_lendings: many(defi_lending),
	defi_borrowings: many(defi_borrowing),
	new_asset_or_collection_requests: many(new_asset_or_collection_request),
}));

export const defi_borrowingRelations = relations(defi_borrowing, ({ one }) => ({
	asset_detail: one(asset_details, {
		fields: [defi_borrowing.borrowing_token],
		references: [asset_details.asset_symbol]
	}),
	user: one(users, {
		fields: [defi_borrowing.user_address],
		references: [users.user_address]
	}),
}));

export const new_asset_or_collection_requestRelations = relations(new_asset_or_collection_request, ({ one }) => ({
	user: one(users, {
		fields: [new_asset_or_collection_request.user_address],
		references: [users.user_address]
	}),
}));