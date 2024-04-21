import { Web3Provider } from '@ethersproject/providers';
import { WebIrys } from '@irys/sdk';
import { Uploader } from '@lens-protocol/react-web';
import { useMemo } from 'react';
import { Account, Chain, Client, Transport } from 'viem';
import { useConnectorClient } from 'wagmi';

import { never } from './utils';

const TOP_UP = '200000000000000000'; // 0.2 MATIC
const MIN_FUNDS = 0.05;

// Define a function to check the validity of the client object
function isValidClient(client: any): client is Client<Transport, Chain, Account> {
  return client && client.transport && client.account && client.account.address;
}

async function getWebIrys(client: Client<Transport, Chain, Account>) {
  if (!isValidClient(client)) {
    throw new Error("Invalid client object. Missing required properties.");
  }

  const webIrys = new WebIrys({
    network: 'mainnet',
    token: 'matic',
    wallet: {
      rpcUrl: 'https://polygon-rpc.com',
      name: 'ethersv5',
      // @ts-ignore
      provider: new Web3Provider(client.transport),
    },
  });

  await webIrys.ready();

  return webIrys;
}

import { Buffer } from 'buffer';

export function useIrysUploadHandler() {
  const { data: client } = useConnectorClient();

  return async (data: unknown) => {
    if (!client) {
      throw new Error('viem Client not found');
    }
    const confirm = window.confirm(
      `We will now update your profile metadata.
    
    Please make sure your wallet is connected to the Polygon.`,
    );

    if (!confirm) {
      throw new Error('User cancelled');
    }

    const irys = await getWebIrys(client);

    let serialized: string | Buffer | null = null;

    if (data instanceof File) {
      const tx = await irys.uploadFile(data);
      return `https://arweave.net/${tx.id}`;
    } else {
      // Otherwise, serialize the data as JSON
      serialized = JSON.stringify(data);
    }

    if (!serialized) {
      throw new Error('Failed to serialize data');
    }

    const tx = await irys.upload(serialized, {
      tags: [{ name: 'Content-Type', value: 'application/json' }],
    });

    return `https://arweave.net/${tx.id}`;
  };
}




export function useIrysUploader() {
  const { data: client } = useConnectorClient();

  return useMemo(() => {
    return new Uploader(async (file: File) => {
      if (!client) {
        throw new Error('viem Client not found');
      }
      const irys = await getWebIrys(client);

      const confirm = window.confirm(`Uploading '${file.name}' via the Irys.`);

      if (!confirm) {
        throw new Error('User cancelled');
      }

      const receipt = await irys.uploadFile(file);

      return `https://arweave.net/${receipt.id}`;
    });
  }, [client]);
}