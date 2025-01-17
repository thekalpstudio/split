'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet2 } from 'lucide-react';

export function Wallet() {
  const [walletAddress, setWalletAddress] = useState<string>('');

  const connectWallet = async () => {
    // Mock wallet connection - replace with actual wallet connection logic
    setWalletAddress('2a0f760f5458a5ba7ff36dc1f26f817bbe14ec11');
  };

  return (
    <Card className="w-full max-w-md bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet2 className="h-6 w-6" />
          Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        {walletAddress ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-400">Connected Wallet:</p>
            <p className="font-mono text-sm">{walletAddress}</p>
          </div>
        ) : (
          <Button onClick={connectWallet} className="w-full">
            Connect Wallet
          </Button>
        )}
      </CardContent>
    </Card>
  );
}