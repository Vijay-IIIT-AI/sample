
"use client";

import Link from "next/link";
import React, { useState, useMemo } from "react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Edit3, Trash2, Eye, CheckCircle2, XCircle, Loader2, FileText, MessageSquare, Type, Image as ImageIcon, Video as VideoIcon, File as FileIconProp } from "lucide-react"; // Renamed FileIcon to FileIconProp
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { TemplateFormValues } from "@/components/templates/template-form"; // Import the type
import { useRouter } from 'next/navigation'; // Added import

// Extended mock template type
interface MockTemplate extends Partial<TemplateFormValues> {
  id: string;
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  lastUpdated: string;
  rejectionReason?: string;
  // Ensure 'name' is always present as it's used as a key and for titles
  name: string; 
}


const mockTemplates: MockTemplate[] = [
  {
    id: "template1",
    name: "welcome_offer",
    category: "MARKETING",
    language: "en_US",
    headerType: "TEXT",
    headerText: "Welcome!",
    body: "Hi {{1}}! Welcome to Yabily. Enjoy 10% off your first campaign using code {{2}}.",
    footerText: "Team Yabily",
    status: "APPROVED",
    lastUpdated: "2024-05-15",
  },
  {
    id: "template2",
    name: "order_shipped",
    category: "UTILITY",
    language: "en_US",
    headerType: "NONE",
    body: "Your order {{1}} has been shipped. Track it here: {{2}}.",
    status: "PENDING",
    lastUpdated: "2024-06-10",
  },
  {
    id: "template3",
    name: "login_verification_code",
    category: "AUTHENTICATION",
    language: "en_US",
    headerType: "NONE",
    body: "Your verification code is {{1}}. Do not share this code.",
    status: "REJECTED",
    lastUpdated: "2024-06-01",
    rejectionReason: "Use of 'code' can sometimes be flagged. Please use 'verification passkey'.",
  },
  {
    id: "template4",
    name: "monthly_newsletter",
    category: "MARKETING",
    language: "es_MX",
    headerType: "IMAGE",
    headerMediaUrl: "https://placehold.co/600x315.png", // Placeholder for image
    body: "¡Hola {{1}}! No te pierdas nuestras actualizaciones de {{2}}. ¡Grandes ofertas te esperan!",
    status: "APPROVED",
    lastUpdated: "2024-04-20",
  },
  {
    id: "template_img_header", // For edit test
    name: "image_promo",
    category: "MARKETING",
    language: "en",
    headerType: "IMAGE",
    headerMediaUrl: "https://placehold.co/600x315.png",
    body: "Check out our new seasonal collection, {{1}}! Fresh styles just dropped.",
    footerText: "Limited time offer.",
    buttonsType: "CALL_TO_ACTION",
    ctaButtonText: "Shop Now",
    ctaButtonType: "URL",
    ctaButtonValue: "https://www.yabily.com/shop",
    status: "DRAFT",
    lastUpdated: "2024-06-18",
  },
];

