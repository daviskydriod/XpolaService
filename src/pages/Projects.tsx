// FILE PATH: src/pages/Projects.tsx
// Place this file at: src/pages/Projects.tsx

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CTASection from "../components/CTASection";
import { useCountry } from "../contexts/CountryContext";
import { Building2, Users, TrendingUp, CheckCircle } from "lucide-react";

const Projects = () => {
  const { currentData } = useCountry();

  // Sample projects - you can replace with real data
  const projects = [
    {
      title: "Energy Infrastructure Development",
      category: "Oil & Gas",
      description: "Large-scale infrastructure project delivering sustainable energy solutions",
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?auto=format&fit=crop&q=80&w=800",
      stats: { value: "$50M", label: "Project Value" },
      status: "Completed",
    },
    {
      title: "Commercial Trade Expansion",
      category: "Commerce",
      description: "Strategic trade partnerships connecting local businesses to global markets",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      stats: { value: "200+", label: "Partners" },
      status: "Ongoing",
    },
    {
      title: "Logistics Network Optimization",
      category: "Logistics",
      description: "Advanced supply chain solutions improving delivery efficiency by 40%",
      image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&q=80&w=800",
      stats: { value: "40%", label: "Efficiency Gain" },
      status: "Completed",
    },
    {
      title: "Mining Operations Modernization",
      category: "Mining",
      description: "Sustainable mining practices with state-of-the-art technology integration",
      image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&q=80&w=800",
      stats: { value: "15K", label: "Jobs Created" },
      status: "Ongoing",
    },
    {
      title: "Construction Excellence Program",
      category: "Construction",
      description: "Building modern infrastructure with focus on quality and sustainability",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
      stats: { value: "25+", label: "Projects" },
      status: "Completed",
    },
    {
      title: "Digital Commerce Platform",
      category: "E-commerce",
      description: "Transforming retail experiences through innovative digital solutions",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      stats: { value: "100K+", label: "Users" },
      status: "Ongoing",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background-secondary relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-montserrat font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Our Projects
            </h1>
            <p className="font-poppins text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Delivering excellence across diverse sectors with innovative solutions and sustainable practices
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-16 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <StatCard icon={Building2} value="150+" label="Projects Completed" />
            <StatCard icon={Users} value="50K+" label="Jobs Created" />
            <StatCard icon={TrendingUp} value="$2B+" label="Total Investment" />
            <StatCard icon={CheckCircle} value="98%" label="Success Rate" />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-extrabold text-3xl md:text-4xl text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="font-poppins text-lg text-muted-foreground">
              Showcasing our commitment to excellence and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
};

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}

const StatCard = ({ icon: Icon, value, label }: StatCardProps) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-3">
        <div className="icon-container">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="font-montserrat font-extrabold text-2xl md:text-3xl text-foreground mb-1">
        {value}
      </div>
      <div className="font-poppins text-sm text-muted-foreground">
        {label}
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: {
    title: string;
    category: string;
    description: string;
    image: string;
    stats: { value: string; label: string };
    status: string;
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-xl group">
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-poppins font-semibold ${
            project.status === 'Completed' 
              ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
              : 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="mb-3">
          <span className="text-xs font-poppins font-semibold text-primary uppercase tracking-wider">
            {project.category}
          </span>
        </div>
        <h3 className="font-montserrat font-bold text-lg text-foreground mb-3">
          {project.title}
        </h3>
        <p className="font-poppins text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Project Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="font-montserrat font-bold text-xl text-foreground">
              {project.stats.value}
            </div>
            <div className="font-poppins text-xs text-muted-foreground">
              {project.stats.label}
            </div>
          </div>
          <button className="text-primary font-poppins text-sm font-semibold hover:underline">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Projects;
