import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export type HeroPath =
  | "/"
  | "/battle"
  | "/roster"
  | "/leaderboard"
  | "/login"
  | "/register";

export type HeroAction = {
  label: string;
  variant?: "primary" | "ghost";
} & (
  | { to: HeroPath; href?: never }
  | { href: string; to?: never }
);

export type HeroStat = { value: string; label: string };

export type HeroImage = { src: string; alt: string };

export type HeroProps = {
  eyebrow?: string;
  title: string[];
  text?: string;
  image?: HeroImage;
  actions?: HeroAction[];
  stats?: HeroStat[];
  footer?: ReactNode;
  className?: string;
};

const actionStyles: Record<NonNullable<HeroAction["variant"]>, string> = {
  primary: "brut press bg-primary px-5 py-3 font-bold text-primary-foreground",
  ghost: "brut press bg-card px-5 py-3 font-bold",
};

function HeroEyebrow({ children }: { children: string }) {
  return (
    <span className="brut-sm inline-block bg-foreground px-3 py-1 font-pixel text-[10px] uppercase text-background">
      {children}
    </span>
  );
}

function HeroTitle({ lines }: { lines: string[] }) {
  return (
    <h1 className="mt-4 font-pixel text-2xl leading-relaxed md:text-4xl">
      {lines.map((line, i) => (
        <span key={i} className={i === lines.length - 1 ? "text-primary" : undefined}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </h1>
  );
}

function HeroActions({ items }: { items: HeroAction[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {items.map((a) => {
        const className = actionStyles[a.variant ?? "ghost"];
        return a.to ? (
          <Link
            key={a.to}
            to={a.to}
            className={className}
          >
            {a.label}
          </Link>
        ) : (
          <a key={a.href} href={a.href} className={className}>
            {a.label}
          </a>
        );
      })}
    </div>
  );
}

function HeroStats({ items }: { items: HeroStat[] }) {
  return (
    <dl className="mt-8 flex flex-wrap gap-3">
      {items.map((s) => (
        <div key={s.label} className="brut-sm bg-card px-4 py-2">
          <dd className="font-pixel text-sm">{s.value}</dd>
          <dt className="mt-1 text-xs uppercase text-muted-foreground">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}

function HeroArt({ image }: { image: HeroImage }) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      className="animate-float hidden w-56 drop-shadow-[6px_6px_0_var(--color-border)] md:block"
    />
  );
}

export function Hero({
  eyebrow,
  title,
  text,
  image,
  actions = [],
  stats = [],
  footer,
  className = "",
}: HeroProps) {
  return (
    <section className={`brut mb-10 grid items-center gap-6 bg-accent p-8 md:grid-cols-[1fr_auto] ${className}`}>
      <div>
        {eyebrow && <HeroEyebrow>{eyebrow}</HeroEyebrow>}
        <HeroTitle lines={title} />
        {text && <p className="mt-4 max-w-md text-lg">{text}</p>}
        <HeroActions items={actions} />
        {footer && <div className="mt-4">{footer}</div>}
        {stats.length > 0 && <HeroStats items={stats} />}
      </div>
      {image && <HeroArt image={image} />}
    </section>
  );
}

export default Hero;