function TemplateStatusBadge({ status }: { status: MockTemplate["status"] }) {
  switch (status) {
    case "APPROVED":
      return <Badge className="bg-green-500 hover:bg-green-600 text-white"><CheckCircle2 className="mr-1 h-3 w-3" />Approved</Badge>;
    case "PENDING":
      return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Pending</Badge>;
    case "REJECTED":
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
    case "DRAFT":
      return <Badge variant="outline" className="border-blue-500 text-blue-500"><Edit3 className="mr-1 h-3 w-3" />Draft</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function TemplateCardActions({ template }: { template: MockTemplate }) {
  const { toast } = useToast();
  const router = useRouter(); 

  const handleDelete = () => {
    toast({
        title: "Delete Template (Mock)",
        description: `Template "${template.name}" would be deleted. This is a mock action.`,
        variant: "destructive"
    });
    // Add logic to remove template from a state list if managing locally, or call API
  }

  const handleEdit = () => {
    if (template.status === "APPROVED") {
        toast({
            title: "Edit Approved Template",
            description: "Approved templates cannot be directly edited. You can create a new version or duplicate it.",
            variant: "default"
        });
        // Optionally, redirect to new template page with data prefilled (duplication)
        // router.push(`/templates/new?duplicate=${template.id}`);
    } else {
        router.push(`/templates/${template.id}/edit`);
    }
  }

 return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>
            <Edit3 className="mr-2 h-4 w-4" /> Edit {template.status === "APPROVED" ? "(New Version)" : ""}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast({ title: "Preview Template", description: `Showing preview for "${template.name}" (mock action). Actual preview in form.`})}>
            <Eye className="mr-2 h-4 w-4" /> Preview (Mock)
        </DropdownMenuItem>
        {template.status !== "APPROVED" && (
            <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TemplateContentPreview({ template }: { template: MockTemplate }) {
    let icon = <MessageSquare className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />;
    let headerInfo = "No Header";

    if (template.headerType === "TEXT" && template.headerText) {
        icon = <Type className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />;
        headerInfo = template.headerText;
    } else if (template.headerType === "IMAGE") {
        icon = <ImageIcon className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />;
        headerInfo = "Image Header";
    } else if (template.headerType === "VIDEO") {
        icon = <VideoIcon className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />;
        headerInfo = "Video Header";
    } else if (template.headerType === "DOCUMENT") {
        icon = <FileIconProp className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />;
        headerInfo = template.headerDocumentFilename || "Document Header";
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center text-xs text-muted-foreground">
                {icon}
                <span className="truncate">{headerInfo}</span>
            </div>
            <p className="font-medium text-foreground mb-1">Body Preview:</p>
            <p className="text-muted-foreground text-xs line-clamp-3 h-[3.8em] bg-muted/30 p-2 rounded-md">
              {template.body || "No body content provided."}
            </p>
        </div>
    );
}


export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all"); // Allow "all" or MockTemplate["status"]
  const [selectedCategory, setSelectedCategory] = useState<string>("all_categories"); // Allow "all_categories" or TemplateFormValues["category"]

  const filteredTemplates = useMemo(() => {
    return mockTemplates.filter(template => {
      const nameMatch = template.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const bodyMatch = template.body?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearchTerm = nameMatch || bodyMatch;
      
      const matchesStatus = selectedStatus === "all" || template.status === selectedStatus;
      const matchesCategory = selectedCategory === "all_categories" || template.category === selectedCategory;
      return matchesSearchTerm && matchesStatus && matchesCategory;
    });
  }, [searchTerm, selectedStatus, selectedCategory]);

  return (
    <PageWrapper
      title="Message Templates"
      description="Manage your WhatsApp message templates and their approval status with Meta."
      actions={
        <Link href="/templates/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Template
          </Button>
        </Link>
      }
    >
      <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search templates by name or body content..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_categories">All Categories</SelectItem>
              <SelectItem value="MARKETING">Marketing</SelectItem>
              <SelectItem value="UTILITY">Utility</SelectItem>
              <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    {template.name}
                  </CardTitle>
                  <TemplateCardActions template={template} />
                </div>
                <CardDescription className="text-xs space-x-2">
                  <span>Category: <Badge variant="outline" className="ml-1">{template.category}</Badge></span>
                  <span>Lang: <Badge variant="outline" className="ml-1">{template.language}</Badge></span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 text-sm">
                <TemplateContentPreview template={template} />
                {template.status === "REJECTED" && template.rejectionReason && (
                   <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-md">
                     <strong>Rejection Reason:</strong> {template.rejectionReason}
                   </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4">
                <span>Last updated: {new Date(template.lastUpdated).toLocaleDateString()}</span>
                <TemplateStatusBadge status={template.status} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-lg">
            <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                    No templates found matching your criteria. Try adjusting your filters or create a new template.
                </p>
            </CardContent>
        </Card>
      )}
    </PageWrapper>
  );
}

    
