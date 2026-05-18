import AboutA1 from "./components/AboutA1";
import Banner from "./components/Banner";
import Carousel from "./components/carousel/Carousel";
import ContactTeam from "./components/ContactTeam";
import IspFaq from "./components/ispfaq/IspFaq";
import PromotionalBanner from "./components/PromotionalBanner";
import ServiceCardsGrid from "./components/ServiceCards";

export default function Home() {
  return (
    <>
      <Carousel />
      <ServiceCardsGrid />
      <AboutA1 />
      <IspFaq/>
      <PromotionalBanner />
      <ContactTeam />
      <Banner />
    </>
  );
}
