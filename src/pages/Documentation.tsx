import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { DocumentationSidebar } from "@/components/DocumentationSidebar";
import { DocumentationContent } from "@/components/DocumentationContent";

const Documentation = () => {
  const [activeSection, setActiveSection] = useState("getting-started-how-it-works");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full pt-16">
          <DocumentationSidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          
          <main className="flex-1 p-8">
            <div className="mb-6">
              <SidebarTrigger className="mb-4" />
            </div>
            
            <DocumentationContent activeSection={activeSection} />
          </main>
        </div>
      </SidebarProvider>
      
      <Footer />
    </div>
  );
};

export default Documentation;