"use server"

import { db } from '@/db/db'
import { waitlist, users, new_asset_or_collection_request, asset_details, nft_collection_details, defi_borrowing, defi_lending, te_user_stats } from '@/db/schema'
import crypto from 'crypto'
import { eq, count, and, desc } from 'drizzle-orm'

interface AssetOrCollectionType {
    walletAddress: string;
    requestedAssetOrCollectionName: string;
    assetOrCollection: string;
}

interface NewDeFiBorrowingType {
    walletAddress: string;
    borrowingAmount: string;
    borrowingToken: string;
    collateralizationAssets: NFTType[];
    borrowingDuration: string;
    borrowingInterestRate: string;
    borrowingDueBy: string;
    borrowingTotal: string;
}

interface NFTType {
    image_uri: string;
    name: string;
    floorprice: number;
    external_url: string;
    mint: string;
    royalty: number;
}

interface NewDeFiLendingType {
    walletAddress: string;
    lendingAmount: string;
    lendingToken: string;
    transactionSignature: string;
}

interface UserType {
    walletAddress: string;
    name?: string | null;
    email?: string | null;
}

interface UserBorrowStatusType {
    borrowId: string;
    borrowStatus: string;
    transactionSignature: string;
}

export const addUserWaitlist = async ({ email }: { email: string }) => {
    try {
        const newWaitlistUser = await db.insert(waitlist).values({ email });
        return newWaitlistUser;
    } catch (error) {
        return 'Error adding user to waitlist';
    }
};

export const addNewUser = async ({ walletAddress }: { walletAddress: string }) => {
    try {
        const uuid = crypto.randomBytes(16).toString('hex');
        const generateNewUserId = uuid.substring(0, 8) + uuid.substring(9, 13) + uuid.substring(14, 18) + uuid.substring(19, 23) + uuid.substring(24);
        const newUserId = 'user_' + generateNewUserId;

        const existingUsers = await db.select({ user_address: users.user_address }).from(users).where(eq(users.user_address, walletAddress));

        if (existingUsers && existingUsers.length > 0) {
            return 'User already exists';
        } else {
            await db.insert(users).values({
                user_id: newUserId,
                user_address: walletAddress,
                created_at: new Date().toISOString()
            });
        }
    } catch (error) {
        return 'Error adding new user';
    }
};

export const updateUserCreditScore = async ({ walletAddress, creditScore }: { walletAddress: string, creditScore: number }) => {
    try {
        await db.update(users).set({ on_chain_credit_score: creditScore }).where(eq(users.user_address, walletAddress));
        return 'User credit score updated';
    } catch (error) {
        return 'Error updating user credit score';
    }
}

export const newAssetOrCollectionRequest = async ({ walletAddress, requestedAssetOrCollectionName, assetOrCollection }: AssetOrCollectionType) => {
    try {
        await db.insert(new_asset_or_collection_request).values({
            user_address: walletAddress,
            asset_or_collection_name: requestedAssetOrCollectionName,
            asset_or_collection: assetOrCollection
        });
        return 'Request for new Asset or Collection sent successfully';
    } catch (error) {
        return 'Error adding request for new Asset or Collection';
    }
}

export const assetDetails = async () => {
    try {
        const data = await db.select().from(asset_details);
        return data;
    } catch (error) {
        return 'Error fetching Asset details';
    }
}

export const newDeFiBorrowing = async ({ walletAddress, borrowingAmount, borrowingToken, collateralizationAssets, borrowingDuration, borrowingInterestRate, borrowingDueBy, borrowingTotal }: NewDeFiBorrowingType) => {
    try {
        const uuid = crypto.randomBytes(16).toString('hex');
        const generateNewBorrowingId = uuid.substring(0, 8) + uuid.substring(9, 13) + uuid.substring(14, 18) + uuid.substring(19, 23) + uuid.substring(24);
        const newBorrowingId = 'loan_' + generateNewBorrowingId;

        await db.insert(defi_borrowing).values({
            borrow_id: newBorrowingId,
            user_address: walletAddress,
            borrowing_submitted_at: new Date().toISOString(),
            borrowing_amount: borrowingAmount,
            borrowing_token: borrowingToken,
            borrowing_collateralization_assets: JSON.stringify(collateralizationAssets),
            borrowing_duration: borrowingDuration,
            borrowing_interest_rate: borrowingInterestRate,
            borrowing_status: 'Active',
            borrowing_due_by: borrowingDueBy,
            borrowing_total: borrowingTotal
        });

        return 'Request for new DeFi Borrowing sent successfully';
    } catch (error) {
        return 'Error adding new DeFi Borrowing';
    }
}

