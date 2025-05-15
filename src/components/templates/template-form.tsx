
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as UiCardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { FileText, Tag, Send, Languages, MessageSquare, Type, Image as ImageIcon, Video as VideoIcon, File as FileIconProp, AlignLeft, ChevronsUpDown, CornerDownLeft } from "lucide-react";
import { TemplatePreview, type TemplatePreviewData } from "./TemplatePreview";

const templateFormSchema = z.object({
  name: z.string()
    .min(3, "Template name must be at least 3 characters.")
    .regex(/^[a-z0-9_]+$/, "Name must be lowercase, use only letters, numbers, and underscores (_). No spaces or special characters."),
  category: z.enum(["MARKETING", "UTILITY", "AUTHENTICATION"], {
    required_error: "Please select a category.",
  }),
  language: z.string().min(2, "Language code is required (e.g., en, en_US).").default("en_US"),
  
  headerType: z.enum(["NONE", "TEXT", "IMAGE", "VIDEO", "DOCUMENT"]).default("NONE"),
  headerText: z.string().max(60, "Header text cannot exceed 60 characters.").optional(),
  headerMediaUrl: z.string().url("Invalid media URL.").optional().or(z.literal('')),
  headerDocumentFilename: z.string().optional(),

  body: z.string().min(1, "Body content is required.").max(1024, "Body content cannot exceed 1024 characters."),
  
  footerText: z.string().max(60, "Footer text cannot exceed 60 characters.").optional(),
  
  buttonsType: z.enum(["NONE", "QUICK_REPLY", "CALL_TO_ACTION"]).default("NONE"),
  quickReply1: z.string().max(20).optional(),
  quickReply2: z.string().max(20).optional(),
  quickReply3: z.string().max(20).optional(),
  
  ctaButtonText: z.string().max(20).optional(),
  ctaButtonType: z.enum(["NONE", "PHONE_NUMBER", "URL"]).default("NONE").optional(),
  ctaButtonValue: z.string().optional(),
}).refine(data => {
  if (data.headerType === "TEXT") return !!data.headerText;
  return true;
}, { message: "Header text is required for Text header type.", path: ["headerText"] })
.refine(data => {
  if (data.headerType === "IMAGE" || data.headerType === "VIDEO") return !!data.headerMediaUrl;
  return true;
}, { message: "Media URL is required for Image/Video header type.", path: ["headerMediaUrl"] })
.refine(data => {
  if (data.headerType === "DOCUMENT") return !!data.headerDocumentFilename;
  return true;
}, { message: "Document filename is required for Document header type.", path: ["headerDocumentFilename"] })
.refine(data => {
    if (data.buttonsType === "QUICK_REPLY") return !!data.quickReply1;
    return true;
}, { message: "At least one quick reply is required if Quick Reply buttons are selected.", path: ["quickReply1"]})
.refine(data => {
    if (data.buttonsType === "CALL_TO_ACTION") {
        return !!data.ctaButtonText && data.ctaButtonType !== "NONE" && !!data.ctaButtonValue;
    }
    return true;
}, { message: "Call to Action text, type (Phone/URL), and value are required when 'Call to Action' buttons are selected.", path: ["ctaButtonText"]});


export type TemplateFormValues = z.infer<typeof templateFormSchema>;

interface TemplateFormProps {
  templateId?: string;
  initialData?: Partial<TemplateFormValues>;
  onSubmitSuccess?: () => void;
}

