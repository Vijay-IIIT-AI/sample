
"use client";

import { useParams, useRouter } from 'next/navigation';
import { PageWrapper } from "@/components/shared/page-wrapper";
import { TemplateForm, type TemplateFormValues } from "@/components/templates/template-form";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Mock function to fetch template data
async function getTemplateData(id: string): Promise<Partial<TemplateFormValues> | null> {
  console.log("Fetching template data for id:", id);
  // In a real app, fetch data from your API
  // For this mock, return some predefined data based on ID
  if (id === "template1") {
    return {
      name: "welcome_offer_edited",
      category: "MARKETING",
      language: "en_US",
      headerType: "TEXT",
      headerText: "🎉 Welcome Aboard!",
      body: "Hi {{1}}! Thanks for joining Yabily. We're thrilled to have you. Enjoy this special 10% discount on your first campaign with code WELCOME10.",
      footerText: "Yabily Team",
      buttonsType: "QUICK_REPLY",
      quickReply1: "Get Started",
      quickReply2: "Learn More",
    };
  }
  if (id === "template_img_header") {
    return {
        name: "image_promo_edited",
        category: "MARKETING",
        language: "en",
        headerType: "IMAGE",
        headerMediaUrl: "https://placehold.co/600x315.png",
        body: "Check out our new seasonal collection, {{1}}! Fresh styles just dropped. Tap the button below to shop now.",
        footerText: "Limited time offer.",
        buttonsType: "CALL_TO_ACTION",
        ctaButtonText: "Shop Now",
        ctaButtonType: "URL",
        ctaButtonValue: "https://www.yabily.com/shop"
    };
  }
  return null; // Template not found
}

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  const [initialData, setInitialData] = useState<Partial<TemplateFormValues> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (templateId) {
      getTemplateData(templateId).then(data => {
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
        setNotFound(true); // Should not happen if route is matched correctly
    }
  }, [templateId]);

  const handleFormSubmitSuccess = () => {
    router.push('/templates');
  };

  if (loading) {
    return (
      <PageWrapper title="Edit Message Template">
        <Card>
            <CardHeader><CardTitle>Loading Template Data...</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
      </PageWrapper>
    );
  }
  
  if (notFound) {
     return (
      <PageWrapper title="Template Not Found">
        <Card>
            <CardHeader><CardTitle>Error</CardTitle></CardHeader>
            <CardContent>
                <p>The template you are trying to edit (ID: {templateId}) could not be found.</p>
                <Button onClick={() => router.push('/templates')} className="mt-4">Back to Templates</Button>
            </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Edit Message Template" description={`Modifying template: ${initialData?.name || templateId}`}>
      <TemplateForm templateId={templateId} initialData={initialData!} onSubmitSuccess={handleFormSubmitSuccess} />
    </PageWrapper>
  );
}

    