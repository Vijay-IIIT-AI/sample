
"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { MetricCard } from "@/components/dashboard/metric-card";
import { BarChart, DollarSign, ListChecks, MessageSquare, PlusCircle, PlayCircle, Star, TrendingUp, Wallet, Info, AlertTriangle } from "lucide-react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, BarChart as RechartsBarChart } from "recharts";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { useToast } from "@/hooks/use-toast"; 
import { cn } from "@/lib/utils";
import React from "react"; // Import React for useState and useEffect

const chartData = [
  { month: "January", sent: 186, delivered: 80 },
  { month: "February", sent: 305, delivered: 200 },
  { month: "March", sent: 237, delivered: 120 },
  { month: "April", sent: 73, delivered: 190 },
  { month: "May", sent: 209, delivered: 130 },
  { month: "June", sent: 214, delivered: 140 },
];

const chartConfig = {
  sent: {
    label: "Sent",
    color: "hsl(var(--primary))",
  },
  delivered: {
    label: "Delivered",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const mockActiveCampaigns = [
  { id: "1", name: "Summer Sale Promo", status: "Active", progress: 75, messagesSent: 15000, deliveryRate: "92%" },
  { id: "2", name: "New Product Launch", status: "Scheduled", progress: 0, messagesSent: 0, deliveryRate: "N/A" },
  { id: "3", name: "Holiday Greetings", status: "Active", progress: 30, messagesSent: 5000, deliveryRate: "88%" },
];

// Mock WhatsApp Rating state, in a real app this would come from an API
const mockWhatsAppRatings = ["High", "Medium", "Low"];

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [whatsAppRating, setWhatsAppRating] = React.useState("High"); // Default to High

  // Cycle through ratings for demo purposes - remove in a real app
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setWhatsAppRating(prevRating => {
        const currentIndex = mockWhatsAppRatings.indexOf(prevRating);
        return mockWhatsAppRatings[(currentIndex + 1) % mockWhatsAppRatings.length];
      });
    }, 5000); // Change rating every 5 seconds
    return () => clearInterval(intervalId);
  }, []);


  const handleAddFunds = () => {
    toast({
      title: "Add Funds",
      description: "Redirecting to billing to add funds via Razorpay.",
    });
    router.push('/billing'); 
  };

  const getWhatsAppRatingStyles = (rating: string) => {
    switch (rating.toLowerCase()) {
      case "high":
        return {
          valueClassName: "text-green-500",
          icon: <Star className="h-5 w-5 text-green-500" />,
          description: "Excellent quality rating!",
        };
      case "medium":
        return {
          valueClassName: "text-yellow-500",
          icon: <Star className="h-5 w-5 text-yellow-500" />, // Or use a different icon like AlertTriangle for Medium/Low
          description: "Good quality, some improvements possible.",
        };
      case "low":
        return {
          valueClassName: "text-destructive",
          icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
          description: "Rating is low, check guidelines.",
        };
      default:
        return {
          valueClassName: "",
          icon: <Star className="h-5 w-5" />,
          description: "Keep up the good work!",
        };
    }
  };
  
  const ratingStyles = getWhatsAppRatingStyles(whatsAppRating);


  return (
    <PageWrapper title="Dashboard" description="Overview of your campaign performance and account status.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Wallet Balance"
          value="₹1,250.75"
          icon={<Wallet className="h-5 w-5" />}
          description={<span className="flex items-center text-xs text-muted-foreground"><Info className="h-3 w-3 mr-1"/>Uses Razorpay for top-ups</span>}
        />
        <MetricCard
          title="WhatsApp Rating"
          value={whatsAppRating}
          icon={ratingStyles.icon}
          description={ratingStyles.description}
          valueClassName={ratingStyles.valueClassName}
        />
        <MetricCard
          title="Active Campaigns"
          value="3"
          icon={<PlayCircle className="h-5 w-5" />}
          description="2 running, 1 scheduled"
        />
        <MetricCard
          title="Messages Sent (Month)"
          value="23,489"
          icon={<MessageSquare className="h-5 w-5" />}
          description="95% delivery rate"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-lg">
          <CardHeader>
            <CardTitle>Campaign Performance Overview</CardTitle>
            <CardDescription>Monthly messages sent vs. delivered.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-2">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <RechartsBarChart accessibilityLayer data={chartData} margin={{left: 12, right: 12}}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="sent" fill="var(--color-sent)" radius={4} />
                <Bar dataKey="delivered" fill="var(--color-delivered)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-lg">
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>Quick view of ongoing and upcoming campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockActiveCampaigns.map(campaign => (
              <div key={campaign.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{campaign.name}</p>
                  <p className="text-xs text-muted-foreground">Status: {campaign.status} | Sent: {campaign.messagesSent}</p>
                </div>
                <Link href={`/campaigns/${campaign.id}/edit`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </div>
            ))}
             <Link href="/campaigns/new" className="w-full">
                <Button variant="default" className="w-full mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New Campaign
                </Button>
              </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/campaigns/new" passHref>
              <Button variant="outline" className="w-full h-20 flex-col">
                <PlusCircle className="h-6 w-6 mb-1" />
                New Campaign
              </Button>
            </Link>
            <Link href="/templates/new" passHref>
              <Button variant="outline" className="w-full h-20 flex-col">
                <ListChecks className="h-6 w-6 mb-1" />
                Create Template
              </Button>
            </Link>
            <Link href="/reports" passHref>
              <Button variant="outline" className="w-full h-20 flex-col">
                <BarChart className="h-6 w-6 mb-1" />
                View Reports
              </Button>
            </Link>
            <Button variant="default" className="w-full h-20 flex-col" onClick={handleAddFunds}>
               <DollarSign className="h-6 w-6 mb-1" />
               Add Funds
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle>Grow Your Reach</CardTitle>
            <CardDescription>Tips and resources to improve your campaigns.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <Image src="https://placehold.co/600x400.png" alt="Marketing illustration" width={600} height={400} className="rounded-lg object-cover aspect-video" data-ai-hint="marketing growth"/>
          </CardContent>
          <CardFooter>
             <Button variant="default" className="w-full">
                <TrendingUp className="mr-2 h-4 w-4" /> Learn More
              </Button>
          </CardFooter>
        </Card>
      </div>
    </PageWrapper>
  );
}
