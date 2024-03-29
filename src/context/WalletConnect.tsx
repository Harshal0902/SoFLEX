"use client"

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { CoinbaseWalletAdapter, LedgerWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import React, { useMemo } from 'react'

require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletConnect = ({ children }: { children: React.ReactNode }) => {
    // Update this for the network you want to connect to
    const network = WalletAdapterNetwork.Mainnet;

    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            // new AlphaWalletAdapter(),
            // new AvanaWalletAdapter(),
            // new BitpieWalletAdapter(),
            // new CloverWalletAdapter(),
            // new Coin98WalletAdapter(),
            new CoinbaseWalletAdapter(),
            // new CoinhubWalletAdapter(),
            // new FractalWalletAdapter(),
            // new HuobiWalletAdapter()
            new LedgerWalletAdapter(),
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            // new TorusWalletAdapter(),
            // new UnsafeBurnerWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
