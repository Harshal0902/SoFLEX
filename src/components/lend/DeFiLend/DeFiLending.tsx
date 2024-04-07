import React, { useEffect, useState } from 'react'
import { newAssetLendingRequest } from '@/lib/supabaseRequests'
import { useWallet } from '@solana/wallet-adapter-react'
import { LendingAssetDataType, lendingAssetColumns } from './columns'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Form, FormLabel, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/ui/data-table-defi'

const lendingAssetData: LendingAssetDataType[] = [
  {
    assetName: 'solana',
    assetSymbol: 'SOL',
    assetLogo: '/assets/lend/sol.svg',
    assetPrice: '$ 176.24',
    totalSupply: '255,556 SOL',
    assetYield: '90 %',
    totalBorrow: '115,55 SOL',
    LTV: '22 %',
  },
  {
    assetName: 'usd-coin',
    assetSymbol: 'USDC',
    assetLogo: '/assets/lend/usdc.svg',
    assetPrice: '$ 1.00',
    totalSupply: '255,556 USDC',
    assetYield: '90 %',
    totalBorrow: '115,55 USDC',
    LTV: '22 %',
  },
  {
    assetName: 'tether',
    assetSymbol: 'USDT',
    assetLogo: '/assets/lend/usdt.svg',
    assetPrice: '$ 1.00',
    totalSupply: '255,556 USDT',
    assetYield: '90 %',
    totalBorrow: '115,55 USDT',
    LTV: '22 %',
  },
  {
    assetName: 'jupiter-ag',
    assetSymbol: 'JUP',
    assetLogo: '/assets/lend/jup.svg',
    assetPrice: '$ 1.38',
    totalSupply: '255,556 JUP',
    assetYield: '90 %',
    totalBorrow: '115,55 JUP',
    LTV: '22 %',
  },
  {
    assetName: 'pyth-network', // not available
    assetSymbol: 'PYTH',
    assetLogo: '/assets/lend/pyth.svg',
    assetPrice: '$ 0.8235',
    totalSupply: '255,556 PYTH',
    assetYield: '90 %',
    totalBorrow: '115,55 PYTH',
    LTV: '22 %',
  },
  {
    assetName: 'jito',
    assetSymbol: 'JTO',
    assetLogo: '/assets/lend/jto.png',
    assetPrice: '$ 3.90',
    totalSupply: '255,556 JTO',
    assetYield: '90 %',
    totalBorrow: '115,55 JTO',
    LTV: '22 %',
  },
  {
    assetName: 'raydium',
    assetSymbol: 'RAY',
    assetLogo: '/assets/lend/ray.svg',
    assetPrice: '$ 2.04',
    totalSupply: '255,556 RAY',
    assetYield: '90 %',
    totalBorrow: '115,55 RAY',
    LTV: '22 %',
  },
  {
    assetName: 'Blze', // not available
    assetSymbol: 'BLZE',
    assetLogo: '/assets/lend/blze.png',
    assetPrice: '$ 117.21',
    totalSupply: '255,556 BLZE',
    assetYield: '90 %',
    totalBorrow: '115,55 BLZE',
    LTV: '22 %',
  },
  {
    assetName: 'tbtc-token',
    assetSymbol: 'tBTC',
    assetLogo: '/assets/lend/tbtc.webp',
    assetPrice: '$ 67,963.90',
    totalSupply: '255,556 tBTC',
    assetYield: '90 %',
    totalBorrow: '115,55 tBTC',
    LTV: '22 %',
  },
  {
    assetName: 'marinade',
    assetSymbol: 'mSOL',
    assetLogo: '/assets/lend/msol.png',
    assetPrice: '$ 207.58',
    totalSupply: '255,556 mSOL',
    assetYield: '90 %',
    totalBorrow: '115,55 mSOL',
    LTV: '22 %',
  },
]

const FormSchema = z.object({
  assetName: z.string({
    required_error: 'Name is required',
  }).min(3, {
    message: 'Name must be at least 3 characters long',
  }).optional()
})

export default function DeFiLending() {
  const [assetPrices, setAssetPrices] = useState<{ [key: string]: string }>({});

  const { connected } = useWallet();
  const wallet = useWallet();

  useEffect(() => {
    const tokens = ['SOL', 'USDC', 'USDT', 'JLP', 'JTO', 'RAY', 'tBTC', 'MSOL'];
    const fetchData = async () => {
      for (const token of tokens) {
        try {
          const response = await fetch(`https://api.coinbase.com/v2/prices/${token}-USD/buy`);
          const data = await response.json();
          setAssetPrices(prevState => ({
            ...prevState,
            [token]: data.data.amount
          }));
        } catch (error) {
          console.error(`Error fetching price for ${token}:`, error);
        }
      }
    };

    fetchData();
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      assetName: '',
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const assetName = data.assetName;

    if (assetName) {
      const result = await newAssetLendingRequest({ walletAddress: wallet.publicKey?.toString(), requestedAssetname: assetName });

      if (result) {
        if (result instanceof Response && result.status === 409) {
          toast.info('Request sent successfully!');
        } else {
          toast.success('Request sent successfully!');
          form.reset();
        }
      }
    }
  }

  return (
    <div className='py-2 md:py-4'>
      <Card>
        <CardHeader>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0'>
            <div className='text-2xl md:text-4xl'>All Assets</div>
            {connected && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='outline' className='px-4'>Request new asset for lending</Button>
                </DialogTrigger>
                <DialogContent className='max-w-[90vw] md:max-w-[425px]'>
                  <DialogHeader>
                    <DialogTitle>Request for new assets</DialogTitle>
                    <DialogDescription>
                      Make request for new assets for lending.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off' className='flex flex-col space-y-4 pt-2'>
                      <FormField
                        control={form.control}
                        name='assetName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asset Name</FormLabel>
                            <FormControl>
                              <Input {...field} className='w-full' placeholder='Asset Name' />
                            </FormControl>
                            <FormMessage className='text-destructive tracking-wide' />
                          </FormItem>
                        )}
                      />

                      <Button type='submit' className='text-white bg-primary hover:bg-primary/90'>
                        Submit Request
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={lendingAssetColumns}
            data={lendingAssetData.map(asset => ({
              ...asset,
              assetPrice: assetPrices[asset.assetSymbol] ? `$ ${assetPrices[asset.assetSymbol]}` : asset.assetPrice
            }))}
            userSearchColumn='assetName'
            inputPlaceHolder='Search for assets'
          />
        </CardContent>
      </Card>
    </div>
  )
}