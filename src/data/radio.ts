// Update this file after launch; set status to confirmed only when verified in-game or from an official Rockstar source.
// Verify against Rockstar's official music page before launch.
// Tracks are a PREVIEW SAMPLE of each station (about 3 each), not full playlists. More stations are expected.

import type { Verifiable } from "@/lib/types";

export interface Host {
  persona: string;
  voicedBy?: string;
  note?: string;
}

export interface Track extends Verifiable {
  artist: string;
  title: string;
}

export interface Station extends Verifiable {
  slug: string;
  name: string;
  genre: string;
  accent: string;
  hosts: Host[];
  /** Station-level note about hosts, e.g. unconfirmed voice assignments. */
  hostsNote?: string;
  tracks: Track[];
}

const VERIFIED = "2026-11-17";

const track = (artist: string, title: string, status: Track["status"]): Track => ({
  artist,
  title,
  status,
  lastVerified: VERIFIED,
});

export const stations: Station[] = [
  {
    slug: "cocoteo-fm",
    name: "Cocoteo FM",
    genre: "Modern Latin: bachata, merengue, dembow, reggaeton",
    accent: "#FF7A1A",
    hosts: [{ persona: "El Martillo" }, { persona: "La Gata" }],
    hostsNote:
      "Voiced by Bad Bunny and RaiNao. Which voice plays which persona is not confirmed.",
    tracks: [
      track("Bad Bunny", "EoO", "confirmed"),
      track("Axel Rulay ft. Farruko & El Alfa", "Si Es Trucho Es Trucho (Remix)", "confirmed"),
      track("Romeo Santos & El Chaval de la Bachata", "Canalla", "confirmed"),
    ],
    status: "confirmed",
    lastVerified: VERIFIED,
    sourceUrl: "", // TODO: add Rockstar music page URL
  },
  {
    slug: "flash-fm",
    name: "Flash FM",
    genre: "Pop",
    accent: "#FF2E93",
    hosts: [
      { persona: "Robyn" },
      { persona: "Alex Consani", note: "Surname to be verified against Rockstar's page." },
    ],
    tracks: [
      track("Charli xcx", "Good Ones", "confirmed"),
      track("MGMT", "Electric Feel", "confirmed"),
      track("Zara Larsson & PinkPantheress", "Midnight Sun (Girls Trip)", "confirmed"),
    ],
    status: "confirmed",
    lastVerified: VERIFIED,
    sourceUrl: "", // TODO: add Rockstar music page URL
  },
  {
    slug: "back-country-radio",
    name: "Back Country Radio",
    genre: "Renegade country",
    accent: "#D9A441",
    hosts: [
      { persona: "MW", voicedBy: "Morgan Wallen" },
      { persona: "Delta Dawne", voicedBy: "Lana Del Rey" },
      { persona: "Mud Dog Mike", voicedBy: "Jeremy Dufrene", note: "Reporter. From secondary sources." },
    ],
    tracks: [
      track("David Allan Coe", "Need a Little Time Off for Bad Behavior", "confirmed"),
      track("Loretta Lynn", "Don't Come Home A-Drinkin' (With Lovin' On Your Mind)", "confirmed"),
      track("Hank Williams Jr. & Waylon Jennings", "The Conversation", "confirmed"),
    ],
    status: "confirmed",
    lastVerified: VERIFIED,
    sourceUrl: "", // TODO: add Rockstar music page URL
  },
  {
    slug: "afrobank-fm",
    name: "AfroBank FM",
    genre: "African classics, amapiano, 3-step",
    accent: "#2EE6A6",
    hosts: [
      { persona: "Burna", voicedBy: "Burna Boy" },
      { persona: "Palmsy", voicedBy: "Palms Trax" },
    ],
    tracks: [
      track("Asake", "Joha", "confirmed"),
      track("Pat Thomas ft. Ebo Taylor", "Gye Wani", "testing"),
      track("DJ Lag & Robot Boii ft. Kamo Mphela", "Shay'sana", "testing"),
    ],
    status: "confirmed",
    lastVerified: VERIFIED,
    sourceUrl: "", // TODO: add Rockstar music page URL
  },
  {
    slug: "the-chamber-106-6",
    name: "The Chamber 106.6",
    genre: "Metal",
    accent: "#E11D2E",
    hosts: [{ persona: "Kerry King" }, { persona: "Tom Araya" }],
    tracks: [
      track("Slayer", "Raining Blood", "confirmed"),
      track("Black Sabbath", "I", "testing"),
      track("Pantera", "I'm Broken", "testing"),
    ],
    status: "confirmed",
    lastVerified: VERIFIED,
    sourceUrl: "", // TODO: add Rockstar music page URL
  },
  {
    slug: "dirty-south-classics",
    name: "Dirty South Classics",
    genre: "Regional rap and hip-hop classics",
    accent: "#A855F7",
    hosts: [{ persona: "Trick Daddy" }, { persona: "Trina" }],
    tracks: [
      track("David Banner ft. Lil' Flip", "Like A Pimp", "testing"),
      track("JT Money ft. Solé", "Who Dat", "testing"),
      track("DJ Khaled ft. Trick Daddy, Rick Ross & Pitbull", "Born N Raised", "testing"),
    ],
    status: "confirmed",
    lastVerified: VERIFIED,
    sourceUrl: "", // TODO: add Rockstar music page URL
  },
];

export function getStation(slug: string): Station | undefined {
  return stations.find((station) => station.slug === slug);
}

export function hostNames(station: Station): string {
  return station.hosts.map((host) => host.persona).join(", ");
}

export function trackQuery(item: Track): string {
  return encodeURIComponent(`${item.artist} ${item.title}`);
}

export function spotifySearchUrl(item: Track): string {
  return `https://open.spotify.com/search/${trackQuery(item)}`;
}

export function youtubeSearchUrl(item: Track): string {
  return `https://www.youtube.com/results?search_query=${trackQuery(item)}`;
}

export function trackAnchor(item: Track): string {
  return `track-${`${item.artist}-${item.title}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}
