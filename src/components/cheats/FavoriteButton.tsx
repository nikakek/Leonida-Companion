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
      data-tooltip={active ? "Unstar" : "Star"}
      onClick={onToggle}
      className={`icon-btn ${
        active
          ? "border-accent/50 bg-accent/10 text-accent shadow-[0_0_16px_-6px_rgba(255,77,157,0.7)] hover:text-accent"
          : "hover:text-accent"
      }`}
    >
      <StarIcon filled={active} size={20} />
    </button>
  );
}