export function TemplateForm({ templateId, initialData, onSubmitSuccess }: TemplateFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "UTILITY",
      language: initialData?.language || "en_US",
      headerType: initialData?.headerType || "NONE",
      headerText: initialData?.headerText || "",
      headerMediaUrl: initialData?.headerMediaUrl || "",
      headerDocumentFilename: initialData?.headerDocumentFilename || "",
      body: initialData?.body || "",
      footerText: initialData?.footerText || "",
      buttonsType: initialData?.buttonsType || "NONE",
      quickReply1: initialData?.quickReply1 || "",
      quickReply2: initialData?.quickReply2 || "",
      quickReply3: initialData?.quickReply3 || "",
      ctaButtonText: initialData?.ctaButtonText || "",
      ctaButtonType: initialData?.ctaButtonType || "NONE",
      ctaButtonValue: initialData?.ctaButtonValue || "",
    },
  });

  const watchedFormData = form.watch();

  async function onSubmit(data: TemplateFormValues) {
    console.log("Template data submitted:", data);
    // Mock API call
    toast({
      title: templateId ? "Template Updated" : "Template Submitted",
      description: `Template "${data.name}" has been ${templateId ? 'updated and resubmitted' : 'submitted'} for approval.`,
    });
    if (onSubmitSuccess) {
        onSubmitSuccess();
    } else {
        setTimeout(() => router.push("/templates"), 1000);
    }
  }
  
  const headerType = form.watch("headerType");
  const buttonsType = form.watch("buttonsType");

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Card className="lg:w-2/3">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            {templateId ? "Edit Message Template" : "Create New Message Template"}
          </CardTitle>
          <UiCardDescription>
            Design your WhatsApp message template. Variables like {'{{1}}'} and {'{{2}}'} will be replaced with actual data. All templates undergo review by Meta.
          </UiCardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><FileText className="mr-2 h-4 w-4" />Template Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., order_confirmation" {...field} />
                    </FormControl>
                    <FormDescription>Lowercase, letters, numbers, and underscores only. No spaces.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center"><Tag className="mr-2 h-4 w-4" />Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="MARKETING">Marketing</SelectItem>
                            <SelectItem value="UTILITY">Utility</SelectItem>
                            <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center"><Languages className="mr-2 h-4 w-4" />Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="en_US">English (US)</SelectItem>
                                <SelectItem value="en_GB">English (UK)</SelectItem>
                                <SelectItem value="es_ES">Spanish (Spain)</SelectItem>
                                <SelectItem value="es_MX">Spanish (Mexico)</SelectItem>
                                <SelectItem value="fr_FR">French (France)</SelectItem>
                                <SelectItem value="de_DE">German</SelectItem>
                                <SelectItem value="pt_BR">Portuguese (Brazil)</SelectItem>
                                {/* Add more common languages as needed */}
                            </SelectContent>
                        </Select>
                        <FormDescription>E.g., en, en_US, es_MX.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              {/* Header Section */}
              <Card className="p-4 bg-muted/30">
                <CardHeader className="p-2">
                    <CardTitle className="text-md flex items-center"><ChevronsUpDown className="mr-2 h-4 w-4"/>Header (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-4">
                    <FormField
                        control={form.control}
                        name="headerType"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Header Type</FormLabel>
                            <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-4">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="NONE" /></FormControl><FormLabel className="font-normal">None</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="TEXT" /></FormControl><FormLabel className="font-normal flex items-center"><Type className="mr-1 h-4 w-4"/>Text</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="IMAGE" /></FormControl><FormLabel className="font-normal flex items-center"><ImageIcon className="mr-1 h-4 w-4"/>Image</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="VIDEO" /></FormControl><FormLabel className="font-normal flex items-center"><VideoIcon className="mr-1 h-4 w-4"/>Video</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="DOCUMENT" /></FormControl><FormLabel className="font-normal flex items-center"><FileIconProp className="mr-1 h-4 w-4"/>Document</FormLabel></FormItem>
                            </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    {headerType === "TEXT" && (
                        <FormField control={form.control} name="headerText" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Header Text</FormLabel>
                                <FormControl><Input placeholder="Your header text (max 60 chars)" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    )}
                    {(headerType === "IMAGE" || headerType === "VIDEO") && (
                        <FormField control={form.control} name="headerMediaUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Media URL ({headerType === "IMAGE" ? "Image" : "Video"})</FormLabel>
                                <FormControl><Input placeholder="https://example.com/media.png or .mp4" {...field} /></FormControl>
                                <FormDescription>Must be a direct link to the media file.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    )}
                    {headerType === "DOCUMENT" && (
                        <FormField control={form.control} name="headerDocumentFilename" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Document Filename (Mock)</FormLabel>
                                <FormControl><Input placeholder="e.g., brochure.pdf" {...field} /></FormControl>
                                <FormDescription>Actual file upload typically handled separately or via URL.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    )}
                </CardContent>
              </Card>

              {/* Body Section */}
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><MessageSquare className="mr-2 h-4 w-4" />Body Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Hi {{1}}, your order {{2}} is confirmed. Track it at {{3}}."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Use numbered placeholders like {'{{1}}'} for variables. Max 1024 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Footer Section */}
              <FormField
                control={form.control}
                name="footerText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><AlignLeft className="mr-2 h-4 w-4" />Footer Text (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Thank you for your business!" {...field} />
                    </FormControl>
                    <FormDescription>Short text at the bottom of the message. Max 60 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Buttons Section */}
              <Card className="p-4 bg-muted/30">
                <CardHeader className="p-2">
                    <CardTitle className="text-md flex items-center"><CornerDownLeft className="mr-2 h-4 w-4"/>Buttons (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-4">
                    <FormField
                        control={form.control}
                        name="buttonsType"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Button Type</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="NONE" /></FormControl><FormLabel className="font-normal">None</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="QUICK_REPLY" /></FormControl><FormLabel className="font-normal">Quick Replies</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="CALL_TO_ACTION" /></FormControl><FormLabel className="font-normal">Call to Action</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    {buttonsType === "QUICK_REPLY" && (
                        <div className="space-y-2">
                            <FormField control={form.control} name="quickReply1" render={({ field }) => (<FormItem><FormLabel>Quick Reply 1</FormLabel><FormControl><Input placeholder="Reply text (max 20 chars)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="quickReply2" render={({ field }) => (<FormItem><FormLabel>Quick Reply 2 (Optional)</FormLabel><FormControl><Input placeholder="Reply text (max 20 chars)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="quickReply3" render={({ field }) => (<FormItem><FormLabel>Quick Reply 3 (Optional)</FormLabel><FormControl><Input placeholder="Reply text (max 20 chars)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormDescription>Up to 3 quick reply buttons. Each max 20 characters.</FormDescription>
                        </div>
                    )}
                    {buttonsType === "CALL_TO_ACTION" && (
                        <div className="space-y-4">
                            <FormField control={form.control} name="ctaButtonText" render={({ field }) => (
                                <FormItem><FormLabel>CTA Button Text</FormLabel><FormControl><Input placeholder="e.g., Visit Website, Call Us" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="ctaButtonType" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CTA Button Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select CTA type" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="NONE">None</SelectItem>
                                            <SelectItem value="PHONE_NUMBER">Call Phone Number</SelectItem>
                                            <SelectItem value="URL">Visit Website (URL)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            {form.watch("ctaButtonType") === "PHONE_NUMBER" && (
                                <FormField control={form.control} name="ctaButtonValue" render={({ field }) => (
                                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="+1234567890" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            )}
                            {form.watch("ctaButtonType") === "URL" && (
                                <FormField control={form.control} name="ctaButtonValue" render={({ field }) => (
                                <FormItem><FormLabel>Website URL</FormLabel><FormControl><Input type="url" placeholder="https://www.example.com" {...field} /></FormControl><FormDescription>Use {'{{1}}'} for dynamic URLs based on a variable.</FormDescription><FormMessage /></FormItem>
                                )} />
                            )}
                             <FormDescription>Max 1 Call to Action button (text max 20 chars).</FormDescription>
                        </div>
                    )}
                </CardContent>
              </Card>

              <UiCardDescription className="text-sm text-muted-foreground pt-4">
                <strong>Meta Validation Rules (Summary):</strong>
                <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                    <li>No promotional content in Utility/Authentication templates.</li>
                    <li>Variable syntax {'{#}'} (e.g., {'{{1}}'}), must be in sequential order if used.</li>
                    <li>Media files have type and size limits (e.g., Images &lt;5MB, Videos &lt;16MB).</li>
                    <li>Content must align with the chosen category.</li>
                    <li>Buttons have character limits and quantity restrictions.</li>
                </ul>
              </UiCardDescription>


              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" className="flex items-center">
                  <Send className="mr-2 h-4 w-4" />
                  {templateId ? "Update & Resubmit Template" : "Save & Submit for Approval"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="lg:w-1/3 lg:sticky lg:top-6 h-fit">
         <TemplatePreview formData={watchedFormData as TemplatePreviewData} />
      </div>
    </div>
  );
}
    
