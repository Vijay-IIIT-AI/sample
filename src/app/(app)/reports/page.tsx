
"use client";

import { PageWrapper } from "@/components/shared/page-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, BarChart as BarChartIcon, CheckCircle, Percent, CalendarDays, MessageCircle, MousePointerClick, Eye, Users } from "lucide-react"; // Renamed BarChart to BarChartIcon to avoid conflict
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line } from "recharts"; // Removed ResponsiveContainer as ChartContainer handles it
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const overallStats = {
  totalCampaigns: 28,
  totalMessagesSent: 135600,
  overallDeliveryRate: 93.5,
  overallOpenRate: 65.2, 
  overallCTR: 15.8,      
  overallEngagementRate: 25.3, 
};

const campaignPerformanceData = [
  { date: "2024-05-01", delivered: 4500, failed: 300, sent: 4800 },
  { date: "2024-05-08", delivered: 4200, failed: 250, sent: 4450 },
  { date: "2024-05-15", delivered: 5100, failed: 150, sent: 5250 },
  { date: "2024-05-22", delivered: 4800, failed: 200, sent: 5000 },
  { date: "2024-05-29", delivered: 5500, failed: 100, sent: 5600 },
  { date: "2024-06-05", delivered: 5200, failed: 180, sent: 5380 },
  { date: "2024-06-12", delivered: 5800, failed: 120, sent: 5920 },
];

const chartConfig: ChartConfig = {
  delivered: { label: "Delivered", color: "hsl(var(--chart-2))" },
  failed: { label: "Failed", color: "hsl(var(--destructive))" },
  sent: { label: "Sent", color: "hsl(var(--chart-1))" },
};

const mockCampaignReports = [
  { id: "1", name: "Summer Sale 2024", sent: 25000, delivered: 24500, failed: 500, deliveryRate: 98.0, openRate: 75.5, ctr: 20.2, engagementRate: 30.0, cost: 10000.50, status: "Completed" },
  { id: "2", name: "New Product X Launch", sent: 15000, delivered: 13800, failed: 1200, deliveryRate: 92.0, openRate: 60.1, ctr: 12.5, engagementRate: 18.5, cost: 6200.00, status: "Active" },
  { id: "3", name: "Feedback Survey Q2", sent: 5000, delivered: 4500, failed: 500, deliveryRate: 90.0, openRate: 55.0, ctr: 8.0, engagementRate: 15.0, cost: 2000.00, status: "Completed" },
  { id: "4", name: "Weekly Deals", sent: 8000, delivered: 7800, failed: 200, deliveryRate: 97.5, openRate: 70.0, ctr: 18.0, engagementRate: 22.0, cost: 3300.00, status: "Paused" },
];

export default function ReportsPage() {
  const { toast } = useToast();

  const handleViewDetails = (campaignName: string) => {
    toast({
      title: "View Details (Mock Action)",
      description: `Displaying details for "${campaignName}". This is a mock and would navigate to a detailed report page.`,
    });
  };
  
  const getRateBadgeClass = (rate: number) => {
    if (rate >= 95 || rate >= 70) return "bg-green-500 text-white hover:bg-green-600";
    if (rate >= 85 || rate >= 50) return "bg-yellow-500 text-white hover:bg-yellow-600";
    return "bg-red-500 text-white hover:bg-red-600";
  };


  return (
    <PageWrapper
      title="Reports & Analytics"
      description="Detailed insights into your campaign performance."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline"><CalendarDays className="mr-2 h-4 w-4" /> Filter by Date (Coming Soon)</Button>
          <Button><Download className="mr-2 h-4 w-4" /> Export All Reports</Button>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="shadow-lg xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle>
            <BarChartIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overallStats.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">+5 since last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages Sent</CardTitle>
            <MessageCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overallStats.totalMessagesSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivery Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overallStats.overallDeliveryRate}%</div>
            <p className="text-xs text-muted-foreground">Avg. success rate</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overallStats.overallOpenRate}%</div>
            <p className="text-xs text-muted-foreground">Avg. open rate</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Click-Through Rate</CardTitle>
            <MousePointerClick className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overallStats.overallCTR}%</div>
            <p className="text-xs text-muted-foreground">Avg. CTR</p>
          </CardContent>
        </Card>
         <Card className="shadow-lg xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overallStats.overallEngagementRate}%</div>
            <p className="text-xs text-muted-foreground">Avg. engagement</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle>Message Delivery Trends</CardTitle>
          <CardDescription>Weekly overview of sent, delivered, and failed messages.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] p-2">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ComposedChart data={campaignPerformanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false}/>
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Legend />
              <Bar dataKey="sent" fill="var(--color-sent)" radius={[4, 4, 0, 0]} barSize={20} />
              <Line type="monotone" dataKey="delivered" stroke="var(--color-delivered)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="failed" stroke="var(--color-failed)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-6">
        <CardHeader>
          <CardTitle>Individual Campaign Reports</CardTitle>
          <CardDescription>Performance breakdown for each campaign.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Delivered</TableHead>
                <TableHead className="text-right">Delivery Rate</TableHead>
                <TableHead className="text-right">Open Rate</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Engagement</TableHead>
                <TableHead className="text-right">Cost (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaignReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell className="text-right">{report.sent.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{report.delivered.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={cn(getRateBadgeClass(report.deliveryRate))}>
                        {report.deliveryRate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                   <TableCell className="text-right">
                    <Badge className={cn(getRateBadgeClass(report.openRate))}>
                        {report.openRate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={cn(getRateBadgeClass(report.ctr))}>
                        {report.ctr.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className={cn(getRateBadgeClass(report.engagementRate))}>
                        {report.engagementRate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">₹{report.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === "Active" ? "default" : report.status === "Completed" ? "outline" : "secondary"}
                           className={cn(
                            report.status === "Active" && "bg-blue-500 text-white hover:bg-blue-600",
                            report.status === "Completed" && "bg-green-500 text-white hover:bg-green-600",
                            report.status === "Paused" && "bg-yellow-500 text-white hover:bg-yellow-600"
                           )}>
                        {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" size="sm" onClick={() => handleViewDetails(report.name)}>View Details</Button>
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
