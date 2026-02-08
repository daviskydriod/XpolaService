// FILE PATH: src/components/common/TestimonialsSection.tsx
// Place this file at: src/components/common/TestimonialsSection.tsx

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCountry } from "@/contexts/CountryContext";
import client1 from "@/assets/client1.jpg";
import client2 from "@/assets/client2.jpg";
import client3 from "@/assets/client3.jpg";

const clientImages = [client1, client2, client3];

const TestimonialsSection = () => {
  const { currentData } = useCountry();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % currentData.testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentData.testimonials.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + currentData.testimonials.length) % currentData.testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % currentData.testimonials.length);
  };

  return (
    <section className="py-20 bg-background-secondary">
      {/* Top Divider */}
      <div className="section-divider mb-16" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-extrabold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="font-poppins text-lg text-muted-foreground">
            Trusted by businesses nationwide
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Cards Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {currentData.testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-4"
                >
                  <TestimonialCard testimonial={testimonial} image={clientImages[index % 3]} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center transition-all duration-300 hover:border-primary hover:bg-background-secondary"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center transition-all duration-300 hover:border-primary hover:bg-background-secondary"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-3 mt-8">
            {currentData.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary border-primary scale-125"
                    : "bg-border border-border hover:border-primary hover:scale-110"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: {
    quote: string;
    name: string;
    title: string;
    company: string;
    rating: number;
  };
  image: string;
}

const TestimonialCard = ({ testimonial, image }: TestimonialCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 md:p-10 relative transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-xl">
      {/* Quote Icon */}
      <div className="absolute top-8 left-8 text-6xl font-serif text-primary/15 leading-none">
        "
      </div>

      {/* Quote Text */}
      <p className="font-poppins text-[15px] md:text-base text-foreground italic leading-relaxed mb-8 pt-8 relative z-10">
        "{testimonial.quote}"
      </p>

      {/* Client Info */}
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full border-2 border-primary object-cover"
        />
        <div>
          <h4 className="font-montserrat font-bold text-base text-foreground">
            {testimonial.name}
          </h4>
          <p className="font-poppins text-sm text-muted-foreground">
            {testimonial.title}, {testimonial.company}
          </p>
        </div>
      </div>

      {/* Star Rating */}
      <div className="flex gap-1 mt-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-primary fill-primary" />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
