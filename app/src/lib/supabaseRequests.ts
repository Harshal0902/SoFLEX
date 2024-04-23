import { createBrowserClient } from '@supabase/ssr'
import crypto from 'crypto'

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface WaitlistUserType {
    email: string;
}

interface UserType {
    walletAddress?: string;
    name?: string | null;
    email?: string | null;
}

interface AssetOrCollectionType {
    walletAddress?: string;
    requestedAssetOrCollectionName: string;
    assetOrCollection: string;
}

interface NewDeFiLendingType {
    walletAddress?: string;
    lendingAmount: string;
    lendingToken: string;
    transactionSignature: string;
}

interface NewDeFiBorrowingType {
    walletAddress?: string;
    borrowingAmount: string;
    borrowingToken: string;
    collateralizationAssets: string[];
    borrowingDuration: string;
    borrowingInterestRate?: string;
    borrowingCollateralType: string;
}

export const addUserWaitlist = async ({ email }: WaitlistUserType) => {
    try {
        const { data, error } = await supabase
            .from('waitlist')
            .insert([
                { email: email },
            ])
            .select()

        if (error) {
            return new Response('Error checking for existing user', { status: 200 });
        }

        return data;

    } catch (error) {
        return new Response('Error checking for existing user', { status: 500 });
    }
};

export const addNewUser = async ({ walletAddress }: { walletAddress?: string }) => {
    try {
        const uuid = crypto.randomBytes(16).toString('hex');
        const generateNewUserId = uuid.substring(0, 8) + uuid.substring(9, 13) + uuid.substring(14, 18) + uuid.substring(19, 23) + uuid.substring(24);
        const newUserId = 'user_' + generateNewUserId;

        const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('user_address')
            .eq('user_address', walletAddress);

        if (checkError) {
            throw new Error('Error checking for existing user');
        }

        if (existingUsers && existingUsers.length > 0) {
            return new Response('User already exists', { status: 200 });
        }

        const { data, error: insertError } = await supabase
            .from('users')
            .upsert([
                {
                    user_id: newUserId,
                    user_address: walletAddress,
                    created_at: new Date()
                }
            ]);

        if (insertError) {
            throw new Error('Error inserting a new user');
        }

        return data;
    } catch (error) {
        return new Response('Error adding a new user', { status: 500 });
    }
};


export const userPortfolioDetails = async ({ walletAddress }: { walletAddress?: string }) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('name, email')
            .eq('user_address', walletAddress);

        if (error) {
            return new Response('Error fetching new user profile', {
                status: 500,
            });
        }

        return data;
    } catch (error) {
        return new Response('Error fetching new user profile', { status: 500 });
    }
};

export const updateUserData = async ({ walletAddress, name, email }: UserType) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({
                name: name,
                email: email
            })
            .eq('user_address', walletAddress);

        if (error) {
            return new Response('Error updating user data', { status: 500 });
        }

        return data;
    } catch (error) {
        return new Response('Error updating user data', { status: 500 });
    }
};

export const updateUserCreditScore = async ({ walletAddress, creditScore }: { walletAddress?: string, creditScore: string }) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({
                on_chain_credit_score: creditScore,
            })
            .eq('user_address', walletAddress);

        if (error) {
            return new Response('Error updating user credit score', { status: 500 });
        }

        return data;
    } catch (error) {
        return new Response('Error updating user credit score', { status: 500 });
    }
};

export const newAssetOrCollectionRequest = async ({ walletAddress, requestedAssetOrCollectionName, assetOrCollection }: AssetOrCollectionType) => {
    try {
        const { data, error } = await supabase
            .from('new_asset_or_collection_request')
            .insert({
                user_address: walletAddress,
                asset_or_collection_name: requestedAssetOrCollectionName,
                asset_or_collection: assetOrCollection
            })
            .select();

        if (error) {
            return new Response('Error inserting user request for new asset', { status: 500 });
        }

        return data;
    } catch (error) {
        return new Response('Error inserting user request for new asset', { status: 500 });
    }
};

