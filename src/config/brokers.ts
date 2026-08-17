/**
 * Brokerage deep-link configuration for the recommendation page CTA.
 *
 * IMPORTANT: Bamboo and Trove do NOT publish a documented prefilled-order URL
 * scheme. Until one is confirmed, `urlTemplate` intentionally points at the app
 * home. If a broker later supports a ticker/search param, add `{ticker}` to the
 * template and set `supportsTicker: true` — nothing else needs to change.
 */
export interface BrokerConfig {
  /** Stable id used in analytics payloads. */
  id: string;
  name: string;
  /** May contain a `{ticker}` placeholder. */
  urlTemplate: string;
  /** True only when the broker documents a ticker/search param. */
  supportsTicker: boolean;
  /** Markets this broker can actually trade. */
  markets: Array<"NGX" | "US">;
}

export const BROKERS: BrokerConfig[] = [
  {
    id: "bamboo",
    name: "Bamboo",
    urlTemplate: "https://app.investbamboo.com/",
    supportsTicker: false,
    markets: ["NGX", "US"],
  },
  {
    id: "trove",
    name: "Trove",
    urlTemplate: "https://www.trovefinance.com/",
    supportsTicker: false,
    markets: ["NGX", "US"],
  },
];

export function brokerUrl(broker: BrokerConfig, ticker?: string): string {
  if (broker.supportsTicker && ticker) {
    return broker.urlTemplate.replace("{ticker}", encodeURIComponent(ticker));
  }
  return broker.urlTemplate.replace("{ticker}", "");
}
