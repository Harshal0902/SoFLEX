"use client"

import React from 'react'

export default function Page() {
    const url = `https://rpc.shyft.to/?api_key=<key>`

    const getAssetsByOwner1 = async () => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'rpc-id',
                method: 'getAssetsByOwner',
                params: {
                    ownerAddress: '2nHUxjFzxFfwnbF1sdAXcpVwgUEZBw6uFDBUu2dNYwbG',
                    page: 1, // Starts at 1
                    limit: 1000
                },
            }),
        });
        const { result } = await response.json();
        console.log("Assets owned by a wallet: ", result.items);
    };

    return (
        <div>
            <button onClick={getAssetsByOwner1}>Get Assets By Owner</button> <br />

            NFT image Link: content.links.image <br />
            NFT Name:content.metadata.name <br />
            NFT URL: content.links.external_url <br />
        </div>
    )
}
