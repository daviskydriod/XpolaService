// FILE PATH: src/components/common/TeamSection.tsx
// Place this file at: src/components/common/TeamSection.tsx

import { Linkedin, Mail } from "lucide-react";

const teamMembers = [
  {
    name: "John Adetola",
    role: "Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    bio: "20+ years of experience in energy and consulting sectors",
    linkedin: "#",
    email: "john@xpola.com",
  },
  {
    name: "Sarah Johnson",
    role: "Chief Operating Officer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    bio: "Expert in logistics and supply chain optimization",
    linkedin: "#",
    email: "sarah@xpola.com",
  },
  {
    name: "Michael Chen",
    role: "Chief Technology Officer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    bio: "Leading digital transformation and innovation",
    linkedin: "#",
    email: "michael@xpola.com",
  },
  {
    name: "Amina Ibrahim",
    role: "Head of Business Development",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    bio: "Driving strategic partnerships and growth",
    linkedin: "#",
    email: "amina@xpola.com",
  },
];

const TeamSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="section-divider mb-16" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-extrabold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Meet Our Leadership
          </h2>
          <p className="font-poppins text-lg text-muted-foreground max-w-2xl mx-auto">
            Experienced professionals dedicated to delivering excellence
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>

        {/* Join Team CTA */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8">
            <h3 className="font-montserrat font-bold text-xl text-foreground mb-3">
              Join Our Team
            </h3>
            <p className="font-poppins text-sm text-muted-foreground mb-6">
              We're always looking for talented individuals to join our growing team
            </p>
            <a
              href="#careers"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-montserrat font-bold text-sm rounded-xl border-2 border-primary transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

interface TeamMemberCardProps {
  member: {
    name: string;
    role: string;
    image: string;
    bio: string;
    linkedin: string;
    email: string;
  };
}

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-xl group">
      {/* Member Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Social Links Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-3">
          <a
            href={member.linkedin}
            className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300 hover:bg-primary hover:border-primary"
          >
            <Linkedin className="w-5 h-5 text-white" />
          </a>
          <a
            href={`mailto:${member.email}`}
            className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300 hover:bg-primary hover:border-primary"
          >
            <Mail className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>

      {/* Member Info */}
      <div className="p-6">
        <h3 className="font-montserrat font-bold text-lg text-foreground mb-1">
          {member.name}
        </h3>
        <p className="font-poppins text-sm text-primary font-semibold mb-3">
          {member.role}
        </p>
        <p className="font-poppins text-sm text-muted-foreground">
          {member.bio}
        </p>
      </div>
    </div>
  );
};

export default TeamSection;
