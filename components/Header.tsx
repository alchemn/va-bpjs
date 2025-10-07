import Logo from "./header/Logo";
import Navigation from "./header/Navigation";
import ActionButtons from "./header/ActionButtons";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sky-100/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Logo />
        <Navigation />
        <ActionButtons />
      </div>
    </header>
  );
}