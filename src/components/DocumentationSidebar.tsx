import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, Package, HelpCircle, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    subsections: [
      { id: "how-it-works", title: "How PortfoliX Works" },
      { id: "quick-start", title: "Quick Start Guide" },
      { id: "account-setup", title: "Account Setup" },
    ]
  },
  {
    id: "packages",
    title: "Investment Packages",
    icon: Package,
    subsections: [
      { id: "retirement", title: "Retirement Package" },
      { id: "high-growth", title: "High-Growth Package" },
      { id: "passive-income", title: "Passive Income Package" },
    ]
  },
  {
    id: "faq",
    title: "FAQ",
    icon: HelpCircle,
    subsections: [
      { id: "general", title: "General Questions" },
      { id: "investing", title: "Investing Questions" },
      { id: "account", title: "Account & Billing" },
    ]
  }
];

interface DocumentationSidebarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export function DocumentationSidebar({ activeSection, onSectionChange }: DocumentationSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "getting-started": true,
    "packages": true,
    "faq": true,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const isSubsectionActive = (sectionId: string, subsectionId: string) => {
    return activeSection === `${sectionId}-${subsectionId}`;
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <h2 className={`font-bold text-lg ${collapsed ? "hidden" : "block"}`}>
            Documentation
          </h2>
        </div>

        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections[section.id];

          return (
            <SidebarGroup key={section.id}>
              <SidebarGroupLabel 
                className="cursor-pointer hover:bg-muted/50 rounded-md px-2 py-1 flex items-center justify-between"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {!collapsed && <span>{section.title}</span>}
                </div>
                {!collapsed && (
                  <ChevronRight 
                    className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} 
                  />
                )}
              </SidebarGroupLabel>

              {isExpanded && !collapsed && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.subsections.map((subsection) => {
                      const subsectionId = `${section.id}-${subsection.id}`;
                      const isActive = isSubsectionActive(section.id, subsection.id);

                      return (
                        <SidebarMenuItem key={subsection.id}>
                          <SidebarMenuButton 
                            onClick={() => onSectionChange(subsectionId)}
                            className={`ml-4 ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
                          >
                            <span>{subsection.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}