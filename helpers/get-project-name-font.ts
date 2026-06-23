// Eggplant Notes mirrors its own app wordmark (Geist Mono) so the portfolio entry matches the live
// app's branding; every other project uses the site's default mono.
export function getProjectNameFont(slug: string): string {
  return slug === "eggplant-notes" ? "font-eggplant" : "font-mono";
}
