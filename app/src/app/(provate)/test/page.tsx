"use client"

import React, { useEffect, useState } from 'react'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

export default function Page() {
    const { connection } = useConnection();
    const [solBalance, setSolBalance] = useState<number | null>(null);
    const [tokenAccounts, setTokenAccounts] = useState<any[]>([]);

    useEffect(() => {
        const fetchSolBalance = async () => {
            try {
                const walletAddress = new PublicKey('2nHUxjFzxFfwnbF1sdAXcpVwgUEZBw6uFDBUu2dNYwbG');
                const balance = await connection.getBalance(walletAddress);
                setSolBalance(balance / 10 ** 9);
            } catch (error) {
                // console.error('Error fetching SOL balance:', error);
            }
        };

        fetchSolBalance();
    }, [connection]);

    useEffect(() => {
        const fetchTokenAccounts = async () => {
            try {
                const walletAddress = new PublicKey('2nHUxjFzxFfwnbF1sdAXcpVwgUEZBw6uFDBUu2dNYwbG');

                const response = await connection.getParsedTokenAccountsByOwner(walletAddress, {
                    programId: TOKEN_PROGRAM_ID,
                });

                const tokenAccounts = response.value.map(({ pubkey, account }) => {
                    try {
                        const data = account.data.parsed.info;
                        const mint = data.mint;
                        const balance = data.tokenAmount.uiAmount;

                        return {
                            pubkey: pubkey.toBase58(),
                            mint,
                            balance,
                        };
                    } catch (error) {
                        // console.error('Error parsing token account data:', error);
                        return null;
                    }
                }).filter(account => account !== null);

                setTokenAccounts(tokenAccounts);
            } catch (error) {
                // console.error('Error fetching token accounts:', error);
            }
        };

        fetchTokenAccounts();
    }, [connection]);

    return (
        <div>
            <h2>SOL Balance</h2>
            <p>{solBalance !== null ? `${solBalance} SOL` : 'Loading...'}</p>

            <h2>SPL Tokens</h2>
            <ul>
                {tokenAccounts.map((account) => (
                    <li key={account.pubkey}>
                        Token Mint: {account.mint}<br />
                        Balance: {account.balance}
                    </li>
                ))}
            </ul>
        </div>
    );
}
