
import { PageWrapper } from "@/components/shared/page-wrapper";
import { ContactForm } from "@/components/contacts/contact-form";

export default function NewContactPage() {
  return (
    <PageWrapper title="Create New Contact" description="Enter the details for your new contact.">
      <ContactForm />
    </PageWrapper>
  );
}
