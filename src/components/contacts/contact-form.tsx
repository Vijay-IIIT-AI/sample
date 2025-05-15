
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Building, Link as LinkIcon, Tag, Save, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import React from "react";

// Mock available tags - in a real app, this would come from settings/API
const availableTags = ["VIP", "Lead", "Bollywood", "Influencer", "Past Client", "Hot Lead", "Requires Follow-up", "Key Account", "Producer", "New Tag"];

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  avatarUrl: z.string().url("Invalid URL for avatar.").optional().or(z.literal('')),
  avatarHint: z.string().optional(), // For AI image search hint
  tags: z.array(z.string()).optional().default([]),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  contactId?: string;
  initialData?: Partial<ContactFormValues>;
  onSubmitSuccess?: () => void;
}

export function ContactForm({ contactId, initialData, onSubmitSuccess }: ContactFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = React.useState<string | undefined>(initialData?.avatarUrl);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      company: initialData?.company || "",
      avatarUrl: initialData?.avatarUrl || "",
      avatarHint: initialData?.avatarHint || "",
      tags: initialData?.tags || [], // Ensure tags is an array
    },
  });

  const watchedAvatarUrl = form.watch("avatarUrl");
  React.useEffect(() => {
    setAvatarPreview(watchedAvatarUrl);
  }, [watchedAvatarUrl]);

  const onSubmit = async (data: ContactFormValues) => {
    console.log("Contact data to submit:", data);
    // Tags are already an array, no need to process comma-separated string
    toast({
      title: contactId ? "Contact Updated" : "Contact Created",
      description: `Contact "${data.name}" has been successfully ${contactId ? 'updated' : 'added'}.`,
    });

    if (onSubmitSuccess) {
      onSubmitSuccess();
    } else {
      router.push("/contacts");
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{contactId ? "Edit Contact" : "Add New Contact"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview || undefined} alt={form.getValues("name")} data-ai-hint={form.getValues("avatarHint") || "person"} />
                    <AvatarFallback>
                        {form.getValues("name") ? form.getValues("name").split(' ').map(n => n[0]).join('').toUpperCase() : <User className="h-10 w-10" />}
                    </AvatarFallback>
                </Avatar>
                <div className="grid grid-cols-1 gap-4 flex-1">
                    <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center"><LinkIcon className="mr-2 h-4 w-4" />Avatar URL (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="https://placehold.co/100x100.png" {...field} />
                        </FormControl>
                        <FormDescription>Use services like https://placehold.co for placeholders.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="avatarHint"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center"><ImageIcon className="mr-2 h-4 w-4" />Avatar AI Hint (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., man smiling, woman professional" {...field} />
                        </FormControl>
                        <FormDescription>Keywords for AI to find a relevant image (max 2 words).</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </div>


            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4" />Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4" />Email (Optional)</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4" />Phone (Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="+91 12345 67890" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4" />Company (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Yabily Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base flex items-center"><Tag className="mr-2 h-4 w-4" />Tags</FormLabel>
                    <FormDescription>
                      Select one or more tags for this contact.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availableTags.map((tag) => (
                      <FormField
                        key={tag}
                        control={form.control}
                        name="tags"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={tag}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(tag)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), tag])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== tag
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {tag}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {contactId ? "Save Changes" : "Create Contact"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
