"use client"

import { useState } from 'react'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

interface UserSOLBalance {
    balance: number;
    getUserSOLBalance: (publicKey: PublicKey, connection: Connection) => void;
}

export default function useUserSOLBalance(): UserSOLBalance {
    const [balance, setBalance] = useState<number>(0);

    const getUserSOLBalance = async (publicKey: PublicKey, connection: Connection) => {
        let fetchedBalance = 0;
        try {
            fetchedBalance = await connection.getBalance(publicKey, 'confirmed');
            fetchedBalance = fetchedBalance / LAMPORTS_PER_SOL;
        } catch (error) {
            console.error('Error getting balance:', error);
        }
        setBalance(fetchedBalance);
    };

    return {
        balance,
        getUserSOLBalance,
    };
};
