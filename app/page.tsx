import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Founder from "@/components/Founder";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";
import {
  getPortfolioItems,
  getLogo,
  getFounderPhoto,
} from "@/lib/assets";
import { site } from "@/lib/site";

// Assets are scanned from the filesystem at build time.
export const dynamic = "force-static";

export default function Home() {
  const items = getPortfolioItems();
  const logo = getLogo();
  const founderPhoto = getFounderPhoto();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon-512.png`,
    image: `${site.url}/og-image.png`,
    email: site.contact.email,
    founder: { "@type": "Person", name: site.founder.name },
    description: site.subheadline,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar logo={logo} />
      <main>
        <Hero />
        <Portfolio items={items} />
        <Founder photo={founderPhoto} />
        <Services />
        <Process />
        <Booking />
      </main>
      <Footer logo={logo} />
    </>
  );
}
