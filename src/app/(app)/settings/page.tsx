
"use client";

import React from "react"; // Added React import for useState
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bell, Globe, Link as LinkIcon, Lock, UserCog, Zap, Info, Tag, PlusCircle, XIcon } from "lucide-react"; // Added Tag, PlusCircle, XIcon
import { Badge } from "@/components/ui/badge"; // Added Badge import
import { useToast } from "@/hooks/use-toast"; // Added useToast import

// Mock state - in a real app, this would come from user data/API
const isMetaConnected = true; 
const connectedMetaAccountName = "My Business Page";

export default function SettingsPage() {
  const { toast } = useToast(); // Initialize toast
  const [tags, setTags] = React.useState<string[]>(["Lead", "VIP", "Follow-up", "Past Client", "Influencer"]); // Mock initial tags
  const [newTag, setNewTag] = React.useState("");

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.map(t => t.toLowerCase()).includes(trimmedTag.toLowerCase())) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
      toast({ title: "Tag Added", description: `Tag "${trimmedTag}" has been added.` });
    } else if (tags.map(t => t.toLowerCase()).includes(trimmedTag.toLowerCase())) {
      toast({ title: "Tag Exists", description: `Tag "${trimmedTag}" already exists.`, variant: "destructive" });
    } else {
      toast({ title: "Invalid Tag", description: "Tag name cannot be empty.", variant: "destructive" });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    toast({ title: "Tag Removed", description: `Tag "${tagToRemove}" has been removed.` });
  };


  return (
    <PageWrapper title="Settings" description="Configure your application preferences and integrations.">
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="account"><UserCog className="mr-2 h-4 w-4 hidden sm:inline-block"/>Account</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4 hidden sm:inline-block"/>Notifications</TabsTrigger>
          <TabsTrigger value="integrations"><Zap className="mr-2 h-4 w-4 hidden sm:inline-block"/>Integrations</TabsTrigger>
          <TabsTrigger value="security"><Lock className="mr-2 h-4 w-4 hidden sm:inline-block"/>Security</TabsTrigger>
          <TabsTrigger value="tags"><Tag className="mr-2 h-4 w-4 hidden sm:inline-block"/>Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your general account preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input id="accountName" defaultValue="My Yabily Business" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc-5">
                    <SelectTrigger id="timezone" className="mt-1">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-8">(UTC-08:00) Pacific Time</SelectItem>
                      <SelectItem value="utc-5">(UTC-05:00) Eastern Time</SelectItem>
                      <SelectItem value="utc">(UTC+00:00) Coordinated Universal Time</SelectItem>
                      <SelectItem value="utc+5.5">(UTC+05:30) India Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language" className="mt-1">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Save Account Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-md font-medium text-foreground">Email Notifications</h3>
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                  <Label htmlFor="campaignUpdates" className="flex flex-col space-y-1">
                    <span>Campaign Updates</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      Receive email notifications about campaign status changes.
                    </span>
                  </Label>
                  <Switch id="campaignUpdates" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                  <Label htmlFor="billingAlerts" className="flex flex-col space-y-1">
                    <span>Billing Alerts</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      Get notified about invoices and payment issues.
                    </span>
                  </Label>
                  <Switch id="billingAlerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                  <Label htmlFor="newFeatures" className="flex flex-col space-y-1">
                    <span>New Features & Offers</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      Stay informed about product updates and special promotions.
                    </span>
                  </Label>
                  <Switch id="newFeatures" />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect Yabily with other services to enhance functionality.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="p-4 border-primary/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-md mr-3 dark:bg-green-800">
                           {/* Using an inline SVG for WhatsApp icon as a placeholder, lucide-react doesn't have it */}
                            <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.61 15.34 3.48 16.8L2 22L7.32 20.55C8.73 21.33 10.34 21.76 12.04 21.76C17.5 21.76 21.95 17.31 21.95 11.85C21.95 6.39 17.5 2 12.04 2ZM12.04 20.13C10.56 20.13 9.12 19.75 7.85 19.05L7.5 18.83L4.42 19.65L5.26 16.67L5.02 16.31C4.25 14.98 3.79 13.47 3.79 11.91C3.79 7.35 7.51 3.63 12.04 3.63C16.57 3.63 20.29 7.35 20.29 11.91C20.29 16.47 16.57 20.13 12.04 20.13ZM17.44 14.42C17.21 14.31 16.05 13.75 15.84 13.67C15.63 13.59 15.48 13.54 15.32 13.78C15.16 14.01 14.66 14.6 14.52 14.76C14.37 14.92 14.23 14.94 14 14.82C13.77 14.71 12.95 14.43 11.96 13.53C11.18 12.81 10.66 11.93 10.51 11.69C10.37 11.46 10.52 11.32 10.64 11.2L10.75 11.07C10.85 10.95 10.91 10.82 11 10.66C11.08 10.5 11.13 10.37 11.08 10.21C11.04 10.06 10.61 8.9 10.42 8.43C10.23 7.96 10.05 8.01 9.91 8.01C9.76 8.01 9.62 8 9.48 8C9.33 8 9.09 8.05 8.89 8.29C8.69 8.52 8.19 9 8.19 10.02C8.19 11.03 8.92 11.99 9.04 12.15C9.15 12.31 10.61 14.58 12.79 15.52C13.27 15.72 13.62 15.86 13.88 15.95C14.38 16.11 14.8 16.08 15.13 16.01C15.51 15.91 16.52 15.33 16.72 14.84C16.92 14.35 16.92 13.95 16.85 13.84C16.78 13.73 16.63 13.67 16.42 13.59L17.44 14.42V14.42Z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground">Meta (Facebook & WhatsApp)</h4>
                            {isMetaConnected ? (
                                <p className="text-sm text-muted-foreground">Connected: {connectedMetaAccountName}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground">Connect your WhatsApp Business account.</p>
                            )}
                        </div>
                    </div>
                    <Button variant={isMetaConnected ? "outline" : "default"} onClick={() => alert('Actual Meta connection flow would start here. This involves backend logic.')}>
                      {isMetaConnected ? "Manage Connection" : "Connect Account"}
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3 pl-1 flex items-center">
                  <Info className="h-3 w-3 mr-1"/> This integration requires backend setup to securely handle OAuth and API communications with Meta.
                </p>
              </Card>
              
              <Card className="p-4 opacity-70">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Globe className="w-6 h-6 text-primary mr-3"/>
                        <div>
                            <h4 className="font-semibold text-foreground">Generic Webhook</h4>
                            <p className="text-sm text-muted-foreground">For advanced users: Send campaign data to external URLs.</p>
                        </div>
                    </div>
                    <Button variant="outline" disabled>Configure (Coming Soon)</Button>
                </div>
              </Card>
              <Separator />
              <div className="flex justify-end">
                <Button disabled>Save Integration Settings</Button> 
                {/* Disabled as no direct saveable fields here, actions are per-integration */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Security & Privacy</CardTitle>
                    <CardDescription>Manage your account security and data privacy settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-md font-medium text-foreground">Password Management</h3>
                        <Button variant="outline" className="w-full md:w-auto">Change Password</Button>
                        
                        <h3 className="text-md font-medium text-foreground pt-4">Two-Factor Authentication (2FA)</h3>
                         <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                            <Label htmlFor="enable2fa" className="flex flex-col space-y-1">
                                <span>Enable 2FA</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                Add an extra layer of security to your account.
                                </span>
                            </Label>
                            <Switch id="enable2fa" />
                        </div>

                        <h3 className="text-md font-medium text-foreground pt-4">Data & Privacy</h3>
                         <Button variant="outline" className="w-full md:w-auto">Download My Data</Button>
                         <Button variant="destructive" className="w-full md:w-auto ml-0 mt-2 md:mt-0 md:ml-2">Delete My Account</Button>
                    </div>
                     <Separator />
                    <div className="flex justify-end">
                        <Button>Save Security Settings</Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="tags">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Manage Contact Tags</CardTitle>
              <CardDescription>Create and manage tags that can be applied to your contacts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Enter new tag name" 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                />
                <Button onClick={handleAddTag}><PlusCircle className="mr-2 h-4 w-4" /> Add Tag</Button>
              </div>
              <Separator />
              <div>
                <h3 className="text-md font-medium text-foreground mb-3">Existing Tags:</h3>
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-sm py-1 px-3 flex items-center group">
                        {tag}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 ml-1.5 opacity-50 group-hover:opacity-100 hover:bg-destructive/20"
                          onClick={() => handleRemoveTag(tag)}
                          aria-label={`Remove tag ${tag}`}
                        >
                          <XIcon className="h-3.5 w-3.5 text-destructive/70 group-hover:text-destructive" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tags created yet. Add some above!</p>
                )}
              </div>
               <Separator />
                <div className="flex justify-end">
                    <Button onClick={() => toast({ title: "Save Tags (Mock)", description: "In a real app, tags would be saved to a backend."})}>
                        Save Tag Changes
                    </Button>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </PageWrapper>
  );
}

