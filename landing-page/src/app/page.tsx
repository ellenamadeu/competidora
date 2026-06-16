import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Competidora Vidros",
    "image": "https://vidroscompetidora.com.br/logo.png",
    "@id": "https://vidroscompetidora.com.br",
    "url": "https://vidroscompetidora.com.br",
    "telephone": "+552141077451",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Nossa Senhora da Penha, 220",
      "addressLocality": "Rio de Janeiro",
      "addressRegion": "RJ",
      "postalCode": "21070-300",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -22.8354,
      "longitude": -43.2764
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/vidroscompetidora/",
      "https://www.instagram.com/competidora.vidros",
      "https://www.youtube.com/@competidora.vidros"
    ]
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-dark-900 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex flex-col flex-1 w-full mx-auto">
        <HeroSection />
        <FeaturesSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
