"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from '@/components/icons/logo';
import Image from "next/image";
import { CalendarDays, Users, DollarSign, FileText, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

interface CampaignPreviewData {
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "none";
  mediaHint?: string;
  startDate?: string;
  endDate?: string;
  targetAudience?: string;
  templateName?: string;
}

// Mock function to fetch campaign preview data
async function getCampaignPreviewData(id: string): Promise<CampaignPreviewData | null> {
  console.log("Fetching preview data for campaign id:", id);
  // In a real app, this would fetch from a public endpoint
  if (id === "1") {
    return {
      title: "Summer Sale Spectacular!",
      description: "Don't miss out on our biggest sale of the year. Up to 70% off on selected items. This is a longer description to test text wrapping and overall layout of the preview card content area. We want to ensure it looks good.",
      mediaUrl: "https://placehold.co/800x450.png",
      mediaType: "image",
      mediaHint: "summer sale products",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      targetAudience: "Fashion Lovers, Bargain Hunters",
      templateName: "Summer Blast Template"
    };
  }
  // Generic preview for any other ID
  return {
    title: `Preview: Campaign ${id}`,
    description: "This is a preview of an upcoming campaign. Stay tuned for more details!",
    mediaUrl: "https://placehold.co/800x450.png",
    mediaType: "image",
    mediaHint: "generic campaign placeholder",
    startDate: new Date().toLocaleDateString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 7 days from now
    targetAudience: "General Audience",
    templateName: "Default Preview Template"
  };
}

export default function CampaignPreviewPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [campaign, setCampaign] = useState<CampaignPreviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (campaignId) {
      getCampaignPreviewData(campaignId).then(data => {
        setCampaign(data);
        setLoading(false);
      });
    }
  }, [campaignId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
        <p className="text-lg text-foreground">Loading campaign preview...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4">
        <Logo className="h-10 text-primary mb-8" />
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">Campaign Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">The campaign you are looking for does not exist or is no longer available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 py-8 px-4 flex flex-col items-center">
      <div className="mb-8">
        <Logo className="h-10 text-primary" />
      </div>
      <Card className="w-full max-w-3xl shadow-2xl overflow-hidden">
        {campaign.mediaUrl && campaign.mediaType !== "none" && (
          <div className="aspect-video w-full bg-muted relative">
            <Image 
              src={campaign.mediaUrl} 
              alt={campaign.title} 
              layout="fill"
              objectFit="cover"
              data-ai-hint={campaign.mediaHint || "campaign media"}
            />
            {campaign.mediaType === "video" && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <VideoIcon className="h-16 w-16 text-white/80" />
                 </div>
            )}
          </div>
        )}
        <CardHeader className="p-6">
          <CardTitle className="text-3xl font-bold text-primary tracking-tight">{campaign.title}</CardTitle>
          <CardDescription className="text-md text-muted-foreground pt-1">{campaign.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {campaign.startDate && campaign.endDate && (
                    <div className="flex items-start">
                        <CalendarDays className="h-5 w-5 mr-3 text-accent shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-foreground">Campaign Dates</p>
                            <p className="text-muted-foreground">{campaign.startDate} - {campaign.endDate}</p>
                        </div>
                    </div>
                )}
                {campaign.targetAudience && (
                    <div className="flex items-start">
                        <Users className="h-5 w-5 mr-3 text-accent shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-foreground">Target Audience</p>
                            <p className="text-muted-foreground">{campaign.targetAudience}</p>
                        </div>
                    </div>
                )}
                 {campaign.templateName && (
                    <div className="flex items-start">
                        <FileText className="h-5 w-5 mr-3 text-accent shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-foreground">Message Template</p>
                            <p className="text-muted-foreground">{campaign.templateName}</p>
                        </div>
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
       <p className="text-center text-xs text-muted-foreground mt-8">
        This is a preview. Campaign details are subject to change. <br/>
        Powered by Yabily.
      </p>
    </div>
  );
}
