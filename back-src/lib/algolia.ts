import algoliasearch from "algoliasearch";

const client = algoliasearch("LTR0PM5KOX", process.env.PASSWORD_ALGOLIA);
const index = client.initIndex("report-pet");

export { index };
