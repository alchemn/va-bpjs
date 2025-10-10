// import HeroSection from "./home/HeroSection";
import CategoriesSection from "./home/CategoriesSection";
// import WhyChooseUsSection from "./home/WhyChooseUsSection";
// import HowItWorksSection from "./home/HowItWorksSection";
// import ContactSection from "./home/ContactSection";

export default function Main() {
  return (
    <div className="w-full space-y-16">
      {/* <HeroSection /> */}
      <CategoriesSection />
      {/* <WhyChooseUsSection />
      <HowItWorksSection />
      <ContactSection /> */}
    </div>
  );
}