/**
 * Consent stub. Before ANY ad or tracking script that sets cookies is loaded, a consent
 * management platform (CMP, e.g. an IAB TCF v2.2 certified one) must be wired in here for
 * EU/UK visitors, and ad scripts must wait for consent. This build loads no ad script,
 * so this component intentionally renders nothing.
 */
export function ConsentPlaceholder() {
  return null;
}
