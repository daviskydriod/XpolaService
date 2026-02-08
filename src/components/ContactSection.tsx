import { Mail, Phone, Clock, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import { useCountry } from "@/contexts/CountryContext";

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

const ContactSection = () => {
  const { currentData } = useCountry();

  const contactCards = [
    {
      icon: Mail,
      label: "Email Us",
      lines: currentData.contact.email,
    },
    {
      icon: Phone,
      label: "Call Us",
      lines: currentData.contact.phone,
    },
    {
      icon: Clock,
      label: "Office Hours",
      lines: currentData.contact.hours,
    },
  ];

  return (
    <section id="contact" className="py-20 bg-background-secondary">
      <div className="section-divider mb-16" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-extrabold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="font-poppins text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help. Reach out for partnerships, inquiries, or service requests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {contactCards.map((card, index) => (
            <ContactCard key={index} card={card} />
          ))}
        </div>

        <div className="flex justify-center gap-4">
          {socialLinks.map((social, index) => (
            
              key={index}
              href={social.href}
              aria-label={social.label}
              className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center transition-all duration-300 hover:border-primary hover:bg-background-secondary hover:-translate-y-0.5 group"
            >
              <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

interface ContactCardProps {
  card: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    lines: string[];
  };
}

const ContactCard = ({ card }: ContactCardProps) => {
  const Icon = card.icon;

  return (
    <div className="bg-card border border-border rounded-2xl p-8 text-center flex flex-col items-center transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-xl">
      <div className="icon-container mb-5">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-montserrat font-bold text-base text-foreground uppercase tracking-wider mb-3">
        {card.label}
      </h3>
      <div className="space-y-1">
        {card.lines.map((line, index) => (
          <p key={index} className="font-poppins text-sm text-muted-foreground">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ContactSection;
