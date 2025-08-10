import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, Github, Award } from "lucide-react";

// X (Twitter) Icon Component
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
  image: "roland-peter-headshot", // Placeholder - will need actual image upload
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
    <section id="team" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-warning/10 text-warning border-warning/20">
            Our Team
          </Badge>
          <h2 className="text-4xl md:text-5xl font-sans-bold text-foreground mb-6">
            Meet the Minds Behind
            <span className="text-gradient block mt-2">PortfoliX</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our team combines decades of Wall Street experience with cutting-edge AI expertise to revolutionize portfolio management.
          </p>
        </div>

        <div className="flex justify-center max-w-7xl mx-auto">
          <Card 
            className="group bg-gradient-card border-border hover:shadow-card transition-all duration-500 hover-scale overflow-hidden max-w-sm"
          >
            <CardContent className="p-0">
              {/* Profile Image */}
              <div className="relative overflow-hidden">
                <img
                  src="/lovable-uploads/7695f634-65fb-45d3-801d-359be5d4a29b.png"
                  alt="Roland Peter — CEO & Founder, PortfoliX"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Social Links */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="h-8 w-8 p-0"
                    asChild
                  >
                    <a 
                      href={teamMember.socials.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="h-8 w-8 p-0"
                    asChild
                  >
                    <a 
                      href={teamMember.socials.x} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="X (formerly Twitter)"
                    >
                      <XIcon className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Member Info */}
              <div className="p-6">
                <h3 className="text-xl font-sans-bold text-foreground mb-1">
                  {teamMember.name}
                </h3>
                <p className="text-primary font-medium mb-3">{teamMember.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {teamMember.bio}
                </p>

                {/* Achievements */}
                <div className="space-y-2">
                  {teamMember.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm">🏅</span>
                      <span className="text-xs text-muted-foreground">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Values */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-sans-bold text-foreground mb-8">
            Our Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-sans-bold text-foreground mb-2">Excellence</h4>
              <p className="text-muted-foreground text-sm">
                We strive for the highest standards in everything we do.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <Github className="h-8 w-8 text-success" />
              </div>
              <h4 className="font-sans-bold text-foreground mb-2">Innovation</h4>
              <p className="text-muted-foreground text-sm">
                Pushing the boundaries of what's possible with AI and finance.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mb-4">
                <Linkedin className="h-8 w-8 text-warning" />
              </div>
              <h4 className="font-sans-bold text-foreground mb-2">Trust</h4>
              <p className="text-muted-foreground text-sm">
                Building lasting relationships through transparency and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};