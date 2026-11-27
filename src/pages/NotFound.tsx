import { useEffect } from "react";
import Hero from "../components/Hero";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 — PokéArena";
  }, []);

  return (
    <Hero
      className="mx-auto max-w-4xl"
      eyebrow="Error 404"
      title={["A wild 404", "appeared!"]}
      text="This page ran away. The link may be outdated, or the page never existed. Head back to the arena and try again."
      image={{ src: "/pokeball.webp", alt: "Pokéball" }}
      actions={[
        { to: "/", label: "Back to Home", variant: "primary" },
        { to: "/leaderboard", label: "Leaderboard", variant: "ghost" },
      ]}
    />
  );
}