export const nftCollectionDetails = async () => {
    try {
        const data = await db.select().from(nft_collection_details);
        return data;
    } catch (error) {
        return 'Error fetching NFT Collection details';
    }
}

export const newDeFiLending = async ({ walletAddress, lendingAmount, lendingToken, transactionSignature }: NewDeFiLendingType) => {
    try {
        const uuid = crypto.randomBytes(16).toString('hex');
        const generateNewLendingId = uuid.substring(0, 8) + uuid.substring(9, 13) + uuid.substring(14, 18) + uuid.substring(19, 23) + uuid.substring(24);
        const newLendingId = 'lend_' + generateNewLendingId;

        await db.insert(defi_lending).values({
            lending_id: newLendingId,
            user_address: walletAddress,
            lending_amount: lendingAmount,
            lending_token: lendingToken,
            transaction_signature: transactionSignature,
            lending_submitted_at: new Date().toISOString()
        });

        return 'Request for new DeFi Lending sent successfully';
    } catch (error) {
        return 'Error adding new DeFi Lending';
    }
}

export const userPortfolioDetails = async ({ walletAddress }: { walletAddress: string }) => {
    try {
        const data = await db
            .select({
                name: users.name,
                email: users.email,
            })
            .from(users)
            .where(eq(users.user_address, walletAddress));
        return data;
    }
    catch (error) {
        return 'Error fetching user portfolio details';
    }
}

export const updateUserData = async ({ walletAddress, name, email }: UserType) => {
    try {
        await db.update(users).set({
            name: name,
            email: email
        }).where(eq(users.user_address, walletAddress));
        return 'User data updated';
    } catch (error) {
        return 'Error updating user data';
    }
}

export const userStatsDetails = async ({ walletAddress }: { walletAddress: string }) => {
    try {
        const activeLendingingValue = await db.select({
            lending_amount: defi_lending.lending_amount,
            lending_token: defi_lending.lending_token
        })
            .from(defi_lending)
            .where(eq(defi_lending.user_address, walletAddress));

        const completedLoans = await db.select({ count: count() }).from(defi_borrowing)
            .where(
                and(
                    eq(defi_borrowing.user_address, walletAddress),
                    eq(defi_borrowing.borrowing_status, 'Repaid')
                )
            );

        const activeLoans = await db.select({ count: count() }).from(defi_borrowing)
            .where(
                and(
                    eq(defi_borrowing.user_address, walletAddress),
                    eq(defi_borrowing.borrowing_status, 'Active')
                )
            );

        const activeBorrowingValue = await db.select({
            borrowing_total: defi_borrowing.borrowing_total
        })
            .from(defi_borrowing)
            .where(
                and(
                    eq(defi_borrowing.user_address, walletAddress),
                    eq(defi_borrowing.borrowing_status, 'Active')
                )
            );

        return { activeLendingingValue, completedLoans, activeLoans, activeBorrowingValue };
    } catch (error) {
        return 'Error fetching user stats';
    }
}

export const userLoanDetails = async ({ walletAddress }: { walletAddress: string }) => {
    try {
        const data = await db.select({
            borrow_id: defi_borrowing.borrow_id,
            borrow_user_address: defi_borrowing.user_address,
            borrowing_amount: defi_borrowing.borrowing_amount,
            borrowing_submitted_at: defi_borrowing.borrowing_submitted_at,
            borrowing_token: defi_borrowing.borrowing_token,
            borrowing_collateralization_assets: defi_borrowing.borrowing_collateralization_assets,
            borrowing_duration: defi_borrowing.borrowing_duration,
            borrowing_interest_rate: defi_borrowing.borrowing_interest_rate,
            borrowing_status: defi_borrowing.borrowing_status,
            borrowing_due_by: defi_borrowing.borrowing_due_by,
            borrowing_total: defi_borrowing.borrowing_total,
        })
            .from(defi_borrowing)
            .where(eq(defi_borrowing.user_address, walletAddress)).orderBy(desc(defi_borrowing.borrowing_submitted_at));
        return data;
    } catch (error) {
        return 'Error fetching user loan details';
    }
}

export const updateUserBorrowStatus = async ({ borrowId, borrowStatus, transactionSignature }: UserBorrowStatusType) => {
    try {
        await db.update(defi_borrowing).set({
            borrowing_status: borrowStatus,
            transaction_signature: transactionSignature,
            borrowing_repayed_on: new Date().toISOString()
        }).where(eq(defi_borrowing.borrow_id, borrowId));
        return 'User borrow status updated';
    } catch (error) {
        return 'Error updating user borrow status';
    }
}
