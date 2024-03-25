"use client"

import React, { useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import useUserSOLBalance from '@/store/useUserSOLBalanceStore'

export default function Page() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { balance, getUserSOLBalance } = useUserSOLBalance();

  useEffect(() => {
    if (wallet.publicKey) {
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (
    <div>
      {wallet &&
        <div className="flex flex-row justify-center">
          <div>
            {balance.toLocaleString()}
          </div>
          <div className='text-slate-600 ml-2'>
            SOL
          </div>
        </div>
      }
    </div>
  )
}