export const newDeFiLending = async ({ walletAddress, lendingAmount, lendingToken, transactionSignature }: NewDeFiLendingType) => {
    try {
        const uuid = crypto.randomBytes(16).toString('hex');
        const generateNewLendingId = uuid.substring(0, 8) + uuid.substring(9, 13) + uuid.substring(14, 18) + uuid.substring(19, 23) + uuid.substring(24);
        const newLendingId = 'lend_' + generateNewLendingId;
        const created_at = new Date();

        const { data, error } = await supabase
            .from('defi_lending')
            .insert({
                lending_id: newLendingId,
                user_address: walletAddress,
                lending_amount: lendingAmount,
                lending_token: lendingToken,
                transaction_signature: transactionSignature,
                lending_submitted_at: created_at
            })
            .select();

        if (error) {
            return new Response('Error inserting user lenging request', { status: 500 });
        }

        return data;
    } catch (error) {
        return new Response('Error inserting user lenging request', { status: 500 });
    }
};

export const newDeFiBorrowing = async ({ walletAddress, borrowingAmount, borrowingToken, collateralizationAssets, borrowingDuration, borrowingInterestRate, borrowingCollateralType }: NewDeFiBorrowingType) => {
    try {
        const uuid = crypto.randomBytes(16).toString('hex');
        const generateNewBorrowingId = uuid.substring(0, 8) + uuid.substring(9, 13) + uuid.substring(14, 18) + uuid.substring(19, 23) + uuid.substring(24);
        const newBorrowingId = 'loan_' + generateNewBorrowingId;
        const created_at = new Date();

        const { data, error } = await supabase
            .from('defi_borrowing')
            .insert({
                borrow_id: newBorrowingId,
                user_address: walletAddress,
                borrowing_amount: borrowingAmount,
                borrowing_token: borrowingToken,
                borrowing_collateralization_assets: collateralizationAssets,
                borrowing_duration: borrowingDuration,
                borrowing_interest_rate: borrowingInterestRate,
                borrowing_collateral_type: borrowingCollateralType,
                borrowing_submitted_at: created_at
            })
            .select();

        if (error) {
            return new Response('Error inserting user borrowing request', { status: 500 });
        }

        return data;
    } catch (error) {
        return new Response('Error inserting user borrowing request', { status: 500 });
    }
};

export const assetDetails = async () => {
    try {
        const { data, error } = await supabase
            .from('asset_details')
            .select('*');

        if (error) {
            return new Response('Error fetching asset details', {
                status: 500,
            });
        }

        return data;
    } catch (error) {
        return new Response('Error fetching asset details', { status: 500 });
    }
};

export const nftCollectionDetails = async () => {
    try {
        const { data, error } = await supabase
            .from('nft_collection_details')
            .select('*');

        if (error) {
            return new Response('Error fetching NFTCollection details', {
                status: 500,
            });
        }

        return data;
    } catch (error) {
        return new Response('Error fetching NFTCollection details', { status: 500 });
    }
};

export const teUserStatsDetails = async ({ walletAddress }: { walletAddress?: string }) => {
    try {
        const { data, error } = await supabase
            .from('te_user_stats')
            .select('*')
            .eq('user_address', walletAddress);

        if (error) {
            return new Response('Error fetching user stats', {
                status: 500,
            });
        }

        return data;
    } catch (error) {
        return new Response('Error fetching user stats', { status: 500 });
    }
};

export const teUserLoanDetails = async ({ walletAddress }: { walletAddress?: string }) => {
    try {
        const { data, error } = await supabase
            .from('te_user_loan_details')
            .select('*')
            .eq('user_address', walletAddress);

        if (error) {
            return new Response('Error fetching user loan details', {
                status: 500,
            });
        }

        return data;
    } catch (error) {
        return new Response('Error fetching user loan details', { status: 500 });
    }
};