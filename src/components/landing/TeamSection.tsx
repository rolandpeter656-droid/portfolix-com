import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, Github, Award } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const teamMember = {
  id: 1,
  name: "Roland Peter",
  role: "CEO & Founder",
  bio: "Building the first-of-its-kind AI investing recommendation platform with 5 years experience in stock investing with impressive returns and educating millions worldwide about investing and wealth through social media.",
  image: "roland-peter-headshot",
  achievements: [
    "5 years investing experience",
    "Self-taught investor with over 50 investing books read and counting", 
    "Educating millions about investing and wealth on social media"
  ],
  socials: {
    linkedin: "http://linkedin.com/in/peter-roland-289684344",
    x: "https://x.com/petr_roland"
  }
};

export const TeamSection = () => {
  return (
    <section id="team" className="relative py-12 sm:py-16 md:py-24 bg-background overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glass-blob glass-blob-cyan w-[400px] h-[400px] top-1/4 left-0 animate-blob-float opacity-10" />
        <div className="glass-blob glass-blob-blue w-[300px] h-[300px] bottom-1/4 right-0 animate-blob-float-delayed opacity-10" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <Badge className="mb-3 sm:mb-4 bg-warning/10 text-warning border-warning/20 text-xs sm:text-sm">
            Our Team
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans-bold text-foreground mb-4 sm:mb-6">
            Meet the Minds Behind
            <span className="text-gradient block mt-2">PortfoliX</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            PortfoliX was built by Roland Peter, one of the sharpest minds in modern investing. After studying 50+ investment books and mastering the principles that drive real wealth, he merged that knowledge with AI and live market data.
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mt-3 sm:mt-4 px-2">
            While currently building solo, Roland is assembling a world-class team of equally sharp minds — professionals who can merge financial intelligence, data science, and innovation.
          </p>
        </div>

        <div className="flex justify-center max-w-7xl mx-auto">
          <Card 
            className="group glass-card glass-glow-hover overflow-hidden w-full max-w-xs sm:max-w-sm"
          >
            <CardContent className="p-0">
              <div className="relative overflow-hidden">
                <img
                  src="/lovable-uploads/7695f634-65fb-45d3-801d-359be5d4a29b.png"
                  alt="Roland Peter — CEO & Founder, PortfoliX"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                    asChild
                  >
                    <a 
                      href={teamMember.socials.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </a>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                    asChild
                  >
                    <a 
                      href={teamMember.socials.x} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="X (formerly Twitter)"
                    >
                      <XIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-sans-bold text-foreground mb-1">
                  {teamMember.name}
                </h3>
                <p className="text-primary font-medium mb-2 sm:mb-3 text-sm sm:text-base">{teamMember.role}</p>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                  {teamMember.bio}
                </p>

                <div className="space-y-1.5 sm:space-y-2">
                  {teamMember.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-xs sm:text-sm flex-shrink-0">🏅</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Values */}
        <div className="mt-12 sm:mt-16 md:mt-20 text-center">
          <h3 className="text-lg sm:text-xl md:text-2xl font-sans-bold text-foreground mb-6 sm:mb-8">
            Our Values
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center glass-stat p-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 backdrop-blur-xl bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Award className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <h4 className="font-sans-bold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Excellence</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">
                We strive for the highest standards in everything we do.
              </p>
            </div>
            <div className="flex flex-col items-center glass-stat p-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 backdrop-blur-xl bg-success/10 border border-success/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Github className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-success" />
              </div>
              <h4 className="font-sans-bold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Innovation</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Pushing the boundaries of what's possible with AI and finance.
              </p>
            </div>
            <div className="flex flex-col items-center glass-stat p-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 backdrop-blur-xl bg-warning/10 border border-warning/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Linkedin className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-warning" />
              </div>
              <h4 className="font-sans-bold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Trust</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Building lasting relationships through transparency and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
