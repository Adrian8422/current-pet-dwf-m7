import algoliasearch from "algoliasearch";

const client = algoliasearch("LTR0PM5KOX", process.env.PASSWORD_ALGOLIA);
const index = client.initIndex("dwf-m7-app-pets");

export { index };
