
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Type, Image as ImageIcon, Video as VideoIcon, File as FileIconProp, Phone, Link as LinkIcon } from "lucide-react"; // Renamed FileIcon to FileIconProp
import type { TemplateFormValues } from './template-form'; 

export type TemplatePreviewData = Partial<TemplateFormValues>;

interface TemplatePreviewProps {
  formData: TemplatePreviewData;
}

export function TemplatePreview({ formData }: TemplatePreviewProps) {
  const {
    headerType,
    headerText,
    headerMediaUrl,
    headerDocumentFilename,
    body,
    footerText,
    buttonsType,
    quickReply1,
    quickReply2,
    quickReply3,
    ctaButtonText,
    ctaButtonType,
    ctaButtonValue,
  } = formData;

  const mockVariable = (placeholder: string) => {
    switch (placeholder) {
      case "{{1}}": return "[Sample Name]";
      case "{{2}}": return "[Order #12345]";
      case "{{3}}": return "[TrackingLink.com]";
      default:
        const match = placeholder.match(/{{\s*(\d+)\s*}}/);
        if (match && match[1]) {
            return `[Sample Value ${match[1]}]`;
        }
        return placeholder;
    }
  };

  const renderBodyWithVariables = (text?: string) => {
    if (!text) return "";
    // First, escape HTML to prevent XSS if variables could contain HTML
    // For this controlled preview, we'll assume variables are safe text
    // Then, replace placeholders
    return text.replace(/{{\s*[\w\d]+\s*}}/g, (match) => {
        const mockedValue = mockVariable(match);
        // Make variables bold for emphasis in preview
        return `<strong class="font-medium text-primary/80">${mockedValue}</strong>`;
    }).replace(/\n/g, '<br />'); // Preserve line breaks
  };

  const bodyContent = renderBodyWithVariables(body) || "Your message content will appear here...";
  const hasContent = !!(headerType !== "NONE" || body || footerText);

  return (
    <Card className="w-full max-w-sm mx-auto shadow-xl overflow-hidden">
      <CardHeader className="bg-muted/50 p-3">
        <CardTitle className="text-sm font-semibold text-center text-foreground">WhatsApp Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Chat Pane Background */}
        <div className="bg-slate-100 dark:bg-slate-800 p-4 min-h-[300px] flex flex-col">
          {hasContent && (
            <div className="flex justify-end mb-2">
              {/* Outgoing Message Bubble */}
              <div className="bg-emerald-100 dark:bg-emerald-800/70 text-foreground rounded-lg rounded-tr-none shadow-md max-w-[85%] p-2.5 text-sm space-y-1.5">
                {/* Header */}
                {headerType && headerType !== "NONE" && (
                  <div className="mb-1.5">
                    {headerType === "TEXT" && headerText && (
                      <p className="font-semibold text-primary">{headerText}</p>
                    )}
                    {headerType === "IMAGE" && headerMediaUrl && (
                      <div className="relative aspect-video w-full rounded overflow-hidden border border-muted/30">
                        <Image src={headerMediaUrl} alt="Header Image Preview" layout="fill" objectFit="cover" data-ai-hint="message header" />
                      </div>
                    )}
                    {headerType === "VIDEO" && headerMediaUrl && (
                      <div className="relative aspect-video w-full bg-slate-700 rounded flex items-center justify-center overflow-hidden border border-muted/30">
                          <VideoIcon className="h-10 w-10 text-white/70" />
                          <p className="text-xs text-white/70 absolute bottom-1.5 left-1.5 bg-black/30 px-1 rounded-sm">Video</p>
                      </div>
                    )}
                    {headerType === "DOCUMENT" && (
                      <div className="flex items-center space-x-2 p-2 bg-slate-200 dark:bg-slate-700 rounded border border-muted/30">
                        <FileIconProp className="h-6 w-6 text-primary shrink-0" />
                        <span className="text-sm text-foreground truncate">{headerDocumentFilename || "document.pdf"}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Body */}
                <p className="text-foreground whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: bodyContent }} />

                {/* Footer */}
                {footerText && (
                  <p className="text-xs text-muted-foreground mt-1 text-right">{footerText}</p>
                )}
              </div>
            </div>
          )}

          {/* Spacer to push buttons to bottom if no message content yet */}
          {!hasContent && <div className="flex-grow"></div>}
          
          {/* Buttons Area - Below the bubble */}
          <div className="mt-auto space-y-1.5 pt-2">
            {buttonsType === "QUICK_REPLY" && 
              [quickReply1, quickReply2, quickReply3].map((reply, index) =>
                reply ? (
                  <Button key={index} variant="outline" size="sm" className="w-full bg-background hover:bg-muted text-primary border-primary/50 text-xs shadow-sm font-medium">
                    {reply}
                  </Button>
                ) : null
            )}
            {buttonsType === "CALL_TO_ACTION" && ctaButtonText && ctaButtonType && ctaButtonType !== "NONE" && (
              <Button variant="outline" size="sm" className="w-full bg-background hover:bg-muted text-primary border-primary/50 text-xs shadow-sm font-medium justify-center">
                {ctaButtonType === "PHONE_NUMBER" && <Phone className="h-3.5 w-3.5 mr-1.5 shrink-0" />}
                {ctaButtonType === "URL" && <LinkIcon className="h-3.5 w-3.5 mr-1.5 shrink-0" />}
                {ctaButtonText}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-muted/50 text-xs text-muted-foreground text-center">
        This is a preview. Actual appearance may vary.
      </CardFooter>
    </Card>
  );
}
