import { createBrowserClient } from '@supabase/ssr'
import crypto from 'crypto'

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface WaitlistUserType {
    email: string;
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