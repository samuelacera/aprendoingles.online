import Hero from "@/components/Hero";
import TestNivel from "@/components/TestNivel";
import Stats from "@/components/Stats";
import WhyUs from "@/components/WhyUs";
import Courses from "@/components/Courses";
import Blog from "@/components/Blog";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "aprendoingles.online",
      url: "https://aprendoingles.online",
      description:
        "Cursos de inglés especializados por sector profesional para hispanohablantes.",
      inLanguage: "es",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://aprendoingles.online/cursos?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      name: "aprendoingles.online",
      url: "https://aprendoingles.online",
      description:
        "Plataforma de aprendizaje de inglés profesional especializado por sector.",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Stats />
      <Courses />
      <WhyUs />
      <TestNivel />
      <Blog />
      <FAQ />
      <CTA />
    </>
  );
}
