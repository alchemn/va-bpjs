import FooterHeader from "./footer/FooterHeader";
import ResourceLinks from "./footer/ResourceLinks";
import SupportLinks from "./footer/SupportLinks";
import SubFooter from "./footer/SubFooter";

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-slate-200">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <FooterHeader />
          <ResourceLinks />
          <SupportLinks />
        </div>
        <SubFooter />
      </div>
    </footer>
  );
}