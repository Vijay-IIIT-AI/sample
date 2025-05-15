
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
// import Image from "next/image"; // Not used directly if Avatar handles it
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, Edit3, Trash2, UserPlus, Tag, Mail, Phone, Building, CalendarClock, Eye } from "lucide-react"; // Added Eye
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface CustomField {
  label: string;
  value: string | number | boolean;
}

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  avatarHint?: string;
  company?: string;
  tags: string[];
  customFields: CustomField[];
  lastContacted: string; 
  createdAt: string;
}

const mockContacts: Contact[] = [
  {
    id: "contact1",
    name: "Alia Bhatt",
    email: "alia.b@example.com",
    phone: "+91 98765 43210",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarHint: "woman smiling",
    company: "Sunshine Productions",
    tags: ["VIP", "Lead", "Bollywood"],
    customFields: [
      { label: "Lead Source", value: "Referral" },
      { label: "Industry", value: "Entertainment" },
      { label: "Account Manager", value: "RK" },
    ],
    lastContacted: "2024-07-10",
    createdAt: "2023-01-15",
  },
  {
    id: "contact2",
    name: "Ranbir Kapoor",
    email: "ranbir.k@example.com",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarHint: "man serious",
    company: "Dharma Productions",
    tags: ["Influencer", "Past Client"],
    customFields: [
      { label: "Subscription Tier", value: "Premium" },
      { label: "Last Purchase", value: "2024-05-20" },
    ],
    lastContacted: "2024-06-25",
    createdAt: "2022-11-05",
  },
  {
    id: "contact3",
    name: "Deepika Padukone",
    phone: "+91 99887 76655",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarHint: "woman professional",
    company: "Ka Productions",
    tags: ["Hot Lead", "Requires Follow-up"],
    customFields: [
      { label: "Preferred Contact Method", value: "Email" },
      { label: "Project Interest", value: "Brand Endorsement" },
    ],
    lastContacted: "2024-07-15",
    createdAt: "2023-03-20",
  },
  {
    id: "contact4",
    name: "Shah Rukh Khan",
    email: "srk.office@example.com",
    avatarUrl: "https://placehold.co/100x100.png",
    avatarHint: "man iconic",
    company: "Red Chillies Entertainment",
    tags: ["Key Account", "Bollywood", "Producer"],
    customFields: [
      { label: "Net Worth (Est.)", value: "₹6000 Cr" },
      { label: "Next Availability", value: "Q4 2024" },
    ],
    lastContacted: "2024-07-01",
    createdAt: "2021-08-10",
  },
];

function ContactCardActions({ contactId }: { contactId: string }) {
  const { toast } = useToast();
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
            <Link href={`/contacts/${contactId}/edit`}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit
            </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
            onClick={() => toast({ title: "View Details (Mock)", description: `Viewing details for contact ID: ${contactId}. This would typically navigate to a dedicated contact detail page.` })}
        >
          <Eye className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive" onClick={() => toast({ title: "Delete Contact (Mock)", description: `Deleting contact ID: ${contactId}`, variant: "destructive" })}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    mockContacts.forEach(contact => contact.tags.forEach(tag => tagsSet.add(tag)));
    return ["all", ...Array.from(tagsSet)];
  }, []);

  const filteredContacts = useMemo(() => {
    return mockContacts.filter(contact => {
      const nameMatch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
      const emailMatch = contact.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const phoneMatch = contact.phone?.includes(searchTerm);
      const companyMatch = contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSearchTerm = nameMatch || emailMatch || phoneMatch || companyMatch;
      const matchesTag = selectedTag === "all" || contact.tags.includes(selectedTag);
      
      return matchesSearchTerm && matchesTag;
    });
  }, [searchTerm, selectedTag]);

  return (
    <PageWrapper
      title="Contacts"
      description="Manage your contacts, custom fields, and tags."
      actions={
        <Link href="/contacts/new" passHref>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add Contact
          </Button>
        </Link>
      }
    >
      <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search contacts by name, email, phone, company..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Tag" />
            </SelectTrigger>
            <SelectContent>
              {allTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag === "all" ? "All Tags" : tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Add more filters here if needed, e.g., by custom field value */}
        </div>
      </div>

      {filteredContacts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatarUrl || undefined} alt={contact.name} data-ai-hint={contact.avatarHint || 'person'} />
                      <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      {contact.company && <CardDescription className="text-xs flex items-center mt-0.5"><Building className="h-3 w-3 mr-1 text-muted-foreground" />{contact.company}</CardDescription>}
                    </div>
                  </div>
                  <ContactCardActions contactId={contact.id} />
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 text-sm">
                {contact.email && (
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2 shrink-0 text-primary/70" />
                    <a href={`mailto:${contact.email}`} className="hover:underline truncate">{contact.email}</a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2 shrink-0 text-primary/70" />
                    <span className="truncate">{contact.phone}</span>
                  </div>
                )}
                
                {contact.tags.length > 0 && (
                  <div className="pt-1">
                    <h4 className="text-xs font-medium text-foreground mb-1.5 flex items-center"><Tag className="h-3.5 w-3.5 mr-1 text-primary/70"/>Tags:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {contact.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {contact.customFields.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-medium text-foreground mb-1.5">Custom Info:</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground list-none">
                      {contact.customFields.slice(0, 3).map(field => ( // Show up to 3 custom fields
                        <li key={field.label} className="flex justify-between">
                          <span className="font-medium text-foreground/80">{field.label}:</span>
                          <span className="truncate ml-2 text-right">{String(field.value)}</span>
                        </li>
                      ))}
                       {contact.customFields.length > 3 && <li className="text-center text-primary/80">...and more</li>}
                    </ul>
                  </div>
                )}
              </CardContent>
              <Separator className="my-2" />
              <CardFooter className="text-xs text-muted-foreground flex justify-between items-center pt-3 pb-4 px-4">
                  <div className="flex items-center">
                    <CalendarClock className="h-3.5 w-3.5 mr-1.5"/>
                    Last touch: {new Date(contact.lastContacted).toLocaleDateString()}
                  </div>
                  {/* Optionally, add a view details button here if preferred over dropdown */}
                  {/* <Link href={`/contacts/${contact.id}/edit`} passHref><Button variant="link" size="sm">View/Edit</Button></Link> */}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-lg col-span-full">
            <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                    No contacts found matching your criteria. Try adjusting your search or filters.
                </p>
            </CardContent>
        </Card>
      )}
    </PageWrapper>
  );
}
