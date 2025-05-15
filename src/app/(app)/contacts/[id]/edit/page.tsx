
"use client"; // Required for useParams

import { useParams, useRouter } from 'next/navigation';
import { PageWrapper } from "@/components/shared/page-wrapper";
import { ContactForm, type ContactFormValues } from "@/components/contacts/contact-form";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { User, Mail, Phone, Building, CalendarClock } from "lucide-react"; // For mock data types

// Mock data - adjust as needed to match your Contact interface in contacts/page.tsx
interface CustomField {
  label: string;
  value: string | number | boolean;
}

interface MockContact extends ContactFormValues {
  id: string;
  customFields?: CustomField[]; // Make optional if not always present for editing
  lastContacted?: string; // Make optional if not always present for editing
  createdAt?: string; // Make optional if not always present for editing
}


// Mock function to fetch contact data
async function getContactData(id: string): Promise<Partial<MockContact> | null> {
  console.log("Fetching contact data for id:", id);
  // In a real app, fetch data from your API
  const mockContactsForEdit: MockContact[] = [
    {
      id: "contact1",
      name: "Alia Bhatt (Loaded)",
      email: "alia.b@example.com",
      phone: "+91 98765 43210",
      avatarUrl: "https://placehold.co/100x100.png",
      avatarHint: "woman smiling",
      company: "Sunshine Productions",
      tags: ["VIP", "Lead"], // Ensure tags is an array
      // Custom fields, lastContacted, createdAt are not directly part of ContactFormValues
      // but might be part of the broader contact object you fetch
    },
    {
      id: "contact2",
      name: "Ranbir Kapoor (Loaded)",
      email: "ranbir.k@example.com",
      avatarUrl: "https://placehold.co/100x100.png",
      avatarHint: "man serious",
      company: "Dharma Productions",
      tags: ["Influencer"],
    }
  ];
  const foundContact = mockContactsForEdit.find(c => c.id === id);
  if (foundContact) {
    // Return only fields relevant to ContactFormValues plus id
    return {
        id: foundContact.id,
        name: foundContact.name,
        email: foundContact.email,
        phone: foundContact.phone,
        avatarUrl: foundContact.avatarUrl,
        avatarHint: foundContact.avatarHint,
        company: foundContact.company,
        tags: foundContact.tags,
    };
  }
  return null;
}


export default function EditContactPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id as string;
  const [initialData, setInitialData] = useState<Partial<ContactFormValues> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (contactId) {
      getContactData(contactId).then(data => {
        if (data) {
          setInitialData(data);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      }).catch(() => {
        setNotFound(true);
        setLoading(false);
      });
    } else {
        setLoading(false);
        setNotFound(true); 
    }
  }, [contactId]);

  const handleFormSubmitSuccess = () => {
    router.push('/contacts');
  };

  if (loading) {
    return (
      <PageWrapper title="Edit Contact">
        <Card>
            <CardHeader><CardTitle>Loading Contact Data...</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      </PageWrapper>
    );
  }
  
  if (notFound) {
     return (
      <PageWrapper title="Contact Not Found">
        <Card>
            <CardHeader><CardTitle>Error</CardTitle></CardHeader>
            <CardContent>
                <p>The contact you are trying to edit (ID: {contactId}) could not be found.</p>
                <Button onClick={() => router.push('/contacts')} className="mt-4">Back to Contacts</Button>
            </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Edit Contact" description={`Modifying contact: ${initialData?.name || contactId}`}>
      <ContactForm contactId={contactId} initialData={initialData!} onSubmitSuccess={handleFormSubmitSuccess} />
    </PageWrapper>
  );
}
