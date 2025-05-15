
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";
import { CalendarIcon, DollarSign, FileText, Image as ImageIcon, Info, ListChecks, Send, UploadCloud, Users, Video, Clock, Search as SearchIcon, X } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel, // This is the context-aware FormLabel
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as UiCardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label"; // This is the basic Label component

const campaignFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().optional(),
  mediaUrl: z.string().url("Invalid URL for media.").optional().or(z.literal('')),
  mediaType: z.enum(["image", "video", "none"]).default("none"),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
  
  audienceSelectionMethod: z.enum(["csv", "manual_select"]).default("csv"),
  targetAudience: z.string().optional(), // Will be auto-filled or for notes
  selectedContactIds: z.array(z.string()).optional().default([]),
  csvFile: z.any().optional(), 

  budget: z.coerce.number().positive("Budget must be a positive number.").optional(),
  selectedTemplate: z.string().min(1, "Please select a template."),
  
  sendOption: z.enum(["immediate", "schedule"]).default("schedule"),
  scheduleDate: z.date().optional(),
  scheduleTime: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format. Use HH:MM.")
    .optional(),
  
  abTestEnabled: z.boolean().default(false),
  variantAContent: z.string().optional(),
  variantBContent: z.string().optional(),
}).refine(data => {
    if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
    }
    return true;
}, {
  message: "End date cannot be earlier than start date.",
  path: ["endDate"],
}).refine(data => {
    if (data.sendOption === 'schedule') {
        return !!data.scheduleDate;
    }
    return true;
}, {
    message: "Schedule date is required for scheduled campaigns.",
    path: ["scheduleDate"],
}).refine(data => {
    if (data.sendOption === 'schedule') {
        return !!data.scheduleTime && /^([01]\d|2[0-3]):([0-5]\d)$/.test(data.scheduleTime) ;
    }
    return true;
}, {
    message: "Schedule time (HH:MM) is required for scheduled campaigns.",
    path: ["scheduleTime"],
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

interface CampaignFormProps {
  campaignId?: string; 
  initialData?: Partial<CampaignFormValues>;
}

const mockTemplates = [
  { id: "template1", name: "Welcome Offer" },
  { id: "template2", name: "Product Update" },
  { id: "template3", name: "Holiday Special" },
  { id: "template4", name: "Feedback Request" },
];

interface MockContactForSelection {
  id: string;
  name: string;
  email: string;
  tags: string[];
}

const mockContactsForSelection: MockContactForSelection[] = [
  { id: "c1", name: "Aisha Sharma", email: "aisha@example.com", tags: ["VIP", "Lead", "Bollywood"] },
  { id: "c2", name: "Rohan Mehra", email: "rohan@example.com", tags: ["Past Client", "Tech"] },
  { id: "c3", name: "Priya Singh", email: "priya@example.com", tags: ["Lead", "New", "Fashion"] },
  { id: "c4", name: "Vikram Patel", email: "vikram@example.com", tags: ["VIP", "Influencer", "Travel"] },
  { id: "c5", name: "Deepika Rao", email: "deepika@example.com", tags: ["Tech", "New"] },
  { id: "c6", name: "Arjun Das", email: "arjun@example.com", tags: ["Lead", "Fashion"] },
];
const mockAvailableTagsForSelection = ["VIP", "Lead", "Bollywood", "Past Client", "Tech", "New", "Fashion", "Influencer", "Travel"];


export function CampaignForm({ campaignId, initialData }: CampaignFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isContactSelectorOpen, setIsContactSelectorOpen] = useState(false);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      mediaUrl: initialData?.mediaUrl || "",
      mediaType: initialData?.mediaType || "none",
      startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      
      audienceSelectionMethod: initialData?.audienceSelectionMethod || "csv",
      targetAudience: initialData?.targetAudience || "",
      selectedContactIds: initialData?.selectedContactIds || [],
      csvFile: initialData?.csvFile || null,

      budget: initialData?.budget || undefined,
      selectedTemplate: initialData?.selectedTemplate || "",
      
      sendOption: initialData?.sendOption || "schedule",
      scheduleDate: initialData?.scheduleDate ? new Date(initialData.scheduleDate) : undefined,
      scheduleTime: initialData?.scheduleTime || "",

      abTestEnabled: initialData?.abTestEnabled || false,
      variantAContent: initialData?.variantAContent || "",
      variantBContent: initialData?.variantBContent || "",
    },
  });

  const onSubmit = async (data: CampaignFormValues) => {
    let processedData = { ...data } as any; 

    if (data.audienceSelectionMethod === "csv" && !data.csvFile && (!initialData?.csvFile)) {
       // if editing and csvFile was already there, it's fine. if new and no csv, could be an issue.
       // for now, we'll assume targetAudience might have notes if CSV isn't primary.
    } else if (data.audienceSelectionMethod === "manual_select" && (!data.selectedContactIds || data.selectedContactIds.length === 0)) {
      toast({
        title: "Missing Audience",
        description: "Please select contacts if using the manual selection method.",
        variant: "destructive",
      });
      return;
    }


    if (data.sendOption === 'schedule') {
      if (!data.scheduleDate || !data.scheduleTime) {
        toast({
          title: "Missing Schedule Information",
          description: "Please provide both date and time for scheduled campaigns.",
          variant: "destructive",
        });
        return;
      }
      const [hours, minutes] = data.scheduleTime.split(':').map(Number);
      const scheduledAtDateTime = new Date(data.scheduleDate);
      scheduledAtDateTime.setHours(hours, minutes, 0, 0);

      if (scheduledAtDateTime <= new Date()) {
        toast({
          title: "Invalid Schedule Time",
          description: "Scheduled date and time must be in the future.",
          variant: "destructive",
        });
        return;
      }
      processedData.scheduledAt = scheduledAtDateTime;
    } else {
        delete processedData.scheduleDate;
        delete processedData.scheduleTime;
    }

    console.log("Campaign data to submit:", processedData);
    toast({
      title: campaignId ? "Campaign Updated" : "Campaign Created",
      description: `Campaign "${processedData.title}" has been successfully ${campaignId ? 'updated' : 'created'}. ${data.sendOption === 'schedule' && processedData.scheduledAt ? `Scheduled for: ${format(processedData.scheduledAt, "PPP p")}` : ''}`,
    });
    setTimeout(() => router.push("/campaigns"), 1000);
  };
  
  const mediaType = form.watch("mediaType");
  const sendOption = form.watch("sendOption");
  const audienceSelectionMethod = form.watch("audienceSelectionMethod");

  const handleConfirmContactSelection = (selectedIds: string[], summary: string) => {
    form.setValue("selectedContactIds", selectedIds);
    form.setValue("targetAudience", summary);
    setIsContactSelectorOpen(false);
  };

  useEffect(() => {
    if (audienceSelectionMethod === "manual_select") {
      form.setValue("csvFile", null); // Clear CSV if switching to manual select
      if (form.getValues("selectedContactIds").length === 0) {
        form.setValue("targetAudience", "No contacts selected. Click 'Select Contacts...' to choose.");
      }
    } else if (audienceSelectionMethod === "csv") {
      form.setValue("selectedContactIds", []); // Clear manual selection if switching to CSV
      // Optionally, clear targetAudience or allow notes
      // form.setValue("targetAudience", ""); 
    }
  }, [audienceSelectionMethod, form]);


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{campaignId ? "Edit Campaign" : "Create New Campaign"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer Sale Extravaganza" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Briefly describe your campaign..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mediaType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Media Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="none" />
                        </FormControl>
                        <FormLabel className="font-normal">None</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="image" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center"><ImageIcon className="mr-1 h-4 w-4"/> Image</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="video" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center"><Video className="mr-1 h-4 w-4"/> Video</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {mediaType !== "none" && (
              <FormField
                control={form.control}
                name="mediaUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media URL ({mediaType === "image" ? "Image" : "Video"})</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/your-media.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a public URL for your {mediaType}. Use placeholder e.g., https://placehold.co/600x400.png
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < (form.getValues("startDate") || new Date(0))}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Audience Selection Method */}
            <FormField
              control={form.control}
              name="audienceSelectionMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center"><Users className="mr-2 h-4 w-4" />Target Audience Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="csv" /></FormControl>
                        <FormLabel className="font-normal flex items-center"><UploadCloud className="mr-1 h-4 w-4"/>Upload CSV</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="manual_select" /></FormControl>
                        <FormLabel className="font-normal flex items-center"><ListChecks className="mr-1 h-4 w-4"/>Select Contacts</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {audienceSelectionMethod === "csv" && (
              <FormField
                control={form.control}
                name="csvFile"
                render={({ field: { onChange, value, ...restField } }) => ( 
                  <FormItem>
                    <FormLabel className="flex items-center">
                       <UploadCloud className="mr-2 h-4 w-4" /> Upload CSV Data
                    </FormLabel>
                    <FormControl>
                       <Input type="file" accept=".csv" onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} {...restField} />
                    </FormControl>
                    <FormDescription>Upload a CSV file with contact information. The 'targetAudience' field below can be used for notes.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {audienceSelectionMethod === "manual_select" && (
                <FormItem>
                    <Button type="button" variant="outline" onClick={() => setIsContactSelectorOpen(true)}>
                        <Users className="mr-2 h-4 w-4" /> Select Contacts...
                    </Button>
                </FormItem>
            )}
            
            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" /> Audience Summary / Notes
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                        placeholder={
                            audienceSelectionMethod === 'csv' 
                            ? "Optional notes about your CSV audience..." 
                            : "Audience summary will appear here after selection."
                        } 
                        {...field} 
                        readOnly={audienceSelectionMethod === 'manual_select' && form.getValues("selectedContactIds").length > 0} 
                        rows={audienceSelectionMethod === 'manual_select' ? 2 : 4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" /> Budget (₹) (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="selectedTemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <ListChecks className="mr-2 h-4 w-4" /> Select Approved Template
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sendOption"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center"><Send className="mr-2 h-4 w-4" /> Send Options</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value === "immediate") {
                          form.setValue("scheduleDate", undefined);
                          form.setValue("scheduleTime", "");
                        }
                      }}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="immediate" />
                        </FormControl>
                        <FormLabel className="font-normal">Send Immediately</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="schedule" />
                        </FormControl>
                        <FormLabel className="font-normal">Schedule for Later</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {sendOption === "schedule" && (
                <Card className="bg-muted/30 p-4 space-y-6">
                    <UiCardDescription className="font-medium text-foreground">Schedule Details</UiCardDescription>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="scheduleDate"
                            render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Schedule Date</FormLabel>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                        "w-full justify-start text-left font-normal bg-background", // Added bg-background
                                        !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} 
                                    initialFocus
                                    />
                                </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="scheduleTime"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4" /> Schedule Time
                                </FormLabel>
                                <FormControl>
                                <Input type="time" {...field} className="w-full bg-background" /> 
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </Card>
            )}

            <Card className="bg-muted/30">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-base flex items-center font-medium">
                  <Info className="mr-2 h-4 w-4 text-primary" /> A/B Testing (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <FormField
                  control={form.control}
                  name="abTestEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-card">
                      <div className="space-y-0.5">
                        <FormLabel>Enable A/B Testing</FormLabel>
                        <FormDescription className="text-xs">
                          Test different versions of your campaign message.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {form.watch("abTestEnabled") && (
                  <>
                    <FormField
                      control={form.control}
                      name="variantAContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Variant A Content</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Content for Variant A" {...field} className="bg-card"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="variantBContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Variant B Content</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Content for Variant B" {...field} className="bg-card"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>


            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">
                {campaignId ? "Save Changes" : "Create Campaign"}
              </Button>
            </div>
          </form>
        </Form>
        <ContactSelectorDialog
            isOpen={isContactSelectorOpen}
            onClose={() => setIsContactSelectorOpen(false)}
            onConfirm={handleConfirmContactSelection}
            initialSelectedIds={form.getValues("selectedContactIds")}
        />
      </CardContent>
    </Card>
  );
}


interface ContactSelectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[], summary: string) => void;
  initialSelectedIds: string[];
}

