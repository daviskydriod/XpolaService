// FILE PATH: src/components/common/PartnersSection.tsx
// Place this file at: src/components/common/PartnersSection.tsx

import { useCountry } from "@/contexts/CountryContext";

// You can replace these with actual partner logos
const partnerLogos = [
  { name: "Partner 1", logo: "https://via.placeholder.com/150x60/666/fff?text=Partner+1" },
  { name: "Partner 2", logo: "https://via.placeholder.com/150x60/666/fff?text=Partner+2" },
  { name: "Partner 3", logo: "https://via.placeholder.com/150x60/666/fff?text=Partner+3" },
  { name: "Partner 4", logo: "https://via.placeholder.com/150x60/666/fff?text=Partner+4" },
  { name: "Partner 5", logo: "https://via.placeholder.com/150x60/666/fff?text=Partner+5" },
  { name: "Partner 6", logo: "https://via.placeholder.com/150x60/666/fff?text=Partner+6" },
  { name: "Partner 7", logo: "https://via.placeholder.com/150x60/666/fff?text=Partner+7" },
  { name: "Partner 8", logo: "https://via.placeholder.com/150x60/666/fff?text=Partner+8" },
];

const PartnersSection = () => {
  const { currentData } = useCountry();

  return (
    <section className="py-20 bg-background-secondary">
      <div className="section-divider mb-16" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-extrabold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Our Trusted Partners
          </h2>
          <p className="font-poppins text-lg text-muted-foreground max-w-2xl mx-auto">
            Collaborating with industry leaders to deliver exceptional results
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {partnerLogos.map((partner, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 flex items-center justify-center transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-xl group"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full h-auto opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
              />
            </div>
          ))}
        </div>

        {/* Partnership CTA */}
        <div className="text-center mt-12">
          <p className="font-poppins text-base text-muted-foreground mb-6">
            Interested in partnering with us?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-transparent text-primary border-2 border-primary font-montserrat font-bold text-sm rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Become a Partner
          </a>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
