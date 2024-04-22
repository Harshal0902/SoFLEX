import React, { useEffect, useState } from 'react'
import { newAssetLendingRequest, assetDetails } from '@/lib/supabaseRequests'
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
import Loading from '@/components/Loading'
import { DataTable } from '@/components/ui/data-table-defi'

const FormSchema = z.object({
  assetName: z.string({
    required_error: 'Name is required',
  }).min(3, {
    message: 'Name must be at least 3 characters long',
  }).optional()
})

export default function DeFiLending() {
  const [assetPrices, setAssetPrices] = useState<{ [key: string]: string }>({});
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [lendingAssetData, setLendingAssetData] = useState<LendingAssetDataType[]>([]);

  const { connected } = useWallet();
  const wallet = useWallet();

  useEffect(() => {
    const fetchAssetData = async () => {
      const result = await assetDetails();
      if (Array.isArray(result)) {
        setLendingAssetData(result);
      } else {
        toast.error('Unexpected result format.');
      }
      setLoadingData(false);
    };

    fetchAssetData();
  }, []);

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
          toast.error(`Error fetching price for ${token}: ${error}`);
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

  const formatPrice = (price: number | string): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (!isNaN(numericPrice)) {
      return `$ ${numericPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    } else {
      return price.toString();
    }
  };

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
          {loadingData ? (
            <Loading />
          ) : (
            <DataTable
              columns={lendingAssetColumns}
              data={lendingAssetData.map(asset => ({
                ...asset,
                assetPrice: assetPrices[asset.asset_symbol] ? formatPrice(assetPrices[asset.asset_symbol]) : asset.asset_price
              }))}
              userSearchColumn='asset_name'
              inputPlaceHolder='Search for assets'
              noResultsMessage='No assets found'
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
