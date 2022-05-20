import algoliasearch from "algoliasearch";

const client = algoliasearch("LTR0PM5KOX", "731248a7c3d2801f29a96ff2663b03ab");
const index = client.initIndex("report-pet");

export { index };
