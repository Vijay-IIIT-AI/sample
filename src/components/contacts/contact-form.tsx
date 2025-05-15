"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { contactsApi } from '@/lib/api/contacts';
import type { Tag } from '@/lib/api/tags';
import { tagsApi } from '@/lib/api/tags';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  phone: z.string().optional(),
  country_code: z.string().optional(),
  whatsapp_number: z.string().optional(),
  company: z.string().optional(),
  avatar_url: z.string().url("Invalid URL for avatar.").optional().or(z.literal('')),
  notes: z.string().optional(),
  tag_ids: z.array(z.number()).optional().default([]),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  contactId?: string;
  initialData?: Partial<ContactFormValues>;
  onSubmitSuccess?: () => void;
}

export function ContactForm({ contactId, initialData, onSubmitSuccess }: ContactFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await tagsApi.getTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error('Failed to load tags:', err);
        toast({
          title: "Failed to load tags",
          description: "Please try again later.",
          variant: "destructive"
        });
      }
    };
    loadTags();
  }, [toast]);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country_code: "",
      whatsapp_number: "",
      company: "",
      avatar_url: "",
      notes: "",
      tag_ids: [],
      ...initialData,
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setLoading(true);
      if (contactId) {
        await contactsApi.updateContact(Number(contactId), data);
      } else {
        await contactsApi.createContact(data);
      }
      
      toast({
        title: `${contactId ? "Updated" : "Created"} contact successfully`,
        description: `Contact ${data.name} has been ${contactId ? "updated" : "created"}.`,
      });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        router.push('/contacts');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to save contact. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="country_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">United States (+1)</SelectItem>
                        <SelectItem value="+44">United Kingdom (+44)</SelectItem>
                        <SelectItem value="+91">India (+91)</SelectItem>
                        <SelectItem value="+86">China (+86)</SelectItem>
                        <SelectItem value="+81">Japan (+81)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter WhatsApp number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter avatar URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tag_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {field.value.map((tagId) => {
                  const tag = availableTags.find((t) => t.id === tagId);
                  if (!tag) return null;
                  return (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      style={{
                        backgroundColor: tag.color + '20',
                        color: tag.color,
                      }}
                      onClick={() => {
                        field.onChange(field.value.filter((id) => id !== tagId));
                      }}
                      className="cursor-pointer"
                    >
                      {tag.name} ×
                    </Badge>
                  );
                })}
              </div>
              <Select
                onValueChange={(value) => {
                  const tagId = Number(value);
                  if (!field.value.includes(tagId)) {
                    field.onChange([...field.value, tagId]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add a tag" />
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map((tag) => (
                    <SelectItem
                      key={tag.id}
                      value={tag.id.toString()}
                      disabled={field.value.includes(tag.id)}
                    >
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes about this contact"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/contacts')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : contactId ? 'Update Contact' : 'Create Contact'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
