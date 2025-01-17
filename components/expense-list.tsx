'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Receipt, PiSquare, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

interface Debt {
  from: string;
  to: string;
  amount: number;
  expenseID: string;
}

export function ExpenseList() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettling, setIsSettling] = useState<string | null>(null);
  const { toast } = useToast()


  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      setIsLoading(true);
      const response = await api.queryAllDebts({
        network: 'DEVNET',
        blockchain: 'KALP',
        walletAddress: '4ef62fae4567a59681f4625351a7bb357c826b26',
        args: {},
      });
      console.log(response.result.result)
      setDebts(response.result.result || []);
    } catch (error: any) {
      toast({
        title: "Error fetching debts",
        description: error.message || "Failed to load debts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettleDebt = async (debt: Debt) => {
    const settleId = `${debt.from}-${debt.to}-${debt.expenseID}`;
    try {
      setIsSettling(settleId);
      await api.settleDebt({
        network: 'DEVNET',
        blockchain: 'KALP',
        walletAddress: '2a0f760f5458a5ba7ff36dc1f26f817bbe14ec11',
        args: {
          from: debt.from,
          to: debt.to,
          expenseID: debt.expenseID,
        },
      });
      toast({
        title: "Debt settled",
        description: "The debt has been successfully settled.",
      });
      await fetchDebts();
    } catch (error: any) {
      toast({
        title: "Error settling debt",
        description: error.message || "Failed to settle debt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSettling(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl bg-gray-800 border-gray-700">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-6 w-6" />
          Outstanding Debts
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchDebts}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {debts.map((debt) => {
            const settleId = `${debt.from}-${debt.to}-${debt.expenseID}`;
            return (
              <div
                key={settleId}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <PiSquare className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-300">From: {debt.from}</p>
                    <p className="text-sm text-gray-300">To: {debt.to}</p>
                    <p className="font-semibold">{debt.amount} KALP</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleSettleDebt(debt)}
                  variant="outline"
                  className="gap-2"
                  disabled={isSettling === settleId}
                >
                  {isSettling === settleId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {isSettling === settleId ? 'Settling...' : 'Settle'}
                </Button>
              </div>
            );
          })}
          {!isLoading && debts.length === 0 && (
            <p className="text-center text-gray-400">No outstanding debts</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}