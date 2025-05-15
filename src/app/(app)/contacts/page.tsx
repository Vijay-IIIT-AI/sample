
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, Edit3, Trash2, UserPlus, Tag, Mail, Phone, Building, CalendarClock, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomField {
  label: string;
  value: string | number | boolean;
}

import { Contact } from '@/lib/api/contacts';
import { contactsApi } from '@/lib/api/contacts';
import { tagsApi } from '@/lib/api/tags';
import type { Tag } from '@/lib/api/tags';

interface CustomField {
  label: string;
  value: string | number | boolean;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const { toast } = useToast();

function ContactCardActions({ contactId, onDelete }: { contactId: number; onDelete: (id: number) => Promise<void> }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await onDelete(contactId);
    }
  };

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
        <DropdownMenuItem asChild>
          <Link href={`/contacts/${contactId}`}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive-foreground focus:bg-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await tagsApi.getTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error('Failed to load tags:', err);
        setError('Failed to load tags. Please try again later.');
      }
    };
    loadTags();
  }, []);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        const result = await contactsApi.getContacts({
          page,
          search: searchTerm || undefined,
          tag_id: selectedTag === 'all' ? undefined : Number(selectedTag)
        });
        setContacts(result.contacts);
        setTotalPages(result.total_pages);
      } catch (err) {
        console.error('Failed to load contacts:', err);
        setError('Failed to load contacts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadContacts();
  }, [page, searchTerm, selectedTag]);

  const handleDeleteContact = async (contactId: number) => {
    try {
      await contactsApi.deleteContact(contactId);
      toast({
        title: "Contact deleted successfully",
        description: "The contact has been removed from your list."
      });
      // Refresh contacts list
      const result = await contactsApi.getContacts({
        page,
        search: searchTerm || undefined,
        tag_id: selectedTag === 'all' ? undefined : Number(selectedTag)
      });
      setContacts(result.contacts);
      setTotalPages(result.total_pages);
    } catch (err) {
      console.error('Failed to delete contact:', err);
      toast({
        title: "Failed to delete contact",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

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
          <Select 
            value={selectedTag} 
            onValueChange={setSelectedTag}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {availableTags.map(tag => (
                <SelectItem key={tag.id} value={tag.id.toString()}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Add more filters here if needed, e.g., by custom field value */}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="flex flex-col shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24 mt-1" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4 mx-auto block"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : contacts.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {contacts.map((contact) => (
            <Card key={contact.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatar_url || undefined} alt={contact.name} />
                      <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      {contact.company && <CardDescription className="text-xs flex items-center mt-0.5"><Building className="h-3 w-3 mr-1 text-muted-foreground" />{contact.company}</CardDescription>}
                    </div>
                  </div>
                  <ContactCardActions contactId={contact.id} onDelete={handleDeleteContact} />
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
                
                {contact.tags && contact.tags.length > 0 && (
                  <div className="pt-1">
                    <h4 className="text-xs font-medium text-foreground mb-1.5 flex items-center"><Tag className="h-3.5 w-3.5 mr-1 text-primary/70"/>Tags:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {contact.tags.map(tag => (
                        <Badge 
                          key={tag.id} 
                          variant="secondary" 
                          className="text-xs"
                          style={{ backgroundColor: tag.color + '20', color: tag.color }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <Separator className="my-2" />
              <CardFooter className="text-xs text-muted-foreground flex justify-between items-center pt-3 pb-4 px-4">
                  <div className="flex items-center">
                    <CalendarClock className="h-3.5 w-3.5 mr-1.5"/>
                    Created: {new Date(contact.created_at).toLocaleDateString()}
                  </div>
              </CardFooter>
            </Card>
          ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="py-2 px-3 text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
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
