import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Github, Award } from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "Alex Chen",
    role: "CEO & Co-Founder",
    bio: "Former Goldman Sachs VP with 15+ years in quantitative trading. PhD in Computer Science from MIT.",
    image: "photo-1472099645785-5658abf4ff4e",
    achievements: ["MIT PhD", "Ex-Goldman Sachs", "15+ Years Trading"],
    socials: {
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    id: 2,
    name: "Dr. Maria Santos",
    role: "CTO & Co-Founder",
    bio: "AI research scientist with expertise in machine learning and financial modeling. Former Google DeepMind engineer.",
    image: "photo-1580489944761-15a19d654956",
    achievements: ["Google DeepMind", "AI Research", "10+ Papers Published"],
    socials: {
      linkedin: "#",
      github: "#"
    }
  },
  {
    id: 3,
    name: "James Wilson",
    role: "Head of Product",
    bio: "Product leader with experience scaling fintech platforms. Previously led product at Robinhood and Coinbase.",
    image: "photo-1560250097-0b93528c311a",
    achievements: ["Ex-Robinhood", "Ex-Coinbase", "Product Expert"],
    socials: {
      linkedin: "#",
      twitter: "#"
    }
  },
  {
    id: 4,
    name: "Dr. Priya Patel",
    role: "Head of Research",
    bio: "Quantitative researcher specializing in portfolio optimization. Former hedge fund manager at Two Sigma.",
    image: "photo-1573496359142-b8d87734a5a2",
    achievements: ["Ex-Two Sigma", "Quant Research", "Portfolio Theory"],
    socials: {
      linkedin: "#",
      twitter: "#"
    }
  }
];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card 
              key={member.id}
              className="group bg-gradient-card border-border hover:shadow-card transition-all duration-500 hover-scale overflow-hidden"
            >
              <CardContent className="p-0">
                {/* Profile Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${member.image}?auto=format&fit=crop&w=400&q=80`}
                    alt={member.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Social Links */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {member.socials.linkedin && (
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    )}
                    {member.socials.twitter && (
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    )}
                    {member.socials.github && (
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Github className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6">
                  <h3 className="text-xl font-sans-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>

                  {/* Achievements */}
                  <div className="space-y-2">
                    {member.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Award className="h-3 w-3 text-warning flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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