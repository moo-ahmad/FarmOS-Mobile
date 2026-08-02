import { Text } from './text';

/** Red uppercase micro-kicker sat above a title or hero figure. */
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="kicker" tone="accent">
      {children}
    </Text>
  );
}

/** Muted uppercase micro-label above a value group. */
export function MicroLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="micro" tone="muted">
      {children}
    </Text>
  );
}

export interface HeroFigureProps {
  children: React.ReactNode;
  /** Render in the red accent (the one key figure per screen). */
  accent?: boolean;
  /** 44px instead of 38px. */
  large?: boolean;
  className?: string;
}

/** The single large figure a screen is built around. */
export function HeroFigure({
  children,
  accent = false,
  large = false,
  className,
}: HeroFigureProps) {
  return (
    <Text
      variant={large ? 'hero-lg' : 'hero'}
      tone={accent ? 'accent' : 'default'}
      className={className}
    >
      {children}
    </Text>
  );
}
