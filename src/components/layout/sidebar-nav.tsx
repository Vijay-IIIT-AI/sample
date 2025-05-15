
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  FileText,
  BarChart3,
  UserCircle,
  Settings,
  CreditCard,
  Users2, // Added Users2 for Contacts
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/contacts", label: "Contacts", icon: Users2 }, // Added Contacts item
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/billing", label: "Billing", icon: CreditCard }, 
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { open } = useSidebar(); // Get sidebar state

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild={false} // Ensure it's a button for tooltip to work properly
              isActive={pathname.startsWith(item.href)}
              tooltip={item.label}
              className={cn(
                "justify-start",
                !open && "px-2" // Adjust padding when collapsed for icon only display
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={cn("truncate", !open && "sr-only")}>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

    