function ContactSelectorDialog({ isOpen, onClose, onConfirm, initialSelectedIds }: ContactSelectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);
  const [currentSelectedIds, setCurrentSelectedIds] = useState<string[]>(initialSelectedIds);

  useEffect(() => { // Sync with external changes if dialog reopens
    setCurrentSelectedIds(initialSelectedIds);
  }, [initialSelectedIds, isOpen]);

  const filteredContacts = useMemo(() => {
    return mockContactsForSelection.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            contact.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedFilterTags.length === 0 || 
                          selectedFilterTags.every(tag => contact.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [searchTerm, selectedFilterTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedFilterTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleContactSelectToggle = (contactId: string) => {
    setCurrentSelectedIds(prev =>
      prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]
    );
  };

  const handleConfirmClick = () => {
    const selectedContacts = mockContactsForSelection.filter(c => currentSelectedIds.includes(c.id));
    let summary = `Selected ${selectedContacts.length} contact(s).`;
    if (selectedFilterTags.length > 0 && selectedContacts.length > 0) {
      summary += ` Tags: ${selectedFilterTags.join(', ')}.`;
    } else if (selectedFilterTags.length > 0 && selectedContacts.length === 0) {
       summary = `No contacts found matching tags: ${selectedFilterTags.join(', ')}.`;
    } else if (selectedContacts.length > 0 && selectedFilterTags.length === 0 && searchTerm) {
         summary += ` Matching search: "${searchTerm}".`;
    }

    onConfirm(currentSelectedIds, summary);
  };
  
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedFilterTags([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Select Contacts</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4 flex-grow overflow-y-hidden flex flex-col">
          <div className="flex gap-2 flex-col sm:flex-row">
            <div className="relative flex-grow">
                <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                />
            </div>
            { (searchTerm || selectedFilterTags.length > 0) && 
                <Button variant="ghost" onClick={handleClearFilters} className="text-xs text-muted-foreground">
                    <X className="h-3 w-3 mr-1"/> Clear Filters
                </Button>
            }
          </div>
          <div>
            <Label className="text-sm font-medium">Filter by Tags:</Label>
            <ScrollArea className="h-20 mt-1">
                <div className="flex flex-wrap gap-2 p-1">
                {mockAvailableTagsForSelection.map(tag => (
                    <Button 
                        key={tag} 
                        variant={selectedFilterTags.includes(tag) ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => handleTagToggle(tag)}
                        className="text-xs"
                    >
                        {tag}
                    </Button>
                ))}
                </div>
            </ScrollArea>
          </div>
          <ScrollArea className="flex-grow border rounded-md">
            <div className="p-2 space-y-1">
              {filteredContacts.length > 0 ? filteredContacts.map(contact => (
                <div key={contact.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md">
                  <Checkbox
                    id={`contact-${contact.id}`}
                    checked={currentSelectedIds.includes(contact.id)}
                    onCheckedChange={() => handleContactSelectToggle(contact.id)}
                  />
                  <Label htmlFor={`contact-${contact.id}`} className="flex-grow cursor-pointer">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-xs text-muted-foreground">{contact.email}</div>
                    {contact.tags.length > 0 && (
                        <div className="mt-1">
                            {contact.tags.map(t => <Badge key={t} variant="secondary" className="mr-1 text-xs">{t}</Badge>)}
                        </div>
                    )}
                  </Label>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center p-4">No contacts match your filters.</p>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="p-4 border-t flex-col sm:flex-row sm:justify-between">
            <div className="text-sm text-muted-foreground mb-2 sm:mb-0">
                {currentSelectedIds.length} contact(s) selected.
            </div>
            <div className="flex gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleConfirmClick}>Confirm Selection</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

