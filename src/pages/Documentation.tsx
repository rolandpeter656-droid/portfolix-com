import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { DocumentationSidebar } from "@/components/DocumentationSidebar";
import { DocumentationContent } from "@/components/DocumentationContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Documentation = () => {
  const [activeSection, setActiveSection] = useState("getting-started-how-it-works");
  const navigate = useNavigate();

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
            <div className="mb-6 flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/")}
                className="bg-card/50 backdrop-blur-sm border-border hover:bg-card"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <SidebarTrigger />
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