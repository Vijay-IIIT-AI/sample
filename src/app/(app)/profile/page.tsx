
"use client";

import { PageWrapper } from "@/components/shared/page-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit3, FileArchive, ShieldCheck, Upload, Link as LinkIcon } from "lucide-react"; // Added LinkIcon
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link"; // Import Link for navigation

const mockUser = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatarUrl: "https://placehold.co/100x100.png",
  avatarHint: "user avatar",
  company: "Yabily Solutions",
  role: "Campaign Manager",
  phone: "+1 234 567 8900",
  address: "123 Main St, Anytown, USA"
};

const mockLoginHistory = [
  { id: "1", date: "2024-06-15 10:30 AM", ipAddress: "192.168.1.100", device: "Chrome on Windows", status: "Success" },
  { id: "2", date: "2024-06-14 05:22 PM", ipAddress: "203.0.113.45", device: "Safari on macOS", status: "Success" },
  { id: "3", date: "2024-06-13 09:00 AM", ipAddress: "198.51.100.12", device: "Mobile App on Android", status: "Failed Attempt" },
];

const mockPastReports = [
    { id: "report1", name: "Q1 Campaign Summary 2024", date: "2024-04-05", type: "PDF" },
    { id: "report2", name: "May Performance Review", date: "2024-06-01", type: "CSV" },
];

// Mock state - in a real app, this would come from user data/API
const isMetaConnected = true; 

export default function ProfilePage() {
  return (
    <PageWrapper title="User Profile" description="Manage your personal information and account settings.">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Information Card */}
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </div>
            <Button variant="outline" size="sm"><Edit3 className="mr-2 h-4 w-4"/>Edit Profile</Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} data-ai-hint={mockUser.avatarHint} />
                  <AvatarFallback>{mockUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-card border-2">
                  <Upload className="h-4 w-4"/>
                  <span className="sr-only">Upload new avatar</span>
                </Button>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{mockUser.name}</h2>
                <p className="text-muted-foreground">{mockUser.role} at {mockUser.company}</p>
              </div>
            </div>
            
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={mockUser.name} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={mockUser.email} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue={mockUser.phone} className="mt-1" />
              </div>
               <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue={mockUser.company} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue={mockUser.address} className="mt-1" />
              </div>
            </div>
            <div className="flex justify-end">
                <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* Security & Account Actions Card */}
        <div className="space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary" />Security & Connections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">Change Password</Button>
                    <Button variant="outline" className="w-full justify-start">Enable Two-Factor Authentication</Button>
                     <p className="text-xs text-muted-foreground pt-2">
                        Connect your WhatsApp Business Account via Meta to send campaigns.
                    </p>
                    <Link href="/settings?tab=integrations" passHref className="w-full">
                      <Button variant={isMetaConnected ? "outline" : "default"} className="w-full justify-start">
                        <LinkIcon className="mr-2 h-4 w-4"/>
                        {isMetaConnected ? "Manage Meta Connection" : "Connect WhatsApp Account"}
                      </Button>
                    </Link>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center"><FileArchive className="mr-2 h-5 w-5 text-primary" />Past Reports</CardTitle>
                <CardDescription>Download your previously generated reports.</CardDescription>
              </CardHeader>
              <CardContent>
                {mockPastReports.length > 0 ? (
                    <ul className="space-y-2">
                    {mockPastReports.map(report => (
                        <li key={report.id} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded-md">
                        <div>
                            <p className="font-medium text-foreground">{report.name} <span className="text-xs text-muted-foreground">({report.type})</span></p>
                            <p className="text-xs text-muted-foreground">Generated: {report.date}</p>
                        </div>
                        <Button variant="link" size="sm">Download</Button>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No past reports available.</p>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
      
      {/* Login History Card */}
      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle>Login History</CardTitle>
          <CardDescription>Recent login activity on your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLoginHistory.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                  <TableCell>{log.device}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === "Success" ? "default" : "destructive"} 
                           className={cn(log.status === "Success" && "bg-green-500 text-white")}>
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
