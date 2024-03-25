"use client"

import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'

const YourComponent = () => {
  const [imageUris, setImageUris] = useState<string[]>([]);

  const xKey = "";
  const wallID = '2nHUxjFzxFfwnbF1sdAXcpVwgUEZBw6uFDBUu2dNYwbG';

  const fetchNFTs = () => {
    let nftUrl = `https://api.shyft.to/sol/v1/nft/compressed/search?network=mainnet-beta&address=${wallID}&wallet=2nHUxjFzxFfwnbF1sdAXcpVwgUEZBw6uFDBUu2dNYwbG`;
    axios({
      url: nftUrl,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xKey,
      },
    })
      .then((res) => {
        console.log(res.data);
        const data = res.data;
        const nfts = data.result.nfts;
        const uris = nfts.map((nft: any) => nft.image_uri);
        setImageUris(uris);
      })

      .catch((err) => {
        console.warn(err);
      });
  };

  return (
    <div className='min-h-screen'>
      <div onClick={fetchNFTs}>Fetch NFTs</div>
      {imageUris.map((uri, index) => (
        <Image key={index} src={uri} alt={`Image ${index}`} height={250} width={250} />
      ))}
    </div>
  );
};

export default YourComponent;
