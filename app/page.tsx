import { Wallet } from '@/components/wallet';
import { ExpenseList } from '@/components/expense-list';
import { CreateExpenseDialog } from '@/components/create-expense-dialog';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-4xl font-bold text-center">Split Dapp</h1>
          <Wallet />
          <CreateExpenseDialog />
          <ExpenseList />
        </div>
      </div>
    </main>
  );
}