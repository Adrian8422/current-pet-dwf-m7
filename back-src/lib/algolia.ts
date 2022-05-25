import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.APP_ID_ALGOLIA,
  process.env.PASSWORD_ALGOLIA
);
const index = client.initIndex("dwf-m7-app-pets");

export { index };
