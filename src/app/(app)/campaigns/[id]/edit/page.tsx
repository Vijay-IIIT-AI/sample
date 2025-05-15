
"use client"; // Required for useParams

import { useParams } from 'next/navigation';
import { PageWrapper } from "@/components/shared/page-wrapper";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { useEffect, useState } from 'react';

// Mock function to fetch campaign data
async function getCampaignData(id: string) {
  console.log("Fetching campaign data for id:", id);
  // In a real app, fetch data from your API
  // For this mock, return some predefined data based on ID or a generic one
  if (id === "1") {
    return {
      title: "Summer Sale 2024 (Loaded)",
      description: "Huge discounts on all summer collection items.",
      mediaUrl: "https://placehold.co/600x400.png",
      mediaType: "image" as "image" | "video" | "none",
      startDate: new Date("2024-07-01"), // Ensure start date is in the future for schedule testing
      endDate: new Date("2024-08-31"),
      targetAudience: "Subscribers, Age 25-45",
      budget: 50000, // INR
      selectedTemplate: "template1", // Make sure this ID exists in mockTemplates in CampaignForm
      sendOption: "schedule" as "immediate" | "schedule",
      scheduleDate: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now for testing
      scheduleTime: "14:30",
      abTestEnabled: true,
      variantAContent: "Version A: Get 50% off!",
      variantBContent: "Version B: Free shipping on all orders!",
    };
  }
  // Default mock data if ID doesn't match specific cases
  return {
    title: "Sample Campaign Title (Loaded)",
    description: "This is a sample campaign description.",
    mediaUrl: "https://placehold.co/300x200.png",
    mediaType: "image" as "image" | "video" | "none",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
    targetAudience: "General Audience",
    budget: 10000, // INR
    selectedTemplate: "template2",
    sendOption: "schedule" as "immediate" | "schedule",
    scheduleDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    scheduleTime: "09:00",
    abTestEnabled: false,
  };
}


export default function EditCampaignPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [initialData, setInitialData] = useState<any>(null); // Using any for simplicity in mock
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (campaignId) {
      getCampaignData(campaignId).then(data => {
        setInitialData(data);
        setLoading(false);
      });
    }
  }, [campaignId]);

  if (loading) {
    return (
      <PageWrapper title="Edit Campaign">
        <p>Loading campaign data...</p>
      </PageWrapper>
    );
  }
  
  if (!initialData && !loading) {
     return (
      <PageWrapper title="Edit Campaign">
        <p>Campaign not found.</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Edit Campaign" description={`Modifying campaign: ${initialData?.title || campaignId}`}>
      <CampaignForm campaignId={campaignId} initialData={initialData} />
    </PageWrapper>
  );
}
