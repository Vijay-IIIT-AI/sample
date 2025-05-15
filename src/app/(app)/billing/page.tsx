
"use client";

import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, FileText, PlusCircle, Download, Info, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; 
import React from "react"; 

const mockCurrentPlan = {
  name: "Pro Plan",
  price: "₹8200/month", // Updated to INR
  features: [
    "Up to 50,000 messages/month",
    "5 Active Campaigns",
    "Advanced Analytics",
    "Priority Support",
  ],
  nextBillingDate: "July 15, 2024",
  currentBalance: 10350.50, // Updated to INR
};

const mockPaymentMethods = [
  { id: "pm1", type: "Visa", last4: "4242", expiry: "12/25", isDefault: true },
  { id: "pm2", type: "Mastercard", last4: "5555", expiry: "08/26", isDefault: false },
];

const mockBillingHistory = [
  { id: "inv1", date: "June 15, 2024", amount: "₹8200.00", status: "Paid", description: "Pro Plan - June 2024" },
  { id: "inv2", date: "May 15, 2024", amount: "₹8200.00", status: "Paid", description: "Pro Plan - May 2024" },
  { id: "inv3", date: "April 15, 2024", amount: "₹4000.00", status: "Paid", description: "Starter Plan - April 2024" },
];


export default function BillingPage() {
  const { toast } = useToast();
  const [addFundsAmount, setAddFundsAmount] = React.useState("");

  const handleAddFunds = () => {
    if (!addFundsAmount || isNaN(parseFloat(addFundsAmount)) || parseFloat(addFundsAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount to add.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Processing Payment (Mock)",
      description: `Attempting to add ₹${parseFloat(addFundsAmount).toFixed(2)} via Razorpay. This requires actual backend integration.`,
    });
    console.log("Razorpay checkout for amount:", addFundsAmount);
    setAddFundsAmount(""); 
  };


  return (
    <PageWrapper title="Billing & Subscriptions" description="Manage your plan, payment methods, and view billing history.">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary"/>Current Plan</CardTitle>
              <Button variant="outline">Change Plan</Button>
            </div>
            <CardDescription>Your current subscription details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <h3 className="text-xl font-semibold text-primary">{mockCurrentPlan.name}</h3>
              <p className="text-2xl font-bold text-foreground">{mockCurrentPlan.price}</p>
              <p className="text-sm text-muted-foreground">Next billing date: {mockCurrentPlan.nextBillingDate}</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Plan Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {mockCurrentPlan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center"><Wallet className="mr-2 h-5 w-5 text-primary"/>Top-up Wallet</CardTitle>
                <CardDescription>Add funds to your account balance using Razorpay.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="currentBalance">Current Balance</Label>
                    <Input id="currentBalance" value={`₹${mockCurrentPlan.currentBalance.toFixed(2)}`} readOnly className="mt-1 bg-muted/50"/>
                </div>
                <div>
                    <Label htmlFor="addAmount">Amount to Add (₹)</Label>
                    <Input 
                        id="addAmount" 
                        type="number" 
                        placeholder="e.g., 5000" 
                        className="mt-1"
                        value={addFundsAmount}
                        onChange={(e) => setAddFundsAmount(e.target.value)}
                    />
                </div>
                <Button className="w-full" onClick={handleAddFunds}>
                    <DollarSign className="mr-2 h-4 w-4"/> Add Funds via Razorpay
                </Button>
                <p className="text-xs text-muted-foreground pt-1 flex items-center">
                    <Info className="h-3 w-3 mr-1"/> Secure payments processed by Razorpay. Actual integration with Razorpay backend is required.
                </p>
            </CardContent>
            </Card>

            <Card className="shadow-lg">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary"/>Payment Methods</CardTitle> {/* Changed DollarSign to CreditCard for better semantics */}
                    <Button variant="outline" size="sm"><PlusCircle className="mr-1 h-4 w-4"/>Add Method</Button>
                </div>
                <CardDescription>Manage your saved payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {mockPaymentMethods.map(method => (
                <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                    <p className="font-medium text-foreground">{method.type} ending in {method.last4}</p>
                    <p className="text-xs text-muted-foreground">Expires: {method.expiry}</p>
                    </div>
                    {method.isDefault && <Badge variant="secondary">Default</Badge>}
                </div>
                ))}
            </CardContent>
            </Card>
        </div>
      </div>

      <Card className="mt-6 shadow-lg">
        <CardHeader>
            <div className="flex justify-between items-center">
                 <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>Billing History</CardTitle>
                 <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4"/>Download All</Button>
            </div>
          <CardDescription>Review your past invoices and payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBillingHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">#{invoice.id.substring(3)}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell className="text-right">{invoice.amount}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={invoice.status === "Paid" ? "default" : "destructive"} className={invoice.status === "Paid" ? "bg-green-500 text-white" : ""}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" size="sm">Download</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
