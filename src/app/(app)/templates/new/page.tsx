
import { PageWrapper } from "@/components/shared/page-wrapper";
import { TemplateForm } from "@/components/templates/template-form";

export default function NewTemplatePage() {
  return (
    <PageWrapper title="Create New Message Template" description="Design and submit your WhatsApp message template for approval by Meta.">
      <TemplateForm />
    </PageWrapper>
  );
}

    