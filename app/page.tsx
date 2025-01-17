import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Split, Users, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Split Expenses
            <br />
            with Confidence
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl">
            The secure and simple way to split expenses with friends, roommates, and groups.
            Powered by blockchain technology for transparent and trustless transactions.
          </p>
          <div className="flex gap-4">
            <Link href="/app">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Rest of the landing page content remains the same */}
      {/* Features Section */}
      <div className="bg-gray-800/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            Why Choose Split Dapp?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-400" />}
              title="Secure & Transparent"
              description="All transactions are recorded on the blockchain, ensuring complete transparency and security."
            />
            <FeatureCard
              icon={<Split className="h-8 w-8 text-purple-400" />}
              title="Easy Splitting"
              description="Split bills instantly with custom amounts and multiple participants."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-pink-400" />}
              title="Group Management"
              description="Create and manage multiple groups for different expenses and occasions."
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <StepCard
            number="1"
            title="Connect Wallet"
            description="Connect your wallet to get started with secure transactions."
          />
          <StepCard
            number="2"
            title="Create Expense"
            description="Add expense details and select participants to split with."
          />
          <StepCard
            number="3"
            title="Settle Up"
            description="Review and settle expenses with automatic calculations."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-white/90">
                Join thousands of users who trust Split Dapp for their expense sharing needs.
              </p>
            </div>
            <Link href="/app">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Launch App <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700 hover:border-gray-600 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative bg-gray-800/50 p-8 rounded-xl border border-gray-700">
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}