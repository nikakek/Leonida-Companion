"use client";

import { StarIcon } from "@/components/Icons";

interface FavoriteButtonProps {
  title: string;
  active: boolean;
  onToggle: () => void;
}

export function FavoriteButton({ title, active, onToggle }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
      onClick={onToggle}
      className={`flex size-12 items-center justify-center rounded-full bg-bg/70 backdrop-blur-sm transition-colors duration-150 ${
        active ? "text-accent" : "text-fg hover:text-accent"
      }`}
    >
      <StarIcon filled={active} />
    </button>
  );
}
