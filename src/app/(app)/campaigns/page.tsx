
"use client";

import Link from "next/link";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Edit3, Trash2, Eye, Play, Pause, CalendarDays } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const mockCampaigns = [
  {
    id: "1",
    title: "Summer Sale 2024",
    description: "Huge discounts on all summer collection items.",
    status: "Active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    targetAudience: "Subscribers, Age 25-45",
    budget: 40000, // Updated to INR
    mediaUrl: "https://placehold.co/600x400.png",
    mediaHint: "summer fashion",
    template: "Summer Promo Template",
  },
  {
    id: "2",
    title: "New Product Launch - X Series",
    description: "Introducing the revolutionary X Series gadgets.",
    status: "Scheduled",
    startDate: "2024-09-15",
    endDate: "2024-10-15",
    targetAudience: "Tech Enthusiasts, Early Adopters",
    budget: 95000, // Updated to INR
    mediaUrl: "https://placehold.co/600x400.png",
    mediaHint: "gadgets technology",
    template: "Product Launch Teaser",
  },
  {
    id: "3",
    title: "Festive Holiday Greetings",
    description: "Warm wishes for the holiday season to our valued customers.",
    status: "Completed",
    startDate: "2023-12-20",
    endDate: "2023-12-25",
    targetAudience: "All Customers",
    budget: 24000, // Updated to INR
    mediaUrl: "https://placehold.co/600x400.png",
    mediaHint: "holiday celebration",
    template: "Holiday Card",
  },
  {
    id: "4",
    title: "Weekend Flash Deal",
    description: "Exclusive 48-hour deals on selected items.",
    status: "Paused",
    startDate: "2024-07-05",
    endDate: "2024-07-07",
    targetAudience: "Newsletter Subscribers",
    budget: 20000, // Updated to INR
    mediaUrl: "https://placehold.co/600x400.png",
    mediaHint: "shopping sale",
    template: "Flash Deal Alert",
  },
];

function CampaignCardActions({ campaignId }: { campaignId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/campaigns/${campaignId}/edit`}>
            <Edit3 className="mr-2 h-4 w-4" /> Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
           <Link href={`/campaigns/${campaignId}/preview`} target="_blank">
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Play className="mr-2 h-4 w-4" /> Resume
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pause className="mr-2 h-4 w-4" /> Pause
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export default function CampaignsPage() {
  // Add state for search and filters if implementing functionality
  return (
    <PageWrapper
      title="Campaigns"
      description="Manage and track all your marketing campaigns."
      actions={
        <Link href="/campaigns/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </Link>
      }
    >
      <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search campaigns..." className="pl-10" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="recent">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCampaigns.map((campaign) => (
          <Card key={campaign.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
                <Image
                  src={campaign.mediaUrl}
                  alt={campaign.title}
                  width={400}
                  height={225}
                  className="object-cover w-full h-full"
                  data-ai-hint={campaign.mediaHint}
                />
              </div>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{campaign.title}</CardTitle>
                <CampaignCardActions campaignId={campaign.id} />
              </div>
              <CardDescription className="text-xs line-clamp-2 h-8">{campaign.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={
                  campaign.status === "Active" ? "default" :
                  campaign.status === "Scheduled" ? "secondary" :
                  campaign.status === "Completed" ? "outline" : 
                  "destructive" 
                } className={cn(
                    campaign.status === "Active" && "bg-green-500 text-white hover:bg-green-600", 
                    campaign.status === "Scheduled" && "bg-blue-500 text-white hover:bg-blue-600",
                    campaign.status === "Paused" && "bg-yellow-500 text-white hover:bg-yellow-600"
                  )}>
                  {campaign.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dates:</span>
                <span className="font-medium flex items-center gap-1">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Budget:</span>
                <span className="font-medium">₹{campaign.budget.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Template:</span>
                <span className="font-medium truncate max-w-[150px]">{campaign.template}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/campaigns/${campaign.id}/edit`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}

