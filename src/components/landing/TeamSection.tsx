import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, Award, Lightbulb, Heart } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const teamMember = {
  id: 1,
  name: "Roland Peter",
  role: "CEO & Founder",
  bio: "Building the first-of-its-kind AI investing recommendation platform with 5 years experience in stock investing with impressive returns and educating millions worldwide about investing and wealth through social media.",
  achievements: [
    "5 years investing experience",
    "Self-taught investor with over 50 investing books read",
    "Educating millions about investing on social media"
  ],
  socials: {
    linkedin: "http://linkedin.com/in/peter-roland-289684344",
    x: "https://x.com/petr_roland"
  }
};

const values = [
  { icon: Award, title: "Excellence", description: "We strive for the highest standards in everything we do." },
  { icon: Lightbulb, title: "Innovation", description: "Pushing the boundaries of what's possible with AI and finance." },
  { icon: Heart, title: "Trust", description: "Building lasting relationships through transparency and reliability." },
];

export const TeamSection = () => {
  return (
    <section id="team" className="relative py-20 sm:py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-16">
          <Badge className="mb-5 bg-warning/10 text-warning border-warning/20 text-sm font-medium">
            Our Team
          </Badge>
          <h2 className="text-foreground mb-5">
            Meet the Mind Behind{" "}
            <span className="text-gradient">PortfoliX</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            PortfoliX was built by Roland Peter, one of the sharpest minds in modern investing. After studying 50+ investment books and mastering the principles that drive real wealth, he merged that knowledge with AI and live market data.
          </p>
        </div>

        {/* Team card */}
        <div className="flex justify-center max-w-7xl mx-auto mb-20 sm:mb-24">
          <div className="rounded-xl border border-border bg-card overflow-hidden w-full max-w-sm hover:border-primary/30 transition-all duration-300 hover-lift group">
            <div className="relative overflow-hidden">
              <img
                src="/lovable-uploads/7695f634-65fb-45d3-801d-359be5d4a29b.png"
                alt="Roland Peter — CEO & Founder, PortfoliX"
                className="w-full h-56 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />

              {/* Social links */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-card/80 backdrop-blur-sm border border-border hover:border-primary/30" asChild>
                  <a href={teamMember.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-card/80 backdrop-blur-sm border border-border hover:border-primary/30" asChild>
                  <a href={teamMember.socials.x} target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)">
                    <XIcon className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-foreground mb-1">{teamMember.name}</h3>
              <p className="text-primary font-medium mb-3 text-sm">{teamMember.role}</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{teamMember.bio}</p>
              <div className="space-y-2">
                {teamMember.achievements.map((achievement, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs flex-shrink-0">🏅</span>
                    <span className="text-xs text-muted-foreground">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Company Values */}
        <div className="text-center">
          <h3 className="text-foreground mb-10">Our Values</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {values.map((value, i) => (
              <div key={i} className="flex flex-col items-center p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{value.title}</h4>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
