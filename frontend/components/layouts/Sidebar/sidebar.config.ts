import type { LucideIcon } from "lucide-react";
import {
  Home,
  CalendarIcon,
  Users,
  Building2,
  Cog,
  MessageSquare,
  BarChart3,
  Settings2,
} from "lucide-react";

export type SidebarChild = {
  key: string;
  label: string;
  href?: string;
  children?: { key: string; label: string; href: string }[];
};

export type RouteItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: SidebarChild[];
};

/** Maps route key to Next.js path for sidebar links and active detection */
export const ROUTE_KEY_TO_PATH: Record<string, string> = {
  dashboard: "/dashboard",
  "property-calendar": "/calendar/property",
  "staff-calendar": "/calendar/staff",
  "owner-prospects": "/leads/owner-prospects",
  "lease-prospects": "/leads/lease-prospects",
  "owners-contact": "/contacts/owners",
  "tenants-contact": "/contacts/tenants",
  "vendors-contact": "/contacts/vendors",
  "property-technician-contact": "/contacts/property-technicians",
  "leasing-agent-contact": "/contacts/leasing-agents",
  "all-properties": "/properties",
  "property-groups": "/properties/groups",
  processes: "/operations/processes",
  projects: "/operations/projects",
  automations: "/operations/automations",
  messages: "/messages",
  reports: "/reports",
  "user-roles": "/settings/staff",
  "stages-owners": "/settings/stages/owners",
  "stages-tenants": "/settings/stages/tenants",
  "template-management": "/settings/templates",
  "property-tags": "/settings/property-tags",
  "custom-fields": "/settings/custom-fields",
};

function href(key: string): string {
  return ROUTE_KEY_TO_PATH[key] ?? `/${key}`;
}

export const ROUTES: RouteItem[] = [
  { key: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
  {
    key: "calendar",
    label: "Calendar",
    icon: CalendarIcon,
    children: [
      {
        key: "property-calendar",
        label: "Property Calendar",
        href: href("property-calendar"),
      },
      {
        key: "staff-calendar",
        label: "Staff Calendar",
        href: href("staff-calendar"),
      },
    ],
  },
  {
    key: "leads",
    label: "Leads",
    icon: Users,
    children: [
      { key: "owner-prospects", label: "Owner Prospects", href: href("owner-prospects") },
      { key: "lease-prospects", label: "Lease Prospects", href: href("lease-prospects") },
    ],
  },
  {
    key: "contacts",
    label: "Contacts",
    icon: Users,
    children: [
      { key: "owners-contact", label: "Owners", href: href("owners-contact") },
      {
        key: "tenants-contact",
        label: "Tenants",
        href: href("tenants-contact"),
      },
      {
        key: "vendors-contact",
        label: "Vendors",
        href: href("vendors-contact"),
      },
      {
        key: "property-technician-contact",
        label: "Property Technician",
        href: href("property-technician-contact"),
      },
      {
        key: "leasing-agent-contact",
        label: "Leasing Agent",
        href: href("leasing-agent-contact"),
      },
    ],
  },
  {
    key: "properties",
    label: "Properties",
    icon: Building2,
    children: [
      {
        key: "all-properties",
        label: "All Properties",
        href: href("all-properties"),
      },
      {
        key: "property-groups",
        label: "Property Groups",
        href: href("property-groups"),
      },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    icon: Cog,
    children: [
      { key: "processes", label: "Processes", href: href("processes") },
      { key: "projects", label: "Projects", href: href("projects") },
      { key: "automations", label: "Automations", href: href("automations") },
    ],
  },
  {
    key: "messages",
    label: "Messages",
    icon: MessageSquare,
    href: "/messages",
  },
  { key: "reports", label: "Reports", icon: BarChart3, href: "/reports" },
  {
    key: "settings",
    label: "Settings",
    icon: Settings2,
    children: [
      {
        key: "user-roles",
        label: "Staff Management",
        href: href("user-roles"),
      },
      {
        key: "stages",
        label: "Stages",
        children: [
          {
            key: "stages-owners",
            label: "Owners",
            href: href("stages-owners"),
          },
          {
            key: "stages-tenants",
            label: "Lease Prospects",
            href: href("stages-tenants"),
          },
        ],
      },
      {
        key: "template-management",
        label: "Template Management",
        href: href("template-management"),
      },
      {
        key: "property-tags",
        label: "Property Tags",
        href: href("property-tags"),
      },
      {
        key: "custom-fields",
        label: "Custom Fields",
        href: href("custom-fields"),
      },
    ],
  },
];
