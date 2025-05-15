import { PageWrapper } from "@/components/shared/page-wrapper";
import { CampaignForm } from "@/components/campaigns/campaign-form";

export default function NewCampaignPage() {
  return (
    <PageWrapper title="Create New Campaign" description="Set up the details for your new marketing campaign.">
      <CampaignForm />
    </PageWrapper>
  );
}
