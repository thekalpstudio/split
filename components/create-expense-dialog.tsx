'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

export function CreateExpenseDialog() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');
  const [participants, setParticipants] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Validate inputs
      if (!description || !amount || !payer) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Validate amount
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid positive amount",
          variant: "destructive",
        });
        return;
      }

      // Create participants array including the payer
      const participantList = participants
        .split(',')
        .map(p => p.trim())
        .filter(p => p !== '');
      
      // Add payer if not already in the list
      if (!participantList.includes(payer)) {
        participantList.push(payer);
      }

      // Create unique expenseID using timestamp and random string
      const expenseID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await api.createExpense({
        network: 'DEVNET',
        blockchain: 'KALP',
        walletAddress: payer,
        args: {
          expenseID,
          description,
          amount: numAmount,
          payer,
          participants: participantList,
        },
      });

      // Reset form and close dialog
      setDescription('');
      setAmount('');
      setPayer('');
      setParticipants('');
      setIsOpen(false);

      toast({
        title: "Success",
        description: "Expense created successfully",
      });
    } catch (error: any) {
      console.error('Failed to create expense:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create expense. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-5 w-5" />
          Create Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Create New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dinner, Movie tickets, etc."
              className="bg-gray-700"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              className="bg-gray-700"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payer">Payer Address</Label>
            <Input
              id="payer"
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              placeholder="Enter payer's wallet address"
              className="bg-gray-700"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="participants">Other Participants (comma-separated addresses)</Label>
            <Input
              id="participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="0x123..., 0x456..."
              className="bg-gray-700"
            />
            <p className="text-sm text-gray-400">Note: Payer will be automatically included in participants</p>
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Expense'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}