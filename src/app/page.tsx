import SpotlightHero from "@/components/SpotlightHero";
import Capabilities from "@/components/landing/Capabilities";

// Landing page: full-screen X-ray spotlight hero, then the liquid-glass
// capabilities section. More scroll sections to come.
export default function Home() {
  return (
    <main className="bg-black">
      <SpotlightHero />
      <Capabilities />
    </main>
  );
}
